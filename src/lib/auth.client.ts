import { getClientSession } from '@/actions/session';

/**
 * Client-safe facade for getting the user session. 
 * Invokes a Server Action under the hood instead of importing `next/headers`.
 */
export async function getSession() {
    return await getClientSession();
}
