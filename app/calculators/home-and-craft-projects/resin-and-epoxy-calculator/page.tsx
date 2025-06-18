import type { Metadata } from "next"
import { ResinAndEpoxyCalculatorClient } from "@/components/calculators/resin-and-epoxy-calculator/resin-and-epoxy-calculator-client"

export const metadata: Metadata = {
  title: "Resin and Epoxy Calculator | DIYCalculatorPro",
  description:
    "Calculate precise resin and hardener amounts for casting, coating, and craft projects. Supports multiple shapes, mix ratios, and includes cost estimation.",
  keywords: [
    "resin calculator",
    "epoxy calculator",
    "resin casting calculator",
    "epoxy resin amount",
    "craft resin calculator",
    "resin hardener ratio",
    "epoxy mixing calculator",
    "resin project calculator",
  ],
}

export default function ResinAndEpoxyCalculatorPage() {
  return <ResinAndEpoxyCalculatorClient />
}
