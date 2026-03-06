import RegisterForm from '@/components/auth/RegisterForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Crear Cuenta - Elemotor',
    description: 'Regístrate en Elemotor para unirte a la revolución de la movilidad eléctrica.'
};

export default function RegisterPage() {
    return (
        <div className="w-full flex items-center justify-center">
            <RegisterForm />
        </div>
    );
}
