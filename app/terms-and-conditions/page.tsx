import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#2D2D2D] mb-8">Terms of Service</h1>
        
        <div className="prose prose-gray max-w-none space-y-6 text-[#666666]">
          <p className="text-sm text-[#999999] mb-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">1. Agreement to Terms</h2>
            <p>
              By accessing or using Sheep It ("we", "us", "our", "Service"), you agree to be bound by these Terms of Service ("Terms"). 
              If you disagree with any part of these terms, you do not have permission to access the Service.
            </p>
            <p>
              These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to product makers, 
              voters, and newsletter subscribers.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">2. Use of Service</h2>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">2.1 Eligibility</h3>
            <p>
              You must be at least 18 years old to use this Service. By using this Service, you represent and warrant that you are at least 
              18 years of age and have the legal capacity to enter into these Terms.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">2.2 Account Registration</h3>
            <p>
              To submit products or access certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">3. Product Submissions</h2>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">3.1 Submission Guidelines</h3>
            <p>When submitting products to Sheep It, you agree that:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>You have the legal right to promote the product</li>
              <li>All information provided is accurate and not misleading</li>
              <li>Your product complies with all applicable laws and regulations</li>
              <li>Your submission does not infringe on any third-party rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">3.2 Approval Process</h3>
            <p>
              All product submissions are subject to review and approval by our team. We reserve the right to reject or remove any submission 
              that violates these Terms or our community guidelines, at our sole discretion.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">3.3 Prohibited Products</h3>
            <p>The following types of products are prohibited:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Illegal products or services</li>
              <li>Products that promote hate, violence, or discrimination</li>
              <li>Adult content or services</li>
              <li>Scams, pyramid schemes, or fraudulent offerings</li>
              <li>Products that violate intellectual property rights</li>
              <li>Malware, spyware, or harmful software</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">4. Voting and Community Participation</h2>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">4.1 Voting Rules</h3>
            <p>Users participating in voting agree to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Vote based on genuine interest and product merit</li>
              <li>Not engage in vote manipulation or fraudulent voting</li>
              <li>Respect the one-vote-per-product-per-week limitation</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">4.2 Fair Play</h3>
            <p>
              Any attempt to manipulate votes, rankings, or the platform through automated means, multiple accounts, or other fraudulent 
              methods will result in immediate account termination and disqualification.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">5. Premium Services and Payments</h2>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">5.1 Premium Features</h3>
            <p>
              Sheep It offers premium features including queue skipping and featured product placement. By purchasing these services, 
              you acknowledge that:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Payment is required upfront and is processed through our third-party payment processor</li>
              <li>Premium features are subject to availability and our approval process</li>
              <li>Premium placement does not guarantee specific results or outcomes</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">5.2 Refund Policy</h3>
            <p>
              Please refer to our separate <Link href="/refund" className="text-orange-600 hover:text-orange-700">Refund Policy</Link> for 
              detailed information about refunds and cancellations.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">6. Content Rights and Licenses</h2>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">6.1 Your Content</h3>
            <p>
              You retain all rights to content you submit to Sheep It. By submitting content, you grant us a worldwide, non-exclusive, 
              royalty-free license to:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Display your product information on our platform</li>
              <li>Include your product in our newsletter (if selected as a winner)</li>
              <li>Promote your product through our marketing channels</li>
              <li>Store and backup your content for operational purposes</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">6.2 Our Content</h3>
            <p>
              The Service and its original content (excluding user-submitted content) are and will remain the exclusive property of 
              Sheep It and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">7. Privacy</h2>
            <p>
              Your use of our Service is also governed by our <Link href="/privacy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>. 
              Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">8. Disclaimers and Limitations of Liability</h2>
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">8.1 Service Provided "As Is"</h3>
            <p>
              The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. 
              We do not warrant that the Service will be uninterrupted, secure, or error-free.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">8.2 Limitation of Liability</h3>
            <p>
              To the maximum extent permitted by law, Sheep It shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses resulting from your use 
              of the Service.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">8.3 Third-Party Products</h3>
            <p>
              We are not responsible for the quality, safety, legality, or any other aspect of products listed on our platform. 
              Any transactions or interactions with third-party products are solely between you and the product maker.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">9. Indemnification</h2>
            <p>
              You agree to defend, indemnify, and hold harmless Sheep It, its affiliates, and their respective officers, directors, 
              employees, and agents from any claims, liabilities, damages, losses, and expenses arising from:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit to the Service</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">10. Termination</h2>
            <p>
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, 
              for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">11. Governing Law and Disputes</h2>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to 
              its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved 
              through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">12. Changes to Terms</h2>
            <p>
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the 
              new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after changes constitutes 
              acceptance of the modified Terms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">13. Contact Information</h2>
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-[#F5F5F5] p-4 rounded-lg mt-4">
              <p className="font-medium text-[#2D2D2D]">Sheep It</p>
              <p>Email: legal@sheep-it.com</p>
              <p>Website: https://sheep-it.com</p>
            </div>
          </section>

          <section className="mt-12 pt-8 border-t border-[#E5E5E5]">
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">Acceptance</h2>
            <p className="font-medium">
              By using Sheep It, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}