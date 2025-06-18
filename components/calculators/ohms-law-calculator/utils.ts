import type { OhmsLawInputs, OhmsLawResults } from "./types"

export function validateInput(value: string): boolean {
  if (value === "") return true

  // Allow numbers with decimal points
  const numberRegex = /^\d*\.?\d*$/
  return numberRegex.test(value)
}

export function calculateOhmsLaw(inputs: OhmsLawInputs): OhmsLawResults {
  const voltage = inputs.voltage ? Number.parseFloat(inputs.voltage) : null
  const current = inputs.current ? Number.parseFloat(inputs.current) : null
  const resistance = inputs.resistance ? Number.parseFloat(inputs.resistance) : null

  // Count how many values are provided
  const providedValues = [voltage, current, resistance].filter((v) => v !== null && !isNaN(v) && v > 0)

  if (providedValues.length < 2) {
    return {
      voltage: null,
      current: null,
      resistance: null,
      power: null,
      isValid: false,
      error: "Please enter at least two values",
    }
  }

  if (providedValues.length > 2) {
    return {
      voltage: null,
      current: null,
      resistance: null,
      power: null,
      isValid: false,
      error: "Please enter only two values",
    }
  }

  try {
    let finalVoltage: number
    let finalCurrent: number
    let finalResistance: number

    // Calculate missing value based on Ohm's Law: V = I × R
    if (voltage !== null && current !== null) {
      // Calculate resistance: R = V / I
      if (current === 0) {
        throw new Error("Current cannot be zero when calculating resistance")
      }
      finalVoltage = voltage
      finalCurrent = current
      finalResistance = voltage / current
    } else if (voltage !== null && resistance !== null) {
      // Calculate current: I = V / R
      if (resistance === 0) {
        throw new Error("Resistance cannot be zero when calculating current")
      }
      finalVoltage = voltage
      finalResistance = resistance
      finalCurrent = voltage / resistance
    } else if (current !== null && resistance !== null) {
      // Calculate voltage: V = I × R
      finalCurrent = current
      finalResistance = resistance
      finalVoltage = current * resistance
    } else {
      throw new Error("Invalid combination of inputs")
    }

    // Calculate power: P = V × I
    const power = finalVoltage * finalCurrent

    // Validate results
    if (!isFinite(finalVoltage) || !isFinite(finalCurrent) || !isFinite(finalResistance) || !isFinite(power)) {
      throw new Error("Calculation resulted in invalid values")
    }

    if (finalVoltage < 0 || finalCurrent < 0 || finalResistance < 0 || power < 0) {
      throw new Error("All values must be positive")
    }

    return {
      voltage: finalVoltage,
      current: finalCurrent,
      resistance: finalResistance,
      power: power,
      isValid: true,
      error: null,
    }
  } catch (error) {
    return {
      voltage: null,
      current: null,
      resistance: null,
      power: null,
      isValid: false,
      error: error instanceof Error ? error.message : "Calculation error",
    }
  }
}

export function formatNumber(value: number): string {
  if (value === 0) return "0"

  // For very small numbers, use scientific notation
  if (Math.abs(value) < 0.001) {
    return value.toExponential(3)
  }

  // For very large numbers, use scientific notation
  if (Math.abs(value) >= 1000000) {
    return value.toExponential(3)
  }

  // For normal range numbers, use appropriate decimal places
  if (Math.abs(value) >= 100) {
    return value.toFixed(1)
  } else if (Math.abs(value) >= 10) {
    return value.toFixed(2)
  } else if (Math.abs(value) >= 1) {
    return value.toFixed(3)
  } else {
    return value.toFixed(4)
  }
}

export function getOhmsLawFormula(knownValues: string[]): string {
  if (knownValues.includes("voltage") && knownValues.includes("current")) {
    return "R = V ÷ I"
  } else if (knownValues.includes("voltage") && knownValues.includes("resistance")) {
    return "I = V ÷ R"
  } else if (knownValues.includes("current") && knownValues.includes("resistance")) {
    return "V = I × R"
  }
  return "V = I × R"
}
