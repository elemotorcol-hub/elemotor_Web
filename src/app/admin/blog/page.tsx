'use client';

import { useState, useEffect, useCallback } from 'react';
import { blogAdminService, PostSummary } from '@/services/blog.service';
import { BlogPostsTable } from '@/components/admin/blog/BlogPostsTable';
import { BlogPostSlideOver } from '@/components/admin/blog/BlogPostSlideOver';

export default function AdminBlogPage() {
    const [posts, setPosts] = useState<PostSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selected, setSelected] = useState<PostSummary | null>(null);
    const [slideOpen, setSlideOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState<PostSummary | null>(null);

    const fetchPosts = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await blogAdminService.findAll(1, 100);
            setPosts(res.data);
        } catch {
            setPosts([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const openNew = () => { setSelected(null); setSlideOpen(true); };
    const openEdit = (post: PostSummary) => { setSelected(post); setSlideOpen(true); };

    const handleDelete = async (post: PostSummary) => {
        if (!window.confirm(`¿Eliminar "${post.title}"? Esta acción no se puede deshacer.`)) return;
        try {
            await blogAdminService.delete(post.id);
            fetchPosts();
        } catch {
            alert('Error al eliminar el post');
        }
    };

    return (
        <>
            <BlogPostsTable
                posts={posts}
                onEdit={openEdit}
                onDelete={handleDelete}
                onNew={openNew}
                isLoading={isLoading}
            />

            <BlogPostSlideOver
                post={selected}
                open={slideOpen}
                onClose={() => setSlideOpen(false)}
                onSaved={fetchPosts}
            />
        </>
    );
}
