import ClientProfileView from '@/components/admin/clients/ClientProfileView';

export const metadata = {
    title: 'Perfil de cliente — Admin Elemotor',
};

export default function ClienteDetailPage({ params }: { params: { id: string } }) {
    return <ClientProfileView userId={Number(params.id)} />;
}
