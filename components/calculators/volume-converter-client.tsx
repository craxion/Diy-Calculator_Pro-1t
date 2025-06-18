"use client"

import { useState, useEffect, useMemo } from "react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectLabel,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Droplet,
  FlaskConical,
  Scale,
  Calculator,
  Beer,
  Milk,
  Syringe,
  Pipette,
  BarcodeIcon as Barrel,
  BathIcon as Bathtub,
  Globe,
  Info,
  ShowerHeadIcon as SwimmingPool,
} from "lucide-react"

// Define the conversion rates to Liters (base unit)
const conversionRatesToLiters: { [key: string]: number } = {
  // Construction Volume
  cubic_inches: 0.0163871,
  cubic_feet: 28.3168,
  cubic_yards: 764.555,

  // US Liquid Volume
  us_fluid_ounces: 0.0295735,
  us_cups: 0.236588,
  us_pints: 0.473176,
  us_quarts: 0.946353,
  us_gallons: 3.78541,

  // Imperial Liquid Volume
  imperial_fluid_ounces: 0.0284131,
  imperial_pints: 0.568261,
  imperial_quarts: 1.13652,
  imperial_gallons: 4.54609,

  // Metric Volume
  milliliters: 0.001,
  liters: 1, // Base unit
  cubic_meters: 1000,
}

// Define display names for units
const unitDisplayNames: { [key: string]: string } = {
  cubic_inches: "Cubic Inches",
  cubic_feet: "Cubic Feet",
  cubic_yards: "Cubic Yards",
  us_fluid_ounces: "US Fluid Ounces",
  us_cups: "US Cups",
  us_pints: "US Pints",
  us_quarts: "US Quarts",
  us_gallons: "US Gallons",
  imperial_fluid_ounces: "Imperial Fluid Ounces",
  imperial_pints: "Imperial Pints",
  imperial_quarts: "Imperial Quarts",
  imperial_gallons: "Imperial Gallons",
  milliliters: "Milliliters",
  liters: "Liters",
  cubic_meters: "Cubic Meters",
}

// Helper function to convert a value from its unit to Liters
const convertToLiters = (value: number, unit: string): number => {
  if (isNaN(value) || !conversionRatesToLiters[unit]) {
    return 0
  }
  return value * conversionRatesToLiters[unit]
}

// Helper function to convert Liters to a target unit
const convertFromLiters = (liters: number, targetUnit: string): number => {
  if (isNaN(liters) || !conversionRatesToLiters[targetUnit]) {
    return 0
  }
  return liters / conversionRatesToLiters[targetUnit]
}

interface VolumeInputState {
  value: string
  unit: string
}

export function VolumeConverterClient() {
  const [input, setInput] = useState<VolumeInputState>({
    value: "1",
    unit: "us_gallons",
  })

  const [convertedVolumes, setConvertedVolumes] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const inputValue = Number.parseFloat(input.value)
    if (isNaN(inputValue) || inputValue < 0) {
      setConvertedVolumes({})
      return
    }

    const liters = convertToLiters(inputValue, input.unit)

    const results: { [key: string]: number } = {}
    for (const unitKey in conversionRatesToLiters) {
      results[unitKey] = convertFromLiters(liters, unitKey)
    }
    setConvertedVolumes(results)
  }, [input])

  const formatNumber = (num: number): string => {
    if (isNaN(num) || !isFinite(num)) {
      return "N/A"
    }
    // Use toPrecision for very small or very large numbers, otherwise toFixed
    if (Math.abs(num) < 0.001 && num !== 0) {
      return num.toPrecision(3)
    }
    return num.toFixed(4).replace(/\.?0+$/, "") // Remove trailing zeros
  }

  const commonObjectComparisons = useMemo(() => {
    const liters = convertToLiters(Number.parseFloat(input.value), input.unit)
    if (isNaN(liters) || liters <= 0) {
      return []
    }

    const comparisons = []

    // Average bathtub volume: 150-200 Liters. Let's use 170L for a standard bathtub.
    const bathtubs = liters / 170
    if (bathtubs >= 0.01) {
      comparisons.push({
        text: `${formatNumber(bathtubs)} standard bathtubs`,
        icon: <Bathtub className="h-5 w-5 text-gray-500" />,
      })
    }

    // 55-gallon drum (US): 55 US gallons * 3.78541 L/gallon = 208.19755 L
    const fiftyFiveGallonDrums = liters / (55 * 3.78541)
    if (fiftyFiveGallonDrums >= 0.01) {
      comparisons.push({
        text: `${formatNumber(fiftyFiveGallonDrums)} 55-gallon drums`,
        icon: <Barrel className="h-5 w-5 text-gray-500" />,
      })
    }

    // Standard soda can: 355 ml = 0.355 L
    const sodaCans = liters / 0.355
    if (sodaCans >= 0.1) {
      comparisons.push({
        text: `${formatNumber(sodaCans)} cans of soda`,
        icon: <Beer className="h-5 w-5 text-gray-500" />,
      })
    }

    // Olympic swimming pool: 2,500,000 Liters
    const olympicPools = liters / 2500000
    if (olympicPools >= 0.000001) {
      comparisons.push({
        text: `${formatNumber(olympicPools)} Olympic swimming pools`,
        icon: <SwimmingPool className="h-5 w-5 text-gray-500" />,
      })
    }

    // Teaspoon: 4.92892 mL = 0.00492892 L
    const teaspoons = liters / 0.00492892
    if (teaspoons >= 1) {
      comparisons.push({
        text: `${formatNumber(teaspoons)} teaspoons`,
        icon: <Syringe className="h-5 w-5 text-gray-500" />,
      })
    }

    // Tablespoon: 14.7868 mL = 0.0147868 L
    const tablespoons = liters / 0.0147868
    if (tablespoons >= 1) {
      comparisons.push({
        text: `${formatNumber(tablespoons)} tablespoons`,
        icon: <Pipette className="h-5 w-5 text-gray-500" />,
      })
    }

    // Milk carton (1 liter)
    const milkCartons = liters / 1
    if (milkCartons >= 0.1) {
      comparisons.push({
        text: `${formatNumber(milkCartons)} 1-liter milk cartons`,
        icon: <Milk className="h-5 w-5 text-gray-500" />,
      })
    }

    return comparisons
  }, [input])

  return (
    <div className="space-y-8">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-center">Enter Your Volume</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Input
              type="number"
              value={input.value}
              onChange={(e) => setInput({ ...input, value: e.target.value })}
              placeholder="Enter volume"
              className="flex-1 text-lg p-3"
              aria-label="Volume input value"
            />
            <Select value={input.unit} onValueChange={(value) => setInput({ ...input, unit: value })}>
              <SelectTrigger className="w-full sm:w-[200px] text-lg p-3">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Construction Volume</SelectLabel>
                  <SelectItem value="cubic_inches">Cubic Inches</SelectItem>
                  <SelectItem value="cubic_feet">Cubic Feet</SelectItem>
                  <SelectItem value="cubic_yards">Cubic Yards</SelectItem>
                </SelectGroup>
                <Separator className="my-2" />
                <SelectGroup>
                  <SelectLabel>US Liquid Volume</SelectLabel>
                  <SelectItem value="us_fluid_ounces">US Fluid Ounces</SelectItem>
                  <SelectItem value="us_cups">US Cups</SelectItem>
                  <SelectItem value="us_pints">US Pints</SelectItem>
                  <SelectItem value="us_quarts">US Quarts</SelectItem>
                  <SelectItem value="us_gallons">US Gallons</SelectItem>
                </SelectGroup>
                <Separator className="my-2" />
                <SelectGroup>
                  <SelectLabel>Imperial Liquid Volume</SelectLabel>
                  <SelectItem value="imperial_fluid_ounces">Imperial Fluid Ounces</SelectItem>
                  <SelectItem value="imperial_pints">Imperial Pints</SelectItem>
                  <SelectItem value="imperial_quarts">Imperial Quarts</SelectItem>
                  <SelectItem value="imperial_gallons">Imperial Gallons</SelectItem>
                </SelectGroup>
                <Separator className="my-2" />
                <SelectGroup>
                  <SelectLabel>Metric Volume</SelectLabel>
                  <SelectItem value="milliliters">Milliliters</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="cubic_meters">Cubic Meters</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Construction Volume */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              {/* Placeholder for Construction Volume icon */}
              Construction Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Cubic Inches:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.cubic_inches || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Cubic Feet:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.cubic_feet || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Cubic Yards:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.cubic_yards || 0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* US Liquid Volume */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Droplet className="h-6 w-6 text-blue-600" />
              US Liquid Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">US Fluid Ounces:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.us_fluid_ounces || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">US Cups:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.us_cups || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">US Pints:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.us_pints || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">US Quarts:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.us_quarts || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">US Gallons:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.us_gallons || 0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Imperial Liquid Volume */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Globe className="h-6 w-6 text-purple-600" />
              Imperial Liquid Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Imperial Fluid Ounces:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.imperial_fluid_ounces || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Imperial Pints:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.imperial_pints || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Imperial Quarts:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.imperial_quarts || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Imperial Gallons:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.imperial_gallons || 0)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Metric Volume */}
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <FlaskConical className="h-6 w-6 text-green-600" />
              Metric Volume
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Milliliters:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.milliliters || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Liters:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.liters || 0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Cubic Meters:</span>
              <span className="font-medium text-lg">{formatNumber(convertedVolumes.cubic_meters || 0)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supporting Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Scale className="h-6 w-6 text-orange-500" />
              Common Object Volume Comparison
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {commonObjectComparisons.length > 0 ? (
              commonObjectComparisons.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-700">
                  {item.icon}
                  <span>{item.text}</span>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Enter a positive volume to see comparisons.</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Info className="h-6 w-6 text-cyan-600" />
              US vs. Imperial Gallons: What&apos;s the Difference?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              It&apos;s crucial to note that a US gallon is not the same as an Imperial (UK) gallon.
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>**1 US Gallon** is defined as 231 cubic inches, approximately **3.785 Liters**.</li>
              <li>**1 Imperial Gallon** is defined as 10 pounds of water at 62°F, approximately **4.546 Liters**.</li>
            </ul>
            <p className="text-gray-700 mt-2">
              This means an Imperial gallon is about 20% larger than a US gallon (1 US gal ≈ 0.83 Imp gal). Always
              double-check which gallon standard is being used for your project!
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Calculator className="h-6 w-6 text-indigo-500" />
              Volume in Your Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              Understanding volume is essential for many DIY and home improvement tasks. This converter can help you
              with:
            </p>
            <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
              <li>
                **Concrete and Excavation:** The &apos;Cubic Yards&apos; measurement is directly used in our{" "}
                <a
                  href="/calculators/construction-and-building/concrete-slab-calculator"
                  className="text-blue-600 hover:underline"
                >
                  Concrete Slab Calculator
                </a>{" "}
                and{" "}
                <a
                  href="/calculators/construction-and-building/excavation-volume-and-cost-calculator"
                  className="text-blue-600 hover:underline"
                >
                  Excavation Volume and Cost Calculator
                </a>{" "}
                to determine material needs.
              </li>
              <li>
                **Landscaping:** Calculate soil, mulch, or gravel quantities using &apos;Cubic Yards&apos; with our{" "}
                <a
                  href="/calculators/landscaping-and-outdoor/soil-and-mulch-calculator"
                  className="text-blue-600 hover:underline"
                >
                  Soil and Mulch Calculator
                </a>
                .
              </li>
              <li>
                **Painting:** Estimate paint requirements in &apos;Gallons&apos; or &apos;Liters&apos; for your projects
                using our{" "}
                <a
                  href="/calculators/painting-and-finishing/paint-project-calculator"
                  className="text-blue-600 hover:underline"
                >
                  Paint Project Calculator
                </a>
                .
              </li>
              <li>
                **Liquid Mixing:** Convert between various liquid units like &apos;Milliliters&apos;,
                &apos;Liters&apos;, and &apos;Fluid Ounces&apos; for precise mixing ratios in our{" "}
                <a
                  href="/calculators/household-solutions-and-mixing/chemical-and-liquid-dilution-calculator"
                  className="text-blue-600 hover:underline"
                >
                  Chemical and Liquid Dilution Calculator
                </a>
                .
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
