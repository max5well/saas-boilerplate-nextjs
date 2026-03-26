'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { IoMoon, IoSunny } from 'react-icons/io5';

import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant='ghost' size='icon' aria-label='Toggle theme'>
        <span className='h-5 w-5' />
      </Button>
    );
  }

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label='Toggle theme'
    >
      {theme === 'dark' ? <IoSunny className='h-5 w-5' /> : <IoMoon className='h-5 w-5' />}
    </Button>
  );
}
