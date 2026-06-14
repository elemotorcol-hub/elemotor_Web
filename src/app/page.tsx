import dynamic from 'next/dynamic';
import { Navbar } from '@/components/Navbar';
import { HeroPrincipal } from '@/components/HeroPrincipal';
import { Hero } from '@/components/Hero';
import { getPublishedPosts } from '@/services/blog.service';
import type { PostSummary } from '@/services/blog.service';
import { getGoogleReviews } from '@/services/google-reviews.service';
import type { GoogleReview } from '@/services/google-reviews.service';
import type { ClientTestimonial } from '@/components/EntregasYResenas';

const ModelCarousel = dynamic(() => import('@/components/ModelCarousel').then(mod => mod.ModelCarousel));
const CompareSection = dynamic(() => import('@/components/CompareSection').then(mod => mod.CompareSection));
const ValueProps = dynamic(() => import('@/components/ValueProps').then(mod => mod.ValueProps));
const TaxIncentivesSection = dynamic(() => import('@/components/TaxIncentivesSection').then(mod => mod.TaxIncentivesSection));
const ExperienceSection = dynamic(() => import('@/components/ExperienceSection').then(mod => mod.ExperienceSection));
const PaymentMethods = dynamic(() => import('@/components/PaymentMethods').then(mod => mod.PaymentMethods));
const ServicesSection = dynamic(() => import('@/components/ServicesSection').then(mod => mod.ServicesSection));
const WarrantySection = dynamic(() => import('@/components/WarrantySection').then(mod => mod.WarrantySection));
const AboutSection = dynamic(() => import('@/components/AboutSection').then(mod => mod.AboutSection));
const EntregasYResenas = dynamic(() => import('@/components/EntregasYResenas').then(mod => mod.EntregasYResenas));
const BlogSection = dynamic(() => import('@/components/BlogSection').then(mod => mod.BlogSection));
const CTABanner = dynamic(() => import('@/components/CTABanner').then(mod => mod.CTABanner));
const Footer = dynamic(() => import('@/components/Footer').then(mod => mod.Footer));

export default async function Home() {
  let blogPosts: PostSummary[] = [];
  try {
    const res = await getPublishedPosts(1, 3);
    blogPosts = res.data;
  } catch {
    // silently fail
  }

  let googleReviews: GoogleReview[] = [];
  try {
    googleReviews = await getGoogleReviews();
  } catch {
    // silently fail — sección usa datos de respaldo
  }

  const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  const clientTestimonials: ClientTestimonial[] = await fetch(
    `${backendUrl}/api/testimonials?rating=5`,
    { cache: 'no-store' },
  )
    .then((r) => (r.ok ? r.json() : []))
    .then((data) => (Array.isArray(data) ? data : []))
    .catch(() => []);

  return (
    <div className="bg-slate-900 selection:bg-[#00D4AA] selection:text-slate-900 overflow-x-hidden">
      <header>
        <Navbar />
      </header>

      <main>
        <HeroPrincipal />

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
          <TaxIncentivesSection />
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
          <EntregasYResenas googleReviews={googleReviews} clientTestimonials={clientTestimonials} />
        </section>

        <section>
          <BlogSection posts={blogPosts} />
        </section>

        <section>
          <CTABanner />
        </section>
      </main>

      <Footer />
    </div>
  );
}
