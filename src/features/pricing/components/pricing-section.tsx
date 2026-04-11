import Image from 'next/image';

import { PricingCard } from '@/features/pricing/components/price-card';
import { getProducts } from '@/features/pricing/controllers/get-products';

import { createCheckoutAction } from '../actions/create-checkout-action';

export async function PricingSection({ isPricingPage }: { isPricingPage?: boolean }) {
  const products = await getProducts();

  const HeadingLevel = isPricingPage ? 'h1' : 'h2';

  return (
    <section className='relative rounded-lg bg-card py-8'>
      <div className='relative z-10 m-auto flex max-w-[1200px] flex-col items-center gap-8 px-4 pt-8 lg:pt-[140px]'>
        <HeadingLevel className='max-w-4xl text-center text-3xl font-bold text-white sm:text-4xl lg:bg-gradient-to-br lg:from-white lg:to-neutral-200 lg:bg-clip-text lg:text-6xl lg:text-transparent'>
          Predictable pricing for every use case.
        </HeadingLevel>
        <p className='text-center text-base sm:text-xl'>
          Find a plan that fits you. Upgrade at any time to enable additional features.
        </p>
        <div className='flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:gap-8'>
          {products.map((product) => {
            return <PricingCard key={product.id} product={product} createCheckoutAction={createCheckoutAction} />;
          })}
        </div>
      </div>
      <Image
        src='/section-bg.png'
        width={1440}
        height={462}
        alt=''
        className='absolute left-0 top-0 rounded-t-lg'
        priority={isPricingPage}
        quality={100}
      />
    </section>
  );
}
