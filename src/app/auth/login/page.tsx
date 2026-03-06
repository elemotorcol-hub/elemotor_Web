import LoginForm from '@/components/auth/LoginForm'; // Client component
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Iniciar Sesión - Elemotor',
    description: 'Ingresa a tu cuenta de Elemotor para acceder al panel de administración.'
};

export default function LoginPage() {
    return (
        <div className="w-full flex items-center justify-center">
            <LoginForm />
        </div>
    );
}
