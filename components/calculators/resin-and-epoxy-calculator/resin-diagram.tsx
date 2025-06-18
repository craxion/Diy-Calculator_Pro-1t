"use client"

import { convertToInches } from "./utils"

interface ResinDiagramProps {
  inputs: {
    shape: "rectangle" | "circle"
    length: number
    width: number
    diameter: number
    depth: number
    lengthUnit: string
    widthUnit: string
    diameterUnit: string
    depthUnit: string
  }
}

export function ResinDiagram({ inputs }: ResinDiagramProps) {
  const { shape, length, width, diameter, depth } = inputs

  // Convert all dimensions to inches for consistent display
  const lengthInches = convertToInches(length, inputs.lengthUnit as any)
  const widthInches = convertToInches(width, inputs.widthUnit as any)
  const diameterInches = convertToInches(diameter, inputs.diameterUnit as any)
  const depthInches = convertToInches(depth, inputs.depthUnit as any)

  // SVG dimensions and scaling
  const svgWidth = 400
  const svgHeight = 300
  const margin = 40

  if (shape === "rectangle") {
    // Calculate scale to fit rectangle in SVG
    const maxDimension = Math.max(lengthInches, widthInches)
    const scale = Math.min((svgWidth - 2 * margin) / lengthInches, (svgHeight - 2 * margin) / widthInches)

    const rectWidth = lengthInches * scale
    const rectHeight = widthInches * scale
    const rectX = (svgWidth - rectWidth) / 2
    const rectY = (svgHeight - rectHeight) / 2

    return (
      <div className="w-full">
        <svg
          width="100%"
          height="300"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="border rounded-lg bg-gray-50"
        >
          {/* Rectangle */}
          <rect
            x={rectX}
            y={rectY}
            width={rectWidth}
            height={rectHeight}
            fill="rgba(251, 146, 60, 0.2)"
            stroke="rgb(251, 146, 60)"
            strokeWidth="2"
            rx="4"
          />

          {/* Length dimension line */}
          <g>
            <line x1={rectX} y1={rectY - 20} x2={rectX + rectWidth} y2={rectY - 20} stroke="#666" strokeWidth="1" />
            <line x1={rectX} y1={rectY - 25} x2={rectX} y2={rectY - 15} stroke="#666" strokeWidth="1" />
            <line
              x1={rectX + rectWidth}
              y1={rectY - 25}
              x2={rectX + rectWidth}
              y2={rectY - 15}
              stroke="#666"
              strokeWidth="1"
            />
            <text
              x={rectX + rectWidth / 2}
              y={rectY - 25}
              textAnchor="middle"
              className="text-xs fill-gray-600"
              dy="-2"
            >
              {length} {inputs.lengthUnit}
            </text>
          </g>

          {/* Width dimension line */}
          <g>
            <line x1={rectX - 20} y1={rectY} x2={rectX - 20} y2={rectY + rectHeight} stroke="#666" strokeWidth="1" />
            <line x1={rectX - 25} y1={rectY} x2={rectX - 15} y2={rectY} stroke="#666" strokeWidth="1" />
            <line
              x1={rectX - 25}
              y1={rectY + rectHeight}
              x2={rectX - 15}
              y2={rectY + rectHeight}
              stroke="#666"
              strokeWidth="1"
            />
            <text
              x={rectX - 30}
              y={rectY + rectHeight / 2}
              textAnchor="middle"
              className="text-xs fill-gray-600"
              transform={`rotate(-90, ${rectX - 30}, ${rectY + rectHeight / 2})`}
            >
              {width} {inputs.widthUnit}
            </text>
          </g>

          {/* Depth indicator */}
          <text
            x={rectX + rectWidth / 2}
            y={rectY + rectHeight / 2}
            textAnchor="middle"
            className="text-sm font-medium fill-primary-orange"
            dy="4"
          >
            Depth: {depth} {inputs.depthUnit}
          </text>
        </svg>
      </div>
    )
  } else {
    // Circle diagram
    const radius = diameterInches / 2
    const scale = Math.min((svgWidth - 2 * margin) / diameterInches, (svgHeight - 2 * margin) / diameterInches)
    const scaledRadius = radius * scale
    const centerX = svgWidth / 2
    const centerY = svgHeight / 2

    return (
      <div className="w-full">
        <svg
          width="100%"
          height="300"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="border rounded-lg bg-gray-50"
        >
          {/* Circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r={scaledRadius}
            fill="rgba(251, 146, 60, 0.2)"
            stroke="rgb(251, 146, 60)"
            strokeWidth="2"
          />

          {/* Diameter line */}
          <line
            x1={centerX - scaledRadius}
            y1={centerY}
            x2={centerX + scaledRadius}
            y2={centerY}
            stroke="#666"
            strokeWidth="1"
            strokeDasharray="4,4"
          />

          {/* Diameter dimension */}
          <g>
            <line
              x1={centerX - scaledRadius}
              y1={centerY - 30}
              x2={centerX + scaledRadius}
              y2={centerY - 30}
              stroke="#666"
              strokeWidth="1"
            />
            <line
              x1={centerX - scaledRadius}
              y1={centerY - 35}
              x2={centerX - scaledRadius}
              y2={centerY - 25}
              stroke="#666"
              strokeWidth="1"
            />
            <line
              x1={centerX + scaledRadius}
              y1={centerY - 35}
              x2={centerX + scaledRadius}
              y2={centerY - 25}
              stroke="#666"
              strokeWidth="1"
            />
            <text x={centerX} y={centerY - 35} textAnchor="middle" className="text-xs fill-gray-600" dy="-2">
              ⌀ {diameter} {inputs.diameterUnit}
            </text>
          </g>

          {/* Depth indicator */}
          <text x={centerX} y={centerY} textAnchor="middle" className="text-sm font-medium fill-primary-orange" dy="4">
            Depth: {depth} {inputs.depthUnit}
          </text>
        </svg>
      </div>
    )
  }
}
