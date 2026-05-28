'use client';

/**
 * ThreeViewer.tsx
 *
 * Core 3D viewer component using Three.js.
 * - Loads GLB models from Cloudinary using GLTFLoader + DRACOLoader (CDN)
 * - OrbitControls for mouse/touch interaction (drag to rotate, scroll/pinch to zoom)
 * - Reflective circular platform
 * - Realistic three-point lighting with day/night toggle
 * - Lights on/off toggle (showroom mode)
 * - Dynamic body color application
 * - Dark background (#050B09)
 * - Reset camera functionality
 * - ResizeObserver for responsive canvas
 */

import { useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from 'react';

// Three.js imports — only loaded client-side (this component is used inside a dynamic import)
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ThreeViewerHandle {
    resetCamera: () => void;
    /** Zoom toward windshield; calls onComplete when animation finishes */
    zoomToWindshield: (onComplete: () => void) => void;
    /** Animate camera back to initial exterior position */
    zoomBack: () => void;
}

export type LightMode = 'day' | 'night';

interface ThreeViewerProps {
    modelUrl: string | null;
    onLoadProgress?: (progress: number) => void;
    onLoaded?: () => void;
    /** Hex color for the reflective platform highlight (matches selected exterior color) */
    accentColor?: string;
    /** Day or night lighting mode */
    lightMode?: LightMode;
    /** Hex color to apply to the vehicle body (null = keep original) */
    bodyColor?: string | null;
}

// ─── Default camera settings ──────────────────────────────────────────────────

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 1.8, 5.5);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.4, 0);

// ─── Lighting presets ─────────────────────────────────────────────────────────

interface LightPreset {
    bgColor: number;
    fogDensity: number;
    ambientIntensity: number;
    keyIntensity: number;
    fillIntensity: number;
    rimIntensity: number;
    bounceIntensity: number;
    hemiSkyColor: number;
    hemiGroundColor: number;
    hemiIntensity: number;
    exposure: number;
}

const LIGHT_PRESETS: Record<LightMode, LightPreset> = {
    day: {
        bgColor: 0x050b09,
        fogDensity: 0.04,
        ambientIntensity: 1.2,
        keyIntensity: 2.5,
        fillIntensity: 1.2,
        rimIntensity: 1.5,
        bounceIntensity: 0.6,
        hemiSkyColor: 0x1a2f2a,
        hemiGroundColor: 0x050b09,
        hemiIntensity: 0.8,
        exposure: 1.4,
    },
    night: {
        bgColor: 0x020508,
        fogDensity: 0.05,
        ambientIntensity: 0.6,
        keyIntensity: 1.8,
        fillIntensity: 0.8,
        rimIntensity: 2.5,
        bounceIntensity: 0.4,
        hemiSkyColor: 0x0a1520,
        hemiGroundColor: 0x020508,
        hemiIntensity: 0.4,
        exposure: 1.1,
    },
};

// ─── Normaliza posición y escala de cualquier modelo GLB cargado ──────────────
//
// ¿Por qué?
// El pivot de cada GLB puede estar en el centro geométrico, la base, o cualquier
// otro punto. `normalizeAndPlaceModel` garantiza que, independientemente del origen
// del archivo, el modelo:
//   1. Escala hasta que su bounding box diagonal sea ~5 unidades.
//   2. Quede centrado en X = 0 y Z = 0.
//   3. Su punto más bajo (min.y) quede exactamente en y = 0 (nivel de plataforma).
function normalizeAndPlaceModel(model: THREE.Object3D): {
    scaledSize: THREE.Vector3;
    cameraDistance: number;
} {
    // Paso 1 — Escalar
    const rawBox = new THREE.Box3().setFromObject(model);
    const rawDiag = rawBox.getSize(new THREE.Vector3()).length();
    if (rawDiag > 0) {
        model.scale.setScalar(5.0 / rawDiag);
    }

    // Paso 2 — Bounding box POST-escala
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    const size   = box.getSize(new THREE.Vector3());

    // Paso 3 — Centrar en X y Z
    model.position.x -= center.x;
    model.position.z -= center.z;

    // Paso 4 — Apoyar exactamente sobre la plataforma (min.y → 0)
    model.position.y -= box.min.y;

    return {
        scaledSize:     size,
        cameraDistance: size.length() * 1.5,
    };
}

// ─── Aplica un color de carrocería al material BODY_CAR ───────────────────────
//
// Implementación "PRO" — crea un nuevo MeshStandardMaterial en vez de clonar.
//
// ¿Por qué no clonar?
//   El material original del GLB puede tener metalness/roughness configurados
//   por el artista para una textura específica (ej: metalness=0.9 para un
//   acabado cromado), lo que hace que el color seleccionado se vea apagado,
//   desaturado o como un "filtro". Heredar esas propiedades corrompe la
//   percepción del color escogido por el usuario.
//
// ¿Por qué MeshStandardMaterial nuevo?
//   Permite definir exactamente las propiedades PBR para PINTURA AUTOMOTRIZ:
//   - color fiel al HEX seleccionado
//   - ligero brillo metálico (metalness 0.35) → acabado lacado
//   - roughness suave (0.3) → reflectividad sin ser espejo
//   - sin texturas que interfieran
//
// Si color es null (usuario deselecciona), se restaura al gris neutro original.
const BODY_CAR_ORIGINAL_COLOR = new THREE.Color(0x888888); // gris neutro como fallback

// Patrones de nombres de materiales que corresponden a la carrocería.
// Soporta múltiples convenciones de artistas 3D distintos.
// Se chequea tanto el nombre completo como el último segmento (después de ':'),
// ya que algunos modelos usan namespaces tipo "model:model:CP.006".
const BODY_MATERIAL_PREFIXES = ['carpaint', 'body_car', 'body', 'paint', 'carbody', 'car_paint', 'cp'];

function isBodyMaterial(name: string): boolean {
    // Chequea si un segmento de nombre coincide con algún prefijo conocido
    const matchesPrefix = (segment: string) => {
        const lower = segment.toLowerCase();
        return BODY_MATERIAL_PREFIXES.some(prefix =>
            lower === prefix || lower.startsWith(prefix + '.') || lower.startsWith(prefix + '_')
        );
    };

    // Chequea el nombre completo y también el último segmento tras ':'
    const lastSegment = name.includes(':') ? name.split(':').pop()! : name;
    return matchesPrefix(name) || matchesPrefix(lastSegment);
}

/** Imprime en consola los materiales del modelo y cuáles se detectaron como carrocería */
function debugMaterials(root: THREE.Object3D): void {
    const all: string[] = [];
    const body: string[] = [];
    root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh || !mesh.material) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach(m => {
            if (!m?.name || all.includes(m.name)) return;
            all.push(m.name);
            if (isBodyMaterial(m.name)) body.push(m.name);
        });
    });
    console.log('[ThreeViewer] Todos los materiales:', all);
    if (body.length > 0) {
        console.log('[ThreeViewer] ✅ Carrocería detectada:', body);
    } else {
        console.warn('[ThreeViewer] ⚠️ No se detectó material de carrocería. Agrega el nombre a BODY_MATERIAL_PREFIXES.');
    }
}

function applyBodyColor(root: THREE.Object3D, color: string | null): void {
    root.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh || !mesh.material) return;

        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        const hasBodyMat = mats.some(m => m && isBodyMaterial(m.name));
        if (!hasBodyMat) return;

        const updated = mats.map((mat) => {
            if (!mat || !isBodyMaterial(mat.name)) return mat;

            // Opción PRO: crear material nuevo con propiedades PBR de pintura automotriz.
            // Esto garantiza que el color HEX sea fiel y no quede distorsionado por
            // las propiedades originales del artista 3D.
            const paintMat = new THREE.MeshStandardMaterial({
                name:             mat.name,
                color:            color ? new THREE.Color(color) : BODY_CAR_ORIGINAL_COLOR,
                metalness:        0.35,   // ligero brillo lacado — no cromado, no mate
                roughness:        0.30,   // superficie suavemente reflectante
                envMapIntensity:  1.0,    // reflexión de entorno para realismo
            });

            paintMat.needsUpdate = true;
            return paintMat;
        });

        mesh.material = Array.isArray(mesh.material) ? updated : updated[0];
    });
}


// ─── Component ────────────────────────────────────────────────────────────────

const ThreeViewer = forwardRef<ThreeViewerHandle, ThreeViewerProps>(
    function ThreeViewer(
        {
            modelUrl,
            onLoadProgress,
            onLoaded,
            accentColor = '#10B981',
            lightMode = 'day',
            bodyColor = null,
        },
        ref,
    ) {
        const mountRef = useRef<HTMLDivElement>(null);
        const sceneRef = useRef<THREE.Scene | null>(null);
        const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
        const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
        const controlsRef = useRef<OrbitControls | null>(null);
        const modelGroupRef = useRef<THREE.Group | null>(null);
        const animFrameRef = useRef<number | null>(null);
        const platformRef = useRef<THREE.Mesh | null>(null);
        const initialCameraPosRef = useRef<THREE.Vector3 | null>(null);
        const initialTargetPosRef = useRef<THREE.Vector3 | null>(null);

        // Camera animation state
        const animRef = useRef<{
            active: boolean;
            targetPos: THREE.Vector3;
            targetLookAt: THREE.Vector3;
            onComplete?: () => void;
            speed: number;
        } | null>(null);

        // Light refs for dynamic updates
        const ambientRef = useRef<THREE.AmbientLight | null>(null);
        const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
        const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
        const rimLightRef = useRef<THREE.DirectionalLight | null>(null);
        const bounceLightRef = useRef<THREE.DirectionalLight | null>(null);
        const hemiRef = useRef<THREE.HemisphereLight | null>(null);

        // ── Expose reset camera to parent ──────────────────────────────────────
        const resetCamera = useCallback(() => {
            if (!cameraRef.current || !controlsRef.current) return;
            animRef.current = null;
            controlsRef.current.enabled = true;
            cameraRef.current.position.copy(initialCameraPosRef.current || DEFAULT_CAMERA_POSITION);
            controlsRef.current.target.copy(initialTargetPosRef.current || DEFAULT_TARGET);
            controlsRef.current.update();
        }, []);

        const zoomToWindshield = useCallback((onComplete: () => void) => {
            if (!cameraRef.current || !controlsRef.current) { onComplete(); return; }
            const initPos = initialCameraPosRef.current || DEFAULT_CAMERA_POSITION;
            const initTarget = initialTargetPosRef.current || DEFAULT_TARGET;
            // Disable controls and remove minDistance so camera can enter the model
            controlsRef.current.enabled = false;
            controlsRef.current.minDistance = 0;
            // Zoom into interior: close to the windshield, camera low (seat level),
            // looking toward dashboard (negative z relative to car center)
            animRef.current = {
                active: true,
                targetPos: new THREE.Vector3(0, initPos.y * 0.45, initPos.z * 0.18),
                targetLookAt: new THREE.Vector3(0, initTarget.y * 0.9, -initPos.z * 0.3),
                onComplete,
                speed: 0.055,
            };
        }, []);

        const zoomBack = useCallback(() => {
            if (!cameraRef.current || !controlsRef.current) return;
            // Disable controls during animation
            controlsRef.current.enabled = false;
            // Restore minDistance before animating back
            if (initialCameraPosRef.current) {
                const initSize = initialCameraPosRef.current.length();
                controlsRef.current.minDistance = initSize * 0.1;
            }
            animRef.current = {
                active: true,
                targetPos: (initialCameraPosRef.current || DEFAULT_CAMERA_POSITION).clone(),
                targetLookAt: (initialTargetPosRef.current || DEFAULT_TARGET).clone(),
                speed: 0.07,
            };
        }, []);

        useImperativeHandle(ref, () => ({ resetCamera, zoomToWindshield, zoomBack }), [resetCamera, zoomToWindshield, zoomBack]);

        // ── Setup Three.js scene (runs once on mount) ──────────────────────────
        useEffect(() => {
            const mount = mountRef.current;
            if (!mount) return;

            // ─ Scene ────────────────────────────────────────────────────────────
            const scene = new THREE.Scene();
            scene.background = new THREE.Color(0x050b09);
            scene.fog = new THREE.FogExp2(0x050b09, 0.04);
            sceneRef.current = scene;

            // ─ Camera ───────────────────────────────────────────────────────────
            const camera = new THREE.PerspectiveCamera(
                40,
                mount.clientWidth / mount.clientHeight,
                0.1,
                200,
            );
            camera.position.copy(DEFAULT_CAMERA_POSITION);
            cameraRef.current = camera;

            // ─ Renderer ─────────────────────────────────────────────────────────
            const renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
            });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(mount.clientWidth, mount.clientHeight);
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.outputColorSpace = THREE.SRGBColorSpace;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 1.2;
            mount.appendChild(renderer.domElement);
            rendererRef.current = renderer;

            // ─ OrbitControls ────────────────────────────────────────────────────
            const controls = new OrbitControls(camera, renderer.domElement);
            controls.target.copy(DEFAULT_TARGET);
            controls.enableDamping = true;
            controls.dampingFactor = 0.08;
            controls.minDistance = 2.0;
            controls.maxDistance = 12;
            controls.maxPolarAngle = Math.PI / 2.05; // prevent going below the platform
            controls.autoRotate = false;
            controls.enablePan = false;
            controlsRef.current = controls;

            // ─ Lighting ─────────────────────────────────────────────────────────
            // Ambient — soft fill
            const ambient = new THREE.AmbientLight(0xffffff, 0.6);
            scene.add(ambient);
            ambientRef.current = ambient;

            // Key light — main directional
            const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
            keyLight.position.set(5, 8, 5);
            keyLight.castShadow = true;
            keyLight.shadow.mapSize.width = 2048;
            keyLight.shadow.mapSize.height = 2048;
            keyLight.shadow.camera.near = 0.5;
            keyLight.shadow.camera.far = 50;
            keyLight.shadow.camera.left = -10;
            keyLight.shadow.camera.right = 10;
            keyLight.shadow.camera.top = 10;
            keyLight.shadow.camera.bottom = -10;
            keyLight.shadow.bias = -0.0005;
            scene.add(keyLight);
            keyLightRef.current = keyLight;

            // Fill light — opposite side, cooler
            const fillLight = new THREE.DirectionalLight(0xb8d4ff, 0.6);
            fillLight.position.set(-5, 4, -3);
            scene.add(fillLight);
            fillLightRef.current = fillLight;

            // Rim / back light — highlights the top edges
            const rimLight = new THREE.DirectionalLight(0xb8d4ff, 0.8);
            rimLight.position.set(0, 5, -12); // Bajada para definir perfil trasero
            scene.add(rimLight);
            rimLightRef.current = rimLight;

            // Bounce / bottom light — to illuminate undercarriage and rims
            const bounceLight = new THREE.DirectionalLight(0xffffff, 0.4);
            bounceLight.position.set(0, -5, 0); // Desde abajo apuntando arriba
            scene.add(bounceLight);
            bounceLightRef.current = bounceLight;

            // Environment — subtle hemisphere
            const hemi = new THREE.HemisphereLight(0x1a2f2a, 0x050b09, 0.5);
            scene.add(hemi);
            hemiRef.current = hemi;

            // ─ Reflective Platform ──────────────────────────────────────────────
            const platformGeo = new THREE.CylinderGeometry(3.2, 3.2, 0.08, 128);
            const platformMat = new THREE.MeshStandardMaterial({
                color: 0x0d1914,
                metalness: 0.85,
                roughness: 0.18,
                envMapIntensity: 1.2,
            });
            const platform = new THREE.Mesh(platformGeo, platformMat);
            platform.position.y = -0.04;
            platform.receiveShadow = true;
            scene.add(platform);
            platformRef.current = platform;

            // Grid ring on platform
            const ringGeo = new THREE.RingGeometry(2.9, 3.1, 128);
            const ringMat = new THREE.MeshBasicMaterial({
                color: 0x10b981,
                transparent: true,
                opacity: 0.15,
                side: THREE.DoubleSide,
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.rotation.x = -Math.PI / 2;
            ring.position.y = 0.005;
            scene.add(ring);

            // ─ Animate loop ─────────────────────────────────────────────────────
            function animate() {
                animFrameRef.current = requestAnimationFrame(animate);

                const anim = animRef.current;
                if (anim?.active) {
                    // Lerp camera directly — do NOT call controls.update() here to avoid
                    // damping fighting the animation and blocking completion
                    camera.position.lerp(anim.targetPos, anim.speed);
                    controls.target.lerp(anim.targetLookAt, anim.speed);
                    camera.lookAt(controls.target);
                    // Snap when close enough and fire callback
                    if (
                        camera.position.distanceTo(anim.targetPos) < 0.04 &&
                        controls.target.distanceTo(anim.targetLookAt) < 0.04
                    ) {
                        camera.position.copy(anim.targetPos);
                        controls.target.copy(anim.targetLookAt);
                        anim.active = false;
                        // Re-enable controls so user can interact again
                        controls.enabled = true;
                        controls.update();
                        anim.onComplete?.();
                    }
                } else {
                    controls.update();
                }

                renderer.render(scene, camera);
            }
            animate();

            // ─ Resize observer ──────────────────────────────────────────────────
            const ro = new ResizeObserver(() => {
                if (!mount) return;
                const w = mount.clientWidth;
                const h = mount.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            });
            ro.observe(mount);

            // ─ Cleanup ──────────────────────────────────────────────────────────
            return () => {
                ro.disconnect();
                if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
                controls.dispose();
                renderer.dispose();
                if (mount.contains(renderer.domElement)) {
                    mount.removeChild(renderer.domElement);
                }
            };
        }, []); // Only on mount

        // ── Load model whenever modelUrl changes ───────────────────────────────
        useEffect(() => {
            const scene = sceneRef.current;
            if (!scene) return;

            let isValidLoad = true; // Prevents race conditions during async load

            // Helper to recursively dispose materials and their VRAM textures
            const disposeMaterial = (mat: THREE.Material) => {
                mat.dispose();
                for (const key of Object.keys(mat)) {
                    const value = (mat as any)[key];
                    if (value && typeof value === 'object' && 'minFilter' in value && typeof value.dispose === 'function') {
                        value.dispose();
                    }
                }
            };

            // Remove previously loaded model
            if (modelGroupRef.current) {
                scene.remove(modelGroupRef.current);
                modelGroupRef.current.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        (child as THREE.Mesh).geometry?.dispose();
                        const mat = (child as THREE.Mesh).material;
                        if (Array.isArray(mat)) mat.forEach(disposeMaterial);
                        else if (mat) disposeMaterial(mat as THREE.Material);
                    }
                });
                modelGroupRef.current = null;
            }

            if (!modelUrl) {
                onLoadProgress?.(100);
                onLoaded?.();
                return;
            }

            // Setup loaders
            const dracoLoader = new DRACOLoader();
            dracoLoader.setDecoderPath('/draco/');

            const gltfLoader = new GLTFLoader();
            gltfLoader.setDRACOLoader(dracoLoader);

            onLoadProgress?.(5);

            gltfLoader.load(
                modelUrl,
                (gltf) => {
                    if (!isValidLoad) {
                        // The user changed modelUrl before this one finished loading.
                        // We must dispose the parsed GLB immediately to prevent VRAM leaks.
                        gltf.scene.traverse((child) => {
                            if ((child as THREE.Mesh).isMesh) {
                                (child as THREE.Mesh).geometry?.dispose();
                                const mat = (child as THREE.Mesh).material;
                                if (Array.isArray(mat)) mat.forEach(disposeMaterial);
                                else if (mat) disposeMaterial(mat as THREE.Material);
                            }
                        });
                        return;
                    }

                    const group = new THREE.Group();
                    const model = gltf.scene;

                    const { scaledSize, cameraDistance } = normalizeAndPlaceModel(model);

                    // 3. Auto-fit cámara
                    if (cameraRef.current) {
                        const camera = cameraRef.current;
                        camera.position.set(0, scaledSize.y * 0.8, cameraDistance);
                        camera.lookAt(0, scaledSize.y / 2, 0);
                        camera.near = 0.1;
                        camera.far = 1000;
                        camera.fov = 45;
                        camera.updateProjectionMatrix();
                        initialCameraPosRef.current = camera.position.clone();
                    }

                    // 4. Ajuste de OrbitControls
                    if (controlsRef.current) {
                        const controls = controlsRef.current;
                        controls.target.set(0, scaledSize.y / 2, 0);
                        controls.minDistance = scaledSize.length() * 0.3;
                        controls.maxDistance = scaledSize.length() * 3;
                        controls.update();
                        initialTargetPosRef.current = controls.target.clone();
                    }

                    // Enable shadows on all meshes
                    model.traverse((child) => {
                        if ((child as THREE.Mesh).isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });

                    group.add(model);
                    scene.add(group);
                    modelGroupRef.current = group;

                    debugMaterials(model);

                    // Apply body color if already set when model loads
                    if (bodyColor) {
                        applyBodyColor(group, bodyColor);
                    }

                    dracoLoader.dispose();
                    onLoadProgress?.(100);
                    onLoaded?.();
                },
                (xhr) => {
                    if (xhr.total > 0) {
                        const pct = Math.round((xhr.loaded / xhr.total) * 95) + 5;
                        onLoadProgress?.(pct);
                    }
                },
                (err) => {
                    console.error('Error loading GLB:', err);
                    dracoLoader.dispose();
                    onLoadProgress?.(100);
                    onLoaded?.();
                },
            );

            return () => {
                isValidLoad = false;
            };
        }, [modelUrl, onLoadProgress, onLoaded]); // Removed bodyColor from deps to avoid re-fetching GLB on color change

        // ── Update platform accent color ───────────────────────────────────────
        useEffect(() => {
            if (!platformRef.current) return;
            (platformRef.current.material as THREE.MeshStandardMaterial).color.set(
                accentColor + '12',
            );
        }, [accentColor]);

        // ── Update lights when lightMode changes ────────────────────────────
        useEffect(() => {
            const ambient = ambientRef.current;
            const keyLight = keyLightRef.current;
            const fillLight = fillLightRef.current;
            const rimLight = rimLightRef.current;
            const bounceLight = bounceLightRef.current;
            const hemi = hemiRef.current;
            const renderer = rendererRef.current;
            const scene = sceneRef.current;

            if (!ambient || !keyLight || !fillLight || !rimLight || !bounceLight || !hemi || !renderer || !scene) {
                return;
            }

            const preset = LIGHT_PRESETS[lightMode];

            ambient.intensity = preset.ambientIntensity;
            keyLight.intensity = preset.keyIntensity;
            fillLight.intensity = preset.fillIntensity;
            rimLight.intensity = preset.rimIntensity;
            bounceLight.intensity = preset.bounceIntensity;
            hemi.intensity = preset.hemiIntensity;
            hemi.color.set(preset.hemiSkyColor);
            hemi.groundColor.set(preset.hemiGroundColor);
            renderer.toneMappingExposure = preset.exposure;

            // Update background and fog for light mode
            (scene.background as THREE.Color).set(preset.bgColor);
            (scene.fog as THREE.FogExp2).density = preset.fogDensity;
        }, [lightMode]);

        // ── Apply body color dynamically when prop changes ─────────────────────
        useEffect(() => {
            if (!modelGroupRef.current || bodyColor === undefined) return;
            applyBodyColor(modelGroupRef.current, bodyColor);
        }, [bodyColor]);

        return (
            <div
                ref={mountRef}
                className="w-full h-full"
                style={{ cursor: 'grab' }}
            />
        );
    },
);

ThreeViewer.displayName = 'ThreeViewer';
export default ThreeViewer;
