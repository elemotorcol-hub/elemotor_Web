'use server';

import { deleteSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { authService } from '@/services/auth.service';

export async function logoutAction() {
    try {
        await authService.logout();
    } catch (error) {
        // Fail silently if there's a backend issue during logout
    }
    await deleteSession();
    redirect('/auth/login');
}
