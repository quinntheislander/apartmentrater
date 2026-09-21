import Link from 'next/link'

export const MIN_AGE_DISPLAY = 16

interface TermsConsentProps {
  acceptTerms: boolean
  confirmAge: boolean
  onChange: (field: 'acceptTerms' | 'confirmAge', value: boolean) => void
}

/**
 * Terms/Privacy assent and age attestation. Recorded server-side with the
 * policy versions; the arbitration and content-license clauses depend on it.
 */
export default function TermsConsent({ acceptTerms, confirmAge, onChange }: TermsConsentProps) {
  return (
    <div className="space-y-3 bg-gray-50 border border-gray-200 rounded-lg p-4">
      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={acceptTerms}
          onChange={(e) => onChange('acceptTerms', e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 rounded"
          required
        />
        <span className="text-sm text-gray-700">
          I agree to the{' '}
          <Link href="/terms" className="text-blue-600 hover:underline" target="_blank">
            Terms of Service
          </Link>
          {' '}(including binding arbitration and class-action waiver) and have read the{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline" target="_blank">
            Privacy Policy
          </Link>.
        </span>
      </label>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={confirmAge}
          onChange={(e) => onChange('confirmAge', e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 rounded"
          required
        />
        <span className="text-sm text-gray-700">
          I confirm I am at least {MIN_AGE_DISPLAY} years old.
        </span>
      </label>
    </div>
  )
}
