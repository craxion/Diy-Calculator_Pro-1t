import type { TriangleProperties, Unit } from "./types"

interface TriangleSVGProps {
  properties: TriangleProperties | null
  unit: Unit
}

const SVG_WIDTH = 300
const SVG_HEIGHT = 250
const PADDING = 30 // Increased padding

// Helper to format numbers for display in SVG
const formatSVGNumber = (num: number | undefined, precision = 1) => {
  if (num === undefined || isNaN(num)) return ""
  return num.toFixed(precision)
}

export function TriangleSVG({ properties, unit }: TriangleSVGProps) {
  if (
    !properties ||
    !properties.sides.a ||
    !properties.sides.b ||
    !properties.sides.c ||
    !properties.angles.A ||
    !properties.angles.B ||
    !properties.angles.C
  ) {
    return (
      <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
        <text
          x={SVG_WIDTH / 2}
          y={SVG_HEIGHT / 2}
          textAnchor="middle"
          dominantBaseline="middle"
          className="fill-current text-gray-400 dark:text-gray-500 text-sm"
        >
          Triangle diagram will appear here
        </text>
      </svg>
    )
  }

  const { sides, angles } = properties
  const { a, b, c } = sides
  const { A, B, C } = angles

  // Convert angles to radians for Math.cos/sin
  const angleA_rad = (A * Math.PI) / 180
  // const angleB_rad = (B * Math.PI) / 180;
  // const angleC_rad = (C * Math.PI) / 180;

  // Determine the longest side to scale the triangle
  const maxSide = Math.max(a, b, c)
  const scaleFactor = (Math.min(SVG_WIDTH, SVG_HEIGHT) - 2 * PADDING) / maxSide

  const scaledA = a * scaleFactor
  const scaledB = b * scaleFactor
  const scaledC = c * scaleFactor

  // Calculate coordinates
  // Place vertex C at (0,0) for simplicity in this example
  // Vertex B is on the x-axis: (scaledA, 0)
  // Vertex A: (scaledB * cos(AngleC_rad), scaledB * sin(AngleC_rad))
  // This is one way to draw it. Let's use a common SSS to coordinates method:
  // Point A (vertex opposite side a) at (x,y)
  // Point B (vertex opposite side b) at (0,0)
  // Point C (vertex opposite side c) at (a_scaled, 0)
  // Point A_x = (a_scaled^2 + c_scaled^2 - b_scaled^2) / (2 * a_scaled)
  // Point A_y = sqrt(c_scaled^2 - Point A_x^2) -- this is for height to side a, not quite right for vertex.

  // Let's use a standard layout:
  // Vertex A: (0,0)
  // Vertex B: (scaledC, 0)
  // Vertex C: (scaledB * cos(angleA_rad), scaledB * sin(angleA_rad))

  const pAx = 0
  const pAy = scaledB * Math.sin(angleA_rad) // Vertex C's y (if A is at origin, B along x-axis)
  const pBx = scaledC
  const pBy = scaledB * Math.sin(angleA_rad) // Same y as C
  const pCx = scaledB * Math.cos(angleA_rad)
  const pCy = 0 // Vertex A's y

  // To make it look more like a triangle with base on bottom:
  // Vertex C (angle C) at top:
  const c_x =
    PADDING + (scaledA - scaledB * Math.cos((C * Math.PI) / 180)) / 2 + scaledB * Math.cos((C * Math.PI) / 180) // Centering logic needs refinement
  const c_y = PADDING
  // Vertex A (angle A) bottom-left:
  const a_x = PADDING
  const a_y = PADDING + scaledB * Math.sin((C * Math.PI) / 180)
  // Vertex B (angle B) bottom-right:
  const b_x = PADDING + scaledA
  const b_y = PADDING + scaledB * Math.sin((C * Math.PI) / 180)

  // Recalculate points to fit within SVG, ensuring base is horizontal
  // Place vertex for Angle A at (xA, yA), Angle B at (xB, yB), Angle C at (xC, yC)
  // Let side c (between A and B) be the base.
  let xA = PADDING
  let yA = SVG_HEIGHT - PADDING
  let xB = PADDING + scaledC
  let yB = SVG_HEIGHT - PADDING
  let xC = PADDING + scaledB * Math.cos(angleA_rad)
  let yC = SVG_HEIGHT - PADDING - scaledB * Math.sin(angleA_rad)

  // Check if triangle is too wide or too tall and rescale if necessary
  const points = [
    { x: xA, y: yA },
    { x: xB, y: yB },
    { x: xC, y: yC },
  ]
  const minX = Math.min(...points.map((p) => p.x))
  const maxX = Math.max(...points.map((p) => p.x))
  const minY = Math.min(...points.map((p) => p.y))
  const maxY = Math.max(...points.map((p) => p.y))

  const currentWidth = maxX - minX
  const currentHeight = maxY - minY

  let finalScale = 1
  if (currentWidth > SVG_WIDTH - 2 * PADDING) {
    finalScale = Math.min(finalScale, (SVG_WIDTH - 2 * PADDING) / currentWidth)
  }
  if (currentHeight > SVG_HEIGHT - 2 * PADDING) {
    finalScale = Math.min(finalScale, (SVG_HEIGHT - 2 * PADDING) / currentHeight)
  }

  if (finalScale < 1) {
    xA = PADDING + (xA - PADDING) * finalScale
    yA = SVG_HEIGHT - PADDING - (SVG_HEIGHT - PADDING - yA) * finalScale
    xB = PADDING + (xB - PADDING) * finalScale
    yB = SVG_HEIGHT - PADDING - (SVG_HEIGHT - PADDING - yB) * finalScale
    xC = PADDING + (xC - PADDING) * finalScale
    yC = SVG_HEIGHT - PADDING - (SVG_HEIGHT - PADDING - yC) * finalScale
  }

  // Center the triangle
  const finalPoints = [
    { x: xA, y: yA },
    { x: xB, y: yB },
    { x: xC, y: yC },
  ]
  const finalMinX = Math.min(...finalPoints.map((p) => p.x))
  const finalMaxX = Math.max(...finalPoints.map((p) => p.x))
  const finalMinY = Math.min(...finalPoints.map((p) => p.y))
  const finalMaxY = Math.max(...finalPoints.map((p) => p.y))

  const finalWidth = finalMaxX - finalMinX
  const finalHeight = finalMaxY - finalMinY

  const offsetX = (SVG_WIDTH - finalWidth) / 2 - finalMinX
  const offsetY = (SVG_HEIGHT - finalHeight) / 2 - finalMinY

  xA += offsetX
  xB += offsetX
  xC += offsetX
  yA += offsetY
  yB += offsetY
  yC += offsetY

  const pathData = `M ${xA} ${yA} L ${xB} ${yB} L ${xC} ${yC} Z`

  const textStyle = "fill-current text-gray-700 dark:text-gray-200 text-xs font-sans"
  const angleTextStyle = "fill-current text-blue-600 dark:text-blue-400 text-xs font-sans font-semibold"

  return (
    <svg viewBox={`0 0 ${SVG_WIDTH} ${SVG_HEIGHT}`} className="w-full h-full">
      <path
        d={pathData}
        strokeWidth="2"
        className="stroke-current text-gray-800 dark:text-gray-100 fill-blue-500/10 dark:fill-blue-400/10"
      />

      {/* Side Labels */}
      <text x={(xA + xB) / 2} y={(yA + yB) / 2 - 5} textAnchor="middle" className={textStyle}>
        c: {formatSVGNumber(c)} {unit}
      </text>
      <text
        x={(xB + xC) / 2 + 5 * Math.sign(xC - xB)}
        y={(yB + yC) / 2}
        textAnchor={xC > xB ? "start" : "end"}
        dominantBaseline="middle"
        className={textStyle}
      >
        a: {formatSVGNumber(a)} {unit}
      </text>
      <text
        x={(xC + xA) / 2 - 5 * Math.sign(xC - xA)}
        y={(yC + yA) / 2}
        textAnchor={xC < xA ? "start" : "end"}
        dominantBaseline="middle"
        className={textStyle}
      >
        b: {formatSVGNumber(b)} {unit}
      </text>

      {/* Angle Labels - positioning needs to be relative to the vertex and inside the triangle */}
      <text
        x={xA + (xC > xA ? 10 : -10) * Math.cos(angleA_rad / 2)}
        y={yA - 10 * Math.sin(angleA_rad / 2)}
        textAnchor={xC > xA ? "start" : "end"}
        className={angleTextStyle}
      >
        A: {formatSVGNumber(A)}°
      </text>
      <text
        x={xB + (xC < xB ? 10 : -10) * Math.cos((angles.B * Math.PI) / 180 / 2)}
        y={yB - 10 * Math.sin((angles.B * Math.PI) / 180 / 2)}
        textAnchor={xC < xB ? "end" : "start"}
        className={angleTextStyle}
      >
        B: {formatSVGNumber(B)}°
      </text>
      <text
        x={xC}
        y={yC + (yA > yC ? -10 : 10)}
        textAnchor="middle"
        dominantBaseline={yA > yC ? "alphabetic" : "hanging"}
        className={angleTextStyle}
      >
        C: {formatSVGNumber(C)}°
      </text>
    </svg>
  )
}
