"use client"
import Link from "next/link"

const calculators = [
  {
    title: "Ohm's Law Calculator",
    description: "Calculate voltage, current, or resistance using Ohm's Law. Enter any two values to find the third.",
    href: "/calculators/electrical-and-plumbing/ohms-law-calculator",
    icon: "⚡",
    difficulty: "Beginner",
    category: "Electrical",
  },
]

const ElectricalAndPlumbingCalculatorsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Electrical and Plumbing Calculators</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {calculators.map((calculator, index) => (
          <Link
            key={index}
            href={calculator.href}
            className="block p-4 rounded shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <h2 className="text-lg font-semibold">{calculator.title}</h2>
            <p className="text-gray-600">{calculator.description}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-blue-500">{calculator.icon}</span>
              <span className="text-sm text-gray-500">{calculator.difficulty}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ElectricalAndPlumbingCalculatorsPage
