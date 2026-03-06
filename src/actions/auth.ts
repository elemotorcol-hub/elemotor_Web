'use server';

import { createSession, deleteSession } from '@/lib/auth';
import { mockUsersDB } from '@/mocks/usersData';

export async function loginAction(email: string, password: string) {
    // 1. Buscar usuario en base de datos (simulada)
    const user = mockUsersDB.find(u => u.email === email);

    if (!user) {
        return { error: 'Usuario no encontrado' };
    }

    // 2. Verificar contraseña (simulada, en la vida real usarías bcrypt.compare)
    if (user.password !== password) {
        return { error: 'Contraseña incorrecta' };
    }

    // 3. Crear sesión JWT segura HTTP-Only
    await createSession({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
    });

    return { success: true, role: user.role };
}

export async function registerAction(name: string, email: string, phone: string, password: string) {
    // 1. Verificar si el usuario ya existe
    const exists = mockUsersDB.find(u => u.email === email);

    if (exists) {
        return { error: 'El correo electrónico ya está registrado' };
    }

    // 2. Insertar nuevo usuario en la base de datos (simulada en memoria)
    const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password, // En la vida real haríamos hasheo aquí con bcrypt
        role: 'client' as const
    };

    mockUsersDB.push(newUser);

    // 3. Crear sesión y loguearlo automáticamente
    await createSession({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    });

    return { success: true, role: newUser.role };
}

export async function logoutAction() {
    await deleteSession();
}
