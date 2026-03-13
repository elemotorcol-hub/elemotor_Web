export type UserRole = 'super_admin' | 'admin' | 'advisor' | 'client';
export type UserStatus = 'active' | 'inactive';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: string;
  avatar?: string;
}

export const adminUsersData: AdminUser[] = [
  {
    id: 'USR-001',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@elemotor.com',
    role: 'super_admin',
    status: 'active',
    lastLogin: '2026-03-11T08:30:00Z',
  },
  {
    id: 'USR-002',
    name: 'Ana Silva',
    email: 'ana.silva@elemotor.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-03-10T14:15:00Z',
  },
  {
    id: 'USR-003',
    name: 'Javier Gomez',
    email: 'javier.gomez@elemotor.com',
    role: 'advisor',
    status: 'active',
    lastLogin: '2026-03-11T09:05:00Z',
  },
  {
    id: 'USR-004',
    name: 'Laura Restrepo',
    email: 'laura.restrepo@elemotor.com',
    role: 'advisor',
    status: 'inactive',
    lastLogin: '2026-02-28T16:45:00Z',
  },
  {
    id: 'USR-005',
    name: 'Diego Castro',
    email: 'diego.castro@elemotor.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-03-09T10:20:00Z',
  }
];
