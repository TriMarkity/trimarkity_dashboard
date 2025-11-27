import { headers } from 'next/headers'

export function getBaseUrl(): string {
  // For client-side
  if (typeof window !== 'undefined') {
    return window.location.origin
  }

  // Server-side - try multiple sources in order of preference
  
  // 1. Environment variable (most reliable)
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // 2. Vercel automatic deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // 3. Custom domain environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // 4. Railway deployment
  if (process.env.RAILWAY_STATIC_URL) {
    return `https://${process.env.RAILWAY_STATIC_URL}`
  }

  // 5. Netlify deployment
  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL
  }

  // 6. Development fallback
  return 'http://localhost:3000'
}

// ✅ FIXED: Add await before headers()
export async function getBaseUrlFromRequest(): Promise<string> {
  try {
    const headersList = await headers() // ✅ Added await
    const host = headersList.get('host')
    const protocol = headersList.get('x-forwarded-proto') || 
                    headersList.get('x-forwarded-protocol') || 
                    (host?.includes('localhost') ? 'http' : 'https')
    
    if (host) {
      return `${protocol}://${host}`
    }
  } catch (error) {
    console.warn('Could not get base URL from headers:', error)
  }
  
  // Fallback to environment-based detection
  return getBaseUrl()
}
