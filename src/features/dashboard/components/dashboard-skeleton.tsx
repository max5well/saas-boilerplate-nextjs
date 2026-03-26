import { Skeleton } from '@/components/ui/skeleton';

export function DashboardSkeleton() {
  return (
    <div className='flex flex-col gap-8 py-8'>
      <div className='flex items-center justify-between'>
        <Skeleton className='h-10 w-48' />
        <Skeleton className='h-10 w-32 rounded-md' />
      </div>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className='rounded-lg border border-border bg-card p-6'>
            <Skeleton className='mb-2 h-4 w-24' />
            <Skeleton className='mb-4 h-8 w-16' />
            <Skeleton className='h-3 w-32' />
          </div>
        ))}
      </div>
      <div className='rounded-lg border border-border bg-card p-6'>
        <Skeleton className='mb-4 h-6 w-36' />
        <div className='flex flex-col gap-3'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-4'>
              <Skeleton className='h-10 w-10 rounded-full' />
              <div className='flex-1'>
                <Skeleton className='mb-1 h-4 w-48' />
                <Skeleton className='h-3 w-32' />
              </div>
              <Skeleton className='h-6 w-16 rounded-md' />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
