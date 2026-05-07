import { fetchApi } from '@/lib/api';

export type PostStatus = 'draft' | 'published';

export interface PostAuthor {
    id: number;
    name: string;
    avatarUrl?: string;
}

export interface PostSummary {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    coverUrl?: string;
    status: PostStatus;
    createdAt: string;
    updatedAt: string;
    author: PostAuthor;
}

export interface PostDetail extends PostSummary {
    content: string;
    coverPublicId?: string;
}

export interface PostsResponse {
    data: PostSummary[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CreatePostData {
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    coverUrl?: string;
    coverPublicId?: string;
    status?: PostStatus;
}

export type UpdatePostData = Partial<CreatePostData>;

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

// ─── Público (sin auth) ───────────────────────────────────────────────────────

export async function getPublishedPosts(page = 1, limit = 9): Promise<PostsResponse> {
    const res = await fetch(`${API_BASE}/api/blog?page=${page}&limit=${limit}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Error fetching posts');
    return res.json();
}

export async function getPostBySlug(slug: string): Promise<PostDetail> {
    const res = await fetch(`${API_BASE}/api/blog/slug/${slug}`, {
        next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error('Post not found');
    return res.json();
}

// ─── Admin (con auth) ─────────────────────────────────────────────────────────

export const blogAdminService = {
    findAll(page = 1, limit = 20, status?: PostStatus): Promise<PostsResponse> {
        const params = new URLSearchParams({ page: String(page), limit: String(limit) });
        if (status) params.set('status', status);
        return fetchApi(`/api/blog/admin/all?${params}`);
    },

    findOne(id: number): Promise<PostDetail> {
        return fetchApi(`/api/blog/admin/${id}`);
    },

    create(data: CreatePostData): Promise<PostDetail> {
        return fetchApi('/api/blog', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update(id: number, data: UpdatePostData): Promise<PostDetail> {
        return fetchApi(`/api/blog/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        });
    },

    delete(id: number): Promise<void> {
        return fetchApi(`/api/blog/${id}`, { method: 'DELETE' });
    },

    uploadCover(file: File): Promise<{ publicUrl: string; publicId: string }> {
        const form = new FormData();
        form.append('file', file);
        return fetchApi('/api/upload/image?folder=blog', {
            method: 'POST',
            body: form,
        });
    },
};
