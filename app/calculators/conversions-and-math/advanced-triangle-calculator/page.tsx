import { AdvancedTriangleCalculatorClient } from "@/components/calculators/advanced-triangle-calculator/advanced-triangle-calculator-client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, HelpCircle, BookOpen } from "lucide-react"

export default function AdvancedTriangleCalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-slate-200 dark:from-gray-900 dark:to-slate-800 py-8 px-4">
      <div className="container mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 dark:text-white sm:text-5xl">
            Advanced Triangle Calculator
          </h1>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Solve for any missing sides, angles, area, perimeter, and other properties of a triangle given various known
            values.
          </p>
        </header>

        <AdvancedTriangleCalculatorClient />

        <section className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center gap-3">
              <HelpCircle className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-xl font-semibold">How to Use the Calculator</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                <strong>1. Select Known Values:</strong> Choose the set of values you know (e.g., SSS, SAS).
              </p>
              <p>
                <strong>2. Enter Values:</strong> Input the side lengths and/or angles as prompted.
              </p>
              <p>
                <strong>3. Choose Units:</strong> Select the unit for side lengths (angles are in degrees).
              </p>
              <p>
                <strong>4. View Results:</strong> The calculator will automatically display all triangle properties and
                a diagram.
              </p>
              <p>
                <strong>Tooltips:</strong> Hover over labels (e.g., 'Side a') for more info on which side/angle it
                refers to.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center gap-3">
              <Lightbulb className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
              <CardTitle className="text-xl font-semibold">Common Applications</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                • <strong>Construction:</strong> Checking corners for squareness (90° angle), roof pitch calculations,
                rafter lengths.
              </p>
              <p>
                • <strong>Woodworking:</strong> Figuring out miter saw angles for non-square corners, creating
                triangular components.
              </p>
              <p>
                • <strong>Landscaping:</strong> Laying out garden beds or paths with specific side lengths or angles.
              </p>
              <p>
                • <strong>Navigation & Surveying:</strong> Calculating distances and bearings.
              </p>
              <p>
                • <strong>Education:</strong> Understanding trigonometric principles and geometric relationships.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader className="flex flex-row items-center gap-3">
              <BookOpen className="w-8 h-8 text-green-600 dark:text-green-400" />
              <CardTitle className="text-xl font-semibold">The Trigonometry Behind It</CardTitle>
            </CardHeader>
            <CardContent className="text-gray-700 dark:text-gray-300 space-y-2">
              <p>
                <strong>Law of Sines:</strong> Relates the sides of a triangle to the sines of their opposite angles.
                Used when you know an angle and its opposite side. Formula: <em>a/sin(A) = b/sin(B) = c/sin(C)</em>.
              </p>
              <p>
                <strong>Law of Cosines:</strong> Relates the lengths of the sides of a triangle to the cosine of one of
                its angles. Used for SSS (to find an angle) and SAS (to find the third side). Formula:{" "}
                <em>c² = a² + b² - 2ab cos(C)</em>.
              </p>
              <p>
                <strong>Angle Sum:</strong> The sum of the interior angles of any triangle is always 180°.
              </p>
              <p>
                <strong>Heron's Formula:</strong> Calculates the area of a triangle when all three side lengths are
                known.
              </p>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}
