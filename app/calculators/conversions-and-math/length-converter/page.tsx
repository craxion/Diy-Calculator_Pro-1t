import type { Metadata } from "next"
import LengthConverterClient from "@/components/calculators/length-converter-client"

export const metadata: Metadata = {
  title: "Length Converter Calculator | DIY Calculator Pro",
  description:
    "Convert between Imperial and Metric length units instantly. Features real-time conversion, construction-friendly tape measure format, and practical comparisons for DIY projects.",
  keywords:
    "length converter, imperial metric conversion, feet inches converter, construction measurements, DIY calculator",
}

export default function LengthConverterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Length Converter Calculator</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Convert any length measurement between Imperial and Metric units instantly. Perfect for construction,
            woodworking, and DIY projects with real-time results and construction-friendly tape measure format.
          </p>
        </div>

        <LengthConverterClient />
      </div>
    </div>
  )
}
