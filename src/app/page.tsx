import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';

const ModelCarousel = dynamic(() => import('@/components/ModelCarousel').then(mod => mod.ModelCarousel));
const ValueProps = dynamic(() => import('@/components/ValueProps').then(mod => mod.ValueProps));
const CTABanner = dynamic(() => import('@/components/CTABanner').then(mod => mod.CTABanner));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

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
