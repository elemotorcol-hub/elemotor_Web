'use client';

import { useState, useEffect, useMemo } from 'react';
import { X, MapPin, Phone, Mail, Star, MessageSquareCode, Loader2, CalendarClock, Search, Filter } from 'lucide-react';
import { workshopService } from '@/services/workshop.service';
import type { WorkshopResponse } from '@/services/workshop.service';

interface ScheduleAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ScheduleAppointmentModal({ isOpen, onClose }: ScheduleAppointmentModalProps) {
  const [workshops, setWorkshops] = useState<WorkshopResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedRating, setSelectedRating] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    
    setIsLoading(true);
    // Fetch active workshops sorted by rating
    workshopService
      .fetchWorkshops('?limit=100&sortBy=rating_desc')
      .then((res) => setWorkshops(res.data))
      .catch((err) => console.error('Error fetching workshops:', err))
      .finally(() => setIsLoading(false));
  }, [isOpen]);

  // Extract distinct cities from the fetched workshops
  const distinctCities = useMemo(() => {
    const cities = workshops
      .map((w) => w.city)
      .filter((city): city is string => Boolean(city));
    // Remove duplicates and sort alphabetically
    return [...new Set(cities)].sort((a, b) => a.localeCompare(b));
  }, [workshops]);

  // Apply all filters
  const filteredWorkshops = useMemo(() => {
    return workshops.filter((workshop) => {
      // 1. Text Search (Name or City) - Case insensitive
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        workshop.name.toLowerCase().includes(searchLower) ||
        (workshop.city && workshop.city.toLowerCase().includes(searchLower));

      if (searchTerm && !matchesSearch) return false;

      // 2. City Filter
      if (selectedCity && workshop.city !== selectedCity) return false;

      // 3. Rating Filter
      if (selectedRating > 0) {
        const rating = workshop.rating || 0;
        if (rating < selectedRating) return false;
      }

      return true;
    });
  }, [workshops, searchTerm, selectedCity, selectedRating]);

  // Clean up states on close
  const handleClose = () => {
    setSearchTerm('');
    setSelectedCity('');
    setSelectedRating(0);
    onClose();
  };

  const handleWhatsApp = (phone?: string | null) => {
    if (!phone) return;
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    const message = encodeURIComponent('Hola, quiero agendar una cita para mantenimiento de mi vehículo');
    window.open(`https://wa.me/${cleanPhone}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#0A110F]/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-5xl bg-[#15201D] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-6 sm:px-8 sm:py-8 border-b border-white/5 flex items-center justify-between shrink-0 bg-[#1A2724]">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#10B981]/10 flex items-center justify-center shrink-0">
              <CalendarClock className="w-6 h-6 text-[#10B981]" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                Agendar <span className="text-[#10B981]">Cita</span>
              </h2>
              <p className="text-slate-400 text-sm mt-1">Selecciona el taller de tu preferencia</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Bar */}
        <div className="px-6 py-4 bg-[#0A110F] border-b border-white/5 shrink-0 flex flex-col sm:flex-row gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-500" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2.5 border border-white/10 rounded-xl leading-5 bg-[#15201D] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-sm transition-colors"
              placeholder="Buscar por nombre o ciudad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="flex gap-4">
            {/* City Filter */}
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-4 w-4 text-slate-500" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2.5 border border-white/10 rounded-xl leading-5 bg-[#15201D] text-white focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-sm appearance-none cursor-pointer transition-colors scheme-dark"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="">Todas las ciudades</option>
                {distinctCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter */}
            <div className="relative min-w-[200px]">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Filter className="h-4 w-4 text-slate-500" />
              </div>
              <select
                className="block w-full pl-10 pr-10 py-2.5 border border-white/10 rounded-xl leading-5 bg-[#15201D] text-white focus:outline-none focus:ring-1 focus:ring-[#10B981] focus:border-[#10B981] text-sm appearance-none cursor-pointer transition-colors scheme-dark"
                value={selectedRating}
                onChange={(e) => setSelectedRating(Number(e.target.value))}
              >
                <option value={0}>Todas las calificaciones</option>
                <option value={5}>5 estrellas</option>
                <option value={4}>4+ estrellas</option>
                <option value={3}>3+ estrellas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 bg-[#15201D]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Loader2 className="w-8 h-8 text-[#10B981] animate-spin" />
              <p className="text-slate-500 font-medium">Buscando talleres...</p>
            </div>
          ) : workshops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No hay talleres disponibles</h3>
              <p className="text-slate-400 max-w-sm">
                En este momento no encontramos talleres activos en nuestra red. Por favor intenta más tarde.
              </p>
            </div>
          ) : filteredWorkshops.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Sin resultados</h3>
              <p className="text-slate-400 max-w-sm">
                No se encontraron talleres con ese criterio. Intenta ajustando los filtros o la búsqueda.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCity('');
                  setSelectedRating(0);
                }}
                className="mt-6 px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-bold transition-colors"
              >
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredWorkshops.map((workshop) => (
                <div
                  key={workshop.id}
                  className="group bg-[#0A110F] border border-white/5 hover:border-[#10B981]/30 rounded-2xl p-6 transition-all duration-300 flex flex-col h-full hover:shadow-[0_8px_30px_rgba(16,185,129,0.05)]"
                >
                  {/* Card Header: Title & Rating */}
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-white group-hover:text-[#10B981] transition-colors break-words whitespace-normal leading-tight">
                        {workshop.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-sm">
                        <MapPin className="w-4 h-4 text-[#10B981] shrink-0" />
                        <span className="text-slate-400 truncate">{workshop.city}</span>
                      </div>
                    </div>

                    <div className="flex flex-col items-start sm:items-end shrink-0">
                      <div className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                        <Star className={`w-3.5 h-3.5 ${workshop.rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'text-slate-600'}`} />
                        <span className="text-sm font-bold text-white">
                          {workshop.rating ? workshop.rating.toFixed(1) : '-'}
                        </span>
                      </div>
                      {!workshop.rating && (
                        <span className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider font-bold">Sin calif.</span>
                      )}
                    </div>
                  </div>

                  {/* Description missing check */}
                  {workshop.description && (
                    <p className="text-sm text-slate-500 line-clamp-3 mb-5 flex-1">
                      {workshop.description}
                    </p>
                  )}
                  {!workshop.description && <div className="flex-1 mb-5" />}

                  {/* Contact Info Text */}
                  <div className="flex flex-col gap-2 mb-6">
                    <p className="text-sm text-slate-300 flex items-start gap-2">
                      <span className="w-6 h-6 rounded bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      </span>
                      <span className="break-words whitespace-normal leading-snug">{workshop.address}</span>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-3 gap-3 mt-auto pt-4 border-t border-white/5">
                    {/* Primary action WhatsApp */}
                    {workshop.whatsapp ? (
                      <button
                        onClick={() => handleWhatsApp(workshop.whatsapp)}
                        className="h-11 flex items-center justify-center rounded-xl bg-[#25D366]/10 hover:bg-[#25D366]/20 border border-[#25D366]/30 hover:border-[#25D366]/60 text-[#25D366] hover:text-[#25D366] transition-all shadow-[0_0_15px_rgba(37,211,102,0.1)] hover:shadow-[0_0_25px_rgba(37,211,102,0.2)]"
                        title="Contactar por WhatsApp"
                      >
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </button>
                    ) : (
                      <div className="h-11 flex items-center justify-center rounded-xl bg-white/5 text-slate-600 opacity-50 cursor-not-allowed" title="Sin WhatsApp">
                        <MessageSquareCode className="w-5 h-5" />
                      </div>
                    )}

                    {/* Secondary action Phone */}
                    {workshop.phone ? (
                      <a
                        href={`tel:${workshop.phone}`}
                        className="h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white transition-all"
                        title="Llamar"
                      >
                        <Phone className="w-5 h-5" />
                      </a>
                    ) : (
                      <div className="h-11 flex items-center justify-center rounded-xl bg-white/5 text-slate-600 opacity-50 cursor-not-allowed" title="Sin teléfono">
                        <Phone className="w-5 h-5" />
                      </div>
                    )}

                    {/* Secondary action Mail */}
                    {workshop.email ? (
                      <a
                        href={`mailto:${workshop.email}`}
                        className="h-11 flex items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-slate-300 hover:text-white transition-all"
                        title="Enviar correo"
                      >
                        <Mail className="w-5 h-5" />
                      </a>
                    ) : (
                      <div className="h-11 flex items-center justify-center rounded-xl bg-white/5 text-slate-600 opacity-50 cursor-not-allowed" title="Sin correo">
                        <Mail className="w-5 h-5" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
