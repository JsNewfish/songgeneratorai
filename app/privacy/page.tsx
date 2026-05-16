import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Privacy Policy - SongGeneratorAI",
  description: "Read SongGeneratorAI's privacy policy to understand how we collect, use, and protect your personal information.",
}

export default function PrivacyPage() {
  const lastUpdated = "January 1, 2025"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
        <p className="mt-2 text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="prose prose-neutral dark:prose-invert mt-10 space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We collect information you provide directly to us, such as when you create an account, subscribe to a plan, or contact us for support. This includes:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Account information (name, email address)</li>
              <li>Payment information (processed securely via Stripe — we do not store card details)</li>
              <li>Content you generate or upload using our services</li>
              <li>Usage data and analytics to improve our product</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Provide, maintain, and improve our AI music generation services</li>
              <li>Process transactions and send related billing information</li>
              <li>Send service-related communications and updates</li>
              <li>Respond to comments, questions, and customer service requests</li>
              <li>Monitor and analyze usage patterns to enhance user experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform, provided those parties agree to keep this information confidential.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Data Retention</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We retain your personal information for as long as your account is active or as needed to provide services. You may request deletion of your data at any time by contacting us at the email below.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">5. Cookies</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We use cookies and similar tracking technologies to track activity on our service and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Security</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We implement industry-standard security measures to protect your personal information. However, no method of transmission over the Internet or method of electronic storage is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Your Rights</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Depending on your location, you may have the right to access, correct, or delete your personal data. You also have the right to object to or restrict certain processing of your data. Contact us to exercise these rights.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">8. Contact Us</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <a href="mailto:support@songgeneratorai.io" className="text-primary underline underline-offset-4">
                support@songgeneratorai.io
              </a>
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}
