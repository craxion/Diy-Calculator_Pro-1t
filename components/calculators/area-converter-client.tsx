"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectGroup,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator, Ruler, MapPin, Info, Lightbulb } from "lucide-react"

// Area unit definitions with conversion factors to square meters
const areaUnits = {
  // Imperial and US Units
  "sq-in": { name: "Square Inches", factor: 0.00064516, symbol: "in²" },
  "sq-ft": { name: "Square Feet", factor: 0.092903, symbol: "ft²" },
  "sq-yd": { name: "Square Yards", factor: 0.836127, symbol: "yd²" },
  "sq-mi": { name: "Square Miles", factor: 2589988.11, symbol: "mi²" },

  // Metric Units
  "sq-mm": { name: "Square Millimeters", factor: 0.000001, symbol: "mm²" },
  "sq-cm": { name: "Square Centimeters", factor: 0.0001, symbol: "cm²" },
  "sq-m": { name: "Square Meters", factor: 1, symbol: "m²" },
  "sq-km": { name: "Square Kilometers", factor: 1000000, symbol: "km²" },

  // Land Measurements
  acres: { name: "Acres", factor: 4046.86, symbol: "ac" },
  hectares: { name: "Hectares", factor: 10000, symbol: "ha" },
}

interface ConversionState {
  value: string
  unit: string
}

interface ConversionResults {
  [key: string]: number
}

export default function AreaConverterClient() {
  const [input, setInput] = useState<ConversionState>({ value: "1000", unit: "sq-ft" })
  const [results, setResults] = useState<ConversionResults>({})

  // Real-time conversion logic
  useEffect(() => {
    const numericValue = Number.parseFloat(input.value)

    if (isNaN(numericValue) || numericValue < 0) {
      setResults({})
      return
    }

    // Convert input to base unit (square meters)
    const inputUnit = areaUnits[input.unit as keyof typeof areaUnits]
    const baseValue = numericValue * inputUnit.factor

    // Convert from base unit to all other units
    const newResults: ConversionResults = {}
    Object.entries(areaUnits).forEach(([key, unit]) => {
      if (key !== input.unit) {
        newResults[key] = baseValue / unit.factor
      }
    })

    setResults(newResults)
  }, [input])

  // Format numbers for display
  const formatNumber = (value: number): string => {
    if (value === 0) return "0"
    if (value < 0.001) return value.toExponential(2)
    if (value < 1) return value.toFixed(6).replace(/\.?0+$/, "")
    if (value < 1000) return value.toFixed(3).replace(/\.?0+$/, "")
    if (value < 1000000) return value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    return value.toExponential(2)
  }

  // Get comparison objects based on area
  const getAreaComparisons = (sqMeters: number) => {
    const comparisons = []

    // Football fields (American football field ≈ 5,351 m²)
    const footballFields = sqMeters / 5351
    if (footballFields >= 0.01) {
      comparisons.push(`${footballFields.toFixed(2)} American football fields`)
    }

    // Two-car garages (≈ 37 m²)
    const garages = sqMeters / 37
    if (garages >= 0.1) {
      comparisons.push(`${garages.toFixed(1)} two-car garages`)
    }

    // King-size beds (≈ 4.2 m²)
    const beds = sqMeters / 4.2
    if (beds >= 0.5) {
      comparisons.push(`${beds.toFixed(0)} king-size beds`)
    }

    // Tennis courts (≈ 261 m²)
    const tennisCourts = sqMeters / 261
    if (tennisCourts >= 0.01) {
      comparisons.push(`${tennisCourts.toFixed(2)} tennis courts`)
    }

    // Basketball courts (≈ 420 m²)
    const basketballCourts = sqMeters / 420
    if (basketballCourts >= 0.01) {
      comparisons.push(`${basketballCourts.toFixed(2)} basketball courts`)
    }

    return comparisons.slice(0, 3) // Return top 3 most relevant
  }

  const inputValue = Number.parseFloat(input.value)
  const baseAreaInSqMeters =
    !isNaN(inputValue) && inputValue > 0 ? inputValue * areaUnits[input.unit as keyof typeof areaUnits].factor : 0

  return (
    <div className="space-y-8">
      {/* Primary Input Section */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-blue-900 flex items-center justify-center gap-2">
            <Calculator className="h-6 w-6" />
            Enter Your Area
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end justify-center max-w-md mx-auto">
            <div className="flex-1">
              <Label htmlFor="area-value" className="text-sm font-medium text-gray-700">
                Area Value
              </Label>
              <Input
                id="area-value"
                type="number"
                value={input.value}
                onChange={(e) => setInput((prev) => ({ ...prev, value: e.target.value }))}
                placeholder="Enter area..."
                className="text-lg font-semibold text-center"
                min="0"
                step="any"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="area-unit" className="text-sm font-medium text-gray-700">
                Unit
              </Label>
              <Select value={input.unit} onValueChange={(value) => setInput((prev) => ({ ...prev, unit: value }))}>
                <SelectTrigger id="area-unit" className="text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Imperial & US Units</SelectLabel>
                    <SelectItem value="sq-in">Square Inches (in²)</SelectItem>
                    <SelectItem value="sq-ft">Square Feet (ft²)</SelectItem>
                    <SelectItem value="sq-yd">Square Yards (yd²)</SelectItem>
                    <SelectItem value="sq-mi">Square Miles (mi²)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Metric Units</SelectLabel>
                    <SelectItem value="sq-mm">Square Millimeters (mm²)</SelectItem>
                    <SelectItem value="sq-cm">Square Centimeters (cm²)</SelectItem>
                    <SelectItem value="sq-m">Square Meters (m²)</SelectItem>
                    <SelectItem value="sq-km">Square Kilometers (km²)</SelectItem>
                  </SelectGroup>
                  <SelectGroup>
                    <SelectLabel>Land Measurements</SelectLabel>
                    <SelectItem value="acres">Acres (ac)</SelectItem>
                    <SelectItem value="hectares">Hectares (ha)</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Dashboard */}
      {Object.keys(results).length > 0 && (
        <div className="space-y-6">
          {/* Imperial and US Units */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Ruler className="h-6 w-6 text-blue-600" />
              Imperial & US Units
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["sq-in", "sq-ft", "sq-yd", "sq-mi"].map(
                (unit) =>
                  results[unit] !== undefined && (
                    <Card key={unit} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {areaUnits[unit as keyof typeof areaUnits].name}
                        </div>
                        <div className="text-2xl font-bold text-blue-900 mb-1">{formatNumber(results[unit])}</div>
                        <div className="text-sm text-gray-500">{areaUnits[unit as keyof typeof areaUnits].symbol}</div>
                      </CardContent>
                    </Card>
                  ),
              )}
            </div>
          </div>

          {/* Metric Units */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calculator className="h-6 w-6 text-green-600" />
              Metric Units
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {["sq-mm", "sq-cm", "sq-m", "sq-km"].map(
                (unit) =>
                  results[unit] !== undefined && (
                    <Card key={unit} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {areaUnits[unit as keyof typeof areaUnits].name}
                        </div>
                        <div className="text-2xl font-bold text-green-900 mb-1">{formatNumber(results[unit])}</div>
                        <div className="text-sm text-gray-500">{areaUnits[unit as keyof typeof areaUnits].symbol}</div>
                      </CardContent>
                    </Card>
                  ),
              )}
            </div>
          </div>

          {/* Land Measurements */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-6 w-6 text-orange-600" />
              Land Measurements
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["acres", "hectares"].map(
                (unit) =>
                  results[unit] !== undefined && (
                    <Card key={unit} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4 text-center">
                        <div className="text-sm font-medium text-gray-600 mb-1">
                          {areaUnits[unit as keyof typeof areaUnits].name}
                        </div>
                        <div className="text-3xl font-bold text-orange-900 mb-1">{formatNumber(results[unit])}</div>
                        <div className="text-sm text-gray-500">{areaUnits[unit as keyof typeof areaUnits].symbol}</div>
                      </CardContent>
                    </Card>
                  ),
              )}
            </div>
          </div>
        </div>
      )}

      <Separator className="my-8" />

      {/* Supporting Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Common Object Area Comparison */}
        {baseAreaInSqMeters > 0 && (
          <Card className="border-purple-200">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-purple-900 flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Size Comparison
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-3">Your area is approximately equal to:</p>
              <ul className="space-y-2">
                {getAreaComparisons(baseAreaInSqMeters).map((comparison, index) => (
                  <li key={index} className="flex items-center gap-2 text-purple-800">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    {comparison}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Understanding Area */}
        <Card className="border-indigo-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-indigo-900 flex items-center gap-2">
              <Info className="h-5 w-5" />
              Understanding Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-3">Area measures the amount of space inside a 2D shape. Common formulas:</p>
            <ul className="space-y-2 text-sm">
              <li>
                <strong>Rectangle:</strong> Length × Width
              </li>
              <li>
                <strong>Square:</strong> Side × Side
              </li>
              <li>
                <strong>Circle:</strong> π × Radius²
              </li>
              <li>
                <strong>Triangle:</strong> ½ × Base × Height
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Units Explained */}
        <Card className="border-green-200 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-green-900 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Land Measurement Units Explained
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Acre</h4>
                <p className="text-gray-700 text-sm mb-2">
                  An acre is a unit of area commonly used in the United States and other countries that use Imperial
                  measurements. One acre equals 43,560 square feet.
                </p>
                <p className="text-gray-600 text-xs">
                  Originally defined as the area that could be plowed by one ox in one day.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-green-800 mb-2">Hectare</h4>
                <p className="text-gray-700 text-sm mb-2">
                  A hectare is a metric unit of area equal to 10,000 square meters. It's commonly used worldwide for
                  measuring land area.
                </p>
                <p className="text-gray-600 text-xs">One hectare equals approximately 2.47 acres.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
