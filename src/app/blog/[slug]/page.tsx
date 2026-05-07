import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { getPostBySlug } from '@/services/blog.service';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Metadata } from 'next';

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { slug } = await params;
        const post = await getPostBySlug(slug);
        return {
            title: `${post.title} | EleMotor Blog`,
            description: post.excerpt ?? post.title,
            openGraph: post.coverUrl ? { images: [post.coverUrl] } : undefined,
        };
    } catch {
        return { title: 'Post | EleMotor Blog' };
    }
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    let post;
    try {
        post = await getPostBySlug(slug);
    } catch {
        notFound();
    }

    return (
        <main className="min-h-screen bg-[#050B09] flex flex-col pt-[72px]">
            <Navbar />

            <article className="flex-grow container mx-auto px-6 py-20 max-w-4xl">
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-[#00D4AA] transition-colors mb-10 text-sm"
                >
                    <ArrowLeft size={16} />
                    Volver al Blog
                </Link>

                {post.coverUrl && (
                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-10 border border-white/5">
                        <Image
                            src={post.coverUrl}
                            alt={post.title}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                )}

                <header className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">{post.title}</h1>
                    <div className="flex items-center gap-5 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                            <User size={14} />
                            {post.author.name}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar size={14} />
                            {format(new Date(post.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                        </span>
                    </div>
                </header>

                <div
                    className="prose prose-invert prose-green max-w-none text-gray-300
                        prose-headings:text-white prose-headings:font-bold
                        prose-a:text-[#00D4AA] prose-a:no-underline hover:prose-a:underline
                        prose-img:rounded-xl prose-img:border prose-img:border-white/10
                        prose-strong:text-white prose-blockquote:border-[#00D4AA]
                        prose-code:text-[#00D4AA] prose-code:bg-[#0E1A17] prose-code:px-1 prose-code:rounded"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />
            </article>

            <Footer />
        </main>
    );
}
