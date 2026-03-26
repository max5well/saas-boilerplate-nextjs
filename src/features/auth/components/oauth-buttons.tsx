'use client';

import { useState } from 'react';
import { IoLogoGithub, IoLogoGoogle } from 'react-icons/io5';

import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { OAuthProvider, oauthProviders } from '@/features/auth/config/auth-config';
import { ActionResponse } from '@/types/action-response';

const providerIcons: Record<OAuthProvider, React.ReactNode> = {
  google: <IoLogoGoogle size={20} />,
  github: <IoLogoGithub size={20} />,
};

const providerStyles: Record<OAuthProvider, string> = {
  google:
    'bg-cyan-500 text-black hover:bg-cyan-400 disabled:bg-neutral-700',
  github:
    'bg-fuchsia-500 text-black hover:bg-fuchsia-400 disabled:bg-neutral-700',
};

export function OAuthButtons({
  signInWithOAuth,
}: {
  signInWithOAuth: (provider: OAuthProvider) => Promise<ActionResponse>;
}) {
  const [pending, setPending] = useState(false);

  async function handleClick(provider: OAuthProvider) {
    setPending(true);
    const response = await signInWithOAuth(provider);

    if (response?.error) {
      toast({
        variant: 'destructive',
        description: 'An error occurred while authenticating. Please try again.',
      });
      setPending(false);
    }
  }

  return (
    <div className='flex flex-col gap-3'>
      {oauthProviders.map((provider) => (
        <button
          key={provider.id}
          className={`flex items-center justify-center gap-2 rounded-md py-4 font-medium transition-all ${providerStyles[provider.id]}`}
          onClick={() => handleClick(provider.id)}
          disabled={pending}
        >
          {providerIcons[provider.id]}
          {provider.label}
        </button>
      ))}
    </div>
  );
}
