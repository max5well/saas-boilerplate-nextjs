import { Skeleton } from '@/components/ui/skeleton';

export function SubscriptionSkeleton() {
  return (
    <section className='rounded-lg bg-card px-4 py-16'>
      <Skeleton className='mx-auto mb-8 h-10 w-32' />
      <div className='flex flex-col gap-4'>
        <div className='m-auto w-full max-w-3xl rounded-md bg-muted'>
          <div className='p-4'>
            <Skeleton className='mb-1 h-6 w-24' />
            <div className='py-4'>
              <div className='flex flex-col gap-3'>
                <Skeleton className='h-5 w-48' />
                <Skeleton className='h-5 w-36' />
                <Skeleton className='h-5 w-40' />
              </div>
            </div>
          </div>
          <div className='flex justify-end rounded-b-md border-t border-border p-4'>
            <Skeleton className='h-8 w-44 rounded-md' />
          </div>
        </div>
      </div>
    </section>
  );
}
