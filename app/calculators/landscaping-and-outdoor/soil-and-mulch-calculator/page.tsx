"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Calculator, Info, RotateCcw, Settings } from "lucide-react"

interface CalculationResults {
  volume: number
  volumeWithWaste: number
  bags: number
  customBags: number
  totalCost: number
}

// SVG Diagram Component
function SoilDiagram({
  shape,
  length,
  width,
  diameter,
  depth,
  unit,
}: {
  shape: string
  length: number
  width: number
  diameter: number
  depth: number
  unit: string
}) {
  const svgWidth = 300
  const svgHeight = 200
  const margin = 40

  if (shape === "circular") {
    const radius = Math.min((svgWidth - margin * 2) / 2, (svgHeight - margin * 2) / 2)
    const centerX = svgWidth / 2
    const centerY = svgHeight / 2

    return (
      <svg width={svgWidth} height={svgHeight} className="border rounded-lg bg-gray-50">
        {/* Circle */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius}
          fill="rgba(0, 0, 128, 0.1)"
          stroke="rgb(0, 0, 128)"
          strokeWidth="2"
        />

        {/* Diameter line */}
        <line
          x1={centerX - radius}
          y1={centerY}
          x2={centerX + radius}
          y2={centerY}
          stroke="rgb(0, 0, 128)"
          strokeWidth="1"
          strokeDasharray="5,5"
        />

        {/* Labels */}
        <text x={centerX} y={centerY - radius - 10} textAnchor="middle" className="text-sm font-medium">
          Diameter: {diameter} {unit}
        </text>
        <text x={centerX} y={centerY + radius + 20} textAnchor="middle" className="text-sm font-medium">
          Depth: {depth} {unit}
        </text>
      </svg>
    )
  }

  // Rectangular shape
  const rectWidth = Math.min(svgWidth - margin * 2, 200)
  const rectHeight = Math.min(svgHeight - margin * 2, 120)
  const rectX = (svgWidth - rectWidth) / 2
  const rectY = (svgHeight - rectHeight) / 2

  return (
    <svg width={svgWidth} height={svgHeight} className="border rounded-lg bg-gray-50">
      {/* Rectangle */}
      <rect
        x={rectX}
        y={rectY}
        width={rectWidth}
        height={rectHeight}
        fill="rgba(0, 0, 128, 0.1)"
        stroke="rgb(0, 0, 128)"
        strokeWidth="2"
      />

      {/* Dimension lines */}
      <line x1={rectX} y1={rectY - 15} x2={rectX + rectWidth} y2={rectY - 15} stroke="rgb(0, 0, 128)" strokeWidth="1" />
      <line
        x1={rectX - 15}
        y1={rectY}
        x2={rectX - 15}
        y2={rectY + rectHeight}
        stroke="rgb(0, 0, 128)"
        strokeWidth="1"
      />

      {/* Labels */}
      <text x={rectX + rectWidth / 2} y={rectY - 20} textAnchor="middle" className="text-sm font-medium">
        Length: {length} {unit}
      </text>
      <text
        x={rectX - 25}
        y={rectY + rectHeight / 2}
        textAnchor="middle"
        className="text-sm font-medium"
        transform={`rotate(-90, ${rectX - 25}, ${rectY + rectHeight / 2})`}
      >
        Width: {width} {unit}
      </text>
      <text x={rectX + rectWidth / 2} y={rectY + rectHeight + 20} textAnchor="middle" className="text-sm font-medium">
        Depth: {depth} {unit}
      </text>
    </svg>
  )
}

export default function SoilMulchCalculatorPage() {
  // Basic inputs
  const [shape, setShape] = useState("rectangular")
  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [diameter, setDiameter] = useState("")
  const [depth, setDepth] = useState("")
  const [unit, setUnit] = useState("feet")
  const [materialType, setMaterialType] = useState("topsoil")
  const [pricePerYard, setPricePerYard] = useState("")

  // Advanced options
  const [wasteFactor, setWasteFactor] = useState("10")
  const [useCustomBag, setUseCustomBag] = useState(false)
  const [customBagVolume, setCustomBagVolume] = useState("")
  const [customBagUnit, setCustomBagUnit] = useState("cubic feet")

  const [results, setResults] = useState<CalculationResults | null>(null)

  const materialInfo = {
    topsoil: { name: "Topsoil", bagsPerYard: 13.5 },
    mulch: { name: "Mulch", bagsPerYard: 13.5 },
    compost: { name: "Compost", bagsPerYard: 13.5 },
    sand: { name: "Sand", bagsPerYard: 15 },
    gravel: { name: "Gravel", bagsPerYard: 15 },
  }

  // Real-time calculation
  useEffect(() => {
    const calculateResults = () => {
      let area = 0
      const d = Number.parseFloat(depth)
      const price = Number.parseFloat(pricePerYard) || 0
      const waste = Number.parseFloat(wasteFactor) / 100

      if (!d) return null

      if (shape === "rectangular") {
        const l = Number.parseFloat(length)
        const w = Number.parseFloat(width)
        if (!l || !w) return null
        area = l * w
      } else {
        const dia = Number.parseFloat(diameter)
        if (!dia) return null
        area = Math.PI * Math.pow(dia / 2, 2)
      }

      // Convert to feet if needed
      let areaFt = area
      let depthFt = d

      if (unit === "inches") {
        areaFt = area / 144 // square inches to square feet
        depthFt = d / 12
      } else if (unit === "meters") {
        areaFt = area * 10.764 // square meters to square feet
        depthFt = d * 3.281 // meters to feet
      }

      // Calculate volume in cubic feet
      const volumeCubicFeet = areaFt * depthFt

      // Convert to cubic yards
      const volumeCubicYards = volumeCubicFeet / 27
      const volumeWithWaste = volumeCubicYards * (1 + waste)

      // Calculate bags needed
      const material = materialInfo[materialType as keyof typeof materialInfo]
      const bags = Math.ceil(volumeWithWaste * material.bagsPerYard)

      // Calculate custom bags if enabled
      let customBags = 0
      if (useCustomBag && customBagVolume) {
        const bagVol = Number.parseFloat(customBagVolume)
        let bagVolCubicYards = bagVol / 27 // assume cubic feet by default

        if (customBagUnit === "liters") {
          bagVolCubicYards = bagVol * 0.001308 // liters to cubic yards
        }

        customBags = Math.ceil(volumeWithWaste / bagVolCubicYards)
      }

      // Calculate total cost
      const totalCost = volumeWithWaste * price

      return {
        volume: volumeCubicYards,
        volumeWithWaste,
        bags,
        customBags,
        totalCost,
      }
    }

    setResults(calculateResults())
  }, [
    shape,
    length,
    width,
    diameter,
    depth,
    unit,
    materialType,
    pricePerYard,
    wasteFactor,
    useCustomBag,
    customBagVolume,
    customBagUnit,
  ])

  const reset = () => {
    setLength("")
    setWidth("")
    setDiameter("")
    setDepth("")
    setPricePerYard("")
    setCustomBagVolume("")
    setResults(null)
  }

  return (
    <div className="container py-12 max-w-7xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold">Soil & Mulch Calculator</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Calculate the amount of soil, mulch, or other landscaping materials needed for your project. Get accurate
            volume and bag count estimates with real-time visual feedback.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section - Left Column */}
          <div className="space-y-6">
            {/* Basic Inputs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Info className="h-5 w-5" />
                  <span>Project Details</span>
                </CardTitle>
                <CardDescription>Enter your area dimensions and material type</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="shape">Area Shape</Label>
                  <Select value={shape} onValueChange={setShape}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectangular">Rectangular</SelectItem>
                      <SelectItem value="circular">Circular</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit">Measurement Unit</Label>
                  <Select value={unit} onValueChange={setUnit}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="feet">Feet</SelectItem>
                      <SelectItem value="inches">Inches</SelectItem>
                      <SelectItem value="meters">Meters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {shape === "rectangular" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length ({unit})</Label>
                      <Input
                        id="length"
                        type="number"
                        placeholder="0"
                        value={length}
                        onChange={(e) => setLength(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width">Width ({unit})</Label>
                      <Input
                        id="width"
                        type="number"
                        placeholder="0"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="diameter">Diameter ({unit})</Label>
                    <Input
                      id="diameter"
                      type="number"
                      placeholder="0"
                      value={diameter}
                      onChange={(e) => setDiameter(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="depth">Depth ({unit})</Label>
                  <Input
                    id="depth"
                    type="number"
                    placeholder="3"
                    value={depth}
                    onChange={(e) => setDepth(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material Type</Label>
                  <Select value={materialType} onValueChange={setMaterialType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="topsoil">Topsoil</SelectItem>
                      <SelectItem value="mulch">Mulch</SelectItem>
                      <SelectItem value="compost">Compost</SelectItem>
                      <SelectItem value="sand">Sand</SelectItem>
                      <SelectItem value="gravel">Gravel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per Cubic Yard (Optional)</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="35"
                    value={pricePerYard}
                    onChange={(e) => setPricePerYard(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Advanced Options */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Advanced Options</span>
                </CardTitle>
                <CardDescription>Fine-tune your calculations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="waste">Waste Factor</Label>
                  <Select value={wasteFactor} onValueChange={setWasteFactor}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5% - Minimal waste</SelectItem>
                      <SelectItem value="10">10% - Standard</SelectItem>
                      <SelectItem value="15">15% - Extra safety</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="custom-bag" checked={useCustomBag} onCheckedChange={setUseCustomBag} />
                    <Label htmlFor="custom-bag">Use Custom Bag Size</Label>
                  </div>

                  {useCustomBag && (
                    <div className="grid grid-cols-2 gap-4 pl-6">
                      <div className="space-y-2">
                        <Label htmlFor="bag-volume">Bag Volume</Label>
                        <Input
                          id="bag-volume"
                          type="number"
                          placeholder="2.5"
                          value={customBagVolume}
                          onChange={(e) => setCustomBagVolume(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bag-unit">Unit</Label>
                        <Select value={customBagUnit} onValueChange={setCustomBagUnit}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="cubic feet">Cubic Feet</SelectItem>
                            <SelectItem value="liters">Liters</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}
                </div>

                <Button onClick={reset} variant="outline" className="w-full">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Calculator
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results & Diagram Section - Right Column */}
          <div className="space-y-6">
            {/* Visual Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>Visual Diagram</CardTitle>
                <CardDescription>Your project visualization</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <SoilDiagram
                  shape={shape}
                  length={Number.parseFloat(length) || 0}
                  width={Number.parseFloat(width) || 0}
                  diameter={Number.parseFloat(diameter) || 0}
                  depth={Number.parseFloat(depth) || 0}
                  unit={unit}
                />
              </CardContent>
            </Card>

            {/* Results */}
            <Card>
              <CardHeader>
                <CardTitle>Calculation Results</CardTitle>
                <CardDescription>Material requirements and cost estimates</CardDescription>
              </CardHeader>
              <CardContent>
                {results ? (
                  <Tabs defaultValue="volume" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="volume">Volume</TabsTrigger>
                      <TabsTrigger value="bags">Bags</TabsTrigger>
                      <TabsTrigger value="cost">Cost</TabsTrigger>
                    </TabsList>

                    <TabsContent value="volume" className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Base Volume:</span>
                          <Badge variant="secondary">{results.volume.toFixed(2)} cubic yards</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">With Waste Factor:</span>
                          <Badge>{results.volumeWithWaste.toFixed(2)} cubic yards</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-medium">In Cubic Feet:</span>
                          <Badge variant="outline">{(results.volumeWithWaste * 27).toFixed(1)} cubic feet</Badge>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="bags" className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Standard Bags (2 cu ft):</span>
                          <Badge>{results.bags} bags</Badge>
                        </div>
                        {useCustomBag && customBagVolume && (
                          <div className="flex justify-between items-center">
                            <span className="font-medium">
                              Custom Bags ({customBagVolume} {customBagUnit}):
                            </span>
                            <Badge variant="secondary">{results.customBags} bags</Badge>
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">
                          Based on {materialInfo[materialType as keyof typeof materialInfo].name} density
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="cost" className="space-y-4">
                      {results.totalCost > 0 ? (
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="font-medium">Material Cost:</span>
                            <Badge className="text-lg">${results.totalCost.toFixed(2)}</Badge>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Based on ${pricePerYard}/cubic yard including waste factor
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-4">
                          <p>Enter a price per cubic yard to see cost estimates</p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter your dimensions to see results</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Supporting Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>How to Use This Calculator</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Step 1: Choose Your Shape</h4>
                <p className="text-sm text-muted-foreground">
                  Select rectangular for garden beds, walkways, or square areas. Choose circular for round planters or
                  tree rings.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Step 2: Enter Dimensions</h4>
                <p className="text-sm text-muted-foreground">
                  Measure your area carefully and enter the dimensions. The calculator supports feet, inches, and
                  meters.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">Step 3: Set Depth & Material</h4>
                <p className="text-sm text-muted-foreground">
                  Choose your material type and desired depth. See the recommended depths in the tips section.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Application Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Recommended Depths:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Topsoil: 2-4 inches for lawn repair, 6+ inches for new gardens</li>
                  <li>• Mulch: 2-3 inches (never exceed 4 inches)</li>
                  <li>• Compost: 1-2 inches as amendment, 3-4 inches as mulch</li>
                  <li>• Sand: 1-2 inches for leveling, 4-6 inches for drainage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Why Use a Waste Factor:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Accounts for settling and compaction</li>
                  <li>• Covers measurement variations</li>
                  <li>• Ensures you have enough material to complete the job</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
