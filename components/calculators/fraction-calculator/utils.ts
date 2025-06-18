// This file was created in the previous step and contains helper functions.
// Assuming it's correct and doesn't need changes unless a bug is found.
// Key functions:
// - parseMeasurementInput: Converts ft, in, fraction string to total decimal inches.
// - formatResultToImperial: Converts total decimal inches back to ft-in-simplified_fraction.
// - calculateAll: Performs sequential arithmetic on an array of parsed measurements.
// - gcd: Greatest Common Divisor for simplifying fractions.
import type { MeasurementInput, FractionPrecision } from "./types"

export function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

export function parseFractionString(fractionStr: string): number {
  if (!fractionStr || fractionStr.trim() === "") return 0
  const parts = fractionStr.split("/")
  if (parts.length === 1) {
    const num = Number.parseFloat(parts[0])
    if (isNaN(num)) throw new Error(`Invalid number in fraction: ${fractionStr}`)
    return num // Whole number or decimal
  }
  if (parts.length === 2) {
    const numerator = Number.parseFloat(parts[0])
    const denominator = Number.parseFloat(parts[1])
    if (isNaN(numerator) || isNaN(denominator)) {
      throw new Error(`Invalid fraction format: ${fractionStr}. Numerator or denominator is not a number.`)
    }
    if (denominator === 0) throw new Error("Denominator cannot be zero.")
    return numerator / denominator
  }
  throw new Error(`Invalid fraction format: ${fractionStr}. Use 'n/d' or a number.`)
}

export function parseMeasurementInput(input: Pick<MeasurementInput, "feet" | "inches" | "fraction">): number {
  const feet = Number.parseFloat(input.feet || "0") || 0
  const inches = Number.parseFloat(input.inches || "0") || 0
  const fraction = parseFractionString(input.fraction || "0")

  if (isNaN(feet) || isNaN(inches) || isNaN(fraction)) {
    throw new Error("Invalid input: Feet, inches, or fraction is not a valid number.")
  }
  return feet * 12 + inches + fraction
}

export function formatResultToImperial(totalInches: number, precision: FractionPrecision = "1/16"): string {
  if (isNaN(totalInches)) return "Invalid Input"

  const sign = totalInches < 0 ? "-" : ""
  const absTotalInches = Math.abs(totalInches)

  const feet = Math.floor(absTotalInches / 12)
  let remainingInches = absTotalInches % 12

  const wholeInches = Math.floor(remainingInches)
  const fractionalPart = remainingInches - wholeInches

  if (fractionalPart === 0) {
    if (feet === 0 && wholeInches === 0 && sign === "-") return `0"` // Avoid -0"
    return `${sign}${feet > 0 ? `${feet}' ` : ""}${wholeInches}"`.trim()
  }

  const precisionDenominator = Number.parseInt(precision.split("/")[1])
  const numerator = Math.round(fractionalPart * precisionDenominator)

  // Handle rounding up that might push inches or feet
  if (numerator === precisionDenominator) {
    remainingInches = Math.ceil(remainingInches) // this might become wholeInches + 1
    if (remainingInches === 12) {
      return `${sign}${feet + 1}' 0"`.trim()
    }
    return `${sign}${feet > 0 ? `${feet}' ` : ""}${Math.floor(remainingInches)}"`.trim()
  }

  if (numerator === 0) {
    // After rounding, fraction became 0
    if (feet === 0 && wholeInches === 0 && sign === "-") return `0"`
    return `${sign}${feet > 0 ? `${feet}' ` : ""}${wholeInches}"`.trim()
  }

  const commonDivisor = gcd(numerator, precisionDenominator)
  const simplifiedNumerator = numerator / commonDivisor
  const simplifiedDenominator = precisionDenominator / commonDivisor

  let resultString = sign
  if (feet > 0) {
    resultString += `${feet}' `
  }
  if (
    wholeInches > 0 ||
    (feet === 0 && wholeInches === 0 && simplifiedNumerator > 0) ||
    (feet > 0 && simplifiedNumerator > 0)
  ) {
    // Show 0 inches if there's a fraction
    resultString += `${wholeInches} `
  }

  resultString += `${simplifiedNumerator}/${simplifiedDenominator}"`

  return resultString.trim().replace(/ \s+/g, " ") // Clean up potential double spaces
}

export function calculateAll(inputs: MeasurementInput[]): number {
  if (inputs.length === 0) return 0

  let currentResult = parseMeasurementInput(inputs[0])

  for (let i = 0; i < inputs.length - 1; i++) {
    const nextValue = parseMeasurementInput(inputs[i + 1])
    const operator = inputs[i].operator // Operator between current and next

    switch (operator) {
      case "+":
        currentResult += nextValue
        break
      case "-":
        currentResult -= nextValue
        break
      case "*":
        currentResult *= nextValue
        break
      case "/":
        if (nextValue === 0) throw new Error("Division by zero is not allowed.")
        currentResult /= nextValue
        break
      default:
        throw new Error(`Unknown operator: ${operator}`)
    }
  }
  return currentResult
}
