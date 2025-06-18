import FractionCalculatorClient from "@/components/calculators/fraction-calculator/fraction-calculator-client"
import type { Metadata } from "next"

// The canonical URL points to the "Conversions & Math" version as the primary one
const canonicalUrl = "/calculators/conversions-and-math/fraction-calculator"

export const metadata: Metadata = {
  title: "Construction & Woodworking Fraction Calculator | Construction & Building",
  description:
    "Perform arithmetic (add, subtract, multiply, divide) on imperial measurements involving feet, inches, and complex fractions. Essential tool for construction, framing, and woodworking projects.",
  keywords: [
    "fraction calculator",
    "construction calculator",
    "building math",
    "imperial measurement",
    "feet inches fraction",
    "woodworking calculator",
    "framing calculator",
  ],
  alternates: {
    canonical: canonicalUrl,
  },
}

export default function FractionCalculatorPage() {
  return (
    <>
      <FractionCalculatorClient />
    </>
  )
}
