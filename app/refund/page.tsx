import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <div className="mb-12">
          <h1 className="text-3xl font-medium text-[#2D2D2D] mb-3">Refund Policy</h1>
          <p className="text-sm text-[#999999]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">Our Commitment</h2>
            <p className="text-[#666666] leading-relaxed">
              At Sheep It, we strive to provide valuable services to help indie makers launch their products. 
              We understand that sometimes things don't work out as expected, and we've created this refund 
              policy to be fair to both our customers and our business.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">1. Overview</h2>
            <p className="text-[#666666] leading-relaxed mb-3">
              This Refund Policy applies to all premium services purchased on Sheep It, including but not limited to:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666]">
              <li>Premium Launch (Queue Skip) services - $35 per launch</li>
              <li>Featured Product placements - $45 per week</li>
              <li>Any other paid promotional services</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">2. Refund Eligibility</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">2.1 Eligible for Refund</h3>
            <p className="text-[#666666] leading-relaxed mb-3">You may be eligible for a refund in these circumstances:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li><strong>Service Not Delivered:</strong> If we fail to deliver the purchased service within the promised timeframe</li>
              <li><strong>Technical Errors:</strong> If a technical error on our platform prevented service delivery</li>
              <li><strong>Duplicate Charges:</strong> If you were accidentally charged multiple times for the same service</li>
              <li><strong>Pre-Service Cancellation:</strong> If you cancel before we begin processing your premium service</li>
              <li><strong>Rejection After Purchase:</strong> If your product is rejected during our review process after purchasing a premium service</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">2.2 Not Eligible for Refund</h3>
            <p className="text-[#666666] leading-relaxed mb-3">Refunds are generally not available in these situations:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666]">
              <li><strong>Service Delivered:</strong> Once your product has been featured or moved up in the queue as promised</li>
              <li><strong>Performance Expectations:</strong> If the service didn't meet your personal expectations for votes, traffic, or conversions</li>
              <li><strong>Change of Mind:</strong> If you simply changed your mind after the service was initiated</li>
              <li><strong>Violation of Terms:</strong> If your account or product violated our Terms of Service</li>
              <li><strong>External Factors:</strong> Issues outside our control (e.g., your website being down during feature period)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">3. Refund Process</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">3.1 How to Request a Refund</h3>
            <ol className="list-decimal ml-6 space-y-2 text-[#666666] mb-6">
              <li><strong>Submit Request:</strong> Email us at santiago@sheepit.io within 14 days of purchase</li>
              <li><strong>Include Details:</strong> Provide your order number, email address used for purchase, and reason for refund</li>
              <li><strong>Wait for Review:</strong> We'll review your request within 3-5 business days</li>
              <li><strong>Receive Decision:</strong> We'll email you our decision and next steps</li>
              <li><strong>Refund Processing:</strong> If approved, refunds are processed within 5-10 business days</li>
            </ol>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">3.2 Important Notes</h3>
            <ul className="list-disc ml-6 space-y-2 text-[#666666]">
              <li>Refunds are issued to the original payment method</li>
              <li>Processing times may vary depending on your bank or payment provider</li>
              <li>Partial refunds may be offered in certain circumstances</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">4. Special Circumstances</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.1 Queue Skip Service</h3>
            <p className="text-[#666666] leading-relaxed mb-3">For Queue Skip purchases:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Refunds are available if requested before we move your product in the queue</li>
              <li>Once your product has been moved up, the service is considered delivered</li>
              <li>If your product launches in the accelerated timeframe, no refund is available</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.2 Featured Product Service</h3>
            <p className="text-[#666666] leading-relaxed mb-3">For Featured Product purchases:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Refunds are available if requested before the featuring period begins</li>
              <li>Once your product appears as featured on our homepage, the service is considered delivered</li>
              <li>The full 7-day feature period must be honored once started</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.3 Product Rejection</h3>
            <p className="text-[#666666] leading-relaxed">
              If your product is rejected after purchasing a premium service, you will receive a full refund automatically. 
              We'll also provide feedback on why the product was rejected to help you improve future submissions.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">5. Dispute Resolution</h2>
            <p className="text-[#666666] leading-relaxed mb-3">
              If you disagree with our refund decision:
            </p>
            <ol className="list-decimal ml-6 space-y-2 text-[#666666] mb-4">
              <li>First, reply to our decision email with additional information or clarification</li>
              <li>If still unsatisfied, you may request escalation to our management team</li>
              <li>As a last resort, you may dispute the charge with your payment provider</li>
            </ol>
            <p className="text-[#666666] leading-relaxed">
              We aim to resolve all disputes amicably and maintain positive relationships with our community members.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">6. Chargebacks</h2>
            <p className="text-[#666666] leading-relaxed mb-3">
              While we prefer to handle refund requests directly, we understand you have the right to dispute charges 
              with your bank or credit card company. However, please note:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666]">
              <li>Initiating a chargeback may result in temporary account suspension</li>
              <li>We will provide transaction evidence to your payment provider</li>
              <li>Fraudulent chargebacks may result in permanent account termination</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">7. Modifications to This Policy</h2>
            <p className="text-[#666666] leading-relaxed">
              We reserve the right to update this Refund Policy at any time. Changes will be effective immediately 
              upon posting to this page. For significant changes, we may notify users via email or platform announcement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">8. Contact Information</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              For refund requests or questions about this policy, please contact us:
            </p>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <p className="text-[#666666]"><strong>Email:</strong> santiago@sheepit.io</p>
              <p className="text-[#666666]"><strong>Response Time:</strong> 3-5 business days</p>
              <p className="text-[#666666]"><strong>Support Hours:</strong> Monday-Friday, 9 AM - 5 PM EST</p>
              <p className="text-[#666666] mt-4">
                Please include "Refund Request" in your email subject line for faster processing.
              </p>
            </div>
          </section>

          <section className="mt-16 pt-8 border-t border-[#E5E5E5]">
            <p className="text-center text-[#666666]">
              This Refund Policy is part of our <Link href="/terms-and-conditions" className="text-orange-600 hover:text-orange-700">Terms of Service</Link> and 
              should be read in conjunction with our <Link href="/privacy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}