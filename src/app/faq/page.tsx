'use client'

import { useState } from 'react'
import Link from 'next/link'
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { FAQSchema } from '@/components/StructuredData'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqs: FAQItem[] = [
  // Account & Registration
  {
    category: 'Account & Registration',
    question: 'How do I create an account?',
    answer: 'Click the "Sign Up" button in the navigation bar. Enter your name, email, and create a password. You\'ll receive a verification email to confirm your account.'
  },
  {
    category: 'Account & Registration',
    question: 'Do I need an account to read reviews?',
    answer: 'No, you can browse and read all reviews without an account. However, you\'ll need to create a free account to write reviews, save favorites, or mark reviews as helpful.'
  },
  {
    category: 'Account & Registration',
    question: 'I forgot my password. How do I reset it?',
    answer: 'Click "Forgot password?" on the sign-in page. Enter your email address and we\'ll send you a link to reset your password. The link expires after 1 hour.'
  },
  {
    category: 'Account & Registration',
    question: 'How do I delete my account?',
    answer: 'Contact us through the Contact page to request account deletion. We\'ll remove your account and associated data within 30 days. Note that anonymous reviews will remain but won\'t be linked to your identity.'
  },

  // Writing Reviews
  {
    category: 'Writing Reviews',
    question: 'Can I write a review for any apartment?',
    answer: 'Yes, you can review any apartment you\'ve lived in. If the apartment isn\'t listed, you can add it yourself using the "Add Apartment" feature, then write your review.'
  },
  {
    category: 'Writing Reviews',
    question: 'What should I include in my review?',
    answer: 'Rate all 9 categories (noise, management, maintenance, etc.) and write about your honest experience. Include specifics like how quickly maintenance responded, noise levels at different times, and any issues you encountered. The more detail, the more helpful your review!'
  },
  {
    category: 'Writing Reviews',
    question: 'Can I post anonymously?',
    answer: 'Yes! When writing a review, check the "Post anonymously" box. Your name won\'t be displayed and the review won\'t be linked to your public profile. We still store your user ID internally for moderation purposes.'
  },
  {
    category: 'Writing Reviews',
    question: 'Can I edit or delete my review?',
    answer: 'Yes, you can edit or delete your reviews at any time from your Dashboard. Click the pencil icon to edit or the trash icon to delete.'
  },
  {
    category: 'Writing Reviews',
    question: 'Why are there so many rating categories?',
    answer: 'Different renters have different priorities. Some care most about noise levels, others about management responsiveness. Our detailed categories help you share specific feedback and help future renters find exactly what they\'re looking for.'
  },

  // Reviews & Content
  {
    category: 'Reviews & Content',
    question: 'How do I report a fake or inappropriate review?',
    answer: 'Use the Contact page and select "Report a Review" as the subject. Include the apartment name and describe the issue. We investigate all reports and remove content that violates our guidelines.'
  },
  {
    category: 'Reviews & Content',
    question: 'What makes a review "verified"?',
    answer: 'Verified badges indicate tenants who have provided proof of residency (such as a lease document). This is an optional feature that helps build trust. Contact us if you\'d like to verify your tenancy.'
  },
  {
    category: 'Reviews & Content',
    question: 'Can property managers respond to reviews?',
    answer: 'Currently, we don\'t have a response feature for property managers. We\'re considering this for a future update to provide balanced perspectives.'
  },

  // Apartments
  {
    category: 'Apartments',
    question: 'How do I add an apartment that\'s not listed?',
    answer: 'Click "Add Apartment" from the apartments page. Fill in the property details including address, type, and amenities. Once added, you and others can write reviews for it.'
  },
  {
    category: 'Apartments',
    question: 'The apartment information is wrong. How do I fix it?',
    answer: 'Contact us through the Contact page with the correct information. Include the apartment name, what\'s wrong, and the correct details. We\'ll update it promptly.'
  },
  {
    category: 'Apartments',
    question: 'How is the overall rating calculated?',
    answer: 'The overall rating is the average of all individual review ratings. Each review\'s overall rating is based on the 9 category ratings the reviewer provides.'
  },

  // Privacy & Safety
  {
    category: 'Privacy & Safety',
    question: 'Is my information safe?',
    answer: 'Yes. We encrypt passwords, use secure connections, and never sell your personal data. Read our Privacy Policy for complete details on how we protect your information.'
  },
  {
    category: 'Privacy & Safety',
    question: 'Can my landlord see who wrote a review?',
    answer: 'If you post anonymously, your identity is not displayed publicly. However, we store your user ID internally for moderation. We don\'t share user information with landlords or property managers.'
  },
]

const categories = [...new Set(faqs.map(faq => faq.category))]

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filteredFaqs = activeCategory
    ? faqs.filter(faq => faq.category === activeCategory)
    : faqs

  // Prepare FAQs for schema (without category field)
  const schemaFaqs = faqs.map(({ question, answer }) => ({ question, answer }))

  return (
    <>
      <FAQSchema faqs={schemaFaqs} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <HelpCircle className="h-16 w-16 text-blue-600 mx-auto mb-4" aria-hidden="true" />
          <h1 className="text-4xl font-bold text-gray-900">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600 mt-4">
            Find answers to common questions about Apartment Rater
          </p>
        </div>

        {/* Category Filter */}
        <nav className="flex flex-wrap gap-2 justify-center mb-8" aria-label="FAQ categories">
          <button
            onClick={() => setActiveCategory(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            aria-pressed={activeCategory === null}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              aria-pressed={activeCategory === category}
            >
              {category}
            </button>
          ))}
        </nav>

        {/* FAQ Accordion */}
        <div className="space-y-4" role="list" aria-label="Frequently asked questions">
          {filteredFaqs.map((faq, index) => {
            const globalIndex = faqs.indexOf(faq)
            const isOpen = openIndex === globalIndex
            const answerId = `faq-answer-${globalIndex}`
            const questionId = `faq-question-${globalIndex}`

            return (
              <div
                key={globalIndex}
                className="bg-white rounded-xl shadow-sm overflow-hidden"
                role="listitem"
              >
                <h3>
                  <button
                    id={questionId}
                    onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <div>
                      <span className="text-xs text-blue-600 font-medium">{faq.category}</span>
                      <span className="font-semibold text-gray-900 mt-1 block">{faq.question}</span>
                    </div>
                    {isOpen ? (
                      <ChevronUp className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400 flex-shrink-0" aria-hidden="true" />
                    )}
                  </button>
                </h3>
                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className={isOpen ? 'block' : 'hidden'}
                >
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900">Still have questions?</h2>
          <p className="text-gray-600 mt-2">
            Can&apos;t find what you&apos;re looking for? We&apos;re here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  )
}
