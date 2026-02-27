import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { AboutHero } from '@/components/About/AboutHero';
import { AboutStats } from '@/components/About/AboutStats';
import { AboutProcess } from '@/components/About/AboutProcess';
import { AboutPartners } from '@/components/About/AboutPartners';
import { AboutTeam } from '@/components/About/AboutTeam';
import { AboutCTA } from '@/components/About/AboutCTA';

export default function NosotrosPage() {
    return (
        <div className="bg-slate-900 selection:bg-[#00D4AA] selection:text-slate-900 overflow-x-hidden min-h-screen">
            <header>
                <Navbar />
            </header>

            <main>
                <AboutHero />
                <AboutStats />
                <AboutProcess />
                <AboutPartners />
                <AboutTeam />
                <AboutCTA />
            </main>

            <Footer />
        </div>
    );
}
