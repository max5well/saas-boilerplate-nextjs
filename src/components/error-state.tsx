import { IoAlertCircleOutline, IoDocumentOutline, IoSearchOutline } from 'react-icons/io5';

import { Button } from '@/components/ui/button';

type Variant = 'error' | 'empty' | 'not-found';

interface ErrorStateProps {
  variant?: Variant;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const icons: Record<Variant, React.ReactNode> = {
  error: <IoAlertCircleOutline className='h-12 w-12 text-destructive' />,
  empty: <IoDocumentOutline className='h-12 w-12 text-muted-foreground' />,
  'not-found': <IoSearchOutline className='h-12 w-12 text-muted-foreground' />,
};

export function ErrorState({ variant = 'error', title, description, action }: ErrorStateProps) {
  return (
    <div className='flex min-h-[200px] flex-col items-center justify-center gap-4 rounded-lg border border-border bg-card p-8'>
      {icons[variant]}
      <div className='flex flex-col items-center gap-1 text-center'>
        <h3 className='text-lg font-semibold'>{title}</h3>
        {description && <p className='max-w-sm text-sm text-muted-foreground'>{description}</p>}
      </div>
      {action && (
        <Button variant='secondary' size='sm' onClick={action.onClick}>
          {action.label}
        </Button>
      )}
    </div>
  );
}
