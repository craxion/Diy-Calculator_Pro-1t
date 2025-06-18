"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Calculator, Lightbulb, Shield, Palette } from "lucide-react"
import { ResinDiagram } from "./resin-diagram"
import {
  calculateResinVolume,
  convertVolume,
  formatVolume,
  calculateMixRatio,
  calculateKitsNeeded,
  type VolumeUnit,
  type PourShape,
  type MixRatio,
  type WasteFactor,
} from "./utils"

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

export function ResinAndEpoxyCalculatorClient() {
  const [inputs, setInputs] = useState<CalculationInputs>({
    shape: "rectangle",
    length: 12,
    width: 8,
    diameter: 10,
    depth: 0.25,
    lengthUnit: "inches",
    widthUnit: "inches",
    diameterUnit: "inches",
    depthUnit: "inches",
    wasteFactor: 10,
    mixRatio: "1:1",
    pricePerKit: 0,
    kitVolume: 32,
    kitVolumeUnit: "fl_oz",
  })

  const [results, setResults] = useState({
    totalVolume: 0,
    partAVolume: 0,
    partBVolume: 0,
    kitsNeeded: 0,
    totalCost: 0,
  })

  useEffect(() => {
    // Calculate base volume
    const baseVolume = calculateResinVolume(inputs)

    // Apply waste factor
    const totalVolume = baseVolume * (1 + inputs.wasteFactor / 100)

    // Calculate mix ratios
    const { partA, partB } = calculateMixRatio(totalVolume, inputs.mixRatio)

    // Calculate kits needed
    const kitVolumeInFlOz = convertVolume(inputs.kitVolume, inputs.kitVolumeUnit, "fl_oz")
    const kitsNeeded = calculateKitsNeeded(totalVolume, kitVolumeInFlOz)

    // Calculate total cost
    const totalCost = inputs.pricePerKit > 0 ? kitsNeeded * inputs.pricePerKit : 0

    setResults({
      totalVolume,
      partAVolume: partA,
      partBVolume: partB,
      kitsNeeded,
      totalCost,
    })
  }, [inputs])

  const updateInput = (key: keyof CalculationInputs, value: any) => {
    setInputs((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="container py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="p-3 bg-primary-orange/10 rounded-lg">
            <Palette className="h-8 w-8 text-primary-orange" />
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-dark-grey">Resin and Epoxy Calculator</h1>
        </div>
        <p className="text-lg md:text-xl text-medium-grey max-w-3xl mx-auto">
          Calculate precise resin and hardener amounts for casting, coating, and craft projects. Get accurate
          measurements with waste factor and cost estimation.
        </p>
      </div>

      {/* Main Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs */}
        <div className="space-y-6">
          {/* Pour Dimensions Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary-orange" />
                <span>Pour Dimensions</span>
              </CardTitle>
              <CardDescription>Define the shape and size of your resin pour</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Shape Selection */}
              <div className="space-y-2">
                <Label htmlFor="shape">Pour Shape</Label>
                <Select value={inputs.shape} onValueChange={(value: PourShape) => updateInput("shape", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rectangle">Rectangle</SelectItem>
                    <SelectItem value="circle">Circle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Conditional Dimension Inputs */}
              {inputs.shape === "rectangle" ? (
                <>
                  {/* Length */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="length">Length</Label>
                      <Input
                        id="length"
                        type="number"
                        step="0.01"
                        min="0"
                        value={inputs.length || ""}
                        onChange={(e) => updateInput("length", Number.parseFloat(e.target.value) || 0)}
                        placeholder="Enter length"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="length-unit">Unit</Label>
                      <Select
                        value={inputs.lengthUnit}
                        onValueChange={(value: VolumeUnit) => updateInput("lengthUnit", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inches">Inches</SelectItem>
                          <SelectItem value="cm">Centimeters</SelectItem>
                          <SelectItem value="mm">Millimeters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Width */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width</Label>
                      <Input
                        id="width"
                        type="number"
                        step="0.01"
                        min="0"
                        value={inputs.width || ""}
                        onChange={(e) => updateInput("width", Number.parseFloat(e.target.value) || 0)}
                        placeholder="Enter width"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="width-unit">Unit</Label>
                      <Select
                        value={inputs.widthUnit}
                        onValueChange={(value: VolumeUnit) => updateInput("widthUnit", value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="inches">Inches</SelectItem>
                          <SelectItem value="cm">Centimeters</SelectItem>
                          <SelectItem value="mm">Millimeters</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              ) : (
                /* Diameter for Circle */
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="diameter">Diameter</Label>
                    <Input
                      id="diameter"
                      type="number"
                      step="0.01"
                      min="0"
                      value={inputs.diameter || ""}
                      onChange={(e) => updateInput("diameter", Number.parseFloat(e.target.value) || 0)}
                      placeholder="Enter diameter"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="diameter-unit">Unit</Label>
                    <Select
                      value={inputs.diameterUnit}
                      onValueChange={(value: VolumeUnit) => updateInput("diameterUnit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="inches">Inches</SelectItem>
                        <SelectItem value="cm">Centimeters</SelectItem>
                        <SelectItem value="mm">Millimeters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Depth */}
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="depth">Pour Depth</Label>
                  <Input
                    id="depth"
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputs.depth || ""}
                    onChange={(e) => updateInput("depth", Number.parseFloat(e.target.value) || 0)}
                    placeholder="Enter depth"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="depth-unit">Unit</Label>
                  <Select
                    value={inputs.depthUnit}
                    onValueChange={(value: VolumeUnit) => updateInput("depthUnit", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inches">Inches</SelectItem>
                      <SelectItem value="cm">Centimeters</SelectItem>
                      <SelectItem value="mm">Millimeters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Product and Cost Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Product and Cost Details</CardTitle>
              <CardDescription>Configure mix ratio, waste factor, and cost estimation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Waste Factor */}
              <div className="space-y-2">
                <Label htmlFor="waste-factor">Overage/Waste Factor</Label>
                <Select
                  value={inputs.wasteFactor.toString()}
                  onValueChange={(value) => updateInput("wasteFactor", Number.parseInt(value) as WasteFactor)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5% - Minimal waste</SelectItem>
                    <SelectItem value="10">10% - Recommended</SelectItem>
                    <SelectItem value="15">15% - Extra safety margin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Mix Ratio */}
              <div className="space-y-3">
                <Label>Mix Ratio (Resin : Hardener)</Label>
                <RadioGroup
                  value={inputs.mixRatio}
                  onValueChange={(value: MixRatio) => updateInput("mixRatio", value)}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="1:1" id="ratio-1-1" />
                    <Label htmlFor="ratio-1-1">1:1 (Equal parts)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="2:1" id="ratio-2-1" />
                    <Label htmlFor="ratio-2-1">2:1 (2 parts resin, 1 part hardener)</Label>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              {/* Cost Estimation */}
              <div className="space-y-4">
                <h4 className="font-medium text-dark-grey">Cost Estimation (Optional)</h4>

                <div className="space-y-2">
                  <Label htmlFor="price-per-kit">Price per Kit ($)</Label>
                  <Input
                    id="price-per-kit"
                    type="number"
                    step="0.01"
                    min="0"
                    value={inputs.pricePerKit || ""}
                    onChange={(e) => updateInput("pricePerKit", Number.parseFloat(e.target.value) || 0)}
                    placeholder="Enter kit price"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor="kit-volume">Kit Volume</Label>
                    <Input
                      id="kit-volume"
                      type="number"
                      step="0.01"
                      min="0"
                      value={inputs.kitVolume || ""}
                      onChange={(e) => updateInput("kitVolume", Number.parseFloat(e.target.value) || 0)}
                      placeholder="Enter volume"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kit-volume-unit">Unit</Label>
                    <Select
                      value={inputs.kitVolumeUnit}
                      onValueChange={(value: VolumeUnit) => updateInput("kitVolumeUnit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fl_oz">Fluid Ounces</SelectItem>
                        <SelectItem value="liters">Liters</SelectItem>
                        <SelectItem value="gallons">Gallons</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Results and Diagram */}
        <div className="space-y-6">
          {/* Visual Diagram */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Diagram</CardTitle>
              <CardDescription>Your pour shape with dimensions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResinDiagram inputs={inputs} />
            </CardContent>
          </Card>

          {/* Results Card */}
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calculator className="h-5 w-5 text-primary-orange" />
                <span>Calculation Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Primary Result */}
              <div className="text-center p-4 bg-primary-orange/5 rounded-lg border border-primary-orange/20">
                <div className="text-sm text-medium-grey mb-1">Total Mixed Resin Needed</div>
                <div className="text-2xl font-bold text-dark-grey">
                  {formatVolume(results.totalVolume, "fl_oz")} /{" "}
                  {formatVolume(convertVolume(results.totalVolume, "fl_oz", "ml"), "ml")}
                </div>
              </div>

              {/* Breakdown Table */}
              <div>
                <h4 className="font-medium text-dark-grey mb-3">Mix Breakdown</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Component</TableHead>
                      <TableHead className="text-right">Volume</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Part A (Resin)</TableCell>
                      <TableCell className="text-right">{formatVolume(results.partAVolume, "fl_oz")}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Part B (Hardener)</TableCell>
                      <TableCell className="text-right">{formatVolume(results.partBVolume, "fl_oz")}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              {/* Purchase Summary */}
              {inputs.kitVolume > 0 && (
                <div>
                  <h4 className="font-medium text-dark-grey mb-3">Purchase Summary</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-medium-grey">Kits to Buy:</span>
                      <span className="font-medium">{results.kitsNeeded}</span>
                    </div>
                    {inputs.pricePerKit > 0 && (
                      <div className="flex justify-between">
                        <span className="text-medium-grey">Total Estimated Cost:</span>
                        <span className="font-medium text-primary-orange">${results.totalCost.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="text-xs text-medium-grey space-y-1">
                <div>• Includes {inputs.wasteFactor}% waste factor</div>
                <div>• Mix ratio: {inputs.mixRatio}</div>
                <div>• Always follow manufacturer's instructions</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Supporting Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        {/* How to Use */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calculator className="h-5 w-5 text-primary-orange" />
              <span>How to Use the Calculator</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-2 text-sm text-medium-grey">
              <li>1. Select your pour shape (rectangle or circle)</li>
              <li>2. Enter the dimensions with appropriate units</li>
              <li>3. Choose your waste factor (10% recommended)</li>
              <li>4. Select the correct mix ratio for your product</li>
              <li>5. Optionally add kit size and price for cost estimation</li>
              <li>6. Review the calculated amounts and purchase summary</li>
            </ol>
          </CardContent>
        </Card>

        {/* Pro Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-primary-orange" />
              <span>Pro Mixing Tips</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-medium-grey">
              <li>• Mix slowly to avoid introducing air bubbles</li>
              <li>• Scrape sides and bottom of mixing container thoroughly</li>
              <li>• Pay attention to the product's working time</li>
              <li>• Use a scale for most accurate measurements</li>
              <li>• Pre-warm resin if working in cold conditions</li>
              <li>• Have all tools ready before you start mixing</li>
            </ul>
          </CardContent>
        </Card>

        {/* Safety */}
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            <strong>Safety First:</strong> Always work in a well-ventilated area and wear appropriate PPE including
            nitrile gloves, safety glasses, and a respirator when recommended. Read all product safety data sheets
            before use.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
