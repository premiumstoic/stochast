import { describe, expect, it } from 'vitest'
import { validateFormula } from '@/lib/formula'

describe('formula validation', () => {
  it('accepts the launch presets', () => {
    expect(validateFormula('0.5')).toEqual({ ok: true })
    expect(validateFormula('x')).toEqual({ ok: true })
    expect(validateFormula('(x^3) / (x^3 + (1-x)^3)')).toEqual({ ok: true })
  })

  it('rejects unknown symbols and unsafe functions', () => {
    expect(validateFormula('y + 1')).toMatchObject({ ok: false, code: 'PARSE_ERROR' })
    expect(validateFormula('import("fs")')).toMatchObject({ ok: false, code: 'PARSE_ERROR' })
  })

  it('rejects out-of-range and non-finite probabilities during validation', () => {
    expect(validateFormula('2')).toMatchObject({ ok: false, code: 'OUT_OF_RANGE_PROBABILITY' })
    expect(validateFormula('sqrt(-1)')).toMatchObject({ ok: false, code: 'NON_FINITE_RESULT' })
  })
})
