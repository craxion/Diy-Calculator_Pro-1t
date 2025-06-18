import type {
  KnownInputType,
  TriangleProperties,
  TriangleSides,
  TriangleAngles,
  Unit,
  TriangleInputValues,
} from "./types"

const EPSILON = 1e-9 // For floating point comparisons

export const DEFAULT_SIDE_UNIT: Unit = "m"

export const UNIT_CONVERSIONS: Record<Unit, number> = {
  // To meters
  m: 1,
  cm: 0.01,
  ft: 0.3048,
  in: 0.0254,
}

// Helper to convert degrees to radians
const toRadians = (degrees: number): number => degrees * (Math.PI / 180)

// Helper to convert radians to degrees
const toDegrees = (radians: number): number => radians * (180 / Math.PI)

// Clamp value for acos/asin to prevent domain errors due to floating point inaccuracies
const clampForTrig = (value: number): number => Math.max(-1, Math.min(1, value))

export function calculateTriangleProperties(
  type: KnownInputType,
  inputs: Partial<Record<keyof TriangleInputValues, number>>,
  unit: Unit,
): TriangleProperties {
  let sides: Partial<TriangleSides> = {}
  const angles: Partial<TriangleAngles> = {}

  const conversionFactor = UNIT_CONVERSIONS[unit]

  // Convert all input sides to a base unit (meters) for calculation
  const getSideInBaseUnit = (sideKey: keyof TriangleInputValues): number | undefined => {
    const val = inputs[sideKey]
    return val !== undefined ? val * conversionFactor : undefined
  }

  const sideA_base = getSideInBaseUnit("sideA")
  const sideB_base = getSideInBaseUnit("sideB")
  const sideC_base = getSideInBaseUnit("sideC")

  const angleA_input = inputs.angleA
  const angleB_input = inputs.angleB
  const angleC_input = inputs.angleC

  try {
    switch (type) {
      case "SSS":
        if (sideA_base === undefined || sideB_base === undefined || sideC_base === undefined)
          throw new Error("All three sides must be provided for SSS.")
        if (sideA_base <= 0 || sideB_base <= 0 || sideC_base <= 0) throw new Error("Side lengths must be positive.")
        if (
          sideA_base + sideB_base <= sideC_base + EPSILON ||
          sideA_base + sideC_base <= sideB_base + EPSILON ||
          sideB_base + sideC_base <= sideA_base + EPSILON
        ) {
          throw new Error("The given sides do not form a valid triangle (triangle inequality violated).")
        }
        sides = { a: sideA_base, b: sideB_base, c: sideC_base }
        angles.A = toDegrees(
          Math.acos(clampForTrig((sides.b! ** 2 + sides.c! ** 2 - sides.a! ** 2) / (2 * sides.b! * sides.c!))),
        )
        angles.B = toDegrees(
          Math.acos(clampForTrig((sides.a! ** 2 + sides.c! ** 2 - sides.b! ** 2) / (2 * sides.a! * sides.c!))),
        )
        angles.C = 180 - angles.A - angles.B
        break

      case "SAS":
        if (sideA_base === undefined || angleB_input === undefined || sideC_base === undefined)
          throw new Error("Two sides and the included angle must be provided for SAS.")
        if (sideA_base <= 0 || sideC_base <= 0) throw new Error("Side lengths must be positive.")
        if (angleB_input <= 0 || angleB_input >= 180) throw new Error("Angle B must be between 0 and 180 degrees.")

        sides.a = sideA_base
        angles.B = angleB_input
        sides.c = sideC_base

        const angleB_rad = toRadians(angles.B)
        sides.b = Math.sqrt(sides.a! ** 2 + sides.c! ** 2 - 2 * sides.a! * sides.c! * Math.cos(angleB_rad))

        angles.A = toDegrees(Math.asin(clampForTrig((sides.a! * Math.sin(angleB_rad)) / sides.b!)))
        // Need to handle ambiguity of asin for obtuse triangles.
        // If a^2 > b^2 + c^2, angle A is obtuse.
        // Or, more reliably, calculate angle C first then A = 180 - B - C
        angles.C = toDegrees(Math.asin(clampForTrig((sides.c! * Math.sin(angleB_rad)) / sides.b!)))

        // Check if the sum of A and C from asin matches 180 - B. If not, one might be obtuse.
        // A more robust way for SAS: after finding side b:
        // Use Law of Cosines to find another angle to avoid asin ambiguity.
        // cos(A) = (b^2 + c^2 - a^2) / (2bc)
        angles.A = toDegrees(
          Math.acos(clampForTrig((sides.b! ** 2 + sides.c! ** 2 - sides.a! ** 2) / (2 * sides.b! * sides.c!))),
        )
        angles.C = 180 - angles.A - angles.B
        break

      case "ASA":
        if (angleA_input === undefined || sideC_base === undefined || angleB_input === undefined)
          throw new Error("Two angles and the included side must be provided for ASA.")
        if (sideC_base <= 0) throw new Error("Side length must be positive.")
        if (angleA_input <= 0 || angleA_input >= 180 || angleB_input <= 0 || angleB_input >= 180)
          throw new Error("Angles must be between 0 and 180 degrees.")
        if (angleA_input + angleB_input >= 180 - EPSILON)
          throw new Error("Sum of Angle A and Angle B must be less than 180 degrees.")

        angles.A = angleA_input
        sides.c = sideC_base
        angles.B = angleB_input
        angles.C = 180 - angles.A - angles.B

        const sinA = Math.sin(toRadians(angles.A))
        const sinB = Math.sin(toRadians(angles.B))
        const sinC = Math.sin(toRadians(angles.C))

        if (Math.abs(sinC) < EPSILON) throw new Error("Angle C is too close to 0 or 180, cannot form a triangle.")

        sides.a = (sides.c! * sinA) / sinC
        sides.b = (sides.c! * sinB) / sinC
        break

      case "AAS":
        if (angleA_input === undefined || angleB_input === undefined || sideA_base === undefined)
          throw new Error("Two angles and a non-included side must be provided for AAS.")
        if (sideA_base <= 0) throw new Error("Side length must be positive.")
        if (angleA_input <= 0 || angleA_input >= 180 || angleB_input <= 0 || angleB_input >= 180)
          throw new Error("Angles must be between 0 and 180 degrees.")
        if (angleA_input + angleB_input >= 180 - EPSILON)
          throw new Error("Sum of Angle A and Angle B must be less than 180 degrees.")

        angles.A = angleA_input
        angles.B = angleB_input
        sides.a = sideA_base
        angles.C = 180 - angles.A - angles.B

        const sinA_aas = Math.sin(toRadians(angles.A))
        const sinB_aas = Math.sin(toRadians(angles.B))
        const sinC_aas = Math.sin(toRadians(angles.C))

        if (Math.abs(sinA_aas) < EPSILON) throw new Error("Angle A is too close to 0 or 180, cannot form a triangle.")

        sides.b = (sides.a! * sinB_aas) / sinA_aas
        sides.c = (sides.a! * sinC_aas) / sinA_aas
        break

      default:
        throw new Error("Invalid calculation type selected.")
    }

    const finalSides = sides as TriangleSides
    const finalAngles = angles as TriangleAngles

    // Convert calculated sides back to the selected display unit
    const displaySides: TriangleSides = {
      a: finalSides.a / conversionFactor,
      b: finalSides.b / conversionFactor,
      c: finalSides.c / conversionFactor,
    }

    const perimeter_base = finalSides.a + finalSides.b + finalSides.c
    const s = perimeter_base / 2 // Semi-perimeter in base units
    const area_base = Math.sqrt(s * (s - finalSides.a) * (s - finalSides.b) * (s - finalSides.c))

    if (isNaN(area_base) || area_base < EPSILON) {
      // Check for valid area
      // This can happen if calculated angles/sides lead to an impossible triangle due to precision
      throw new Error("Calculated values result in an invalid triangle (e.g., zero area). Check input consistency.")
    }

    const heights_base = {
      ha: (2 * area_base) / finalSides.a,
      hb: (2 * area_base) / finalSides.b,
      hc: (2 * area_base) / finalSides.c,
    }

    return {
      sides: displaySides,
      angles: finalAngles,
      perimeter: perimeter_base / conversionFactor,
      area: area_base / conversionFactor ** 2,
      heights: {
        ha: heights_base.ha / conversionFactor,
        hb: heights_base.hb / conversionFactor,
        hc: heights_base.hc / conversionFactor,
      },
      valid: true,
      typeInfo: determineTriangleTypeInternal(finalSides, finalAngles),
    }
  } catch (e: any) {
    // console.error("Calculation error:", e);
    throw e // Re-throw to be caught by the component
  }
}

function determineTriangleTypeInternal(
  sides: TriangleSides, // Sides in base unit
  angles: TriangleAngles,
): {
  angleType: "Acute" | "Right" | "Obtuse" | "Invalid"
  sideType: "Equilateral" | "Isosceles" | "Scalene" | "Invalid"
} {
  let angleType: "Acute" | "Right" | "Obtuse" | "Invalid" = "Invalid"
  let sideType: "Equilateral" | "Isosceles" | "Scalene" | "Invalid" = "Invalid"

  const { A, B, C } = angles
  const { a, b, c } = sides

  if (Math.abs(A + B + C - 180) > EPSILON || A <= EPSILON || B <= EPSILON || C <= EPSILON) {
    return { angleType: "Invalid", sideType: "Invalid" }
  }

  if (Math.abs(A - 90) < EPSILON || Math.abs(B - 90) < EPSILON || Math.abs(C - 90) < EPSILON) {
    angleType = "Right"
  } else if (A > 90 || B > 90 || C > 90) {
    angleType = "Obtuse"
  } else {
    angleType = "Acute"
  }

  const abEqual = Math.abs(a - b) < EPSILON * Math.max(a, b, 1) // Relative epsilon
  const bcEqual = Math.abs(b - c) < EPSILON * Math.max(b, c, 1)
  const acEqual = Math.abs(a - c) < EPSILON * Math.max(a, c, 1)

  if (abEqual && bcEqual) {
    // All sides equal
    sideType = "Equilateral"
  } else if (abEqual || bcEqual || acEqual) {
    // At least two sides equal
    sideType = "Isosceles"
  } else {
    // No sides equal
    sideType = "Scalene"
  }

  return { angleType, sideType }
}

export function getTriangleType(sides: TriangleSides, angles: TriangleAngles): string {
  // This function uses the already converted display sides, but type determination should ideally use base unit sides for precision.
  // For simplicity here, we'll call determineTriangleTypeInternal again, assuming it's robust.
  // Or, better, the typeInfo should be passed directly from calculateTriangleProperties.
  // For now, let's assume `properties.typeInfo` is available from the main calculation.
  // This function is now more of a formatter for the typeInfo.

  // Re-calculate with display values for consistency if typeInfo is not passed.
  // This is not ideal, typeInfo should come from the main calculation.
  // For the purpose of this example, let's assume typeInfo is passed or re-derived.
  const typeInfo = determineTriangleTypeInternal(sides, angles) // Using display sides, less precise.

  if (typeInfo.angleType === "Invalid" || typeInfo.sideType === "Invalid") return "Invalid Triangle"
  return `${typeInfo.angleType} ${typeInfo.sideType}`
}
