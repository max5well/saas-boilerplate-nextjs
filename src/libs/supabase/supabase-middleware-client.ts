// Ref: https://supabase.com/docs/guides/auth/server-side/nextjs

import { type NextRequest, NextResponse } from 'next/server';

import { adminRoutes, loginRedirect, protectedRoutes } from '@/features/auth/config/auth-config';
import { getEnvVar } from '@/utils/get-env-var';
import { createServerClient } from '@supabase/ssr';

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_URL, 'NEXT_PUBLIC_SUPABASE_URL'),
    getEnvVar(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY, 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: Record<string, unknown> }>) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }

          supabaseResponse = NextResponse.next({
            request,
          });

          for (const { name, value, options } of cookiesToSet) {
            supabaseResponse.cookies.set(name, value, options as any);
          }
        },
      },
    }
  );

  // IMPORTANT: DO NOT REMOVE auth.getUser()
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // Protected route guard — redirect to login if not authenticated
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = loginRedirect;
    url.searchParams.set('redirectTo', pathname);
    return NextResponse.redirect(url);
  }

  // Admin route guard — redirect home if not admin
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  if (isAdminRoute) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = loginRedirect;
      return NextResponse.redirect(url);
    }

    // Check admin role via users table
    const { data: userData } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!userData || userData.role !== 'admin') {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}
