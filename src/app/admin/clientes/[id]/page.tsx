import ClientProfileView from '@/components/admin/clients/ClientProfileView';

export const metadata = {
    title: 'Perfil de cliente — Admin Elemotor',
};

export default async function ClienteDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ClientProfileView userId={Number(id)} />;
}
