import { NextResponse, NextRequest } from 'next/server';
import { getSession } from './lib/auth';

// Define las rutas que requieren autenticación
const protectedRoutes = ['/admin'];
const publicRoutes = ['/auth/login', '/auth/register', '/'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Verificar si la ruta actual es una ruta protegida
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);

    // Obtener la sesión del usuario decodificando el JWT en la cookie
    const session = await getSession();

    // 1. Si intenta acceder a /admin sin estar logueado, redirigir a /login
    if (isProtectedRoute && !session) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    }

    // 2. Si ya está logueado e intenta acceder a /login o /register, redirigir directo al admin
    if (isPublicRoute && session && pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/admin/inventory', request.nextUrl));
    }

    return NextResponse.next();
}

// Configurar el matcher para optimizar dónde se ejecuta este middleware
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
