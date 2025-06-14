"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Trash2, Plus, PaintBucket, Calculator, DollarSign, Info } from "lucide-react"

interface Opening {
  id: string
  type: "door" | "window"
  width: number
  height: number
}

interface PaintResults {
  wallGallons: number
  ceilingGallons: number
  trimGallons: number
  primerGallons: number
  totalGallons: number
  wallArea: number
  ceilingArea: number
  paintableWallArea: number
  totalExcludedArea: number
  supplies: {
    painterTape: number
    rollerCovers: number
    dropCloths: number
  }
  costs: {
    wallPaint: number
    ceilingPaint: number
    trimPaint: number
    primer: number
    total: number
  }
}

export default function PaintProjectCalculatorPage() {
  // Room dimensions
  const [roomLength, setRoomLength] = useState<number>(12)
  const [roomWidth, setRoomWidth] = useState<number>(10)
  const [roomHeight, setRoomHeight] = useState<number>(9)
  const [dimensionUnit, setDimensionUnit] = useState<string>("feet")

  // Openings (doors and windows)
  const [openings, setOpenings] = useState<Opening[]>([
    { id: "1", type: "door", width: 3, height: 7 },
    { id: "2", type: "window", width: 4, height: 3 },
  ])

  // Paint details
  const [paintCoverage, setPaintCoverage] = useState<number>(350)
  const [wallCoats, setWallCoats] = useState<string>("2")
  const [ceilingCoats, setCeilingCoats] = useState<string>("1")
  const [trimCoats, setTrimCoats] = useState<string>("1")
  const [includePrimer, setIncludePrimer] = useState<boolean>(false)

  // Cost estimation
  const [wallPaintPrice, setWallPaintPrice] = useState<number>(45)
  const [ceilingPaintPrice, setCeilingPaintPrice] = useState<number>(40)
  const [trimPaintPrice, setTrimPaintPrice] = useState<number>(50)
  const [primerPrice, setPrimerPrice] = useState<number>(35)

  // Results
  const [results, setResults] = useState<PaintResults>({
    wallGallons: 0,
    ceilingGallons: 0,
    trimGallons: 0,
    primerGallons: 0,
    totalGallons: 0,
    wallArea: 0,
    ceilingArea: 0,
    paintableWallArea: 0,
    totalExcludedArea: 0,
    supplies: { painterTape: 0, rollerCovers: 0, dropCloths: 0 },
    costs: { wallPaint: 0, ceilingPaint: 0, trimPaint: 0, primer: 0, total: 0 },
  })

  // Convert dimensions to feet if needed
  const convertToFeet = (value: number) => {
    return dimensionUnit === "meters" ? value * 3.28084 : value
  }

  // Calculate paint requirements
  useEffect(() => {
    const lengthFt = convertToFeet(roomLength)
    const widthFt = convertToFeet(roomWidth)
    const heightFt = convertToFeet(roomHeight)

    // Calculate areas
    const wallArea = (lengthFt + widthFt) * 2 * heightFt
    const ceilingArea = lengthFt * widthFt

    // Calculate excluded area
    const totalExcludedArea = openings.reduce((total, opening) => {
      const openingWidthFt = dimensionUnit === "meters" ? opening.width * 3.28084 : opening.width
      const openingHeightFt = dimensionUnit === "meters" ? opening.height * 3.28084 : opening.height
      return total + openingWidthFt * openingHeightFt
    }, 0)

    const paintableWallArea = Math.max(0, wallArea - totalExcludedArea)

    // Calculate paint gallons
    const wallGallons = Math.ceil((paintableWallArea * Number.parseInt(wallCoats)) / paintCoverage)
    const ceilingGallons = Math.ceil((ceilingArea * Number.parseInt(ceilingCoats)) / paintCoverage)

    // Trim calculation: 1 gallon per 800 linear feet
    const trimLinearFeet = (lengthFt + widthFt) * 2
    const trimGallons = Math.ceil((trimLinearFeet * Number.parseInt(trimCoats)) / 800)

    // Primer calculation
    const primerGallons = includePrimer ? Math.ceil((paintableWallArea + ceilingArea) / paintCoverage) : 0

    const totalGallons = wallGallons + ceilingGallons + trimGallons + primerGallons

    // Calculate supplies
    const painterTape = Math.ceil(trimLinearFeet / 60) // 60 feet per roll
    const rollerCovers = 2 + (includePrimer ? 1 : 0) + (trimGallons > 0 ? 1 : 0)
    const dropCloths = Math.ceil(ceilingArea / 144) // 12x12 drop cloths

    // Calculate costs
    const wallPaintCost = wallGallons * wallPaintPrice
    const ceilingPaintCost = ceilingGallons * ceilingPaintPrice
    const trimPaintCost = trimGallons * trimPaintPrice
    const primerCost = primerGallons * primerPrice
    const totalCost = wallPaintCost + ceilingPaintCost + trimPaintCost + primerCost

    setResults({
      wallGallons,
      ceilingGallons,
      trimGallons,
      primerGallons,
      totalGallons,
      wallArea,
      ceilingArea,
      paintableWallArea,
      totalExcludedArea,
      supplies: {
        painterTape,
        rollerCovers,
        dropCloths,
      },
      costs: {
        wallPaint: wallPaintCost,
        ceilingPaint: ceilingPaintCost,
        trimPaint: trimPaintCost,
        primer: primerCost,
        total: totalCost,
      },
    })
  }, [
    roomLength,
    roomWidth,
    roomHeight,
    dimensionUnit,
    openings,
    paintCoverage,
    wallCoats,
    ceilingCoats,
    trimCoats,
    includePrimer,
    wallPaintPrice,
    ceilingPaintPrice,
    trimPaintPrice,
    primerPrice,
  ])

  const addOpening = (type: "door" | "window") => {
    const newOpening: Opening = {
      id: Date.now().toString(),
      type,
      width: type === "door" ? 3 : 4,
      height: type === "door" ? 7 : 3,
    }
    setOpenings([...openings, newOpening])
  }

  const removeOpening = (id: string) => {
    setOpenings(openings.filter((opening) => opening.id !== id))
  }

  const updateOpening = (id: string, field: "width" | "height", value: number) => {
    setOpenings(openings.map((opening) => (opening.id === id ? { ...opening, [field]: value } : opening)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PaintBucket className="h-8 w-8 text-primary-navy" />
            <h1 className="text-4xl font-bold text-primary-navy">Paint Project Calculator</h1>
          </div>
          <p className="text-lg text-medium-grey max-w-2xl mx-auto">
            Calculate the exact amount of paint needed for your room, including walls, ceiling, and trim. Get detailed
            cost estimates and supply recommendations.
          </p>
        </div>

        {/* Main Calculator Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Left Column - Inputs */}
          <div className="space-y-6">
            {/* Room Dimensions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Room Dimensions
                </CardTitle>
                <CardDescription>Enter the dimensions of your room</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="room-length">Room Length</Label>
                    <Input
                      id="room-length"
                      type="number"
                      value={roomLength}
                      onChange={(e) => setRoomLength(Number(e.target.value))}
                      min="1"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="room-width">Room Width</Label>
                    <Input
                      id="room-width"
                      type="number"
                      value={roomWidth}
                      onChange={(e) => setRoomWidth(Number(e.target.value))}
                      min="1"
                      step="0.1"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="room-height">Room Height</Label>
                    <Input
                      id="room-height"
                      type="number"
                      value={roomHeight}
                      onChange={(e) => setRoomHeight(Number(e.target.value))}
                      min="1"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="dimension-unit">Units</Label>
                    <Select value={dimensionUnit} onValueChange={setDimensionUnit}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feet">Feet</SelectItem>
                        <SelectItem value="meters">Meters</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Areas to Exclude */}
            <Card>
              <CardHeader>
                <CardTitle>Areas to Exclude</CardTitle>
                <CardDescription>
                  Subtract the area of doors and windows for a more accurate wall paint estimate.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {openings.map((opening) => (
                  <div key={opening.id} className="flex items-center gap-2 p-3 border rounded-lg">
                    <div className="flex-1 grid grid-cols-3 gap-2">
                      <div className="text-sm font-medium capitalize flex items-center">{opening.type}</div>
                      <div>
                        <Label className="text-xs">Width ({dimensionUnit === "feet" ? "ft" : "m"})</Label>
                        <Input
                          type="number"
                          value={opening.width}
                          onChange={(e) => updateOpening(opening.id, "width", Number(e.target.value))}
                          min="0.1"
                          step="0.1"
                          className="h-8"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Height ({dimensionUnit === "feet" ? "ft" : "m"})</Label>
                        <Input
                          type="number"
                          value={opening.height}
                          onChange={(e) => updateOpening(opening.id, "height", Number(e.target.value))}
                          min="0.1"
                          step="0.1"
                          className="h-8"
                        />
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeOpening(opening.id)}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => addOpening("door")} className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Door
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => addOpening("window")} className="flex-1">
                    <Plus className="h-4 w-4 mr-1" />
                    Add Window
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Paint & Surface Details */}
            <Card>
              <CardHeader>
                <CardTitle>Paint & Surface Details</CardTitle>
                <CardDescription>Configure paint coverage and number of coats</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="paint-coverage">Coverage per Gallon (sq ft)</Label>
                  <Input
                    id="paint-coverage"
                    type="number"
                    value={paintCoverage}
                    onChange={(e) => setPaintCoverage(Number(e.target.value))}
                    min="200"
                    max="500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="wall-coats">Wall Coats</Label>
                    <Select value={wallCoats} onValueChange={setWallCoats}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Coat</SelectItem>
                        <SelectItem value="2">2 Coats</SelectItem>
                        <SelectItem value="3">3 Coats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="ceiling-coats">Ceiling Coats</Label>
                    <Select value={ceilingCoats} onValueChange={setCeilingCoats}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Coat</SelectItem>
                        <SelectItem value="2">2 Coats</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="trim-coats">Trim Coats</Label>
                    <Select value={trimCoats} onValueChange={setTrimCoats}>
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
                <div className="flex items-center space-x-2">
                  <Checkbox id="include-primer" checked={includePrimer} onCheckedChange={setIncludePrimer} />
                  <Label htmlFor="include-primer">Include Primer?</Label>
                </div>
              </CardContent>
            </Card>

            {/* Cost Estimation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Estimation
                </CardTitle>
                <CardDescription>Enter paint prices for cost calculations (optional)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="wall-paint-price">Wall Paint ($/gallon)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="wall-paint-price"
                        type="number"
                        value={wallPaintPrice}
                        onChange={(e) => setWallPaintPrice(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="ceiling-paint-price">Ceiling Paint ($/gallon)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="ceiling-paint-price"
                        type="number"
                        value={ceilingPaintPrice}
                        onChange={(e) => setCeilingPaintPrice(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="trim-paint-price">Trim Paint ($/gallon)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="trim-paint-price"
                        type="number"
                        value={trimPaintPrice}
                        onChange={(e) => setTrimPaintPrice(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="primer-price">Primer ($/gallon)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="primer-price"
                        type="number"
                        value={primerPrice}
                        onChange={(e) => setPrimerPrice(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Results */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">Paint Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-primary-navy mb-2">{results.totalGallons} Gallons</div>
                  <p className="text-medium-grey">Total Paint Needed</p>
                </div>

                <Tabs defaultValue="breakdown" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="breakdown">Paint Breakdown</TabsTrigger>
                    <TabsTrigger value="supplies">Supplies</TabsTrigger>
                    <TabsTrigger value="costs">Cost Summary</TabsTrigger>
                  </TabsList>

                  <TabsContent value="breakdown" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Walls</span>
                        <span className="font-bold">{results.wallGallons} Gallons</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Ceiling</span>
                        <span className="font-bold">{results.ceilingGallons} Gallons</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium">Trim</span>
                        <span className="font-bold">{results.trimGallons} Gallons</span>
                      </div>
                      {includePrimer && (
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                          <span className="font-medium">Primer</span>
                          <span className="font-bold">{results.primerGallons} Gallons</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-4 border-t">
                      <div className="text-sm text-medium-grey space-y-1">
                        <div>Wall Area: {Math.round(results.wallArea)} sq ft</div>
                        <div>Ceiling Area: {Math.round(results.ceilingArea)} sq ft</div>
                        <div>Excluded Area: {Math.round(results.totalExcludedArea)} sq ft</div>
                        <div>Paintable Wall Area: {Math.round(results.paintableWallArea)} sq ft</div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="supplies" className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Painter's Tape</span>
                        <span className="font-bold">{results.supplies.painterTape} rolls</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Roller Covers</span>
                        <span className="font-bold">{results.supplies.rollerCovers} pieces</span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="font-medium">Drop Cloths</span>
                        <span className="font-bold">{results.supplies.dropCloths} pieces</span>
                      </div>
                    </div>
                    <div className="pt-4 border-t text-sm text-medium-grey">
                      <p>Estimates based on standard coverage and room dimensions.</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="costs" className="space-y-4">
                    <div className="space-y-3">
                      {results.costs.wallPaint > 0 && (
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <span className="font-medium">Wall Paint</span>
                          <span className="font-bold">${results.costs.wallPaint.toFixed(2)}</span>
                        </div>
                      )}
                      {results.costs.ceilingPaint > 0 && (
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <span className="font-medium">Ceiling Paint</span>
                          <span className="font-bold">${results.costs.ceilingPaint.toFixed(2)}</span>
                        </div>
                      )}
                      {results.costs.trimPaint > 0 && (
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <span className="font-medium">Trim Paint</span>
                          <span className="font-bold">${results.costs.trimPaint.toFixed(2)}</span>
                        </div>
                      )}
                      {results.costs.primer > 0 && (
                        <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                          <span className="font-medium">Primer</span>
                          <span className="font-bold">${results.costs.primer.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                    {results.costs.total > 0 && (
                      <div className="pt-4 border-t">
                        <div className="flex justify-between items-center p-4 bg-primary-navy text-white rounded-lg">
                          <span className="font-bold text-lg">Total Estimated Cost</span>
                          <span className="font-bold text-xl">${results.costs.total.toFixed(2)}</span>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Supporting Content */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                How to Use This Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Enter your room dimensions accurately</li>
                <li>Add all doors and windows to exclude their area</li>
                <li>Adjust paint coverage based on your paint specifications</li>
                <li>Select the number of coats for each surface</li>
                <li>Include primer if painting over dark colors or new surfaces</li>
                <li>Enter paint prices for cost estimation</li>
              </ol>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Painting Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li>• Always paint from top to bottom (ceiling, walls, then trim)</li>
                <li>• Use high-quality painter's tape for clean lines</li>
                <li>• Prime all surfaces when changing from dark to light colors</li>
                <li>• Buy 10-15% extra paint for touch-ups and future repairs</li>
                <li>• Use a quality brush for trim and roller for large surfaces</li>
                <li>• Remove tape while paint is still slightly wet</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Understanding Paint Finishes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <strong>Matte/Flat:</strong> Best for ceilings and low-traffic areas. Hides imperfections well.
                </div>
                <div>
                  <strong>Eggshell:</strong> Slight sheen, good for living rooms and bedrooms. Easy to clean.
                </div>
                <div>
                  <strong>Satin:</strong> Durable finish for high-traffic areas like hallways and kids' rooms.
                </div>
                <div>
                  <strong>Semi-gloss:</strong> Best for trim, doors, and bathrooms. Very durable and washable.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
