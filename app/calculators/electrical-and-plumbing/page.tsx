import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Calculator, ArrowRight, Wrench } from "lucide-react"

export default function ElectricalAndPlumbingPage() {
  const calculators = [
    {
      title: "Ohms Law Calculator",
      description: "Calculate voltage, current, resistance, and power using Ohm's Law for electrical circuits.",
      href: "/calculators/electrical-and-plumbing/ohms-law-calculator",
      icon: Zap,
      features: ["Voltage calculations", "Current & resistance", "Power calculations", "Circuit analysis"],
      implemented: false,
    },
    {
      title: "Wire Gauge Calculator",
      description: "Determine the correct wire gauge for electrical installations based on amperage and distance.",
      href: "/calculators/electrical-and-plumbing/wire-gauge-calculator",
      icon: Zap,
      features: ["Wire sizing", "Voltage drop", "Distance factors", "Safety margins"],
      implemented: false,
    },
    {
      title: "Pipe Volume Calculator",
      description: "Calculate the volume of water or other fluids in pipes of various sizes and lengths.",
      href: "/calculators/electrical-and-plumbing/pipe-volume-calculator",
      icon: Wrench,
      features: ["Pipe dimensions", "Volume calculations", "Multiple pipe sizes", "Flow estimates"],
      implemented: false,
    },
    {
      title: "Tank Volume Calculator",
      description: "Calculate the volume capacity of cylindrical, rectangular, and custom-shaped tanks.",
      href: "/calculators/electrical-and-plumbing/tank-volume-calculator",
      icon: Wrench,
      features: ["Multiple tank shapes", "Capacity calculations", "Partial fill levels", "Material estimates"],
      implemented: false,
    },
  ]

  const implementedCalculators = calculators.filter((calc) => calc.implemented)
  const upcomingCalculators = calculators.filter((calc) => !calc.implemented)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Zap className="h-8 w-8 text-primary-navy" />
            <h1 className="text-4xl font-bold text-primary-navy">Electrical & Plumbing Calculators</h1>
          </div>
          <p className="text-lg text-medium-grey max-w-2xl mx-auto">
            Professional tools for electrical circuit calculations, wire sizing, plumbing volume calculations, and
            system design.
          </p>
        </div>

        {/* Available Calculators */}
        {implementedCalculators.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-primary-navy mb-6">Available Calculators</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {implementedCalculators.map((calc) => {
                const IconComponent = calc.icon
                return (
                  <Card
                    key={calc.href}
                    className="group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary-navy/20"
                  >
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-primary-navy/10 rounded-lg group-hover:bg-primary-navy/20 transition-colors">
                          <IconComponent className="h-6 w-6 text-primary-navy" />
                        </div>
                        <CardTitle className="text-xl">{calc.title}</CardTitle>
                      </div>
                      <CardDescription className="text-base">{calc.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                          {calc.features.map((feature) => (
                            <span key={feature} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                        <Link href={calc.href}>
                          <Button className="w-full group-hover:bg-primary-navy/90 transition-colors">
                            <Calculator className="h-4 w-4 mr-2" />
                            Use Calculator
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        )}

        {/* Coming Soon Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary-navy mb-6">Coming Soon</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingCalculators.map((calc) => {
              const IconComponent = calc.icon
              return (
                <Card key={calc.href} className="opacity-75 border-dashed border-2">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-gray-500" />
                      </div>
                      <CardTitle className="text-xl text-gray-700">{calc.title}</CardTitle>
                    </div>
                    <CardDescription className="text-base">{calc.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {calc.features.map((feature) => (
                          <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <Button disabled className="w-full" variant="outline">
                        <Calculator className="h-4 w-4 mr-2" />
                        Coming Soon
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Electrical Safety</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-medium-grey">
                <li>• Always turn off power at the breaker before working</li>
                <li>• Use proper wire gauges to prevent overheating</li>
                <li>• Follow local electrical codes and regulations</li>
                <li>• Consider voltage drop over long wire runs</li>
                <li>• Use GFCI protection in wet locations</li>
                <li>• Consult a licensed electrician for complex work</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Plumbing Best Practices</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-medium-grey">
                <li>• Calculate proper pipe sizes for adequate flow</li>
                <li>• Account for pressure loss in long pipe runs</li>
                <li>• Use appropriate materials for different applications</li>
                <li>• Consider thermal expansion in hot water systems</li>
                <li>• Follow local plumbing codes and standards</li>
                <li>• Plan for proper drainage and venting</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
