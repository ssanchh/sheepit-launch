import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <div className="mb-12">
          <h1 className="text-3xl font-medium text-[#2D2D2D] mb-3">Terms of Service</h1>
          <p className="text-sm text-[#999999]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">1. Agreement to Terms</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              By accessing or using Sheep It ("we", "us", "our", "Service"), operated by Santiago Sánchez (Sole Proprietor), 
              you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, 
              you do not have permission to access the Service.
            </p>
            <p className="text-[#666666] leading-relaxed mb-4">
              These Terms apply to all visitors, users, and others who access or use the Service, including but not limited to product makers, 
              voters, and newsletter subscribers.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mt-4">
              <p className="text-sm text-[#666666]"><strong>Service Operator:</strong> Santiago Sánchez (Sole Proprietor)</p>
              <p className="text-sm text-[#666666]"><strong>Business Address:</strong> Pedro Berro 1238, Montevideo, 11300, Uruguay</p>
              <p className="text-sm text-[#666666]"><strong>Contact Email:</strong> santiago@sheepit.io</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">2. Use of Service</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">2.1 Eligibility</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              You must be at least 18 years old to use this Service. By using this Service, you represent and warrant that you are at least 
              18 years of age and have the legal capacity to enter into these Terms.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">2.2 Account Registration</h3>
            <p className="text-[#666666] leading-relaxed mb-3">
              To submit products or access certain features, you must register for an account. You agree to:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Accept responsibility for all activities under your account</li>
              <li>Notify us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">3. Product Submissions</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">3.1 Submission Guidelines</h3>
            <p className="text-[#666666] leading-relaxed mb-3">When submitting products to Sheep It, you agree that:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>You have the legal right to promote the product</li>
              <li>All information provided is accurate and not misleading</li>
              <li>Your product complies with all applicable laws and regulations</li>
              <li>Your submission does not infringe on any third-party rights</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">3.2 Approval Process</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              All product submissions are subject to review and approval by our team. We reserve the right to reject or remove any submission 
              that violates these Terms or our community guidelines, at our sole discretion.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">3.3 Prohibited Products</h3>
            <p className="text-[#666666] leading-relaxed mb-3">The following types of products and services are strictly prohibited on our platform:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666]">
              <li><strong>Illegal products or services:</strong> Any products or services that violate local, state, federal, or international laws</li>
              <li><strong>Weapons and dangerous goods:</strong> Firearms, ammunition, explosives, or instructions for creating weapons</li>
              <li><strong>Hate and discrimination:</strong> Content that promotes hate, violence, harassment, or discrimination based on race, ethnicity, religion, gender, sexual orientation, disability, or other protected characteristics</li>
              <li><strong>Adult content:</strong> Pornography, adult services, sexually explicit material, or dating services</li>
              <li><strong>Financial scams:</strong> Pyramid schemes, multi-level marketing (MLM), get-rich-quick schemes, cryptocurrency scams, or fraudulent investment opportunities</li>
              <li><strong>Intellectual property violations:</strong> Products that infringe on copyrights, trademarks, patents, or other intellectual property rights</li>
              <li><strong>Malicious software:</strong> Malware, spyware, viruses, hacking tools, or any software designed to harm or gain unauthorized access to systems</li>
              <li><strong>Regulated substances:</strong> Drugs, pharmaceuticals without proper licensing, tobacco products, e-cigarettes, or alcohol</li>
              <li><strong>Gambling and betting:</strong> Online casinos, sports betting, lottery services, or any form of gambling</li>
              <li><strong>Deceptive practices:</strong> Fake reviews, click farms, bot services, or any service designed to manipulate online metrics</li>
              <li><strong>Personal data:</strong> Services that sell or trade personal information, databases of user data, or privacy-violating tools</li>
              <li><strong>Health claims:</strong> Products making unsubstantiated medical claims, miracle cures, or unapproved medical devices</li>
              <li><strong>Academic dishonesty:</strong> Essay writing services, exam answers, or tools designed to facilitate cheating</li>
              <li><strong>High-risk financial services:</strong> Payday loans, debt collection services, or credit repair schemes</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">4. Content Moderation and Review Process</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.1 Review Process</h3>
            <p className="text-[#666666] leading-relaxed mb-3">All product submissions undergo a review process:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li><strong>Initial Review:</strong> Products are reviewed within 24-48 hours of submission</li>
              <li><strong>Compliance Check:</strong> We verify products comply with our Terms and prohibited content guidelines</li>
              <li><strong>Quality Standards:</strong> Products must have functional websites, clear descriptions, and legitimate offerings</li>
              <li><strong>Decision Communication:</strong> Submitters are notified via email of approval or rejection with reasons</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.2 Ongoing Monitoring</h3>
            <p className="text-[#666666] leading-relaxed mb-3">We continuously monitor listed products for:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Changes that violate our policies</li>
              <li>User reports of inappropriate content</li>
              <li>Suspicious voting patterns or manipulation attempts</li>
              <li>External links becoming malicious or inappropriate</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.3 Reporting and Appeals</h3>
            <p className="text-[#666666] leading-relaxed mb-3">
              Users can report products that violate our policies by emailing santiago@sheepit.io. 
              If your product is rejected or removed, you may appeal the decision by providing additional 
              information or clarification within 7 days of the decision.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">5. Voting and Community Participation</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">5.1 Voting Rules</h3>
            <p className="text-[#666666] leading-relaxed mb-3">Users participating in voting agree to:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Vote based on genuine interest and product merit</li>
              <li>Not engage in vote manipulation or fraudulent voting</li>
              <li>Respect the one-vote-per-product-per-week limitation</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">5.2 Fair Play</h3>
            <p className="text-[#666666] leading-relaxed">
              Any attempt to manipulate votes, rankings, or the platform through automated means, multiple accounts, or other fraudulent 
              methods will result in immediate account termination and disqualification.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">6. Premium Services and Payments</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">6.1 Premium Features</h3>
            <p className="text-[#666666] leading-relaxed mb-3">
              Sheep It offers premium features including queue skipping and featured product placement. By purchasing these services, 
              you acknowledge that:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Payment is required upfront and is processed through our third-party payment processor</li>
              <li>Premium features are subject to availability and our approval process</li>
              <li>Premium placement does not guarantee specific results or outcomes</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">6.2 Refund Policy</h3>
            <p className="text-[#666666] leading-relaxed">
              Please refer to our separate <Link href="/refund" className="text-orange-600 hover:text-orange-700">Refund Policy</Link> for 
              detailed information about refunds and cancellations.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">7. Content Rights and Licenses</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">7.1 Your Content</h3>
            <p className="text-[#666666] leading-relaxed mb-3">
              You retain all rights to content you submit to Sheep It. By submitting content, you grant us a worldwide, non-exclusive, 
              royalty-free license to:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Display your product information on our platform</li>
              <li>Include your product in our newsletter (if selected as a winner)</li>
              <li>Promote your product through our marketing channels</li>
              <li>Store and backup your content for operational purposes</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">7.2 Our Content</h3>
            <p className="text-[#666666] leading-relaxed">
              The Service and its original content (excluding user-submitted content) are and will remain the exclusive property of 
              Sheep It and its licensors. The Service is protected by copyright, trademark, and other laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">8. Privacy</h2>
            <p className="text-[#666666] leading-relaxed">
              Your use of our Service is also governed by our <Link href="/privacy" className="text-orange-600 hover:text-orange-700">Privacy Policy</Link>. 
              Please review our Privacy Policy, which also governs the Site and informs users of our data collection practices.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">9. Disclaimers and Limitations of Liability</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">9.1 Service Provided "As Is"</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              The Service is provided on an "as is" and "as available" basis without warranties of any kind, either express or implied. 
              We do not warrant that the Service will be uninterrupted, secure, or error-free.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">9.2 Limitation of Liability</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              To the maximum extent permitted by law, Sheep It shall not be liable for any indirect, incidental, special, consequential, 
              or punitive damages, including loss of profits, data, use, goodwill, or other intangible losses resulting from your use 
              of the Service.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">9.3 Third-Party Products</h3>
            <p className="text-[#666666] leading-relaxed">
              We are not responsible for the quality, safety, legality, or any other aspect of products listed on our platform. 
              Any transactions or interactions with third-party products are solely between you and the product maker.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">10. Indemnification</h2>
            <p className="text-[#666666] leading-relaxed mb-3">
              You agree to defend, indemnify, and hold harmless Sheep It, its affiliates, and their respective officers, directors, 
              employees, and agents from any claims, liabilities, damages, losses, and expenses arising from:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666]">
              <li>Your use of the Service</li>
              <li>Your violation of these Terms</li>
              <li>Your violation of any third-party rights</li>
              <li>Any content you submit to the Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">11. Termination</h2>
            <p className="text-[#666666] leading-relaxed">
              We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, 
              for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">12. Governing Law and Disputes</h2>
            <p className="text-[#666666] leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to 
              its conflict of law provisions. Any disputes arising from these Terms or your use of the Service shall be resolved 
              through binding arbitration in accordance with the rules of the American Arbitration Association.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">13. Changes to Terms</h2>
            <p className="text-[#666666] leading-relaxed">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the 
              new Terms on this page and updating the "Last Updated" date. Your continued use of the Service after changes constitutes 
              acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">14. Contact Information</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <p className="font-medium text-[#2D2D2D]">Sheep It</p>
              <p className="text-[#666666]"><strong>Operated by:</strong> Santiago Sánchez (Sole Proprietor)</p>
              <p className="text-[#666666]"><strong>Address:</strong> Pedro Berro 1238, Montevideo, 11300, Uruguay</p>
              <p className="text-[#666666]"><strong>Email:</strong> santiago@sheepit.io</p>
              <p className="text-[#666666]"><strong>Website:</strong> https://sheepit.io</p>
            </div>
          </section>

          <section className="mt-16 pt-8 border-t border-[#E5E5E5]">
            <p className="text-center text-[#666666]">
              By using Sheep It, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}