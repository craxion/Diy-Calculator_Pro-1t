import FractionCalculatorClient from "@/components/calculators/fraction-calculator/fraction-calculator-client"
import type { Metadata } from "next"

const canonicalUrl = "/calculators/conversions-and-math/fraction-calculator"

export const metadata: Metadata = {
  title: "Construction & Woodworking Fraction Calculator | Conversions & Math",
  description:
    "Perform arithmetic (add, subtract, multiply, divide) on imperial measurements involving feet, inches, and complex fractions. Ideal for construction, woodworking, and DIY projects.",
  keywords: [
    "fraction calculator",
    "imperial calculator",
    "feet and inches calculator",
    "woodworking math",
    "construction math",
    "measurement calculator",
    "DIY calculator",
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
