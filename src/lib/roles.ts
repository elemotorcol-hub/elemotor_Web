export const ADMIN_ROLES = ['admin', 'super_admin', 'advisor'];

/**
 * Verifica si el rol provisto tiene acceso al panel de administración.
 * @param role El rol del usuario devuelto por la API.
 * @returns boolean indicando acceso de administrador.
 */
export const hasAdminAccess = (role: string | null | undefined): boolean => {
    return !!role && ADMIN_ROLES.includes(role);
};
