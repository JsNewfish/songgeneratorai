import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Terms of Service - SongGeneratorAI",
  description: "Read SongGeneratorAI's terms of service to understand the rules and guidelines for using our AI music generation platform.",
}

export default function TermsPage() {
  const lastUpdated = "January 1, 2025"

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
        <p className="mt-2 text-muted-foreground">Last updated: {lastUpdated}</p>

        <div className="prose prose-neutral dark:prose-invert mt-10 space-y-8 text-foreground">
          <section>
            <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              By accessing or using SongGeneratorAI ("Service"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">2. Use of Service</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service to:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li>Generate content that infringes on third-party intellectual property rights</li>
              <li>Create harmful, abusive, defamatory, obscene, or otherwise objectionable content</li>
              <li>Attempt to reverse-engineer, decompile, or disassemble our AI models</li>
              <li>Use automated means to access the Service beyond what is permitted by your plan</li>
              <li>Resell or redistribute access to the Service without authorization</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">3. Intellectual Property & Content Ownership</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Music generated using SongGeneratorAI is owned by you, the user, subject to the following conditions:
            </p>
            <ul className="mt-3 list-disc space-y-2 pl-6 text-muted-foreground">
              <li><strong>Free plan users</strong> receive a limited personal license. Commercial use requires a paid subscription.</li>
              <li><strong>Paid plan users</strong> receive a royalty-free commercial license to all generated content.</li>
              <li>SongGeneratorAI retains the right to use anonymized generated content to improve its AI models, unless you opt out in account settings.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">4. Credits and Payments</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              Credits are consumed to generate music and use AI tools. Credits are non-refundable and non-transferable. Subscription benefits reset on each billing cycle. If you believe there has been an error in billing, contact us within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">5. Refund Policy</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We offer refunds within 7 days of purchase if you have not used your subscription credits. One-time credit pack purchases are non-refundable once credits have been used. Contact support@songgeneratorai.io for refund requests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Disclaimer of Warranties</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              The Service is provided "as is" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or that results from use of the Service will be accurate or reliable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              To the fullest extent permitted by law, SongGeneratorAI shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">8. Termination</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We may terminate or suspend your account at any time for violation of these Terms. You may cancel your account at any time through your account settings. Upon termination, your right to use the Service ceases immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">9. Changes to Terms</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              We reserve the right to modify these Terms at any time. We will provide notice of significant changes via email or a prominent notice on the Service. Continued use after changes constitutes acceptance of the new Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">10. Contact</h2>
            <p className="mt-3 text-muted-foreground leading-relaxed">
              For questions about these Terms, contact us at:{" "}
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
