export type KnownInputType = "SSS" | "SAS" | "ASA" | "AAS"

export type Unit = "ft" | "in" | "m" | "cm"

export interface TriangleInputValues {
  sideA?: string | number
  sideB?: string | number
  sideC?: string | number
  angleA?: string | number
  angleB?: string | number
  angleC?: string | number
}

export interface TriangleSides {
  a: number
  b: number
  c: number
}

export interface TriangleAngles {
  A: number
  B: number
  C: number
}

export interface TriangleHeights {
  ha: number // Height to side a
  hb: number // Height to side b
  hc: number // Height to side c
}

export interface TriangleProperties {
  sides: TriangleSides
  angles: TriangleAngles
  perimeter: number
  area: number
  heights: TriangleHeights
  valid: boolean
  error?: string
  typeInfo: {
    angleType: "Acute" | "Right" | "Obtuse" | "Invalid"
    sideType: "Equilateral" | "Isosceles" | "Scalene" | "Invalid"
  }
}
