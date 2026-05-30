import AppointmentsTable from '@/components/admin/appointments/AppointmentsTable';

export const metadata = {
    title: 'Mantenimiento — Admin Elemotor',
};

export default function MantenimientoPage() {
    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-8 w-full">
            <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-5">
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Citas de Mantenimiento</h1>
                <p className="text-slate-400">Gestiona las solicitudes de cita recibidas desde el sitio web.</p>
            </div>
            <AppointmentsTable />
        </div>
    );
}
