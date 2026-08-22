import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getClientIp, RATE_LIMITS, rateLimitResponse } from '@/lib/rate-limit'

/**
 * Contact Form API
 *
 * Email Integration (Optional):
 * To enable email delivery, install Resend (npm install resend) and add:
 * - RESEND_API_KEY to your environment variables
 * - Uncomment the Resend code blocks below
 */

// import { Resend } from 'resend'
// const resend = new Resend(process.env.RESEND_API_KEY)

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

/** Escape HTML special characters to prevent injection in email templates. */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 requests per 15 minutes
    const ip = getClientIp(request)
    const rateLimitResult = checkRateLimit(`contact:${ip}`, RATE_LIMITS.contact)
    if (!rateLimitResult.allowed) {
      return rateLimitResponse(rateLimitResult)
    }

    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate message length
    if (body.message.length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    if (body.message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be less than 5000 characters' },
        { status: 400 }
      )
    }

    // Escape all user-provided fields for safe HTML email rendering
    const safeName = escapeHtml(body.name)
    const safeEmail = escapeHtml(body.email)
    const safeSubject = escapeHtml(body.subject)
    const safeMessage = escapeHtml(body.message).replace(/\n/g, '<br>')

    // Email delivery (uncomment when Resend is configured)
    // await resend.emails.send({
    //   from: 'Apartment Rater <noreply@apartmentrater.com>',
    //   to: ['hello@apartmentrater.com'],
    //   replyTo: body.email,
    //   subject: `[Contact Form] ${safeSubject}: ${safeName}`,
    //   html: `
    //     <h2>New Contact Form Submission</h2>
    //     <p><strong>Name:</strong> ${safeName}</p>
    //     <p><strong>Email:</strong> ${safeEmail}</p>
    //     <p><strong>Subject:</strong> ${safeSubject}</p>
    //     <p><strong>Message:</strong></p>
    //     <p>${safeMessage}</p>
    //   `,
    // })

    // Log submission for development/debugging
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      subject: body.subject,
      messageLength: body.message.length,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been received. We will respond within 24-48 hours.'
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again later.' },
      { status: 500 }
    )
  }
}
