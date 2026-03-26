import { Skeleton } from '@/components/ui/skeleton';

function PricingCardSkeleton() {
  return (
    <div className='flex w-full flex-col rounded-md border border-border bg-card p-4 lg:p-8'>
      <div className='flex flex-col items-center gap-2 p-4'>
        <Skeleton className='h-7 w-24' />
        <Skeleton className='h-5 w-20' />
      </div>
      <div className='flex justify-center py-2'>
        <Skeleton className='h-9 w-48 rounded-md' />
      </div>
      <div className='flex flex-col gap-2 px-8 py-4'>
        <Skeleton className='h-5 w-52' />
        <Skeleton className='h-5 w-44' />
        <Skeleton className='h-5 w-36' />
      </div>
      <div className='py-4'>
        <Skeleton className='h-10 w-full rounded-md' />
      </div>
    </div>
  );
}

export function PricingSkeleton() {
  return (
    <section className='relative rounded-lg bg-card py-8'>
      <div className='m-auto flex max-w-[1200px] flex-col items-center gap-8 px-4 pt-8 lg:pt-[140px]'>
        <Skeleton className='h-14 w-[500px] max-w-full' />
        <Skeleton className='h-6 w-[400px] max-w-full' />
        <div className='flex w-full flex-col items-center justify-center gap-2 lg:flex-row lg:gap-8'>
          <PricingCardSkeleton />
          <PricingCardSkeleton />
          <PricingCardSkeleton />
        </div>
      </div>
    </section>
  );
}
