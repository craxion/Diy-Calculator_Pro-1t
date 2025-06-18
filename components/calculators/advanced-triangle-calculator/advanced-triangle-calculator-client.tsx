"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { Triangle, AlertCircle, Ruler, Sigma, Maximize } from "lucide-react"
import { TriangleSVG } from "./triangle-svg"
import type { KnownInputType, TriangleProperties, TriangleInputValues, Unit } from "./types"
import { calculateTriangleProperties, getTriangleType, UNIT_CONVERSIONS, DEFAULT_SIDE_UNIT } from "./utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const inputModes: { value: KnownInputType; label: string; fields: (keyof TriangleInputValues)[] }[] = [
  { value: "SSS", label: "SSS (Side-Side-Side)", fields: ["sideA", "sideB", "sideC"] },
  { value: "SAS", label: "SAS (Side-Angle-Side)", fields: ["sideA", "angleB", "sideC"] },
  { value: "ASA", label: "ASA (Angle-Side-Angle)", fields: ["angleA", "sideC", "angleB"] },
  { value: "AAS", label: "AAS (Angle-Angle-Side)", fields: ["angleA", "angleB", "sideA"] },
]

const initialInputValues: TriangleInputValues = {
  sideA: "",
  sideB: "",
  sideC: "",
  angleA: "",
  angleB: "",
  angleC: "",
}

export function AdvancedTriangleCalculatorClient() {
  const [knownInputType, setKnownInputType] = useState<KnownInputType>("SSS")
  const [inputValues, setInputValues] = useState<TriangleInputValues>(initialInputValues)
  const [sideUnit, setSideUnit] = useState<Unit>(DEFAULT_SIDE_UNIT)
  const [results, setResults] = useState<TriangleProperties | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activeFields = useMemo(
    () => inputModes.find((mode) => mode.value === knownInputType)?.fields || [],
    [knownInputType],
  )

  useEffect(() => {
    // Reset irrelevant input fields when mode changes
    const newValues = { ...initialInputValues }
    activeFields.forEach((field) => {
      if (inputValues[field] !== undefined) {
        // Keep existing values if field is still active
        newValues[field] = inputValues[field]
      }
    })
    setInputValues(newValues)
    setResults(null)
    setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knownInputType]) // activeFields dependency removed as it's derived from knownInputType

  useEffect(() => {
    const currentInputMode = inputModes.find((mode) => mode.value === knownInputType)
    if (!currentInputMode) return

    const numericInputs: Partial<Record<keyof TriangleInputValues, number>> = {}
    let allFieldsFilled = true

    for (const field of currentInputMode.fields) {
      const value = inputValues[field]
      if (value === "" || value === null || isNaN(Number.parseFloat(value as string))) {
        allFieldsFilled = false
        break
      }
      numericInputs[field] = Number.parseFloat(value as string)
    }

    if (!allFieldsFilled) {
      setResults(null)
      setError(null) // Clear error if not all fields are filled yet
      return
    }

    try {
      const calculatedProps = calculateTriangleProperties(knownInputType, numericInputs, sideUnit)
      setResults(calculatedProps)
      setError(null)
    } catch (e: any) {
      setResults(null)
      setError(e.message || "Invalid input for triangle calculation.")
    }
  }, [inputValues, knownInputType, sideUnit])

  const handleInputChange = (field: keyof TriangleInputValues, value: string) => {
    setInputValues((prev) => ({ ...prev, [field]: value }))
  }

  const renderInputField = (field: keyof TriangleInputValues, label: string, tooltip: string) => {
    const isAngleField = field.startsWith("angle")
    return (
      <div key={field} className="space-y-1">
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Label htmlFor={field} className="cursor-help">
                {label} {isAngleField ? "(degrees)" : `(${sideUnit})`}
              </Label>
            </TooltipTrigger>
            <TooltipContent>
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Input
          id={field}
          type="number"
          value={inputValues[field] ?? ""}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={isAngleField ? "e.g., 60" : "e.g., 10"}
          min="0"
          step="any"
          className="dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>
    )
  }

  const displayValue = (value: number | undefined, precision = 2) => {
    if (value === undefined || isNaN(value)) return "N/A"
    // Use toLocaleString for better formatting and to avoid excessive trailing zeros from toFixed
    const factor = Math.pow(10, precision)
    const rounded = Math.round(value * factor) / factor
    return rounded.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: precision })
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-start">
      {/* Left Column: Inputs */}
      <Card className="shadow-lg dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold flex items-center gap-2">
            <Ruler className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            Known Values
          </CardTitle>
          <CardDescription>Select what you know and enter the values.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="knownInputType">What do you know?</Label>
            <Select value={knownInputType} onValueChange={(value) => setKnownInputType(value as KnownInputType)}>
              <SelectTrigger id="knownInputType" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                <SelectValue placeholder="Select input type" />
              </SelectTrigger>
              <SelectContent>
                {inputModes.map((mode) => (
                  <SelectItem key={mode.value} value={mode.value}>
                    {mode.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="sideUnit">Unit for Sides</Label>
            <Select value={sideUnit} onValueChange={(value) => setSideUnit(value as Unit)}>
              <SelectTrigger id="sideUnit" className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(UNIT_CONVERSIONS).map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit.charAt(0).toUpperCase() + unit.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {activeFields.includes("sideA") && renderInputField("sideA", "Side a", "Length of side opposite Angle A.")}
            {activeFields.includes("sideB") && renderInputField("sideB", "Side b", "Length of side opposite Angle B.")}
            {activeFields.includes("sideC") && renderInputField("sideC", "Side c", "Length of side opposite Angle C.")}
            {activeFields.includes("angleA") &&
              renderInputField("angleA", "Angle A", "Measure of angle A, opposite Side a.")}
            {activeFields.includes("angleB") &&
              renderInputField("angleB", "Angle B", "Measure of angle B, opposite Side b.")}
            {activeFields.includes("angleC") &&
              renderInputField("angleC", "Angle C", "Measure of angle C, opposite Side c.")}
          </div>
        </CardContent>
      </Card>

      {/* Right Column: Diagram & Results */}
      <div className="space-y-8">
        <Card className="shadow-lg sticky top-8 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <Triangle className="w-6 h-6 text-green-600 dark:text-green-400" />
              Triangle Diagram & Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="aspect-[4/3] bg-gray-50 dark:bg-gray-700 rounded-md mb-6 flex items-center justify-center p-4 overflow-hidden">
              <TriangleSVG properties={results} unit={sideUnit} />
            </div>
            {results && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Primary Properties:</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Side a</TableCell>
                      <TableCell>
                        {displayValue(results.sides.a)} {sideUnit}
                      </TableCell>
                      <TableCell className="font-medium">Angle A</TableCell>
                      <TableCell>{displayValue(results.angles.A)}°</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Side b</TableCell>
                      <TableCell>
                        {displayValue(results.sides.b)} {sideUnit}
                      </TableCell>
                      <TableCell className="font-medium">Angle B</TableCell>
                      <TableCell>{displayValue(results.angles.B)}°</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Side c</TableCell>
                      <TableCell>
                        {displayValue(results.sides.c)} {sideUnit}
                      </TableCell>
                      <TableCell className="font-medium">Angle C</TableCell>
                      <TableCell>{displayValue(results.angles.C)}°</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6">Calculated Properties:</h3>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium flex items-center gap-1">
                        <Sigma className="w-4 h-4" />
                        Perimeter
                      </TableCell>
                      <TableCell>
                        {displayValue(results.perimeter)} {sideUnit}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium flex items-center gap-1">
                        <Maximize className="w-4 h-4" />
                        Area
                      </TableCell>
                      <TableCell>
                        {displayValue(results.area)} {sideUnit}²
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Type</TableCell>
                      <TableCell>{getTriangleType(results.sides, results.angles)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Height to Side a (hₐ)</TableCell>
                      <TableCell>
                        {displayValue(results.heights.ha)} {sideUnit}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Height to Side b (hᵦ)</TableCell>
                      <TableCell>
                        {displayValue(results.heights.hb)} {sideUnit}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Height to Side c (h꜀)</TableCell>
                      <TableCell>
                        {displayValue(results.heights.hc)} {sideUnit}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
            {!results && !error && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                Enter valid triangle data to see the results and diagram.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
