import nodemailer from 'nodemailer'

// Create reusable transporter
export function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: process.env.NODE_ENV === 'production' // strict validation only in production
    },
    pool: true, // use pooled connections
    maxConnections: 5, // limit concurrent connections
    maxMessages: 100, // limit messages per connection
  })
}

// Reusable email sending function
export async function sendEmail({ 
  to, 
  subject, 
  text, 
  html 
}: { 
  to: string
  subject: string
  text?: string
  html?: string
}) {
  try {
    const transporter = createTransporter()
    
    // Verify connection configuration
    await transporter.verify()
    
    const info = await transporter.sendMail({
      from: process.env.FROM_EMAIL,
      to,
      subject,
      text,
      html,
    })

    console.log('✅ Email sent successfully:', info.messageId)
    return { success: true, messageId: info.messageId }
  } catch (error) {
    console.error('❌ Email sending failed:', error)
    return { success: false, error }
  }
}

// Password reset email template
export async function sendPasswordResetEmail(email: string, resetUrl: string, userName: string) {
  const html = `
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
          If you didn't request this password reset, please ignore this email. Your password will remain unchanged.
        </p>
        
        <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">
        
        <p style="color: #999; font-size: 14px; margin: 0;">
          This email was sent from TriMarkity. If you have any questions, please contact our support team.
        </p>
      </div>
    </div>
  `

  return await sendEmail({
    to: email,
    subject: 'Password Reset Request - TriMarkity',
    html,
  })
}
