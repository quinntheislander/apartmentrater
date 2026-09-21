import crypto from 'crypto'
import { Resend } from 'resend'
import { BRAND_NAME, CONTACT_EMAILS } from './legal'

const FROM_EMAIL = `${BRAND_NAME} <${CONTACT_EMAILS.contact}>`

// Lazy-load Resend client to avoid build-time errors when API key isn't available
let resendClient: Resend | null = null
function getResendClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export async function sendVerificationEmail(email: string, token: string): Promise<void> {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/auth/verify-email?token=${token}`

  // In development without RESEND_API_KEY, log to console
  if (!process.env.RESEND_API_KEY) {
    console.log('==================================================')
    console.log('EMAIL VERIFICATION (No RESEND_API_KEY configured)')
    console.log('==================================================')
    console.log(`To: ${email}`)
    console.log(`Verification URL: ${verificationUrl}`)
    console.log('==================================================')
    return
  }

  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Verify your email for Apartment Rater',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Apartment Rater</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Verify Your Email</h2>
            <p>Thanks for signing up for Apartment Rater! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #2563eb; word-break: break-all; font-size: 14px;">${verificationUrl}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">This link will expire in 24 hours. If you didn't create an account with Apartment Rater, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `
  })
}

export async function sendDataRequestConfirmationEmail(
  email: string,
  token: string,
  requestType: 'access' | 'export' | 'delete'
): Promise<void> {
  const confirmUrl = `${process.env.NEXTAUTH_URL}/data-request/confirm?token=${token}`

  const typeLabel =
    requestType === 'delete' ? 'data deletion' :
    requestType === 'export' ? 'data export' : 'data access'

  if (!process.env.RESEND_API_KEY) {
    console.log('==================================================')
    console.log('DATA REQUEST CONFIRMATION (No RESEND_API_KEY configured)')
    console.log('==================================================')
    console.log(`To: ${email}`)
    console.log(`Type: ${typeLabel}`)
    console.log(`Confirm URL: ${confirmUrl}`)
    console.log('==================================================')
    return
  }

  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Confirm your ${typeLabel} request`,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Apartment Rater</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Confirm Your ${typeLabel.charAt(0).toUpperCase() + typeLabel.slice(1)} Request</h2>
            <p>We received a request for <strong>${typeLabel}</strong> of your personal data. To protect your account, we need to verify you made this request.</p>
            <p>If you requested this, click the button below within 24 hours to confirm:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${confirmUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Confirm Request</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #2563eb; word-break: break-all; font-size: 14px;">${confirmUrl}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px;"><strong>If you did NOT request this, ignore this email.</strong> Your data will not be affected unless you click the link. The link expires in 24 hours.</p>
          </div>
        </body>
      </html>
    `
  })
}

export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`

  // In development without RESEND_API_KEY, log to console
  if (!process.env.RESEND_API_KEY) {
    console.log('==================================================')
    console.log('PASSWORD RESET (No RESEND_API_KEY configured)')
    console.log('==================================================')
    console.log(`To: ${email}`)
    console.log(`Reset URL: ${resetUrl}`)
    console.log('==================================================')
    return
  }

  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: 'Reset your Apartment Rater password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Apartment Rater</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">Reset Your Password</h2>
            <p>We received a request to reset your password. Click the button below to choose a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #2563eb; word-break: break-all; font-size: 14px;">${resetUrl}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">This link will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `
  })
}

/** How long an invite link lasts; the email below says 7 days. */
export const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000

/** Invitation for an account an admin created: the link sets the first password. */
export async function sendInviteEmail(email: string, token: string): Promise<void> {
  const inviteUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}&invite=1`

  // In development without RESEND_API_KEY, log to console
  if (!process.env.RESEND_API_KEY) {
    console.log('==================================================')
    console.log('ACCOUNT INVITE (No RESEND_API_KEY configured)')
    console.log('==================================================')
    console.log(`To: ${email}`)
    console.log(`Invite URL: ${inviteUrl}`)
    console.log('==================================================')
    return
  }

  await getResendClient().emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `You're invited to ${BRAND_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Apartment Rater</h1>
          </div>
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <h2 style="color: #1f2937; margin-top: 0;">You've been invited</h2>
            <p>An ${BRAND_NAME} account has been created for this email address. Click the button below to choose your password and finish setting it up:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${inviteUrl}" style="background-color: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Set Your Password</a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="color: #2563eb; word-break: break-all; font-size: 14px;">${inviteUrl}</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 12px; margin-bottom: 0;">This link will expire in 7 days. If you weren't expecting this, you can safely ignore this email.</p>
          </div>
        </body>
      </html>
    `
  })
}
