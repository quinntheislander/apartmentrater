/**
 * Quick assertions for the pure residency matchers.
 * Run: npx tsx src/scripts/checkResidencyMatchers.ts
 */

import {
  coverageFromDates,
  deriveBadge,
  isWithinRecentWindow,
  namesMatch,
  normalizeUnit,
  parseLooseDate,
  streetsMatch,
  unitsMatch,
} from '../lib/residency'

let failures = 0
function check(label: string, actual: unknown, expected: unknown) {
  const ok = JSON.stringify(actual) === JSON.stringify(expected)
  if (!ok) failures++
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${ok ? '' : `  → got ${JSON.stringify(actual)}, expected ${JSON.stringify(expected)}`}`)
}

const NOW = new Date(Date.UTC(2026, 7, 22)) // 2026-08-22

// --- names ------------------------------------------------------------------
check('name: exact', namesMatch('Jane Doe', ['Jane Doe']), true)
check('name: last-first order, middle initial', namesMatch('Jane Doe', ['DOE, JANE M']), true)
check('name: different first name', namesMatch('Jane Doe', ['John Doe']), false)
check('name: different last name', namesMatch('Jane Doe', ['Jane Smith']), false)
check('name: provided initial', namesMatch('J. Doe', ['Jane Doe']), true)
check('name: document initial', namesMatch('Jane Doe', ['J Doe']), true)
check('name: diacritics + hyphen', namesMatch('María García-López', ['Maria Garcia Lopez']), true)
check('name: apostrophe', namesMatch("Sean O'Brien", ['SEAN OBRIEN']), true)
check('name: suffix ignored', namesMatch('Jane Doe', ['Jane Doe Jr.']), true)
check('name: any of several tenants', namesMatch('Jane Doe', ['John Smith', 'Jane Doe']), true)
check('name: single token rejected', namesMatch('Jane', ['Jane Doe']), false)
check('name: empty candidates', namesMatch('Jane Doe', []), false)

// --- units ------------------------------------------------------------------
check('unit: Apt. 4B', normalizeUnit('Apt. 4B'), '4B')
check('unit: #4b', normalizeUnit('#4b'), '4B')
check('unit: Unit 4-B', normalizeUnit('Unit 4-B'), '4B')
check('unit: Bldg 3 Apt 1204', normalizeUnit('Bldg 3 Apt 1204'), '1204')
check('unit: bare 1204', normalizeUnit('1204'), '1204')
check('unit: Suite 200', normalizeUnit('Suite 200'), '200')
check('unit: match 4B vs apt 4b', unitsMatch('4B', 'apt 4b'), true)
check('unit: no match 4B vs 4C', unitsMatch('4B', '4C'), false)
check('unit: empty never matches', unitsMatch('', ''), false)

// --- streets ----------------------------------------------------------------
check('street: suffix normalization', streetsMatch('1234 Riverside Avenue', '1234 Riverside Ave, Jacksonville, FL 32204'), true)
check('street: doc includes unit', streetsMatch('1234 Riverside Ave Apt 4B', '1234 Riverside Ave'), true)
check('street: different house number', streetsMatch('1235 Riverside Ave', '1234 Riverside Ave'), false)
check('street: different street', streetsMatch('1234 Main St', '1234 Riverside Ave'), false)
check('street: directional on one side', streetsMatch('1234 N Riverside Ave', '1234 Riverside Ave'), true)
check('street: directional spelled out', streetsMatch('1234 N Riverside Ave', '1234 North Riverside Ave'), true)
check('street: null doc', streetsMatch(null, '1234 Riverside Ave'), false)

// --- dates ------------------------------------------------------------------
check('date: YYYY-MM-DD', parseLooseDate('2024-04-30')?.toISOString(), '2024-04-30T00:00:00.000Z')
check('date: YYYY-MM', parseLooseDate('2024-04')?.toISOString(), '2024-04-01T00:00:00.000Z')
check('date: garbage', parseLooseDate('April 2024'), null)
check('coverage: lease period', coverageFromDates({ periodStart: '2023-05-01', periodEnd: '2024-04-30', documentDate: null }), {
  from: new Date('2023-05-01T00:00:00.000Z'),
  to: new Date('2024-04-30T00:00:00.000Z'),
})
check('coverage: bill date only', coverageFromDates({ periodStart: null, periodEnd: null, documentDate: '2026-07-15' }), {
  from: new Date('2026-07-15T00:00:00.000Z'),
  to: new Date('2026-07-15T00:00:00.000Z'),
})
check('coverage: open-ended lease', coverageFromDates({ periodStart: '2026-01-01', periodEnd: null, documentDate: null }), {
  from: new Date('2026-01-01T00:00:00.000Z'),
  to: null,
})
check('coverage: nothing', coverageFromDates({ periodStart: null, periodEnd: null, documentDate: null }), { from: null, to: null })

// --- window -----------------------------------------------------------------
check('window: day before 3y boundary is out', isWithinRecentWindow(new Date('2023-08-21T00:00:00Z'), NOW), false)
check('window: on boundary is in', isWithinRecentWindow(new Date('2023-08-22T00:00:00Z'), NOW), true)
check('window: null (active) is in', isWithinRecentWindow(null, NOW), true)

// --- badges -----------------------------------------------------------------
check('badge: active lease → resident', deriveBadge({ status: 'verified', coveredFrom: '2026-01-01', coveredTo: null }, NOW), { kind: 'resident' })
check('badge: bill within 90 days → resident', deriveBadge({ status: 'verified', coveredFrom: '2026-07-01', coveredTo: '2026-07-01' }, NOW), { kind: 'resident' })
check('badge: ended last year → former with dates', deriveBadge({ status: 'verified', coveredFrom: '2023-05-01', coveredTo: '2024-04-30' }, NOW), { kind: 'former', label: 'May 2023 – Apr 2024' })
check('badge: ended 4 years ago → none', deriveBadge({ status: 'verified', coveredFrom: '2021-01-01', coveredTo: '2022-01-01' }, NOW), null)
check('badge: rejected → none', deriveBadge({ status: 'rejected', coveredFrom: null, coveredTo: null }, NOW), null)
check('badge: missing → none', deriveBadge(null, NOW), null)

console.log(failures === 0 ? '\nAll residency matcher checks passed.' : `\n${failures} check(s) FAILED.`)
process.exit(failures === 0 ? 0 : 1)
