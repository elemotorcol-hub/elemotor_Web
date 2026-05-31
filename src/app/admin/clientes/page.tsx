import ClientsTable from '@/components/admin/clients/ClientsTable';

export const metadata = {
    title: 'Clientes — Admin Elemotor',
};

export default function ClientesPage() {
    return (
        <div className="max-w-7xl mx-auto flex flex-col gap-8 pb-8 w-full">
            <div className="flex flex-col gap-1.5 border-b border-slate-800 pb-5">
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Clientes</h1>
                <p className="text-slate-400">Directorio de clientes y trazabilidad de vehículos.</p>
            </div>
            <ClientsTable />
        </div>
    );
}
