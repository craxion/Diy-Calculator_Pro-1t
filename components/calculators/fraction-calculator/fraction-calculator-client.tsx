"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Trash2, PlusCircle, AlertCircle, CalculatorIcon } from "lucide-react"
import type { MeasurementInput, Operator, FractionPrecision } from "./types"
import { formatResultToImperial, calculateAll, gcd } from "./utils"

const initialInput: MeasurementInput = {
  id: Date.now().toString(),
  feet: "",
  inches: "",
  fraction: "",
  operator: "+",
}

export default function FractionCalculatorClient() {
  const [inputs, setInputs] = useState<MeasurementInput[]>([
    { ...initialInput, id: `initial-${Date.now()}-1` },
    { ...initialInput, id: `initial-${Date.now()}-2`, operator: "+" },
  ])
  const [result, setResult] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [fractionPrecision, setFractionPrecision] = useState<FractionPrecision>("1/16")

  const handleInputChange = (
    id: string,
    field: keyof Omit<MeasurementInput, "id" | "operator" | "nextOperator">,
    value: string,
  ) => {
    setInputs(inputs.map((input) => (input.id === id ? { ...input, [field]: value } : input)))
  }

  const handleOperatorChange = (id: string, value: Operator) => {
    setInputs(
      inputs.map((input, index) => {
        if (input.id === id && index < inputs.length - 1) {
          // Operator is for the *next* input
          return { ...input, operator: value }
        }
        return input
      }),
    )
  }

  const addMeasurement = () => {
    const newId = `input-${Date.now()}-${inputs.length}`
    if (inputs.length > 0) {
      // Ensure the last input has an operator if it's not the very last one being added
      const lastInput = inputs[inputs.length - 1]
      if (!lastInput.operator && inputs.length >= 1) {
        setInputs([
          ...inputs.slice(0, -1),
          { ...lastInput, operator: "+" },
          { ...initialInput, id: newId, operator: "+" },
        ])
        return
      }
    }
    setInputs([...inputs, { ...initialInput, id: newId, operator: "+" }])
  }

  const removeMeasurement = (id: string) => {
    if (inputs.length <= 1) {
      // Keep at least one input row
      setError("Cannot remove the last input row. Please clear values if needed.")
      setTimeout(() => setError(null), 3000)
      return
    }
    setInputs(inputs.filter((input) => input.id !== id))
  }

  useEffect(() => {
    setError(null)
    try {
      const calculatedResult = calculateAll(inputs)
      setResult(calculatedResult)
    } catch (e: any) {
      setError(e.message || "Calculation error")
      setResult(null)
    }
  }, [inputs])

  const formattedResult = result !== null ? formatResultToImperial(result, fractionPrecision) : null

  const resultInTotalInchesDecimal = result !== null ? result.toFixed(6) : "-"
  const resultInTotalFeetDecimal = result !== null ? (result / 12).toFixed(6) : "-"
  const resultInMeters = result !== null ? (result * 0.0254).toFixed(4) : "-"
  const resultInCentimeters = result !== null ? (result * 2.54).toFixed(2) : "-"
  const resultInMillimeters = result !== null ? (result * 25.4).toFixed(1) : "-"

  const resultInTotalInchesFraction =
    result !== null
      ? (() => {
          const totalInches = Math.floor(result)
          const remainder = result - totalInches
          if (remainder === 0) return `${totalInches}"`
          const precisionVal = Number.parseInt(fractionPrecision.split("/")[1])
          const numerator = Math.round(remainder * precisionVal)
          if (numerator === 0) return `${totalInches}"`
          const commonDivisor = gcd(numerator, precisionVal)
          return `${totalInches} ${numerator / commonDivisor}/${precisionVal / commonDivisor}"`
        })()
      : "-"

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-8 shadow-lg">
        <CardHeader>
          <div className="flex items-center gap-3">
            <CalculatorIcon className="h-8 w-8 text-primary-navy" />
            <CardTitle className="text-3xl font-bold text-primary-navy">
              Construction & Woodworking Fraction Calculator
            </CardTitle>
          </div>
          <CardDescription className="text-lg text-medium-grey">
            Perform arithmetic (add, subtract, multiply, divide) on imperial measurements involving feet, inches, and
            complex fractions.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column: Inputs */}
        <div className="space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Enter Measurements</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {inputs.map((input, index) => (
                <div key={input.id} className="space-y-3">
                  <Card className="p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <Input
                        type="number"
                        placeholder="ft"
                        value={input.feet}
                        onChange={(e) => handleInputChange(input.id, "feet", e.target.value)}
                        aria-label={`Feet for input ${index + 1}`}
                      />
                      <Input
                        type="number"
                        placeholder="in"
                        value={input.inches}
                        onChange={(e) => handleInputChange(input.id, "inches", e.target.value)}
                        aria-label={`Inches for input ${index + 1}`}
                      />
                      <Input
                        type="text"
                        placeholder="e.g., 3/8"
                        value={input.fraction}
                        onChange={(e) => handleInputChange(input.id, "fraction", e.target.value)}
                        aria-label={`Fraction for input ${index + 1}`}
                      />
                    </div>
                    {inputs.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMeasurement(input.id)}
                        className="text-red-500 hover:text-red-700 float-right"
                      >
                        <Trash2 className="h-4 w-4 mr-1" /> Remove
                      </Button>
                    )}
                  </Card>
                  {index < inputs.length - 1 && (
                    <div className="flex justify-center">
                      <Select
                        value={input.operator}
                        onValueChange={(value: Operator) => handleOperatorChange(input.id, value)}
                      >
                        <SelectTrigger className="w-[80px] h-12 text-xl font-bold">
                          <SelectValue placeholder="Operator" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="+">+</SelectItem>
                          <SelectItem value="-">-</SelectItem>
                          <SelectItem value="*">×</SelectItem>
                          <SelectItem value="/">÷</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ))}
              <Button onClick={addMeasurement} className="w-full">
                <PlusCircle className="h-4 w-4 mr-2" /> Add Measurement
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Results */}
        <div className="sticky top-8 space-y-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle>Calculation Results</CardTitle>
              <div className="flex items-center gap-2 pt-2">
                <label htmlFor="fractionPrecision" className="text-sm font-medium">
                  Fraction Precision:
                </label>
                <Select
                  value={fractionPrecision}
                  onValueChange={(value: FractionPrecision) => setFractionPrecision(value)}
                >
                  <SelectTrigger id="fractionPrecision" className="w-[120px]">
                    <SelectValue placeholder="Precision" />
                  </SelectTrigger>
                  <SelectContent>
                    {["1/2", "1/4", "1/8", "1/16", "1/32", "1/64"].map((p) => (
                      <SelectItem key={p} value={p as FractionPrecision}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="text-center mb-6">
                <p className="text-sm text-medium-grey">Primary Result</p>
                <p className="text-4xl font-bold text-primary-navy dark:text-sky-400">{formattedResult || "-"}</p>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Format</TableHead>
                    <TableHead className="text-right">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Total Inches (Fraction)</TableCell>
                    <TableCell className="text-right font-mono">{resultInTotalInchesFraction}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Inches (Decimal)</TableCell>
                    <TableCell className="text-right font-mono">{resultInTotalInchesDecimal}"</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Feet (Decimal)</TableCell>
                    <TableCell className="text-right font-mono">{resultInTotalFeetDecimal}'</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Metric (Meters)</TableCell>
                    <TableCell className="text-right font-mono">{resultInMeters} m</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Metric (Centimeters)</TableCell>
                    <TableCell className="text-right font-mono">{resultInCentimeters} cm</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Metric (Millimeters)</TableCell>
                    <TableCell className="text-right font-mono">{resultInMillimeters} mm</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Supporting Content */}
      <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Why a Fraction Calculator is Essential</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-medium-grey">
              Prevents common, costly errors in carpentry, framing, and pipefitting. Ensures accuracy for cuts, layouts,
              and material estimation, saving time and resources.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Practical Use Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-medium-grey">
              <li>Centering a shelf: (Opening Width - Shelf Width) / 2</li>
              <li>Equal spacing for fence posts or balusters.</li>
              <li>Summing off-cuts for required lengths.</li>
              <li>Calculating precise material needs for projects.</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tape Measure Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-medium-grey">
              Standard imperial tape measures are typically marked in 1/16th inch increments. Larger lines indicate
              1/8", 1/4", and 1/2". Always "measure twice, cut once" for best results.
            </p>
            {/* Consider adding an SVG of a tape measure segment here later */}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
