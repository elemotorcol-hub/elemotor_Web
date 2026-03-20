'use client';

import { ShieldX, MessageCircle } from 'lucide-react';

const ADVISOR_PHONE = '573001234567'; // ⚠️ Reemplaza con el número real del asesor
const WA_MESSAGE = encodeURIComponent(
  'Hola, ya recibí mi vehículo pero no tengo acceso al módulo de mantenimiento. ¿Me pueden ayudar?'
);

export function MaintenanceAccessBlocker() {
  const waUrl = `https://wa.me/${ADVISOR_PHONE}?text=${WA_MESSAGE}`;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-lg mx-auto text-center px-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Icon */}
      <div className="w-24 h-24 rounded-full bg-slate-800/60 border border-white/10 flex items-center justify-center mb-8 shadow-lg">
        <ShieldX className="w-12 h-12 text-slate-500" />
      </div>

      {/* Main message */}
      <h2 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight">
        Módulo no disponible
      </h2>
      <p className="text-slate-300 text-base md:text-lg mb-4 leading-relaxed">
        Para acceder a este módulo debes esperar a que tu vehículo sea entregado.
      </p>

      {/* Secondary message */}
      <p className="text-slate-500 text-sm mb-10 leading-relaxed">
        Si tu vehículo ya fue entregado y el módulo aún no se activa, por favor contacta a tu asesor para proceder con la activación.
      </p>

      {/* WhatsApp CTA */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-3 px-8 py-4 bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366]/60 text-[#25D366] hover:text-white rounded-2xl font-bold text-sm transition-all duration-300 shadow-[0_0_20px_rgba(37,211,102,0.1)] hover:shadow-[0_0_30px_rgba(37,211,102,0.2)]"
      >
        <span className="w-6 h-6 shrink-0">
          {/* WhatsApp icon SVG */}
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </span>
        Contactar por WhatsApp
        <MessageCircle className="w-4 h-4 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
      </a>
    </div>
  );
}
