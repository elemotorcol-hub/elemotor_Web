'use client';

/**
 * ThreeViewer.tsx
 *
 * Core 3D viewer component using Three.js.
 * - Loads GLB models from Cloudinary using GLTFLoader + DRACOLoader (CDN)
 * - OrbitControls for mouse/touch interaction (drag to rotate, scroll/pinch to zoom)
 * - Reflective circular platform
 * - Realistic three-point lighting
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
}

interface ThreeViewerProps {
    modelUrl: string | null;
    onLoadProgress?: (progress: number) => void;
    onLoaded?: () => void;
    /** Hex color for the reflective platform highlight (matches selected exterior color) */
    accentColor?: string;
}

// ─── Default camera settings ──────────────────────────────────────────────────

const DEFAULT_CAMERA_POSITION = new THREE.Vector3(0, 1.8, 5.5);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.4, 0);

// ─── Component ────────────────────────────────────────────────────────────────

const ThreeViewer = forwardRef<ThreeViewerHandle, ThreeViewerProps>(
    function ThreeViewer({ modelUrl, onLoadProgress, onLoaded, accentColor = '#10B981' }, ref) {
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

        // ── Expose reset camera to parent ──────────────────────────────────────
        const resetCamera = useCallback(() => {
            if (!cameraRef.current || !controlsRef.current) return;
            cameraRef.current.position.copy(initialCameraPosRef.current || DEFAULT_CAMERA_POSITION);
            controlsRef.current.target.copy(initialTargetPosRef.current || DEFAULT_TARGET);
            controlsRef.current.update();
        }, []);

        useImperativeHandle(ref, () => ({ resetCamera }), [resetCamera]);

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

            // Fill light — opposite side, cooler
            const fillLight = new THREE.DirectionalLight(0xb8d4ff, 0.6);
            fillLight.position.set(-5, 4, -3);
            scene.add(fillLight);

            // Rim / back light — highlights the top edges
            const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
            rimLight.position.set(0, 12, -10);
            scene.add(rimLight);

            // Environment — subtle hemisphere
            const hemi = new THREE.HemisphereLight(0x1a2f2a, 0x050b09, 0.5);
            scene.add(hemi);

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
                controls.update();
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

            // Remove previously loaded model
            if (modelGroupRef.current) {
                scene.remove(modelGroupRef.current);
                modelGroupRef.current.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        (child as THREE.Mesh).geometry?.dispose();
                        const mat = (child as THREE.Mesh).material;
                        if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
                        else (mat as THREE.Material)?.dispose();
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
                    const group = new THREE.Group();
                    const model = gltf.scene;

                    // 1. Auto-centering: calcular bounding box original
                    const box = new THREE.Box3().setFromObject(model);
                    const center = box.getCenter(new THREE.Vector3());
                    // Centrar modelo en (0,0,0)
                    model.position.sub(center);

                    // 2. Escalado: calcular tamaño actual y normalizar si es necesario
                    const size = box.getSize(new THREE.Vector3());
                    const sizeLength = size.length();
                    
                    if (sizeLength > 0) {
                        const scaleFactor = 5.0 / sizeLength; // normalizar tamaño a ~5 unidades para ajustarse a la plataforma
                        model.scale.setScalar(scaleFactor);
                    }

                    // Recalcular bounding box después de escalar
                    const scaledBox = new THREE.Box3().setFromObject(model);
                    const scaledSize = scaledBox.getSize(new THREE.Vector3());

                    // Ajustar altura para sentarse en la plataforma (y = -0.04)
                    model.position.y += (scaledSize.y / 2) + 0.05;

                    // 3. Auto-fit cámara
                    const distance = scaledSize.length() * 1.5;

                    if (cameraRef.current) {
                        const camera = cameraRef.current;
                        camera.position.set(0, scaledSize.y * 0.8, distance);
                        camera.lookAt(0, scaledSize.y / 2, 0);
                        
                        // Configuración correcta de cámara para evitar clipping
                        camera.near = 0.1;
                        camera.far = 1000;
                        camera.fov = 45;
                        camera.updateProjectionMatrix();

                        // Guardar posición inicial para el resetCamer
                        initialCameraPosRef.current = camera.position.clone();
                    }

                    // 4. Ajuste de OrbitControls
                    if (controlsRef.current) {
                        const controls = controlsRef.current;
                        controls.target.set(0, scaledSize.y / 2, 0);
                        controls.minDistance = scaledSize.length() * 0.3;
                        controls.maxDistance = scaledSize.length() * 3;
                        controls.update();

                        // Guardar target inicial para el resetCamera
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
        }, [modelUrl, onLoadProgress, onLoaded]);

        // ── Update platform accent color ───────────────────────────────────────
        useEffect(() => {
            if (!platformRef.current) return;
            (platformRef.current.material as THREE.MeshStandardMaterial).color.set(
                accentColor + '12',
            );
        }, [accentColor]);

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
