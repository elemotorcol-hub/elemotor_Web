import { Bell, LayoutDashboard, Car, Users, Settings, Search, LogOut } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import AdminSidebarNav from '@/app/admin/AdminSidebarNav';
import { logoutAction } from '@/actions/authActions';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();

    if (!session) {
        redirect('/auth/login');
    }

    const { name, email } = session;

    // Extractor seguro de iniciales
    const getInitials = (userName?: string) => {
        if (!userName || userName.trim() === '') return 'U';
        const parts = userName.trim().split(/\s+/);
        return parts
            .slice(0, 2)
            .map((n) => n[0])
            .join('')
            .toUpperCase();
    };

    const initials = getInitials(name);

    return (
        <div className="flex min-h-screen bg-slate-950 font-sans text-slate-200">
            {/* Sidebar */}
            <aside className="relative z-20 flex w-64 flex-shrink-0 flex-col border-r border-slate-800/60 bg-slate-950">
                <div className="mt-2 mb-4 flex h-16 w-full items-center justify-center border-b border-slate-800/60 px-6">
                    <div className="relative h-10 w-40 cursor-pointer transition-opacity hover:opacity-90">
                        <Image
                            src="/logo-elementor1.avif"
                            alt="Elemotor Administrador"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>

                <AdminSidebarNav />

                <div className="mt-auto border-t border-slate-800/60 p-4">
                    <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-slate-800/40">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-300">
                            {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-slate-200">{name}</div>
                            <div className="mt-0.5 truncate text-xs text-slate-500">{email}</div>
                        </div>
                    </div>

                    <form action={logoutAction} className="mt-2 w-full text-center">
                        <button
                            type="submit"
                            className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-medium text-slate-400 transition-colors hover:bg-slate-800/40 hover:text-red-400"
                        >
                            <LogOut size={16} />
                            Desconectarse
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="relative z-10 flex min-w-0 flex-1 flex-col bg-[#0f172a] shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">
                {/* TopBar */}
                <header className="flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-800/60 bg-slate-950/40 px-8 backdrop-blur-md">
                    {/* TopBar Left / Global Search Mockup */}
                    <div className="relative flex max-w-xl flex-1 items-center text-slate-500">
                        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Buscar globalmente..."
                            className="w-full border-none bg-transparent py-2 pr-4 pl-10 text-sm text-slate-200 placeholder-slate-500 focus:ring-0 focus:outline-none"
                            disabled
                        />
                    </div>

                    {/* TopBar Right Actions */}
                    <div className="flex items-center gap-5">
                        <button className="relative text-slate-400 transition-colors hover:text-slate-200">
                            <Bell size={18} />
                            <span className="absolute top-0 right-0 h-2 w-2 rounded-full border border-slate-950 bg-cyan-500"></span>
                        </button>
                        <div className="h-8 border-l border-slate-800"></div>
                        <div className="flex items-center gap-3">
                            <button className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-sm font-semibold text-slate-300 transition-colors hover:border-slate-500">
                                {initials}
                            </button>
                            <form action={logoutAction}>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/20 hover:text-red-400"
                                >
                                    <LogOut size={14} />
                                    Cerrar Sesión
                                </button>
                            </form>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="w-full flex-1 overflow-y-auto p-8">{children}</div>
            </main>
        </div>
    );
}
