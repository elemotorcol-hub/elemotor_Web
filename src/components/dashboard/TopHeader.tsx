import { Bell, ChevronDown } from 'lucide-react';

interface Props {
    userName: string;
    role: string;
}

export function TopHeader({ userName, role }: Props) {
    const getInitials = (name?: string) => {
        if (!name || !name.trim()) return 'U';
        return name.trim().split(/\s+/).map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };
    const fallbackInitials = getInitials(userName);

    return (
        <header className="h-[80px] lg:pl-[260px] flex items-center justify-between px-8 bg-[#0A110F] border-b border-white/5 sticky top-0 z-40">
            {/* Greeting */}
            <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">
                    Hola, {userName.split(' ')[0]}
                </h1>
                <p className="text-sm font-medium text-slate-400">
                    Bienvenido de nuevo
                </p>
            </div>

            {/* User Actions */}
            <div className="flex items-center gap-6">
                {/* Notification Bell */}
                <button className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors relative">
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
                    <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                </div>
            </div>
        </header>
    );
}
