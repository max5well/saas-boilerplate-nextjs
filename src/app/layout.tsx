import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';
import { Montserrat, Montserrat_Alternates } from 'next/font/google';
import Link from 'next/link';
import { IoLogoFacebook, IoLogoInstagram, IoLogoTwitter } from 'react-icons/io5';

import { Logo } from '@/components/logo';
import { ThemeProvider } from '@/components/theme-provider';
import { ThemeToggle } from '@/components/theme-toggle';
import { Toaster } from '@/components/ui/toaster';
import { siteConfig } from '@/config/site';
import { cn } from '@/utils/cn';
import { Analytics } from '@vercel/analytics/react';

import { Navigation } from './navigation';

import '@/styles/globals.css';

export const dynamic = 'force-dynamic';

const montserrat = Montserrat({
  variable: '--font-montserrat',
  subsets: ['latin'],
});

const montserratAlternates = Montserrat_Alternates({
  variable: '--font-montserrat-alternates',
  weight: ['500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
};

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={cn('font-sans antialiased', montserrat.variable, montserratAlternates.variable)}>
        <ThemeProvider attribute='class' defaultTheme='dark' enableSystem disableTransitionOnChange>
          <div className='m-auto flex h-full max-w-[1440px] flex-col px-4'>
            <AppBar />
            <main className='relative flex-1'>
              <div className='relative h-full'>{children}</div>
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}

async function AppBar() {
  return (
    <header className='flex items-center justify-between py-8'>
      <Logo />
      <div className='flex items-center gap-2'>
        <ThemeToggle />
        <Navigation />
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className='mt-8 flex flex-col gap-8 text-muted-foreground lg:mt-32'>
      <div className='flex flex-col justify-between gap-8 lg:flex-row'>
        <div>
          <Logo />
        </div>
        <div className='grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-4 lg:gap-16'>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-foreground'>Product</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/pricing'>Pricing</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-foreground'>Company</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/about-us'>About Us</Link>
              <Link href='/privacy'>Privacy</Link>
            </nav>
          </div>
          <div className='flex flex-col gap-2 lg:gap-6'>
            <div className='font-semibold text-foreground'>Support</div>
            <nav className='flex flex-col gap-2 lg:gap-6'>
              <Link href='/contact'>Contact</Link>
            </nav>
          </div>
          {(siteConfig.links.twitter || siteConfig.links.facebook || siteConfig.links.instagram) && (
            <div className='flex flex-col gap-2 lg:gap-6'>
              <div className='font-semibold text-foreground'>Follow us</div>
              <nav className='flex flex-col gap-2 lg:gap-6'>
                {siteConfig.links.twitter && (
                  <Link href={siteConfig.links.twitter}>
                    <span className='flex items-center gap-2'>
                      <IoLogoTwitter size={22} /> <span>Twitter</span>
                    </span>
                  </Link>
                )}
                {siteConfig.links.facebook && (
                  <Link href={siteConfig.links.facebook}>
                    <span className='flex items-center gap-2'>
                      <IoLogoFacebook size={22} /> <span>Facebook</span>
                    </span>
                  </Link>
                )}
                {siteConfig.links.instagram && (
                  <Link href={siteConfig.links.instagram}>
                    <span className='flex items-center gap-2'>
                      <IoLogoInstagram size={22} /> <span>Instagram</span>
                    </span>
                  </Link>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
      <div className='border-t border-border py-6 text-center'>
        <span className='text-neutral4 text-xs'>
          Copyright {new Date().getFullYear()} © {siteConfig.name}
        </span>
      </div>
    </footer>
  );
}
