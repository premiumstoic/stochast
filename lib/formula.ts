import { compile, parse } from 'mathjs'

const ALLOWED_OPERATORS = new Set(['+', '-', '*', '/', '^'])
const ALLOWED_FUNCTIONS = new Set(['abs', 'sqrt', 'exp', 'log', 'min', 'max'])
const VALIDATION_SAMPLES = [0.01, 0.25, 0.5, 0.75, 0.99]

export interface FormulaValidationResult {
  ok: boolean
  code?: 'PARSE_ERROR' | 'NON_FINITE_RESULT' | 'OUT_OF_RANGE_PROBABILITY'
  message?: string
}

function validateNode(
  node: { type: string; [key: string]: unknown },
  parent?: { type?: string; [key: string]: unknown },
) {
  switch (node.type) {
    case 'ParenthesisNode':
    case 'ConstantNode':
      return
    case 'SymbolNode':
      if (parent?.type === 'FunctionNode' && (parent.fn as { name?: string } | undefined)?.name === node.name) {
        return
      }
      if (node.name !== 'x') {
        throw new Error(`Unknown symbol "${String(node.name)}". Only "x" is allowed.`)
      }
      return
    case 'OperatorNode':
      if (!ALLOWED_OPERATORS.has(String(node.op))) {
        throw new Error(`Operator "${String(node.op)}" is not allowed.`)
      }
      return
    case 'FunctionNode': {
      const fn = node.fn as { type?: string; name?: string } | undefined
      if (!fn || fn.type !== 'SymbolNode' || !ALLOWED_FUNCTIONS.has(String(fn.name))) {
        throw new Error(
          `Function "${fn?.name ?? 'unknown'}" is not allowed. Use arithmetic or approved numeric helpers.`,
        )
      }
      return
    }
    default:
      throw new Error(`Expression node "${node.type}" is not allowed.`)
  }
}

export function validateFormula(formula: string): FormulaValidationResult {
  try {
    const ast = parse(formula)
    ast.traverse((node, _path, parent) => {
      validateNode(
        node as unknown as { type: string; [key: string]: unknown },
        parent as unknown as { type?: string; [key: string]: unknown } | undefined,
      )
    })

    const compiled = compile(formula)
    for (const x of VALIDATION_SAMPLES) {
      const value = compiled.evaluate({ x }) as number
      if (typeof value !== 'number' || !isFinite(value)) {
        return {
          ok: false,
          code: 'NON_FINITE_RESULT',
          message: `Formula returned a non-finite value near x = ${x.toFixed(2)}.`,
        }
      }
      if (value < 0 || value > 1) {
        return {
          ok: false,
          code: 'OUT_OF_RANGE_PROBABILITY',
          message: `Formula returned ${value.toFixed(4)} near x = ${x.toFixed(2)}. Probability must stay in [0, 1].`,
        }
      }
    }

    return { ok: true }
  } catch (error: unknown) {
    return {
      ok: false,
      code: 'PARSE_ERROR',
      message: error instanceof Error ? error.message : 'Failed to parse formula.',
    }
  }
}

export function compileProbabilityFormula(formula: string) {
  const validation = validateFormula(formula)
  if (!validation.ok) {
    const error = new Error(validation.message ?? 'Failed to parse formula.')
    Object.assign(error, { code: validation.code })
    throw error
  }

  return compile(formula) as { evaluate: (scope: { x: number }) => number }
}
