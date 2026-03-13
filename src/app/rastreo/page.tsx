import React from 'react';
import Image from 'next/image';
import { Truck, Fingerprint, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import dynamic from 'next/dynamic';

const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default function RastreoPage() {
  return (
    <div className="min-h-screen bg-[#060b13] flex flex-col selection:bg-[#00D4AA] selection:text-[#060b13]">
      <header>
        <Navbar />
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4 relative overflow-hidden mt-16 lg:mt-24 mb-12">
        {/* Decorative Glow completely optional but keeps premium feel */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#00D4AA]/5 rounded-full blur-[120px] pointer-events-none" />
        {/* Main Card */}
        <div className="w-full max-w-md bg-[#0d131f]/80 backdrop-blur-md border border-slate-800/80 rounded-2xl p-8 z-10 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-3">Rastrea Tu Vehículo</h1>
            <p className="text-sm text-slate-400 font-medium px-2">
              Ingresa tu código de seguimiento para ver el estado de tu importación en tiempo real.
            </p>
          </div>

          <form className="space-y-6">
            {/* Input: Tracking Code */}
            <div className="space-y-2">
              <label htmlFor="tracking-code" className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                Código de Seguimiento
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Truck className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="tracking-code"
                  type="text"
                  placeholder="ELE-2025-XXXXX"
                  className="w-full bg-[#060b13]/50 border border-slate-800 text-slate-200 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-[#00D4AA]/50 focus:border-[#00D4AA]/50 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Input: Identity Verification */}
            <div className="space-y-2">
              <label htmlFor="identity" className="text-xs font-bold text-slate-500 uppercase tracking-wider pl-1">
                Verificación de Identidad
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Fingerprint className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  id="identity"
                  type="text"
                  placeholder="Número de cédula o correo"
                  className="w-full bg-[#060b13]/50 border border-slate-800 text-slate-200 text-sm rounded-xl py-3.5 pl-11 pr-4 focus:outline-none focus:ring-1 focus:ring-[#00D4AA]/50 focus:border-[#00D4AA]/50 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="button"
              className="w-full mt-2 bg-[#00D4AA] hover:bg-[#00B38F] text-[#0A0F1C] font-bold text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_15px_rgba(0,212,170,0.2)] hover:shadow-[0_6px_20px_rgba(0,212,170,0.3)]"
            >
              Consultar Estado
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-800/50 text-center">
            <p className="text-xs text-slate-400">
              ¿Tienes problemas con tu código?{' '}
              <a href="#" className="text-[#00D4AA] hover:text-[#00B38F] transition-colors font-medium">
                Contacta a soporte
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
