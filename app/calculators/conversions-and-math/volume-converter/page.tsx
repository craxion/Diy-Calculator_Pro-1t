import type { Metadata } from "next"
import { VolumeConverterClient } from "@/components/calculators/volume-converter-client"

export const metadata: Metadata = {
  title: "Volume Converter - DIYCalculatorPro",
  description:
    "Convert volume measurements instantly across Imperial (US and UK), Metric, and common construction units. Real-time dashboard for cubic feet, gallons, liters, and more.",
}

export default function VolumeConverterPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Volume Converter</h1>
      <p className="text-center text-lg mb-12 max-w-2xl mx-auto">
        Instantly convert volume measurements across a comprehensive range of Imperial (US and UK), Metric, and common
        construction units. Enter a single value and see all conversions in real-time.
      </p>
      <VolumeConverterClient />
    </div>
  )
}
