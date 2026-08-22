/**
 * Residency document extraction (server only).
 *
 * Sends an in-memory document to Claude and gets back a structured,
 * schema-validated summary: who is named, what address and unit, what dates.
 * The caller compares that to the reviewer and discards it. Nothing here
 * writes to disk or logs document content.
 */

import Anthropic from '@anthropic-ai/sdk'
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod'
import { z } from 'zod'
import type { AcceptedDocumentMimeType } from './residency'

export const ResidencyExtractionSchema = z.object({
  isResidencyDocument: z
    .boolean()
    .describe("True only if this is a lease, renter's insurance declarations page, utility bill, move-out statement, rent ledger/receipt, or similar document tying a named person to a residential address."),
  documentType: z.enum(['lease', 'renters_insurance', 'utility_bill', 'move_out_statement', 'rent_ledger', 'other']),
  namesOnDocument: z
    .array(z.string())
    .describe('Every personal name that appears as a tenant, insured, account holder, or resident. Exclude landlords, property managers, agents, and company names.'),
  streetAddress: z.string().nullable().describe('Street number and street name of the RESIDENTIAL/service address, without unit. Null if absent.'),
  unitNumber: z.string().nullable().describe('Apartment/unit identifier exactly as printed, without the word Apt/Unit (e.g. "4B", "1204"). Null if absent.'),
  city: z.string().nullable(),
  state: z.string().nullable().describe('Two-letter state code.'),
  zipCode: z.string().nullable(),
  periodStart: z.string().nullable().describe('Lease/policy/occupancy start date as YYYY-MM-DD (YYYY-MM if day unknown). Null if absent.'),
  periodEnd: z.string().nullable().describe('Lease/policy/occupancy end date as YYYY-MM-DD (YYYY-MM if day unknown). Null if absent or open-ended.'),
  documentDate: z.string().nullable().describe('Date the document was issued / statement date / signature date, YYYY-MM-DD. Null if absent.'),
  tamperingIndicators: z
    .array(z.string())
    .describe('Concrete signs of digital editing: mismatched fonts, misaligned text, inconsistent dates, pasted-over fields. Empty if none.'),
  readability: z.enum(['good', 'partial', 'poor']).describe('poor = key fields unreadable or cropped out.'),
})

export type ResidencyExtraction = z.infer<typeof ResidencyExtractionSchema>

const SYSTEM_PROMPT = `You extract facts from residency documents for an apartment-review site's tenancy check.

Read the document and report only what is printed on it. Do not guess or fill in missing fields — use null. Dates must be ISO (YYYY-MM-DD, or YYYY-MM when the day is not shown). Report the residential or service address, not the landlord's or insurer's mailing address. If the document is not a residency document at all (a selfie, a screenshot of a website, an ID card, an unrelated letter), set isResidencyDocument to false.`

// Lazily constructed so a missing key only fails the verification request, not the whole build.
let client: Anthropic | null = null
function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not configured')
  }
  client ??= new Anthropic()
  return client
}

export function isExtractionConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY
}

/** Override with RESIDENCY_EXTRACTION_MODEL to trade accuracy for cost (e.g. claude-haiku-4-5). */
export function extractionModel(): string {
  return process.env.RESIDENCY_EXTRACTION_MODEL || 'claude-opus-5'
}

export async function extractResidencyDocument(
  data: Buffer,
  mimeType: AcceptedDocumentMimeType
): Promise<ResidencyExtraction> {
  const base64 = data.toString('base64')

  const documentBlock: Anthropic.ContentBlockParam =
    mimeType === 'application/pdf'
      ? { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: base64 } }
      : { type: 'image', source: { type: 'base64', media_type: mimeType, data: base64 } }

  const response = await getClient().messages.parse({
    model: extractionModel(),
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: [
          documentBlock,
          { type: 'text', text: 'Extract the residency facts from this document.' },
        ],
      },
    ],
    output_config: {
      effort: 'medium',
      format: zodOutputFormat(ResidencyExtractionSchema),
    },
  })

  if (response.stop_reason === 'refusal' || !response.parsed_output) {
    throw new Error('Document could not be processed')
  }

  return response.parsed_output
}
