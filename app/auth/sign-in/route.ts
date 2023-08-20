import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// https://github.com/orgs/supabase/discussions/15862
export async function POST(request: Request) {
  const requestUrl = new URL(request.url)
  const supabase = createRouteHandlerClient({ cookies })

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    // Options below is required for Google OAuth
    options: {
      redirectTo: `${requestUrl.origin}/auth/callback`,
    }
  });

  if (error) {
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=Could not authenticate user`,
      {
        // a 301 status is required to redirect from a POST to a GET route
        status: 301,
      }
    )
  }

  return NextResponse.redirect(data.url, {
    // a 301 status is required to redirect from a POST to a GET route
    // It needs to be made into a GET request because auth/callback route.ts expects a GET request
    status: 301,
  });
}

/** Required lines for OAuth google:
 * 1. options: { redirectTo: `${requestUrl.origin}/auth/callback` }
 * 2. status: 301 for POST to GET redirect
*/