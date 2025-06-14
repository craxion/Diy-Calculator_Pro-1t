/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
/** @type {import('next').NextConfig} */
const nextConfig = {
  // ... any other configs you have
  async redirects() {
    return [
      // --- CONSTRUCTION & HOME IMPROVEMENT ---
      {
        source: '/calculator/construction-and-home-improvement/demolition-volume-estimator',
        // Matched to the new excavation calculator
        destination: '/calculators/construction-and-building/excavation-volume-and-cost-calculator',
        permanent: true,
      },
      {
        source: '/calculator/construction-and-home-improvement/concrete-formwork-calculator',
        // Matched to the new concrete slab calculator
        destination: '/calculators/construction-and-building/concrete-slab-calculator',
        permanent: true,
      },
      {
        source: '/calculator/construction-and-home-improvement/window-door-rough-opening-sizer',
        // No direct match, redirecting to the most relevant calculator
        destination: '/calculators/construction-and-building/wall-framing-calculator',
        permanent: true,
      },
      {
        source: '/calculator/construction-and-home-improvement/drywall-sheet-calculator',
        // No direct match, redirecting to the construction category
        destination: '/calculators/construction-and-building',
        permanent: true,
      },
      {
        source: '/calculator/construction-and-home-improvement/siding-estimator',
        // No direct match, redirecting to the construction category
        destination: '/calculators/construction-and-building',
        permanent: true,
      },
      {
        source: '/calculator/construction-and-home-improvement/fastener-estimator',
        // No direct match, redirecting to the construction category
        destination: '/calculators/construction-and-building',
        permanent: true,
      },
      {
        source: '/calculator/construction-and-home-improvement/roofing-shingle-calculator',
        // No direct match, redirecting to the construction category
        destination: '/calculators/construction-and-building',
        permanent: true,
      },
      {
        source: '/calculator/construction-and-home-improvement/grade-slope-calculator',
         // This is now more relevant to the landscaping category
        destination: '/calculators/landscaping-and-outdoor',
        permanent: true,
      },

      // --- WOODWORKING & CARPENTRY ---
      {
        source: '/calculator/woodworking-and-carpentry/plywood-sheet-layout-optimizer',
        // Matched to the new lumber cut optimizer
        destination: '/calculators/carpentry-and-woodworking/lumber-cut-optimizer',
        permanent: true,
      },
      {
        source: '/calculator/woodworking-and-carpentry/stair-calculator',
        // No direct match, redirecting to the carpentry category
        destination: '/calculators/carpentry-and-woodworking',
        permanent: true,
      },
      {
        source: '/calculator/woodworking-and-carpentry/shelf-load-calculator',
        // No direct match, redirecting to the carpentry category
        destination: '/calculators/carpentry-and-woodworking',
        permanent: true,
      },

      // --- LANDSCAPING & OUTDOOR ---
      {
        source: '/calculator/landscaping-and-outdoor/mulch-topsoil-calculator',
        // Matched to the new soil and mulch calculator
        destination: '/calculators/landscaping-and-outdoor/soil-and-mulch-calculator',
        permanent: true,
      },
      {
        source: '/calculator/landscaping-and-outdoor/garden-bed-volume-planner',
        // Matched to the new soil and mulch calculator as it's the most relevant
        destination: '/calculators/landscaping-and-outdoor/soil-and-mulch-calculator',
        permanent: true,
      },
      {
        source: '/calculator/landscaping-and-outdoor/deck-material-estimator',
        // No direct match, redirecting to the landscaping category
        destination: '/calculators/landscaping-and-outdoor',
        permanent: true,
      },

      // --- MECHANICAL / UTILITIES / HOUSEHOLD ---
      {
        source: '/calculator/mechanical-and-utilities/fluid-dilution-calculator',
        // Matched to the new chemical dilution calculator
        destination: '/calculators/household-solutions-and-mixing/chemical-and-liquid-dilution-calculator',
        permanent: true,
      },
      {
        source: '/calculator/home-and-garden-care/pest-control-calculator',
        // No direct pest control calculator, redirecting to the most relevant category
        destination: '/calculators/household-solutions-and-mixing',
        permanent: true,
      },
       {
        source: '/calculator/mechanical-and-utilities/ductwork-sizing-helper',
        // No direct match, redirecting to the main calculators page
        destination: '/calculators',
        permanent: true,
      },
      {
        source: '/calculator/mechanical-and-utilities/room-btu-load-calculator',
        // No direct match, redirecting to the main calculators page
        destination: '/calculators',
        permanent: true,
      },
      {
        source: '/calculator/mechanical-and-utilities/electrical-load-calculator',
        // No direct match, redirecting to the main calculators page
        destination: '/calculators',
        permanent: true,
      },
      {
        source: '/calculator/mechanical-and-utilities/water-heater-sizing-tool',
        // No direct match, redirecting to the main calculators page
        destination: '/calculators',
        permanent: true,
      },

      // --- GENERAL & SUPPORT TOOLS ---
      // These features likely no longer exist as standalone pages. Redirecting to the main calculators page is best.
      {
        source: '/calculator/general-and-support-tools/pro-tip-overlays',
        destination: '/calculators',
        permanent: true,
      },
      {
        source: '/calculator/general-and-support-tools/waste-factor-toggle',
        destination: '/calculators',
        permanent: true,
      },
       {
        source: '/calculator/general-and-support-tools/project-cost-estimator',
        destination: '/calculators',
        permanent: true,
      },
      {
        source: '/calculator/general-and-support-tools/printable-material-lists',
        destination: '/calculators',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
