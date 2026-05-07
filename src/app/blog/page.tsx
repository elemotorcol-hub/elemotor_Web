import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { buildMetadata } from '@/lib/metadata';
import { getPublishedPosts, PostSummary } from '@/services/blog.service';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const metadata = buildMetadata({
    title: 'Blog',
    description: 'Noticias, tendencias y novedades sobre movilidad eléctrica de EleMotor.',
    path: '/blog',
});

export default async function BlogPage() {
    let posts: PostSummary[] = [];
    try {
        const res = await getPublishedPosts(1, 12);
        posts = res.data;
    } catch {
        posts = [];
    }

    return (
        <main className="min-h-screen bg-[#050B09] flex flex-col pt-[72px]">
            <Navbar />

            <div className="flex-grow container mx-auto px-6 py-20">
                <div className="mb-14">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
                    <p className="text-gray-400 text-lg">Noticias, tendencias y novedades sobre movilidad eléctrica.</p>
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-24 text-gray-500">
                        <p className="text-xl">Próximamente publicaremos contenido aquí.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post) => (
                            <Link
                                key={post.id}
                                href={`/blog/${post.slug}`}
                                className="group bg-[#0E1A17] border border-white/5 rounded-2xl overflow-hidden hover:border-[#00D4AA]/30 transition-all duration-300"
                            >
                                <div className="relative aspect-video bg-[#15201D] overflow-hidden">
                                    {post.coverUrl ? (
                                        <Image
                                            src={post.coverUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <span className="text-[#00D4AA] text-4xl font-bold opacity-20">E</span>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6">
                                    <h2 className="text-white font-bold text-lg mb-3 group-hover:text-[#00D4AA] transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    {post.excerpt && (
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-3">{post.excerpt}</p>
                                    )}
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <User size={12} />
                                            {post.author.name}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} />
                                            {format(new Date(post.createdAt), "d MMM yyyy", { locale: es })}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
