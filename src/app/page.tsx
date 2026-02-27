import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { ModelCarousel } from '@/components/ModelCarousel';
import { ValueProps } from '@/components/ValueProps';
import { CTABanner } from '@/components/CTABanner';
import { Footer } from '@/components/Footer';

export default function Home() {
  return (
    <div className="bg-slate-900 selection:bg-[#00D4AA] selection:text-slate-900 overflow-x-hidden">
      <header>
        <Navbar />
      </header>

      <main>
        <Hero />

        <article>
          <ModelCarousel />
        </article>

        <section>
          <ValueProps />
        </section>

        <section>
          <CTABanner />
        </section>
      </main>

      <Footer />
    </div>
  );
}
