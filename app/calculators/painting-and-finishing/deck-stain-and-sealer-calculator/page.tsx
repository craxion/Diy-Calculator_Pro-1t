"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Paintbrush, Calculator, Info, CheckCircle, AlertTriangle } from "lucide-react"

// Types
interface DeckCalculation {
  deckArea: number
  railingArea: number
  spindleArea: number
  stairArea: number
  totalArea: number
  gallonsNeeded: number
  totalCost: number
}

export default function DeckStainCalculatorPage() {
  // State for inputs
  const [deckShape, setDeckShape] = useState<"rectangle" | "l-shape">("rectangle")
  const [deckLength, setDeckLength] = useState<string>("20")
  const [deckWidth, setDeckWidth] = useState<string>("12")
  const [sectionALength, setSectionALength] = useState<string>("20")
  const [sectionAWidth, setSectionAWidth] = useState<string>("12")
  const [sectionBLength, setSectionBLength] = useState<string>("10")
  const [sectionBWidth, setSectionBWidth] = useState<string>("8")
  const [deckUnit, setDeckUnit] = useState<"feet" | "meters">("feet")

  const [railingLength, setRailingLength] = useState<string>("64")
  const [railingUnit, setRailingUnit] = useState<"feet" | "meters">("feet")
  const [spindleType, setSpindleType] = useState<string>("standard")
  const [spindlesPerFoot, setSpindlesPerFoot] = useState<string>("3")
  const [spindleHeight, setSpindleHeight] = useState<string>("36")
  const [spindleUnit, setSpindleUnit] = useState<"inches" | "cm">("inches")

  const [numSteps, setNumSteps] = useState<string>("5")
  const [stairWidth, setStairWidth] = useState<string>("4")
  const [stairUnit, setStairUnit] = useState<"feet" | "meters">("feet")
  const [includeStringers, setIncludeStringers] = useState<boolean>(true)

  const [woodCondition, setWoodCondition] = useState<"new" | "old">("new")
  const [transparency, setTransparency] = useState<"transparent" | "semi-transparent" | "solid">("semi-transparent")
  const [coveragePerGallon, setCoveragePerGallon] = useState<string>("250")
  const [numCoats, setNumCoats] = useState<string>("2")
  const [pricePerGallon, setPricePerGallon] = useState<string>("")

  // State for calculations
  const [calculation, setCalculation] = useState<DeckCalculation>({
    deckArea: 0,
    railingArea: 0,
    spindleArea: 0,
    stairArea: 0,
    totalArea: 0,
    gallonsNeeded: 0,
    totalCost: 0,
  })

  // Helper function to convert units to feet
  const convertToFeet = (value: number, unit: string): number => {
    if (unit === "meters") return value * 3.28084
    if (unit === "inches") return value / 12
    if (unit === "cm") return value / 30.48
    return value
  }

  // Update coverage based on wood condition and transparency
  useEffect(() => {
    let defaultCoverage = 250

    if (woodCondition === "old") {
      defaultCoverage = transparency === "transparent" ? 150 : transparency === "semi-transparent" ? 175 : 200
    } else {
      defaultCoverage = transparency === "transparent" ? 300 : transparency === "semi-transparent" ? 250 : 225
    }

    setCoveragePerGallon(defaultCoverage.toString())
  }, [woodCondition, transparency])

  // Calculate deck stain requirements
  useEffect(() => {
    const calculate = (): DeckCalculation => {
      // Convert all measurements to feet
      const deckLengthFt = convertToFeet(Number.parseFloat(deckLength) || 0, deckUnit)
      const deckWidthFt = convertToFeet(Number.parseFloat(deckWidth) || 0, deckUnit)
      const sectionALengthFt = convertToFeet(Number.parseFloat(sectionALength) || 0, deckUnit)
      const sectionAWidthFt = convertToFeet(Number.parseFloat(sectionAWidth) || 0, deckUnit)
      const sectionBLengthFt = convertToFeet(Number.parseFloat(sectionBLength) || 0, deckUnit)
      const sectionBWidthFt = convertToFeet(Number.parseFloat(sectionBWidth) || 0, deckUnit)
      const railingLengthFt = convertToFeet(Number.parseFloat(railingLength) || 0, railingUnit)
      const spindleHeightFt = convertToFeet(Number.parseFloat(spindleHeight) || 0, spindleUnit)
      const stairWidthFt = convertToFeet(Number.parseFloat(stairWidth) || 0, stairUnit)

      // Calculate deck area
      let deckArea = 0
      if (deckShape === "rectangle") {
        deckArea = deckLengthFt * deckWidthFt
      } else {
        deckArea = sectionALengthFt * sectionAWidthFt + sectionBLengthFt * sectionBWidthFt
      }

      // Calculate railing area (top, bottom, and sides of rails)
      const railWidth = 0.5 // Assume 6" wide rails
      const railingArea = railingLengthFt * railWidth * 4 // 4 surfaces per rail

      // Calculate spindle area
      let spindleArea = 0
      if (spindleType !== "none") {
        const totalSpindles = railingLengthFt * (Number.parseFloat(spindlesPerFoot) || 0)
        const spindlePerimeter = spindleType === "standard" ? (1.5 * 4) / 12 : (2 * 4) / 12 // Convert inches to feet
        spindleArea = totalSpindles * spindleHeightFt * spindlePerimeter
      }

      // Calculate stair area
      let stairArea = 0
      const steps = Number.parseFloat(numSteps) || 0
      if (steps > 0) {
        const stepDepth = 11 / 12 // 11 inches converted to feet
        const treadArea = steps * stairWidthFt * stepDepth
        const stringerArea = includeStringers ? steps * 1 * 2 : 0 // 2 stringers, 1 ft height each
        stairArea = treadArea + stringerArea
      }

      // Calculate totals
      const totalArea = deckArea + railingArea + spindleArea + stairArea
      const coverage = Number.parseFloat(coveragePerGallon) || 250
      const coats = Number.parseFloat(numCoats) || 1
      const gallonsNeeded = Math.ceil((totalArea * coats) / coverage)
      const price = Number.parseFloat(pricePerGallon) || 0
      const totalCost = gallonsNeeded * price

      return {
        deckArea,
        railingArea,
        spindleArea,
        stairArea,
        totalArea,
        gallonsNeeded,
        totalCost,
      }
    }

    setCalculation(calculate())
  }, [
    deckShape,
    deckLength,
    deckWidth,
    sectionALength,
    sectionAWidth,
    sectionBLength,
    sectionBWidth,
    deckUnit,
    railingLength,
    railingUnit,
    spindleType,
    spindlesPerFoot,
    spindleHeight,
    spindleUnit,
    numSteps,
    stairWidth,
    stairUnit,
    includeStringers,
    woodCondition,
    transparency,
    coveragePerGallon,
    numCoats,
    pricePerGallon,
  ])

  // SVG Diagram Component
  const DeckDiagram = () => (
    <div className="w-full h-64 bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
      <svg width="280" height="200" viewBox="0 0 280 200" className="text-gray-600">
        {deckShape === "rectangle" ? (
          <>
            <rect x="40" y="40" width="200" height="120" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="140" y="35" textAnchor="middle" className="text-sm font-medium">
              {deckLength}' × {deckWidth}'
            </text>
            <text x="140" y="105" textAnchor="middle" className="text-xs">
              Deck Surface
            </text>
            {/* Railing representation */}
            <rect
              x="35"
              y="35"
              width="210"
              height="130"
              fill="none"
              stroke="orange"
              strokeWidth="1"
              strokeDasharray="3,3"
            />
            <text x="140" y="180" textAnchor="middle" className="text-xs text-orange-600">
              Railings: {railingLength}'
            </text>
          </>
        ) : (
          <>
            {/* L-Shape representation */}
            <rect x="40" y="40" width="120" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
            <rect x="160" y="80" width="80" height="80" fill="none" stroke="currentColor" strokeWidth="2" />
            <text x="100" y="35" textAnchor="middle" className="text-xs font-medium">
              A: {sectionALength}' × {sectionAWidth}'
            </text>
            <text x="200" y="75" textAnchor="middle" className="text-xs font-medium">
              B: {sectionBLength}' × {sectionBWidth}'
            </text>
            <text x="140" y="180" textAnchor="middle" className="text-xs">
              L-Shaped Deck
            </text>
          </>
        )}
      </svg>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Paintbrush className="h-8 w-8 text-orange-600" />
            <h1 className="text-4xl font-bold text-gray-900">Deck Stain & Sealer Calculator</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Calculate the exact amount of stain or sealer needed for your deck, including railings, spindles, and
            stairs. Get professional results with precise measurements.
          </p>
        </div>

        {/* Main Calculator */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Main Deck Surface */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Main Deck Dimensions
                </CardTitle>
                <CardDescription>
                  Enter your deck's shape and dimensions for accurate surface area calculation.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deck-shape">Deck Shape</Label>
                  <Select value={deckShape} onValueChange={(value: "rectangle" | "l-shape") => setDeckShape(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rectangle">Rectangle</SelectItem>
                      <SelectItem value="l-shape">L-Shape</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {deckShape === "rectangle" ? (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="deck-length">Deck Length</Label>
                      <div className="flex gap-2">
                        <Input
                          id="deck-length"
                          type="number"
                          value={deckLength}
                          onChange={(e) => setDeckLength(e.target.value)}
                          placeholder="20"
                        />
                        <Select value={deckUnit} onValueChange={(value: "feet" | "meters") => setDeckUnit(value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feet">ft</SelectItem>
                            <SelectItem value="meters">m</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="deck-width">Deck Width</Label>
                      <div className="flex gap-2">
                        <Input
                          id="deck-width"
                          type="number"
                          value={deckWidth}
                          onChange={(e) => setDeckWidth(e.target.value)}
                          placeholder="12"
                        />
                        <Select value={deckUnit} onValueChange={(value: "feet" | "meters") => setDeckUnit(value)}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="feet">ft</SelectItem>
                            <SelectItem value="meters">m</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="section-a-length">Section A Length</Label>
                        <Input
                          id="section-a-length"
                          type="number"
                          value={sectionALength}
                          onChange={(e) => setSectionALength(e.target.value)}
                          placeholder="20"
                        />
                      </div>
                      <div>
                        <Label htmlFor="section-a-width">Section A Width</Label>
                        <Input
                          id="section-a-width"
                          type="number"
                          value={sectionAWidth}
                          onChange={(e) => setSectionAWidth(e.target.value)}
                          placeholder="12"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="section-b-length">Section B Length</Label>
                        <Input
                          id="section-b-length"
                          type="number"
                          value={sectionBLength}
                          onChange={(e) => setSectionBLength(e.target.value)}
                          placeholder="10"
                        />
                      </div>
                      <div>
                        <Label htmlFor="section-b-width">Section B Width</Label>
                        <Input
                          id="section-b-width"
                          type="number"
                          value={sectionBWidth}
                          onChange={(e) => setSectionBWidth(e.target.value)}
                          placeholder="8"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Railings and Spindles */}
            <Card>
              <CardHeader>
                <CardTitle>Railings & Spindles</CardTitle>
                <CardDescription>
                  Accurately include railings and spindles, as they add significant surface area.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="railing-length">Total Railing Length</Label>
                  <div className="flex gap-2">
                    <Input
                      id="railing-length"
                      type="number"
                      value={railingLength}
                      onChange={(e) => setRailingLength(e.target.value)}
                      placeholder="64"
                    />
                    <Select value={railingUnit} onValueChange={(value: "feet" | "meters") => setRailingUnit(value)}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">ft</SelectItem>
                        <SelectItem value="meters">m</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="spindle-type">Spindle/Bannister Type</Label>
                  <Select value={spindleType} onValueChange={setSpindleType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard 2x2 Spindles</SelectItem>
                      <SelectItem value="decorative">Flat/Decorative Spindles</SelectItem>
                      <SelectItem value="none">No Spindles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {spindleType !== "none" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="spindles-per-foot">Spindles per Foot</Label>
                        <Input
                          id="spindles-per-foot"
                          type="number"
                          value={spindlesPerFoot}
                          onChange={(e) => setSpindlesPerFoot(e.target.value)}
                          placeholder="3"
                        />
                      </div>
                      <div>
                        <Label htmlFor="spindle-height">Height of Spindles</Label>
                        <div className="flex gap-2">
                          <Input
                            id="spindle-height"
                            type="number"
                            value={spindleHeight}
                            onChange={(e) => setSpindleHeight(e.target.value)}
                            placeholder="36"
                          />
                          <Select value={spindleUnit} onValueChange={(value: "inches" | "cm") => setSpindleUnit(value)}>
                            <SelectTrigger className="w-20">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="inches">in</SelectItem>
                              <SelectItem value="cm">cm</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Stairs and Additional Structures */}
            <Card>
              <CardHeader>
                <CardTitle>Stairs & Extras</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="num-steps">Number of Stair Steps</Label>
                    <Input
                      id="num-steps"
                      type="number"
                      value={numSteps}
                      onChange={(e) => setNumSteps(e.target.value)}
                      placeholder="5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stair-width">Width of Stairs</Label>
                    <div className="flex gap-2">
                      <Input
                        id="stair-width"
                        type="number"
                        value={stairWidth}
                        onChange={(e) => setStairWidth(e.target.value)}
                        placeholder="4"
                      />
                      <Select value={stairUnit} onValueChange={(value: "feet" | "meters") => setStairUnit(value)}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="feet">ft</SelectItem>
                          <SelectItem value="meters">m</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="include-stringers" checked={includeStringers} onCheckedChange={setIncludeStringers} />
                  <Label htmlFor="include-stringers">Include stair sides (stringers)?</Label>
                </div>
              </CardContent>
            </Card>

            {/* Product & Application Details */}
            <Card>
              <CardHeader>
                <CardTitle>Stain & Application Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="text-base font-medium">Wood Condition</Label>
                  <RadioGroup
                    value={woodCondition}
                    onValueChange={(value: "new" | "old") => setWoodCondition(value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="new" id="new-wood" />
                      <Label htmlFor="new-wood">New, Smooth Wood</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="old" id="old-wood" />
                      <Label htmlFor="old-wood">Old, Porous Wood</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div>
                  <Label className="text-base font-medium">Product Transparency</Label>
                  <RadioGroup
                    value={transparency}
                    onValueChange={(value: "transparent" | "semi-transparent" | "solid") => setTransparency(value)}
                    className="mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transparent" id="transparent" />
                      <Label htmlFor="transparent">Transparent/Toner</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="semi-transparent" id="semi-transparent" />
                      <Label htmlFor="semi-transparent">Semi-Transparent</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="solid" id="solid" />
                      <Label htmlFor="solid">Solid Color Stain</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="coverage">Coverage per Gallon (sq ft)</Label>
                    <Input
                      id="coverage"
                      type="number"
                      value={coveragePerGallon}
                      onChange={(e) => setCoveragePerGallon(e.target.value)}
                      placeholder="250"
                    />
                  </div>
                  <div>
                    <Label htmlFor="num-coats">Number of Coats</Label>
                    <Select value={numCoats} onValueChange={setNumCoats}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Coat</SelectItem>
                        <SelectItem value="2">2 Coats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="price">Price per Gallon ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    value={pricePerGallon}
                    onChange={(e) => setPricePerGallon(e.target.value)}
                    placeholder="45.00"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Deck Diagram */}
            <Card>
              <CardHeader>
                <CardTitle>Deck Layout</CardTitle>
              </CardHeader>
              <CardContent>
                <DeckDiagram />
              </CardContent>
            </Card>

            {/* Results */}
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Stain Requirements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Primary Result */}
                <div className="text-center p-6 bg-orange-50 rounded-lg border-2 border-orange-200">
                  <div className="text-3xl font-bold text-orange-800 mb-2">{calculation.gallonsNeeded} Gallons</div>
                  <div className="text-orange-600">Total Stain Needed</div>
                  {calculation.totalCost > 0 && (
                    <div className="text-lg font-semibold text-gray-700 mt-2">
                      Estimated Cost: ${calculation.totalCost.toFixed(2)}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Detailed Breakdown */}
                <div>
                  <h4 className="font-semibold mb-3">Surface Area Breakdown</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Component</TableHead>
                        <TableHead className="text-right">Area (sq ft)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Deck Surface</TableCell>
                        <TableCell className="text-right">{calculation.deckArea.toFixed(1)}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Railings</TableCell>
                        <TableCell className="text-right">{calculation.railingArea.toFixed(1)}</TableCell>
                      </TableRow>
                      {calculation.spindleArea > 0 && (
                        <TableRow>
                          <TableCell>Spindles</TableCell>
                          <TableCell className="text-right">{calculation.spindleArea.toFixed(1)}</TableCell>
                        </TableRow>
                      )}
                      {calculation.stairArea > 0 && (
                        <TableRow>
                          <TableCell>Stairs</TableCell>
                          <TableCell className="text-right">{calculation.stairArea.toFixed(1)}</TableCell>
                        </TableRow>
                      )}
                      <TableRow className="font-semibold border-t-2">
                        <TableCell>Total Stainable Area</TableCell>
                        <TableCell className="text-right">{calculation.totalArea.toFixed(1)}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Application Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Coverage per gallon:</span>
                    <span>{coveragePerGallon} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Number of coats:</span>
                    <span>{numCoats}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Wood condition:</span>
                    <span className="capitalize">{woodCondition}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Stain type:</span>
                    <span className="capitalize">{transparency.replace("-", " ")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Supporting Content */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                How to Prep a Deck for Staining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Clean the deck thoroughly with deck cleaner</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Sand rough or splintered areas smooth</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Check weather forecast - avoid rain for 24-48 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Remove all furniture and decorations</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Cover nearby plants and surfaces</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Paintbrush className="h-5 w-5 text-orange-600" />
                Choosing the Right Stain
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <Badge variant="outline" className="mb-1">
                    Transparent
                  </Badge>
                  <p className="text-gray-600">Shows wood grain, natural look, requires frequent reapplication</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    Semi-Transparent
                  </Badge>
                  <p className="text-gray-600">Some color with visible grain, good durability, most popular choice</p>
                </div>
                <div>
                  <Badge variant="outline" className="mb-1">
                    Solid Color
                  </Badge>
                  <p className="text-gray-600">Opaque coverage, hides imperfections, longest lasting protection</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Pro Application Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Work in manageable sections to avoid lap marks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Use a brush or pad applicator, not a roller</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Back-brush to work stain into wood grain</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Stain railings and spindles first, then deck boards</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span>Apply thin, even coats for best penetration</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
