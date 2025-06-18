export interface OhmsLawInputs {
  voltage: string
  current: string
  resistance: string
}

export interface OhmsLawResults {
  voltage: number | null
  current: number | null
  resistance: number | null
  power: number | null
  isValid: boolean
  error: string | null
}

export interface OhmsLawCalculation {
  voltage: number
  current: number
  resistance: number
  power: number
}
