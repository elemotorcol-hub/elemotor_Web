import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';

const ModelCarousel = dynamic(() => import('@/components/ModelCarousel').then(mod => mod.ModelCarousel));
const CompareSection = dynamic(() => import('@/components/CompareSection').then(mod => mod.CompareSection));
const ValueProps = dynamic(() => import('@/components/ValueProps').then(mod => mod.ValueProps));
const ExperienceSection = dynamic(() => import('@/components/ExperienceSection').then(mod => mod.ExperienceSection));
const PaymentMethods = dynamic(() => import('@/components/PaymentMethods').then(mod => mod.PaymentMethods));
const ServicesSection = dynamic(() => import('@/components/ServicesSection').then(mod => mod.ServicesSection));
const WarrantySection = dynamic(() => import('@/components/WarrantySection').then(mod => mod.WarrantySection));
const AboutSection = dynamic(() => import('@/components/AboutSection').then(mod => mod.AboutSection));
const BlogSection = dynamic(() => import('@/components/BlogSection').then(mod => mod.BlogSection));
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
          <CompareSection />
        </section>

        <section>
          <ValueProps />
        </section>

        <section>
          <ExperienceSection />
        </section>

        <section>
          <PaymentMethods variant="section" />
        </section>

        <section>
          <ServicesSection />
        </section>

        <section>
          <WarrantySection />
        </section>

        <section>
          <AboutSection />
        </section>

        <section>
          <BlogSection />
        </section>

        <section>
          <CTABanner />
        </section>
      </main>

      <Footer />
    </div>
  );
}
