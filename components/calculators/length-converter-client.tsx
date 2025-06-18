"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Ruler, Globe, History, Lightbulb } from "lucide-react"

interface ConversionState {
  value: string
  unit: string
}

interface ConversionResults {
  // Imperial
  inches: number
  feet: number
  yards: number
  miles: number
  tapemeasure: string
  // Metric
  millimeters: number
  centimeters: number
  meters: number
  kilometers: number
}

// Conversion factors to meters (base unit)
const CONVERSION_TO_METERS = {
  // Imperial
  inches: 0.0254,
  feet: 0.3048,
  yards: 0.9144,
  miles: 1609.344,
  // Metric
  millimeters: 0.001,
  centimeters: 0.01,
  meters: 1,
  kilometers: 1000,
}

// Conversion factors from meters
const CONVERSION_FROM_METERS = {
  // Imperial
  inches: 39.3701,
  feet: 3.28084,
  yards: 1.09361,
  miles: 0.000621371,
  // Metric
  millimeters: 1000,
  centimeters: 100,
  meters: 1,
  kilometers: 0.001,
}

// Utility function to convert decimal inches to fraction
function decimalToFraction(decimal: number, precision = 16): string {
  if (decimal === 0) return "0"

  const wholePart = Math.floor(decimal)
  const fractionalPart = decimal - wholePart

  if (fractionalPart === 0) return wholePart.toString()

  // Find the closest fraction
  let bestNumerator = 0
  let bestDenominator = 1
  let bestError = Math.abs(fractionalPart)

  for (let denominator = 2; denominator <= precision; denominator++) {
    const numerator = Math.round(fractionalPart * denominator)
    const error = Math.abs(fractionalPart - numerator / denominator)

    if (error < bestError) {
      bestError = error
      bestNumerator = numerator
      bestDenominator = denominator
    }
  }

  // Simplify the fraction
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
  const divisor = gcd(bestNumerator, bestDenominator)
  bestNumerator /= divisor
  bestDenominator /= divisor

  if (bestNumerator === 0) return wholePart.toString()
  if (bestNumerator === bestDenominator) return (wholePart + 1).toString()

  const fractionPart = `${bestNumerator}/${bestDenominator}`
  return wholePart > 0 ? `${wholePart} ${fractionPart}` : fractionPart
}

// Convert to tape measure format (feet, inches, fraction)
function toTapeMeasure(totalInches: number): string {
  if (totalInches === 0) return '0"'

  const feet = Math.floor(totalInches / 12)
  const remainingInches = totalInches % 12
  const wholeInches = Math.floor(remainingInches)
  const fractionalInches = remainingInches - wholeInches

  let result = ""

  if (feet > 0) {
    result += `${feet}'`
  }

  if (wholeInches > 0 || fractionalInches > 0) {
    if (feet > 0) result += " "

    if (fractionalInches > 0.001) {
      const fractionStr = decimalToFraction(fractionalInches, 32)
      if (wholeInches > 0) {
        result += `${wholeInches} ${fractionStr}"`
      } else {
        result += `${fractionStr}"`
      }
    } else {
      result += `${wholeInches}"`
    }
  }

  return result || '0"'
}

// Get object comparisons based on length
function getObjectComparisons(meters: number) {
  const comparisons = []

  if (meters < 0.001) return ["Smaller than a grain of rice"]

  // Common objects with their approximate lengths in meters
  const objects = [
    { name: "credit card", length: 0.0856, unit: "credit cards" },
    { name: "smartphone", length: 0.15, unit: "smartphones" },
    { name: "standard ruler", length: 0.3048, unit: "rulers" },
    { name: "baseball bat", length: 0.86, unit: "baseball bats" },
    { name: "standard door height", length: 2.03, unit: "door heights" },
    { name: "king-size bed", length: 2.03, unit: "king-size beds" },
    { name: "parking space", length: 5.5, unit: "parking spaces" },
    { name: "school bus", length: 12, unit: "school buses" },
    { name: "basketball court", length: 28.7, unit: "basketball courts" },
    { name: "football field", length: 109.7, unit: "football fields" },
  ]

  for (const obj of objects) {
    const ratio = meters / obj.length
    if (ratio >= 0.5 && ratio <= 10) {
      if (ratio < 1) {
        comparisons.push(`About ${Math.round(ratio * 100)}% the length of a ${obj.name}`)
      } else {
        const count = Math.round(ratio)
        comparisons.push(`About ${count} ${obj.unit} laid end-to-end`)
      }
    }
  }

  return comparisons.length > 0 ? comparisons.slice(0, 3) : ["A unique measurement!"]
}

export default function LengthConverterClient() {
  const [input, setInput] = useState<ConversionState>({ value: "10", unit: "feet" })
  const [results, setResults] = useState<ConversionResults | null>(null)
  const [comparisons, setComparisons] = useState<string[]>([])

  useEffect(() => {
    const numericValue = Number.parseFloat(input.value)

    if (isNaN(numericValue) || numericValue < 0) {
      setResults(null)
      setComparisons([])
      return
    }

    // Convert input to meters (base unit)
    const metersValue = numericValue * CONVERSION_TO_METERS[input.unit as keyof typeof CONVERSION_TO_METERS]

    // Convert from meters to all other units
    const newResults: ConversionResults = {
      inches: metersValue * CONVERSION_FROM_METERS.inches,
      feet: metersValue * CONVERSION_FROM_METERS.feet,
      yards: metersValue * CONVERSION_FROM_METERS.yards,
      miles: metersValue * CONVERSION_FROM_METERS.miles,
      tapemaster: toTapeMeasure(metersValue * CONVERSION_FROM_METERS.inches),
      millimeters: metersValue * CONVERSION_FROM_METERS.millimeters,
      centimeters: metersValue * CONVERSION_FROM_METERS.centimeters,
      meters: metersValue,
      kilometers: metersValue * CONVERSION_FROM_METERS.kilometers,
    }

    setResults(newResults)
    setComparisons(getObjectComparisons(metersValue))
  }, [input])

  const formatNumber = (num: number, decimals = 2): string => {
    if (num === 0) return "0"
    if (num < 0.01 && num > 0) return num.toExponential(2)
    if (num > 1000000) return num.toExponential(2)
    return num.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: decimals,
    })
  }

  return (
    <div className="space-y-8">
      {/* Primary Input Section */}
      <Card className="border-2 border-blue-200 shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl flex items-center justify-center gap-2">
            <Ruler className="h-6 w-6 text-blue-600" />
            Enter Your Measurement
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-end justify-center max-w-md mx-auto">
            <div className="flex-1">
              <Label htmlFor="length-value" className="text-sm font-medium">
                Value
              </Label>
              <Input
                id="length-value"
                type="number"
                value={input.value}
                onChange={(e) => setInput((prev) => ({ ...prev, value: e.target.value }))}
                placeholder="Enter length"
                className="text-lg text-center"
                min="0"
                step="any"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="length-unit" className="text-sm font-medium">
                Unit
              </Label>
              <Select value={input.unit} onValueChange={(value) => setInput((prev) => ({ ...prev, unit: value }))}>
                <SelectTrigger id="length-unit" className="text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inches">Inches</SelectItem>
                  <SelectItem value="feet">Feet</SelectItem>
                  <SelectItem value="yards">Yards</SelectItem>
                  <SelectItem value="miles">Miles</SelectItem>
                  <SelectItem value="millimeters">Millimeters</SelectItem>
                  <SelectItem value="centimeters">Centimeters</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="kilometers">Kilometers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          {/* Imperial System Results */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Badge variant="outline" className="text-lg px-3 py-1">
                Imperial System
              </Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Tape Measure - Featured Card */}
              <Card className="border-2 border-orange-200 bg-orange-50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Ruler className="h-5 w-5 text-orange-600" />
                    Tape Measure Format
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-orange-700">{results.tapemaster}</div>
                  <p className="text-sm text-orange-600 mt-1">Construction Standard</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Inches</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{formatNumber(results.inches)} in</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Feet</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{formatNumber(results.feet)} ft</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Yards</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{formatNumber(results.yards)} yd</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Miles</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{formatNumber(results.miles, 6)} mi</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Metric System Results */}
          <div>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Badge variant="outline" className="text-lg px-3 py-1">
                Metric System
              </Badge>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Millimeters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{formatNumber(results.millimeters)} mm</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Centimeters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{formatNumber(results.centimeters)} cm</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Meters</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{formatNumber(results.meters)} m</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Kilometers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-semibold">{formatNumber(results.kilometers, 6)} km</div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Supporting Content */}
          <Separator className="my-8" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Object Comparisons */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <Globe className="h-5 w-5" />
                  Size Comparison
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {comparisons.map((comparison, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                      <p className="text-green-700">{comparison}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Practical Applications */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  <Lightbulb className="h-5 w-5" />
                  Practical Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-blue-700">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Converting metric product specifications for US projects</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Scaling architectural drawings and blueprints</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p>Material ordering and space planning</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p>International collaboration on construction projects</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* History of Measurement */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <History className="h-5 w-5" />
                History of Measurement Systems
              </CardTitle>
            </CardHeader>
            <CardContent className="text-purple-700">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-2">Imperial System</h4>
                  <p className="text-sm">
                    Developed from ancient Roman and Anglo-Saxon units, the Imperial system is based on human body parts
                    and everyday objects. An "inch" comes from the Latin "uncia" (1/12), a "foot" from the human foot,
                    and a "yard" from the distance between a person's nose and outstretched arm.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Metric System</h4>
                  <p className="text-sm">
                    Created during the French Revolution in 1799, the metric system is based on natural constants. The
                    meter was originally defined as one ten-millionth of the distance from the equator to the North
                    Pole, making it a universal standard independent of human variation.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
