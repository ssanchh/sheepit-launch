import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <div className="mb-12">
          <h1 className="text-3xl font-medium text-[#2D2D2D] mb-3">Privacy Policy</h1>
          <p className="text-sm text-[#999999]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <div className="prose prose-gray max-w-none">
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">1. Introduction</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              Sheep It ("we", "us", "our"), operated by Santiago Sánchez (Sole Proprietor), is committed to protecting your privacy. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website 
              and services at sheepit.io (the "Service").
            </p>
            <p className="text-[#666666] leading-relaxed mb-4">
              By using our Service, you consent to the data practices described in this policy. If you do not agree with the 
              terms of this Privacy Policy, please do not access the Service.
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-[#666666]"><strong>Data Controller:</strong> Santiago Sánchez (Sole Proprietor)</p>
              <p className="text-sm text-[#666666]"><strong>Business Address:</strong> Pedro Berro 1238, Montevideo, 11300, Uruguay</p>
              <p className="text-sm text-[#666666]"><strong>Contact Email:</strong> santiago@sheepit.io</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">2.1 Information You Provide</h3>
            <p className="text-[#666666] leading-relaxed mb-3">We collect information you provide directly to us, including:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li><strong>Account Information:</strong> Email address, name, username, and profile information</li>
              <li><strong>Product Information:</strong> Product names, descriptions, URLs, logos, and other product details</li>
              <li><strong>Payment Information:</strong> Processed through our third-party payment providers (we do not store credit card details)</li>
              <li><strong>Communications:</strong> Information in emails or messages you send us</li>
              <li><strong>User Content:</strong> Comments, votes, and other interactions with the Service</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">2.2 Information Collected Automatically</h3>
            <p className="text-[#666666] leading-relaxed mb-3">When you use our Service, we automatically collect certain information, including:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li><strong>Usage Data:</strong> Pages viewed, links clicked, features used, and time spent on pages</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies to enhance user experience and analyze usage</li>
              <li><strong>Log Data:</strong> Server logs that record access times, referring URLs, and error reports</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">2.3 Information from Third Parties</h3>
            <p className="text-[#666666] leading-relaxed mb-3">We may receive information about you from:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666]">
              <li><strong>OAuth Providers:</strong> When you sign in using Google or other authentication services</li>
              <li><strong>Analytics Services:</strong> Aggregated demographic and interest data</li>
              <li><strong>Public Sources:</strong> Publicly available information about products and makers</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">3. How We Use Your Information</h2>
            <p className="text-[#666666] leading-relaxed mb-3">We use the information we collect to:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666]">
              <li>Provide, maintain, and improve our Service</li>
              <li>Process product submissions and manage the weekly launch cycles</li>
              <li>Send you newsletters (with your consent) featuring weekly winners</li>
              <li>Process payments and prevent fraudulent transactions</li>
              <li>Respond to your comments, questions, and customer service requests</li>
              <li>Send you technical notices, updates, and security alerts</li>
              <li>Monitor and analyze trends, usage, and activities</li>
              <li>Personalize and improve your experience</li>
              <li>Comply with legal obligations and enforce our Terms of Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">4. How We Share Your Information</h2>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.1 Public Information</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              Product information you submit (name, description, logo, website) is publicly visible on our platform. 
              Your profile information may also be publicly visible based on your settings.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.2 Newsletter Partners</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              If your product wins, we share product information with our newsletter partners (50,000+ subscribers) 
              for promotional purposes.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.3 Service Providers</h3>
            <p className="text-[#666666] leading-relaxed mb-3">We share information with third-party vendors who perform services for us:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Supabase (database and authentication)</li>
              <li>Payment processors (Stripe/LemonSqueezy)</li>
              <li>Email service providers (Resend)</li>
              <li>Analytics providers</li>
              <li>Cloud storage services</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.4 Legal Requirements</h3>
            <p className="text-[#666666] leading-relaxed mb-3">We may disclose information if required to do so by law or if we believe such action is necessary to:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-6">
              <li>Comply with legal obligations or respond to lawful requests</li>
              <li>Protect and defend our rights or property</li>
              <li>Prevent fraud or protect against security risks</li>
              <li>Protect the safety of users or the public</li>
            </ul>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">4.5 Business Transfers</h3>
            <p className="text-[#666666] leading-relaxed">
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part 
              of that transaction. We will notify you via email and/or prominent notice on our Service of any change 
              in ownership or uses of your personal information.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">5. Data Retention</h2>
            <p className="text-[#666666] leading-relaxed mb-3">We retain your information for as long as necessary to:</p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-4">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain business records for analysis and/or audit purposes</li>
            </ul>
            <p className="text-[#666666] leading-relaxed">
              When we no longer need your information, we will securely delete or anonymize it in accordance with 
              our data retention policies.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">6. Data Security</h2>
            <p className="text-[#666666] leading-relaxed mb-3">
              We implement appropriate technical and organizational measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-4">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p className="text-[#666666] leading-relaxed">
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
              to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">7. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">7.1 Access and Update</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              You can access and update your account information through your dashboard. You may also request a copy 
              of your personal data by contacting us.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">7.2 Email Communications</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              You can opt out of promotional emails by clicking the unsubscribe link in any email or updating your 
              email preferences in your account settings. Note that you may still receive transactional emails.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">7.3 Cookies</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              Most browsers allow you to refuse or delete cookies. Please note that disabling cookies may limit your 
              ability to use certain features of our Service.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">7.4 Data Deletion</h3>
            <p className="text-[#666666] leading-relaxed mb-6">
              You can request deletion of your account and personal data by contacting us. We will delete your information 
              except where we need to retain it for legal or legitimate business purposes.
            </p>

            <h3 className="text-xl font-medium text-[#2D2D2D] mb-3">7.5 Data Portability</h3>
            <p className="text-[#666666] leading-relaxed">
              You have the right to request your data in a structured, commonly used, and machine-readable format.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">8. International Data Transfers</h2>
            <p className="text-[#666666] leading-relaxed">
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have data protection laws different from those in your country. We take appropriate 
              safeguards to ensure your information remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">9. Children's Privacy</h2>
            <p className="text-[#666666] leading-relaxed">
              Our Service is not intended for children under 18 years of age. We do not knowingly collect personal 
              information from children under 18. If we learn we have collected information from a child under 18, 
              we will delete that information promptly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">10. California Privacy Rights</h2>
            <p className="text-[#666666] leading-relaxed mb-3">
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-4">
              <li>Right to know what personal information we collect, use, and share</li>
              <li>Right to delete personal information (with some exceptions)</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="text-[#666666] leading-relaxed">To exercise these rights, please contact us using the information below.</p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">11. European Privacy Rights</h2>
            <p className="text-[#666666] leading-relaxed mb-3">
              If you are located in the European Economic Area (EEA) or United Kingdom, you have additional rights under 
              the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc ml-6 space-y-2 text-[#666666] mb-4">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p className="text-[#666666] leading-relaxed">
              Our legal basis for processing your information is typically your consent, contract performance, or 
              legitimate interests.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">12. Changes to This Privacy Policy</h2>
            <p className="text-[#666666] leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review 
              this Privacy Policy periodically.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">13. Contact Us</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <p className="font-medium text-[#2D2D2D]">Sheep It Privacy Team</p>
              <p className="text-[#666666]"><strong>Data Controller:</strong> Santiago Sánchez (Sole Proprietor)</p>
              <p className="text-[#666666]"><strong>Address:</strong> Pedro Berro 1238, Montevideo, 11300, Uruguay</p>
              <p className="text-[#666666]"><strong>Email:</strong> santiago@sheepit.io</p>
              <p className="text-[#666666]"><strong>Website:</strong> https://sheepit.io</p>
              <p className="text-[#666666] mt-4">
                For data protection inquiries or to exercise your rights, please email us with "Privacy Request" in the 
                subject line. We will respond to your request within 30 days.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}