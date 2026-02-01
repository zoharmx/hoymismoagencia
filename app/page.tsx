import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import TrackingSection from '@/components/sections/TrackingSection'
import QuoteSection from '@/components/sections/QuoteSection'
import CTASection from '@/components/sections/CTASection'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesSection />
      <TrackingSection />
      <QuoteSection />
      <CTASection />
      <Footer />
    </main>
  )
}
