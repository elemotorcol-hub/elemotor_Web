import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { BatteryCharging, Zap, Info, ShieldCheck, Home, Settings, MapPin } from 'lucide-react';

const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function ComoCargoPage() {
  return (
    <div className="min-h-screen bg-slate-900 selection:bg-[#00D4AA] selection:text-slate-900 overflow-x-hidden flex flex-col">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow flex flex-col pt-0 relative overflow-hidden">
        
        {/* Full Viewport Width Hero Section */}
        <div className="relative w-screen lg:w-full h-[600px] md:h-[700px] flex items-center mb-20 overflow-hidden">
            {/* Background Image Layer (Full Screen Width with Fixed/Parallax effect) */}
            <div 
              className="absolute inset-0 z-0 bg-fixed bg-cover bg-center"
              style={{ backgroundImage: 'url("/Como cargo 2.webp")' }}
            >
              <div className="absolute inset-0 bg-slate-900/60 z-10" /> {/* Clean, soft dark overlay for text readability */}
              <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-slate-900 to-transparent z-10" />
              <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-slate-900 to-transparent z-10" />
            </div>

            {/* Content constrained to max-w-7xl to align with rest of the page */}
            <div className="relative z-20 w-full max-w-7xl mx-auto px-6 lg:px-12 flex flex-col text-center lg:text-left mt-24">
              <div className="max-w-3xl">
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-white tracking-tight uppercase leading-tight mb-8 drop-shadow-2xl">
                  Carga <br className="hidden lg:block"/><span className="text-[#00D4AA]">Rápida y Segura</span>
                </h1>
                
                <div className="bg-[#03060c]/60 backdrop-blur-md rounded-2xl p-6 lg:p-8 border border-white/5 shadow-2xl inline-block text-left relative overflow-hidden group">
                  <p className="text-lg text-slate-200 leading-relaxed font-medium mb-4 drop-shadow-md">
                    El costo de cargar un vehículo eléctrico en casa en Colombia depende de la capacidad de la batería y del costo de la electricidad.
                  </p>
                  <div className="bg-[#0b121e]/80 rounded-xl p-4 border border-slate-700/50 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                    <div className="p-3 bg-[#00D4AA]/20 rounded-lg shrink-0">
                      <BatteryCharging className="w-6 h-6 text-[#00D4AA]" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-300 mb-1 font-medium">Para batería de 30 kWh (aprox. 250 km):</p>
                      <p className="text-white font-bold"><span className="text-[#00D4AA]">$15.000</span> (Estrato 4)  -  <span className="text-[#00D4AA]">$19.000</span> (Estrato 6)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>

        {/* Rest of the Page Container */}
        <div className="w-full max-w-7xl mx-auto px-6 lg:px-12 relative z-10 pb-20">
          
          {/* Wallbox Specs Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-20">
            
            {/* Presentation Image & Wallbox Intro Column */}
            <div className="col-span-1 lg:col-span-5 flex flex-col gap-6">
              {/* Added Image Container */}
              <div className="relative w-full h-[300px] rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d131f] to-transparent z-10" />
                  <Image
                    src="/Como cargo.webp"
                    alt="Wallbox Setup and Charging"
                    fill
                    className="object-cover object-center"
                  />
              </div>

              {/* Main Presentation Card */}
              <div className="flex-1 bg-gradient-to-br from-[#0d131f] to-[#0a0f1c] border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D4AA]/10 rounded-full blur-[80px]" />
                
                <h2 className="text-3xl font-bold text-white mb-2 relative z-10">Tecnología Elemotor</h2>
                <h3 className="text-slate-400 font-medium mb-8 relative z-10">Cargador AC tipo Wallbox Taizhou Xinghuo</h3>
                
                <div className="space-y-4 relative z-10">
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 font-medium">Tipo de Carga</span>
                    <span className="text-white font-bold">Lenta (AC)</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 font-medium">Potencia Máxima</span>
                    <span className="text-[#00D4AA] font-bold text-lg">7 kW</span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl border border-slate-700/50">
                    <span className="text-slate-400 font-medium">Tiempo Estimado</span>
                    <span className="text-white font-bold text-right leading-tight">10 a 11 horas<br/><span className="text-xs text-slate-500 font-normal">(batería 73 kWh)</span></span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detailed Specs Grid */}
            <div className="col-span-1 lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Parámetros Eléctricos */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-8 hover:border-[#00D4AA]/30 transition-colors group">
                <div className="flex items-center gap-4 mb-6">
                  <Zap className="w-6 h-6 text-[#00D4AA]" />
                  <h3 className="text-xl font-bold text-white">Eléctricos</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-2"><strong className="text-slate-200">Sistema:</strong> Monofásico fase dividida</li>
                  <li className="flex gap-2"><strong className="text-slate-200">Tensión:</strong> 220 VAC</li>
                  <li className="flex gap-2"><strong className="text-slate-200">Corriente:</strong> 32A</li>
                  <li className="text-[#00D4AA]/90 font-medium mt-4 pt-4 border-t border-slate-800">
                    * Requiere toma dedicada con puesta a tierra.
                  </li>
                </ul>
              </div>

              {/* General / Seguridad */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-8 hover:border-[#00D4AA]/30 transition-colors group">
                <div className="flex items-center gap-4 mb-6">
                  <ShieldCheck className="w-6 h-6 text-[#00D4AA]" />
                  <h3 className="text-xl font-bold text-white">Seguridad</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-2"><strong className="text-slate-200">Protección:</strong> IP55 (RCD 30mA)</li>
                  <li className="flex gap-2"><strong className="text-slate-200">Temperatura:</strong> -30°C a 50°C</li>
                  <li className="flex gap-2"><strong className="text-slate-200">Altitud máx:</strong> 2000 m.s.n.m</li>
                  <li className="flex gap-2"><strong className="text-slate-200">Humedad:</strong> 5% - 95%</li>
                </ul>
              </div>

              {/* Conectividad */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-8 hover:border-[#00D4AA]/30 transition-colors group">
                <div className="flex items-center gap-4 mb-6">
                  <Settings className="w-6 h-6 text-[#00D4AA]" />
                  <h3 className="text-xl font-bold text-white">Conectividad</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-2"><strong className="text-slate-200">Pantalla:</strong> LCD de 2.4"</li>
                  <li className="flex gap-2"><strong className="text-slate-200">Red:</strong> Conexión 4G</li>
                  <li className="flex gap-2"><strong className="text-slate-200">Gestión:</strong> App móvil de monitoreo</li>
                </ul>
              </div>

              {/* Instalación */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-8 hover:border-[#00D4AA]/30 transition-colors group">
                <div className="flex items-center gap-4 mb-6">
                  <Home className="w-6 h-6 text-[#00D4AA]" />
                  <h3 className="text-xl font-bold text-white">Instalación</h3>
                </div>
                <ul className="space-y-3 text-sm text-slate-400">
                  <li className="flex gap-2"><strong className="text-slate-200">Montaje:</strong> Fija en pared (soporte incl.)</li>
                  <li className="flex gap-2"><strong className="text-slate-200">Accesorios:</strong> Cable Tipo 2 (5 metros)</li>
                  <li className="text-amber-400/90 font-medium mt-4 pt-4 border-t border-slate-800">
                    * Requiere instalación por electricista certificado.
                  </li>
                </ul>
              </div>

            </div>
          </div>

          {/* Educational Definitions Section */}
          <div className="bg-[#05080f] rounded-3xl p-8 lg:p-12 border border-slate-800/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Info className="w-48 h-48 text-[#00D4AA]" />
            </div>
            
            <div className="relative z-10 max-w-4xl">
              <h3 className="text-2xl font-bold text-white mb-8">Conceptos Básicos de Energía</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[#00D4AA] font-bold text-lg mb-2">Voltaje & Amperaje</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    El <strong className="text-slate-200">Amperio (A)</strong> mide la corriente eléctrica, mientras que el <strong className="text-slate-200">Voltio (V)</strong> mide la diferencia de potencial o voltaje.
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Los cargadores de vehículos eléctricos se miden usualmente en <strong className="text-slate-200">kW</strong> o <strong className="text-slate-200">Amperes</strong>.
                  </p>
                </div>
                
                <div>
                  <h4 className="text-[#00D4AA] font-bold text-lg mb-2">Potencia & Capacidad</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">
                    El <strong className="text-slate-200">Kilovatio (kW)</strong> es una unidad de potencia eléctrica (la velocidad a la que fluye la energía).
                  </p>
                  <p className="text-slate-400 text-sm leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    El <strong className="text-white">Kilovatio hora (kWh)</strong> mide la energía almacenada. Por eso, las baterías de los vehículos se miden en kWh, como el "tamaño del tanque".
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Tipos de Conectores ── */}
          <div className="mt-20">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-white uppercase tracking-tight">Tipos de <span className="text-[#00D4AA]">Conectores</span></h2>
              <p className="text-slate-400 mt-2 text-sm">Cada vehículo eléctrico usa un estándar de conector. Conoce cuál usa el tuyo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Tipo 1 */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-7 hover:border-[#00D4AA]/40 transition-colors group">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#00D4AA] uppercase">AC · Lenta</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-bold">SAE J1772</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Tipo 1</h4>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed">Conector monofásico, estándar en vehículos japoneses y americanos. Carga lenta en corriente alterna.</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Potencia</span><span className="text-white font-semibold">Hasta 7.4 kW</span></div>
                  <div className="flex justify-between text-slate-400"><span>Corriente</span><span className="text-white font-semibold">AC monofásica</span></div>
                  <div className="flex justify-between text-slate-400"><span>Uso típico</span><span className="text-white font-semibold">Mitsubishi, Nissan</span></div>
                </div>
              </div>

              {/* Tipo 2 */}
              <div className="bg-[#0b121e] border border-[#00D4AA]/30 rounded-3xl p-7 hover:border-[#00D4AA]/60 transition-colors group relative overflow-hidden">
                <div className="absolute top-3 right-3 text-[9px] font-black bg-[#00D4AA]/10 text-[#00D4AA] px-2 py-1 rounded-full border border-[#00D4AA]/20 tracking-widest">MÁS COMÚN</div>
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black tracking-[0.2em] text-[#00D4AA] uppercase">AC · Lenta/Semi</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-bold">IEC 62196</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Tipo 2 (Mennekes)</h4>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed">Estándar europeo y el más utilizado en Latinoamérica. Compatible con la mayoría de cargadores públicos.</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Potencia</span><span className="text-white font-semibold">Hasta 22 kW</span></div>
                  <div className="flex justify-between text-slate-400"><span>Corriente</span><span className="text-white font-semibold">AC mono/trifásica</span></div>
                  <div className="flex justify-between text-slate-400"><span>Uso típico</span><span className="text-white font-semibold">BYD, Deepal, Tesla</span></div>
                </div>
              </div>

              {/* CCS */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-7 hover:border-[#00D4AA]/40 transition-colors group">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase">DC · Rápida</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-bold">CCS2</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">CCS Combo 2</h4>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed">Combined Charging System. Conector Tipo 2 extendido para carga DC rápida. Estándar en Europa y cargadores públicos de alta potencia.</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Potencia</span><span className="text-white font-semibold">Hasta 350 kW</span></div>
                  <div className="flex justify-between text-slate-400"><span>Corriente</span><span className="text-white font-semibold">DC directa</span></div>
                  <div className="flex justify-between text-slate-400"><span>Uso típico</span><span className="text-white font-semibold">BMW, Hyundai, Kia</span></div>
                </div>
              </div>

              {/* CHAdeMO */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-7 hover:border-[#00D4AA]/40 transition-colors group">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black tracking-[0.2em] text-amber-400 uppercase">DC · Rápida</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-bold">CHAdeMO</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">CHAdeMO</h4>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed">Estándar japonés de carga rápida DC. Cada vez menos común en nuevos modelos, pero aún presente en infraestructura instalada.</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Potencia</span><span className="text-white font-semibold">Hasta 100 kW</span></div>
                  <div className="flex justify-between text-slate-400"><span>Corriente</span><span className="text-white font-semibold">DC directa</span></div>
                  <div className="flex justify-between text-slate-400"><span>Uso típico</span><span className="text-white font-semibold">Nissan Leaf, Outlander</span></div>
                </div>
              </div>

              {/* GB/T */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-7 hover:border-[#00D4AA]/40 transition-colors group">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black tracking-[0.2em] text-blue-400 uppercase">AC/DC · Mixto</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-bold">GB/T</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">GB/T (Estándar Chino)</h4>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed">Estándar nacional chino. Presente en vehículos de marcas como BYD, Deepal, NIO y otros fabricantes de China.</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Potencia AC</span><span className="text-white font-semibold">Hasta 7 kW</span></div>
                  <div className="flex justify-between text-slate-400"><span>Potencia DC</span><span className="text-white font-semibold">Hasta 250 kW</span></div>
                  <div className="flex justify-between text-slate-400"><span>Uso típico</span><span className="text-white font-semibold">BYD, Deepal, NIO</span></div>
                </div>
              </div>

              {/* NACS / Tesla */}
              <div className="bg-[#0b121e] border border-slate-800 rounded-3xl p-7 hover:border-[#00D4AA]/40 transition-colors group">
                <div className="flex items-center justify-between mb-5">
                  <span className="text-[10px] font-black tracking-[0.2em] text-red-400 uppercase">AC/DC · Mixto</span>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-md font-bold">NACS</span>
                </div>
                <h4 className="text-lg font-bold text-white mb-1">Tesla / NACS</h4>
                <p className="text-slate-500 text-xs mb-5 leading-relaxed">Conector propietario de Tesla, adoptado como estándar abierto (NACS) en Norteamérica. Un solo conector para AC y DC.</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400"><span>Potencia</span><span className="text-white font-semibold">Hasta 250 kW</span></div>
                  <div className="flex justify-between text-slate-400"><span>Corriente</span><span className="text-white font-semibold">AC y DC</span></div>
                  <div className="flex justify-between text-slate-400"><span>Uso típico</span><span className="text-white font-semibold">Tesla Model 3, Y, S, X</span></div>
                </div>
              </div>

            </div>
          </div>

          {/* ── Mapa de Cargadores ── */}
          <div className="mt-20 mb-4">
            <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-[#05080f]">
              {/* Map embed */}
              <div className="w-full h-[420px] relative">
                <iframe
                  src="https://www.google.com/maps?q=estaciones+de+carga+electrica+para+vehiculos+electricos&output=embed"
                  className="w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#05080f] via-transparent to-transparent" />
              </div>

              {/* Overlay CTA */}
              <div className="p-8 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black tracking-[0.2em] text-[#00D4AA] uppercase mb-2">Red de Carga Pública</p>
                  <h2 className="text-2xl lg:text-3xl font-black text-white uppercase tracking-tight">
                    Encuentra cargadores <br className="hidden lg:block" />
                    <span className="text-[#00D4AA]">cerca de ti</span>
                  </h2>
                  <p className="text-slate-400 text-sm mt-3 max-w-lg leading-relaxed">
                    Explora la red de estaciones de carga pública disponibles en tu ciudad. Filtra por tipo de conector, potencia y disponibilidad en tiempo real.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                  <a
                    href="https://www.google.com/maps/search/electric+vehicle+charging/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#00D4AA] hover:bg-[#00bfa0] text-slate-900 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_4px_20px_rgba(0,212,170,0.25)] hover:shadow-[0_4px_30px_rgba(0,212,170,0.4)] active:scale-[0.98]"
                  >
                    <MapPin className="w-4 h-4" />
                    Ver mapa completo
                  </a>
                  <Link
                    href="/talleres"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
                  >
                    Nuestros talleres
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
