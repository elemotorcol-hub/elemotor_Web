import { fetchApi } from '@/lib/api';

export type TicketCategory = 'technical' | 'billing' | 'delivery' | 'general';
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export interface CreateTicketPayload {
  subject: string;
  message: string;
  category?: TicketCategory;
}

export interface SupportTicket {
  id: number;
  subject: string;
  category: TicketCategory;
  status: TicketStatus;
  createdAt: string;
}

export interface TicketMessage {
  id: number;
  body: string;
  createdAt: string;
  sender: { id: number; name: string; role: string };
}

export interface SupportTicketDetail extends SupportTicket {
  messages: TicketMessage[];
  user: { id: number; name: string; email: string; phone?: string };
  updatedAt: string;
  _count?: { messages: number };
}

export const supportTicketsService = {
  create: (payload: CreateTicketPayload) => fetchApi('/api/support-tickets', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMine: () => fetchApi('/api/support-tickets/mine', { method: 'GET' }),
  getOne: (id: number) => fetchApi(`/api/support-tickets/${id}`),
  addMessage: (id: number, body: string) => fetchApi(`/api/support-tickets/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  }),
};
