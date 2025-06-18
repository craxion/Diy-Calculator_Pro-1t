import type { Metadata } from "next"
import AreaConverterClient from "@/components/calculators/area-converter-client"

export const metadata: Metadata = {
  title: "Area Converter Calculator | Convert Square Feet, Acres, Hectares & More | DIYCalculatorPro",
  description:
    "Professional area converter for construction, landscaping, and real estate. Instantly convert between square feet, acres, hectares, square meters, and all major area units. Perfect for contractors, landscapers, and property professionals.",
  keywords: [
    "area converter",
    "square feet calculator",
    "acres to hectares",
    "square meters converter",
    "land area calculator",
    "construction area calculator",
    "landscaping area calculator",
    "property area converter",
    "real estate calculator",
    "area measurement tool",
  ],
  openGraph: {
    title: "Area Converter Calculator - Convert All Area Units Instantly",
    description:
      "Professional area converter for construction, landscaping, and real estate. Convert between square feet, acres, hectares, square meters, and more.",
    type: "website",
  },
}

export default function AreaConverterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Area Converter Calculator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert between all major area units instantly. Perfect for construction projects, landscaping, real estate,
            and property management. Get accurate conversions between square feet, acres, hectares, square meters, and
            more.
          </p>
        </div>

        <AreaConverterClient />
      </div>
    </div>
  )
}
