'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

export default function DashboardLayoutWrapper({ 
    children, 
    user 
}: { 
    children: React.ReactNode;
    user: { name: string; role: string };
}) {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Persist desktop sidebar state
    useEffect(() => {
        const stored = localStorage.getItem('clientSidebarCollapsed');
        if (stored !== null) {
            setIsSidebarCollapsed(stored === 'true');
        }
    }, []);

    const toggleSidebar = () => {
        const newState = !isSidebarCollapsed;
        setIsSidebarCollapsed(newState);
        localStorage.setItem('clientSidebarCollapsed', String(newState));
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    return (
        <div className="min-h-screen bg-[#0A110F] text-slate-300 selection:bg-[#10B981] selection:text-[#0A110F] flex font-sans overflow-x-hidden">
            {/* Sidebar Component */}
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                isMobileOpen={isMobileMenuOpen} 
                onMobileClose={() => setIsMobileMenuOpen(false)} 
            />

            {/* Backdrop for mobile */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity border-none focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
                isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-[260px]'
            }`}>
                <TopHeader 
                    userName={user.name} 
                    role={user.role} 
                    onToggleSidebar={toggleSidebar}
                    onToggleMobile={toggleMobileMenu}
                    isSidebarCollapsed={isSidebarCollapsed}
                />

                <main className="flex-1 p-6 lg:p-10">
                    <div className="mx-auto max-w-[1600px] w-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
