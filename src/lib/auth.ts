import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

const secretKey = process.env.JWT_SECRET_KEY || 'development-fallback-secret-key-do-not-use-in-prod';
const key = new TextEncoder().encode(secretKey);

interface SessionPayload {
    user: { id: string; name: string; email: string };
    expires: Date;
    [key: string]: unknown;
}

export async function encrypt(payload: SessionPayload) {
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('24h')
        .sign(key);
}

export async function decrypt(input: string): Promise<SessionPayload | null> {
    try {
        const { payload } = await jwtVerify(input, key, {
            algorithms: ['HS256'],
        });
        return payload as SessionPayload;
    } catch (error) {
        return null;
    }
}

export async function createSession(user: { id: string, name: string, email: string }) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user, expires });

    (await cookies()).set('elemotor_session', session, {
        expires,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
    });
}

export async function getSession() {
    const sessionCookie = (await cookies()).get('elemotor_session')?.value;
    if (!sessionCookie) return null;
    try {
        const parsed = await decrypt(sessionCookie);
        return parsed?.user || null;
    } catch (error) {
        return null;
    }
}

export async function deleteSession() {
    (await cookies()).delete('elemotor_session');
}
