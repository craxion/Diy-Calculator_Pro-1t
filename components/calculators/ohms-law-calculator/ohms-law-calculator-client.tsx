"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Calculator, Zap, Activity, Gauge } from "lucide-react"
import type { OhmsLawInputs, OhmsLawResults } from "./types"
import { calculateOhmsLaw, formatNumber, validateInput } from "./utils"

export function OhmsLawCalculatorClient() {
  const [inputs, setInputs] = useState<OhmsLawInputs>({
    voltage: "",
    current: "",
    resistance: "",
  })

  const [results, setResults] = useState<OhmsLawResults>({
    voltage: null,
    current: null,
    resistance: null,
    power: null,
    isValid: false,
    error: null,
  })

  const [activeInputs, setActiveInputs] = useState<Set<string>>(new Set())

  useEffect(() => {
    const filledInputs = Object.entries(inputs).filter(([_, value]) => value.trim() !== "")
    const newActiveInputs = new Set(filledInputs.map(([key, _]) => key))
    setActiveInputs(newActiveInputs)

    if (filledInputs.length >= 2) {
      const calculationResults = calculateOhmsLaw(inputs)
      setResults(calculationResults)
    } else {
      setResults({
        voltage: null,
        current: null,
        resistance: null,
        power: null,
        isValid: false,
        error: null,
      })
    }
  }, [inputs])

  const handleInputChange = (field: keyof OhmsLawInputs, value: string) => {
    if (validateInput(value)) {
      setInputs((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const clearAll = () => {
    setInputs({
      voltage: "",
      current: "",
      resistance: "",
    })
    setResults({
      voltage: null,
      current: null,
      resistance: null,
      power: null,
      isValid: false,
      error: null,
    })
    setActiveInputs(new Set())
  }

  const getDisplayValue = (field: keyof OhmsLawInputs) => {
    if (inputs[field] !== "") {
      return inputs[field]
    }
    if (results.isValid && results[field] !== null) {
      return formatNumber(results[field]!)
    }
    return ""
  }

  const isInputDisabled = (field: keyof OhmsLawInputs) => {
    return activeInputs.size >= 2 && !activeInputs.has(field)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Ohm's Law Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Voltage Input */}
            <div className="space-y-2">
              <Label htmlFor="voltage" className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-yellow-500" />
                Voltage (V)
              </Label>
              <div className="relative">
                <Input
                  id="voltage"
                  type="text"
                  placeholder="Enter voltage"
                  value={getDisplayValue("voltage")}
                  onChange={(e) => handleInputChange("voltage", e.target.value)}
                  disabled={isInputDisabled("voltage")}
                  className={`pr-12 ${activeInputs.has("voltage") ? "border-blue-500 bg-blue-50" : ""} ${
                    isInputDisabled("voltage") ? "bg-gray-100" : ""
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">V</span>
              </div>
            </div>

            {/* Current Input */}
            <div className="space-y-2">
              <Label htmlFor="current" className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-500" />
                Current (I)
              </Label>
              <div className="relative">
                <Input
                  id="current"
                  type="text"
                  placeholder="Enter current"
                  value={getDisplayValue("current")}
                  onChange={(e) => handleInputChange("current", e.target.value)}
                  disabled={isInputDisabled("current")}
                  className={`pr-12 ${activeInputs.has("current") ? "border-blue-500 bg-blue-50" : ""} ${
                    isInputDisabled("current") ? "bg-gray-100" : ""
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">A</span>
              </div>
            </div>

            {/* Resistance Input */}
            <div className="space-y-2">
              <Label htmlFor="resistance" className="flex items-center gap-2">
                <Gauge className="h-4 w-4 text-green-500" />
                Resistance (R)
              </Label>
              <div className="relative">
                <Input
                  id="resistance"
                  type="text"
                  placeholder="Enter resistance"
                  value={getDisplayValue("resistance")}
                  onChange={(e) => handleInputChange("resistance", e.target.value)}
                  disabled={isInputDisabled("resistance")}
                  className={`pr-12 ${activeInputs.has("resistance") ? "border-blue-500 bg-blue-50" : ""} ${
                    isInputDisabled("resistance") ? "bg-gray-100" : ""
                  }`}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">Ω</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={clearAll} variant="outline">
              Clear All Values
            </Button>
          </div>

          {results.error && (
            <Alert variant="destructive">
              <AlertDescription>{results.error}</AlertDescription>
            </Alert>
          )}

          {results.isValid && (
            <div className="space-y-4">
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-4">Calculated Results</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-yellow-500" />
                          Voltage:
                        </span>
                        <span className="font-mono font-semibold">{formatNumber(results.voltage!)} V</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-blue-500" />
                          Current:
                        </span>
                        <span className="font-mono font-semibold">{formatNumber(results.current!)} A</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          <Gauge className="h-4 w-4 text-green-500" />
                          Resistance:
                        </span>
                        <span className="font-mono font-semibold">{formatNumber(results.resistance!)} Ω</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <div className="text-center">
                      <h4 className="font-semibold text-purple-800 mb-2">Power Consumption</h4>
                      <div className="text-2xl font-bold text-purple-900 font-mono">
                        {formatNumber(results.power!)} W
                      </div>
                      <div className="text-sm text-purple-600 mt-1">P = V × I</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">How to Use:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Enter any two known values (voltage, current, or resistance)</li>
              <li>2. The third value will be calculated automatically</li>
              <li>3. Power consumption is also calculated and displayed</li>
              <li>4. Use the "Clear All Values" button to start over</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
