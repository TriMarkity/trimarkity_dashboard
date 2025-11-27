import { NextRequest, NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // ✅ ADD THIS DEBUG CODE
    console.log('🔍 SMTP Debug Info:')
    console.log('SMTP_HOST:', process.env.SMTP_HOST)
    console.log('SMTP_PORT:', process.env.SMTP_PORT)
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'SET' : 'MISSING')
    console.log('SMTP_USERNAME:', process.env.SMTP_USERNAME ? 'SET' : 'MISSING')
    console.log('SMTP_PASSWORD:', process.env.SMTP_PASSWORD ? 'SET' : 'MISSING')
    console.log('FROM_EMAIL:', process.env.FROM_EMAIL ? 'SET' : 'MISSING')
    console.log('SMTP_FROM_EMAIL:', process.env.SMTP_FROM_EMAIL ? 'SET' : 'MISSING')

    const client = await clientPromise
    const db = client.db("trimarkity")
    
    // Check if user exists
    const user = await db.collection('users').findOne({ email })
    
    if (user) {
      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex')
      const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

      // Save token to database
      await db.collection('users').updateOne(
        { email },
        {
          $set: {
            reset_token: resetToken,
            reset_token_expires: resetTokenExpiry,
            updated_at: new Date()
          }
        }
      )

      // ✅ BULLETPROOF URL GENERATION
      let baseUrl = getBaseUrl(request)
      
      const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`
      
      console.log('✅ Generated reset URL:', resetUrl)
      
      try {
        await sendResetEmail(email, resetUrl, user.full_name || user.first_name || 'User')
        console.log('✅ Reset email sent successfully')
      } catch (emailError) {
        console.error('❌ Failed to send reset email:', emailError)
      }
    }

    return NextResponse.json({ 
      message: "If an account with that email exists, we sent you a reset link" 
    })

  } catch (error) {
    console.error('❌ Forgot password error:', error)
    return NextResponse.json({ 
      error: "Something went wrong" 
    }, { status: 500 })
  }
}

// ✅ BULLETPROOF BASE URL FUNCTION
function getBaseUrl(request: NextRequest): string {
  // Try multiple sources in order of preference
  
  // 1. Custom environment variable from next.config.js
  if (process.env.CUSTOM_BASE_URL) {
    return process.env.CUSTOM_BASE_URL
  }
  
  // 2. NEXTAUTH_URL environment variable
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // 3. From request headers (most accurate for deployed environments)
  const host = request.headers.get('host')
  const protocol = request.headers.get('x-forwarded-proto') || 
                  request.headers.get('x-forwarded-protocol') || 
                  (host?.includes('localhost') ? 'http' : 'https')
  
  if (host) {
    return `${protocol}://${host}`
  }

  // 4. Vercel automatic deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // 5. Netlify deployment URL
  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL
  }

  // 6. Railway deployment URL
  if (process.env.RAILWAY_STATIC_URL) {
    return `https://${process.env.RAILWAY_STATIC_URL}`
  }

  // 7. Final fallback to your actual domain
  if (process.env.NODE_ENV === 'production') {
    return 'https://trimarkity.com' // Replace with your actual domain
  }

  // 8. Development fallback
  return 'http://localhost:3000'
}

async function sendResetEmail(email: string, resetUrl: string, userName: string) {
  // ✅ FLEXIBLE: Use whichever variables exist
  const smtpUser = process.env.SMTP_USER || process.env.SMTP_USERNAME
  const fromEmail = process.env.FROM_EMAIL || process.env.SMTP_FROM_EMAIL
  
  console.log('🔍 Email Config:')
  console.log('Using SMTP_USER:', smtpUser)
  console.log('Using FROM_EMAIL:', fromEmail)

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: smtpUser, // ✅ Use flexible variable
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production'
    }
  })

  await transporter.verify()

  const mailOptions = {
    from: fromEmail, // ✅ Use flexible variable
    to: email,
    subject: 'Password Reset Request - TriMarkity',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
        <div style="background: linear-gradient(135deg, #3b82f6, #10b981); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">TriMarkity</h1>
          <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Password Reset Request</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hello ${userName},</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            You requested a password reset for your TriMarkity account. Click the button below to create a new password:
          </p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${resetUrl}" 
               style="background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
              Reset Your Password
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 20px;">
            This link will expire in 1 hour for security reasons.
          </p>
          
          <p style="color: #666; line-height: 1.6;">
            If you didn't request this password reset, please ignore this email.
          </p>
        </div>
      </div>
    `,
  }

  await transporter.sendMail(mailOptions)
}
