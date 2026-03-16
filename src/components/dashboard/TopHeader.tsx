'use client';

import { Bell, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
    userName: string;
    role: string;
    onToggleSidebar?: () => void;
    onToggleMobile?: () => void;
    isSidebarCollapsed?: boolean;
}

export function TopHeader({ userName, role, onToggleSidebar, onToggleMobile, isSidebarCollapsed }: Props) {
    const getInitials = (name?: string) => {
        if (!name || !name.trim()) return 'U';
        return name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };
    const fallbackInitials = getInitials(userName);

    return (
        <header className={`h-[80px] flex items-center justify-between px-4 lg:px-8 bg-[#0A110F] border-b border-white/5 sticky top-0 z-40 transition-all duration-300`}>
            {/* Left Section: Toggle & Greeting */}
            <div className="flex items-center gap-4">
                {/* Mobile Hamburger */}
                <button 
                    onClick={onToggleMobile}
                    className="lg:hidden p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    <Menu size={20} />
                </button>

                {/* Desktop Toggle */}
                <button 
                    onClick={onToggleSidebar}
                    className="hidden lg:flex p-2 -ml-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                    {isSidebarCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                </button>

                <div className="flex flex-col">
                    <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
                        Hola, {userName.split(' ')[0]}
                    </h1>
                    <p className="text-[11px] lg:text-sm font-medium text-slate-400">
                        Bienvenido de nuevo
                    </p>
                </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-3 lg:gap-6">
                {/* Notification Bell */}
                <button className="hidden xs:flex w-10 h-10 rounded-full bg-white/5 border border-white/5 items-center justify-center text-slate-400 hover:text-white transition-colors relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-[#10B981] rounded-full"></span>
                </button>

                {/* Profile Widget */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold text-white group-hover:text-[#10B981] transition-colors">{userName}</p>
                        <p className="text-[11px] font-medium text-slate-400">{role}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-[#15201D] border border-white/10 flex items-center justify-center overflow-hidden">
                        <span className="text-[#10B981] font-bold text-sm">{fallbackInitials}</span>
                    </div>
                </div>
            </div>
        </header>
    );
}
