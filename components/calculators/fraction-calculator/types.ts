// This file was created in the previous step and defines types.
// Assuming it's correct and doesn't need changes.
export type Operator = "+" | "-" | "*" | "/"
export type FractionPrecision = "1/2" | "1/4" | "1/8" | "1/16" | "1/32" | "1/64"

export interface MeasurementInput {
  id: string
  feet: string
  inches: string
  fraction: string
  operator: Operator // Operator to apply with the *next* measurement
}
