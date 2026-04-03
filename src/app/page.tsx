import Link from 'next/link';
import { IoCheckmark } from 'react-icons/io5';

import { Container } from '@/components/container';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';
import { PricingSection } from '@/features/pricing/components/pricing-section';

export default async function HomePage() {
  return (
    <div className='flex flex-col gap-8 lg:gap-32'>
      <HeroSection />
      <FeaturesSection />
      <PricingSection />
    </div>
  );
}

function HeroSection() {
  return (
    <section className='relative overflow-hidden lg:overflow-visible'>
      <Container className='relative rounded-lg bg-card py-20 lg:py-[140px]'>
        <div className='relative z-10 flex flex-col items-center gap-5 text-center'>
          <div className='w-fit rounded-full bg-gradient-to-r from-[#616571] via-[#7782A9] to-[#826674] px-4 py-1'>
            <span className='font-alt text-sm font-semibold text-black mix-blend-soft-light'>
              Ship faster. Scale easier.
            </span>
          </div>
          <h1 className='max-w-3xl text-4xl font-bold lg:text-6xl'>
            Everything you need to launch your SaaS
          </h1>
          <p className='max-w-xl text-lg text-muted-foreground'>
            {siteConfig.description}
          </p>
          <div className='flex gap-4'>
            <Button asChild variant='sexy'>
              <Link href='/signup'>Get started for free</Link>
            </Button>
            <Button asChild variant='outline'>
              <Link href='/pricing'>View pricing</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FeaturesSection() {
  const features = [
    {
      title: 'Authentication',
      description: 'OAuth, magic links, and session management with Supabase Auth. Ready out of the box.',
    },
    {
      title: 'Payments & Subscriptions',
      description: 'Stripe checkout, customer portal, webhook sync, and billing management included.',
    },
    {
      title: 'Transactional Emails',
      description: 'React Email templates with Resend integration for verification, receipts, and more.',
    },
    {
      title: 'Role-based Access',
      description: 'User and admin roles with row-level security enforced at the database layer.',
    },
    {
      title: 'Dark Mode',
      description: 'System-aware theme switching built in. Light and dark themes work everywhere.',
    },
    {
      title: 'Type Safe',
      description: 'End-to-end TypeScript with generated Supabase types, Zod validation, and strict mode.',
    },
  ];

  return (
    <section className='flex flex-col items-center gap-8 py-8'>
      <h2 className='text-center text-3xl font-bold lg:text-4xl'>Built for builders</h2>
      <p className='max-w-lg text-center text-muted-foreground'>
        Skip weeks of boilerplate setup. Focus on what makes your product unique.
      </p>
      <div className='grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {features.map((feature) => (
          <div
            key={feature.title}
            className='flex flex-col gap-2 rounded-lg border border-border bg-card p-6'
          >
            <div className='flex items-center gap-2'>
              <IoCheckmark className='text-emerald-500' size={18} />
              <h3 className='font-semibold'>{feature.title}</h3>
            </div>
            <p className='text-sm text-muted-foreground'>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
