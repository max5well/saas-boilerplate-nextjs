import { Button } from '@react-email/components';

interface EmailButtonProps {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'destructive';
}

const variantClasses: Record<string, string> = {
  primary: 'bg-blue-600 text-white',
  secondary: 'bg-white text-blue-600 border border-slate-300',
  destructive: 'bg-red-600 text-white',
};

export function EmailButton({ href, children, variant = 'primary' }: EmailButtonProps) {
  return (
    <Button
      href={href}
      className={`rounded-md px-6 py-3 text-center text-[14px] font-semibold no-underline ${variantClasses[variant]}`}
    >
      {children}
    </Button>
  );
}
