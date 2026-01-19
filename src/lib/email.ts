import crypto from 'crypto'

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

  // For development, log to console instead of sending actual email
  console.log('==================================================')
  console.log('EMAIL VERIFICATION')
  console.log('==================================================')
  console.log(`To: ${email}`)
  console.log(`Subject: Verify your email for Apartment Rater`)
  console.log('')
  console.log('Click the link below to verify your email:')
  console.log(verificationUrl)
  console.log('==================================================')

  // In production, integrate with an email service like:
  // - Resend (https://resend.com)
  // - SendGrid (https://sendgrid.com)
  // - AWS SES (https://aws.amazon.com/ses/)
  // Example with Resend:
  // const resend = new Resend(process.env.RESEND_API_KEY)
  // await resend.emails.send({
  //   from: 'noreply@apartmentrater.com',
  //   to: email,
  //   subject: 'Verify your email for Apartment Rater',
  //   html: `<p>Click <a href="${verificationUrl}">here</a> to verify your email.</p>`
  // })
}
