import { Header } from "@/components/header"
import { MusicGenerator } from "@/components/music-generator"
import { MusicShowcase } from "@/components/music-showcase"
import { HowItWorks } from "@/components/how-it-works"
import { Features } from "@/components/features"
import { UserCases } from "@/components/user-cases"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <MusicGenerator />
        <MusicShowcase />
        <HowItWorks />
        <Features />
        <UserCases />
        <Testimonials />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
