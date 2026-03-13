'use server';

import { getSession as getSessionServer } from '@/lib/auth.server';

/**
 * Server action designed to be safely called from Client Components 
 * to retrieve the active session without triggering Server Component boundary errors.
 */
export async function getClientSession() {
    return await getSessionServer();
}
