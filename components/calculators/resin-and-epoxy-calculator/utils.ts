export type PourShape = "rectangle" | "circle"
export type MixRatio = "1:1" | "2:1"
export type WasteFactor = 5 | 10 | 15
export type VolumeUnit = "inches" | "cm" | "mm" | "fl_oz" | "ml" | "liters" | "gallons"

interface CalculationInputs {
  shape: PourShape
  length: number
  width: number
  diameter: number
  depth: number
  lengthUnit: VolumeUnit
  widthUnit: VolumeUnit
  diameterUnit: VolumeUnit
  depthUnit: VolumeUnit
  wasteFactor: WasteFactor
  mixRatio: MixRatio
  pricePerKit: number
  kitVolume: number
  kitVolumeUnit: VolumeUnit
}

// Conversion factors to inches
const INCH_CONVERSIONS = {
  inches: 1,
  cm: 0.393701,
  mm: 0.0393701,
  fl_oz: 1, // Not used for length
  ml: 1, // Not used for length
  liters: 1, // Not used for length
  gallons: 1, // Not used for length
}

// Conversion factors to fluid ounces
const VOLUME_CONVERSIONS = {
  fl_oz: 1,
  ml: 0.033814,
  liters: 33.814,
  gallons: 128,
  inches: 1, // Not used for volume
  cm: 1, // Not used for volume
  mm: 1, // Not used for volume
}

export function convertToInches(value: number, unit: VolumeUnit): number {
  return value * INCH_CONVERSIONS[unit]
}

export function convertVolume(value: number, fromUnit: VolumeUnit, toUnit: VolumeUnit): number {
  // Convert to fl_oz first, then to target unit
  const flOz = value * VOLUME_CONVERSIONS[fromUnit]
  return flOz / VOLUME_CONVERSIONS[toUnit]
}

export function calculateResinVolume(inputs: CalculationInputs): number {
  let volumeCubicInches: number

  if (inputs.shape === "rectangle") {
    const lengthInches = convertToInches(inputs.length, inputs.lengthUnit)
    const widthInches = convertToInches(inputs.width, inputs.widthUnit)
    const depthInches = convertToInches(inputs.depth, inputs.depthUnit)

    volumeCubicInches = lengthInches * widthInches * depthInches
  } else {
    const diameterInches = convertToInches(inputs.diameter, inputs.diameterUnit)
    const radiusInches = diameterInches / 2
    const depthInches = convertToInches(inputs.depth, inputs.depthUnit)

    volumeCubicInches = Math.PI * Math.pow(radiusInches, 2) * depthInches
  }

  // Convert cubic inches to fluid ounces (1 cubic inch ≈ 0.554113 fl oz)
  return volumeCubicInches * 0.554113
}

export function calculateMixRatio(totalVolume: number, mixRatio: MixRatio): { partA: number; partB: number } {
  if (mixRatio === "1:1") {
    return {
      partA: totalVolume / 2,
      partB: totalVolume / 2,
    }
  } else {
    // 2:1 ratio
    return {
      partA: (totalVolume * 2) / 3,
      partB: totalVolume / 3,
    }
  }
}

export function calculateKitsNeeded(totalVolumeFlOz: number, kitVolumeFlOz: number): number {
  if (kitVolumeFlOz <= 0) return 0
  return Math.ceil(totalVolumeFlOz / kitVolumeFlOz)
}

export function formatVolume(volume: number, unit: VolumeUnit): string {
  const unitLabels = {
    fl_oz: "fl oz",
    ml: "ml",
    liters: "L",
    gallons: "gal",
    inches: "in",
    cm: "cm",
    mm: "mm",
  }

  if (volume < 0.01) return `0 ${unitLabels[unit]}`
  if (volume < 1) return `${volume.toFixed(2)} ${unitLabels[unit]}`
  if (volume < 10) return `${volume.toFixed(1)} ${unitLabels[unit]}`
  return `${Math.round(volume)} ${unitLabels[unit]}`
}
