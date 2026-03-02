import React from 'react';
import { Bell, LayoutDashboard, Car, Users, Settings, Search } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    // TODO: Implementar JWT Auth Guard o envolver en <AuthProvider> según la HU de Login.

    return (
        <div className="min-h-screen bg-slate-950 flex font-sans text-slate-200">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-950 border-r border-slate-800/60 flex flex-col flex-shrink-0 relative z-20">
                <div className="h-16 flex items-center px-6 border-b border-slate-800/60 w-full mb-4 mt-2">
                    <div className="flex items-center gap-3 text-cyan-400 font-bold text-xl tracking-wide w-full cursor-pointer hover:opacity-90 transition-opacity">
                        <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-slate-950 text-xs shadow-lg shadow-cyan-500/20">
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M13 3L4 14h7v7l9-11h-7V3z" /></svg>
                        </div>
                        Elemotor
                    </div>
                </div>

                <nav className="flex-1 py-2 px-3 flex flex-col gap-1.5 overflow-y-auto">
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all font-medium text-sm">
                        <LayoutDashboard size={18} />
                        Dashboard
                    </a>
                    <a href="/admin/inventory" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-cyan-400 bg-cyan-900/20 font-medium transition-all text-sm border border-cyan-500/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] shadow-cyan-900/20">
                        <Car size={18} />
                        Inventory
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all font-medium text-sm">
                        <Users size={18} />
                        CRM
                    </a>
                    <a href="#" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 transition-all font-medium text-sm">
                        <Settings size={18} />
                        Settings
                    </a>
                </nav>

                <div className="p-4 border-t border-slate-800/60 mt-auto">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-800/40 transition-colors cursor-pointer">
                        <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center font-semibold text-sm text-slate-300 border border-slate-700">
                            AK
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-slate-200 truncate">Admin</div>
                            <div className="text-xs text-slate-500 truncate mt-0.5">admin@elemotor.com</div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 relative z-10 bg-[#0f172a] shadow-[-10px_0_15px_-3px_rgba(0,0,0,0.5)]">
                {/* TopBar */}
                <header className="h-16 border-b border-slate-800/60 flex flex-shrink-0 items-center justify-between px-8 bg-slate-950/40 backdrop-blur-md">
                    {/* TopBar Left / Global Search Mockup */}
                    <div className="flex-1 max-w-xl flex items-center relative text-slate-500">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search globally..."
                            className="w-full bg-transparent border-none focus:ring-0 pl-10 pr-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none"
                            disabled
                        />
                    </div>

                    {/* TopBar Right Actions */}
                    <div className="flex items-center gap-5">
                        <button className="text-slate-400 hover:text-slate-200 transition-colors relative">
                            <Bell size={18} />
                            <span className="absolute top-0 right-0 w-2 h-2 bg-cyan-500 rounded-full border border-slate-950"></span>
                        </button>
                        <div className="h-8 border-l border-slate-800"></div>
                        <button className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-semibold text-sm text-slate-300 border border-slate-700 hover:border-slate-500 transition-colors">
                            AK
                        </button>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-8 overflow-y-auto w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
