import React from 'react';
import Image from 'next/image';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';
import { BatteryCharging, Zap, Info, ShieldCheck, Home, Settings } from 'lucide-react';

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

        </div>
      </main>

      <Footer />
    </div>
  );
}
