'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Youtube from '@tiptap/extension-youtube';
import {
    Bold, Italic, List, ListOrdered, Link as LinkIcon,
    Image as ImageIcon, Youtube as YoutubeIcon, Heading2, Heading3,
    Quote, Code, Undo, Redo,
} from 'lucide-react';
import { blogAdminService } from '@/services/blog.service';

interface Props {
    value: string;
    onChange: (html: string) => void;
}

export function RichTextEditor({ value, onChange }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Image.configure({ inline: false, allowBase64: false }),
            Link.configure({ openOnClick: false, autolink: true }),
            Youtube.configure({ controls: true }),
        ],
        content: value,
        onUpdate: ({ editor }) => onChange(editor.getHTML()),
    });

    if (!editor) return null;

    const btn = (active: boolean) =>
        `p-2 rounded hover:bg-white/10 transition-colors ${active ? 'text-[#00D4AA] bg-white/10' : 'text-gray-400'}`;

    const addImage = async () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = async () => {
            const file = input.files?.[0];
            if (!file) return;
            try {
                const { publicUrl } = await blogAdminService.uploadCover(file);
                editor.chain().focus().setImage({ src: publicUrl }).run();
            } catch {
                alert('Error al subir la imagen');
            }
        };
        input.click();
    };

    const addLink = () => {
        const url = window.prompt('URL del enlace');
        if (!url) return;
        editor.chain().focus().setLink({ href: url }).run();
    };

    const addYoutube = () => {
        const url = window.prompt('URL del video de YouTube');
        if (!url) return;
        editor.commands.setYoutubeVideo({ src: url });
    };

    return (
        <div className="border border-white/10 rounded-xl overflow-hidden bg-[#0A1410]">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 border-b border-white/10 bg-[#0E1A17]">
                <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}>
                    <Bold size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}>
                    <Italic size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}>
                    <Heading2 size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}>
                    <Heading3 size={16} />
                </button>
                <div className="w-px bg-white/10 mx-1" />
                <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>
                    <List size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>
                    <ListOrdered size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}>
                    <Quote size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().toggleCode().run()} className={btn(editor.isActive('code'))}>
                    <Code size={16} />
                </button>
                <div className="w-px bg-white/10 mx-1" />
                <button type="button" onClick={addLink} className={btn(editor.isActive('link'))}>
                    <LinkIcon size={16} />
                </button>
                <button type="button" onClick={addImage} className={btn(false)}>
                    <ImageIcon size={16} />
                </button>
                <button type="button" onClick={addYoutube} className={btn(false)}>
                    <YoutubeIcon size={16} />
                </button>
                <div className="w-px bg-white/10 mx-1" />
                <button type="button" onClick={() => editor.chain().focus().undo().run()} className={btn(false)} disabled={!editor.can().undo()}>
                    <Undo size={16} />
                </button>
                <button type="button" onClick={() => editor.chain().focus().redo().run()} className={btn(false)} disabled={!editor.can().redo()}>
                    <Redo size={16} />
                </button>
            </div>

            {/* Content area */}
            <EditorContent
                editor={editor}
                className="prose prose-invert prose-green max-w-none min-h-[320px] p-4 text-gray-300
                    prose-headings:text-white prose-a:text-[#00D4AA] prose-img:rounded-lg
                    focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[300px]"
            />
        </div>
    );
}
