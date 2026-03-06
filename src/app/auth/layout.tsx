import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#0A110F] font-sans flex items-center justify-center p-4 selection:bg-[#10B981]/30">
            {children}
        </div>
    );
}
