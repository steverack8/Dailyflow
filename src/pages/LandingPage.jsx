import Navbar from "../components/layout/Navbar"
import Footer from "../components/layout/Footer"

import Hero from "../components/landing/Hero"
import HowItWorks from "../components/landing/HowItWorks"
import LifeDimensions from "../components/landing/LifeDimensions"
import SmartScheduling from "../components/landing/SmartScheduling"
import CalendarSync from "../components/landing/CalendarSync"
import DynamicPlanning from "../components/landing/DynamicPlanning"

function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-dark antialiased selection:bg-blue-100 selection:text-blue-900">
      <Navbar />

      <main>
        <Hero />
        <HowItWorks />
        <LifeDimensions />
        <SmartScheduling />
        <CalendarSync />
        <DynamicPlanning />
      </main>

      <Footer />
    </div>
  )
}

export default LandingPage