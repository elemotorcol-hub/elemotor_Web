import { NextResponse, NextRequest } from 'next/server';
import { getSession } from './lib/auth';

// Define las rutas que requieren autenticación
const adminRoutes = ['/admin'];
const dashboardRoutes = ['/dashboard'];
const publicRoutes = ['/auth/login', '/auth/register', '/'];

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route));
    const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));
    const isPublicRoute = publicRoutes.includes(pathname);

    // Obtener la sesión del usuario decodificando el JWT en la cookie
    const session: any = await getSession();

    // 1. Proteger rutas sin login
    if ((isAdminRoute || isDashboardRoute) && !session) {
        return NextResponse.redirect(new URL('/auth/login', request.nextUrl));
    }

    // 2. Control estricto de roles
    if (session) {
        if (isAdminRoute && session.role !== 'ADMIN') {
            return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
        }
        if (isDashboardRoute && session.role !== 'CUSTOMER') {
            return NextResponse.redirect(new URL('/admin/inventory', request.nextUrl));
        }
    }

    // 3. Evitar que logueados vuelvan a login/register
    if (isPublicRoute && session && pathname.startsWith('/auth')) {
        if (session.role === 'ADMIN') {
            return NextResponse.redirect(new URL('/admin/inventory', request.nextUrl));
        } else {
            return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
        }
    }

    return NextResponse.next();
}

// Configurar el matcher para optimizar dónde se ejecuta este middleware
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};
