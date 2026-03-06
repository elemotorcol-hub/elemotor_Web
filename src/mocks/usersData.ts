// Esto es una base de datos simulada en memoria para pruebas locales.
// Cuando el servidor se reinicie, los usuarios registrados temporalmente se perderán.

export type User = {
    id: string;
    name: string;
    email: string;
    password?: string; // En una DB real esto sería el hash
    role: 'admin' | 'super_admin' | 'advisor' | 'client';
};

// Usuario semilla (Admin inicial)
export const mockUsersDB: User[] = [
    {
        id: '1',
        name: 'David Admin',
        email: 'admin@elemotor.com',
        password: 'password123',
        role: 'admin'
    }
];
