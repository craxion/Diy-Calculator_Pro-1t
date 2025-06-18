import type { Metadata } from "next"
import { OhmsLawCalculatorClient } from "@/components/calculators/ohms-law-calculator/ohms-law-calculator-client"

export const metadata: Metadata = {
  title: "Ohm's Law Calculator | DIY Calculator Pro",
  description:
    "Calculate voltage, current, or resistance using Ohm's Law. Enter any two values to find the third. Perfect for electrical projects and circuit analysis.",
  keywords:
    "ohms law calculator, voltage calculator, current calculator, resistance calculator, electrical calculator, circuit analysis",
}

export default function OhmsLawCalculatorPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Ohm's Law Calculator</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Calculate voltage, current, or resistance using Ohm's Law (V = I × R). Enter any two values to automatically
            calculate the third value.
          </p>
        </div>

        <OhmsLawCalculatorClient />

        <div className="mt-12 space-y-8">
          <div className="bg-blue-50 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">About Ohm's Law</h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 mb-4">
                Ohm's Law is one of the most fundamental principles in electrical engineering and electronics. It
                describes the relationship between voltage, current, and resistance in an electrical circuit.
              </p>
              <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500 mb-4">
                <h3 className="font-semibold text-lg mb-2">The Formula:</h3>
                <p className="text-xl font-mono bg-gray-100 p-2 rounded">V = I × R</p>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>
                    <strong>V</strong> = Voltage (measured in volts)
                  </li>
                  <li>
                    <strong>I</strong> = Current (measured in amperes)
                  </li>
                  <li>
                    <strong>R</strong> = Resistance (measured in ohms)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Common Applications</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Designing electrical circuits</li>
                <li>• Calculating power consumption</li>
                <li>• Selecting appropriate resistors</li>
                <li>• Troubleshooting electrical problems</li>
                <li>• Determining wire gauge requirements</li>
                <li>• LED circuit design</li>
              </ul>
            </div>

            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Safety Tips</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Always turn off power before working on circuits</li>
                <li>• Use proper safety equipment and tools</li>
                <li>• Verify calculations before implementing</li>
                <li>• Consider safety margins in your designs</li>
                <li>• Consult a qualified electrician for complex work</li>
                <li>• Follow local electrical codes and regulations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
