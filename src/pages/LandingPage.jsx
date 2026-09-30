import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

import Hero from "../components/landing/Hero"
import LifeDimensions from "../components/landing/LifeDimensions"

function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-dark antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main>
        <Hero />
        <LifeDimensions />
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage