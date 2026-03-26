import { LoadingSpinner } from './loading-spinner';

export function PageLoader() {
  return (
    <div className='flex min-h-[50vh] items-center justify-center'>
      <div className='flex flex-col items-center gap-4'>
        <LoadingSpinner size='lg' />
        <p className='text-sm text-muted-foreground'>Loading...</p>
      </div>
    </div>
  );
}
