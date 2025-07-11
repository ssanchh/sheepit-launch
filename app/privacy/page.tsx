import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-[#2D2D2D] mb-8">Privacy Policy</h1>
        
        <div className="prose prose-gray max-w-none space-y-6 text-[#666666]">
          <p className="text-sm text-[#999999] mb-8">
            Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">1. Introduction</h2>
            <p>
              Sheep It ("we", "us", "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our website and services at sheep-it.com (the "Service").
            </p>
            <p>
              By using our Service, you consent to the data practices described in this policy. If you do not agree with the 
              terms of this Privacy Policy, please do not access the Service.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">2. Information We Collect</h2>
            
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">2.1 Information You Provide</h3>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Account Information:</strong> Email address, name, username, and profile information</li>
              <li><strong>Product Information:</strong> Product names, descriptions, URLs, logos, and other product details</li>
              <li><strong>Payment Information:</strong> Processed through our third-party payment providers (we do not store credit card details)</li>
              <li><strong>Communications:</strong> Information in emails or messages you send us</li>
              <li><strong>User Content:</strong> Comments, votes, and other interactions with the Service</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">2.2 Information Collected Automatically</h3>
            <p>When you use our Service, we automatically collect certain information, including:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>Usage Data:</strong> Pages viewed, links clicked, features used, and time spent on pages</li>
              <li><strong>Device Information:</strong> IP address, browser type, operating system, and device identifiers</li>
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies to enhance user experience and analyze usage</li>
              <li><strong>Log Data:</strong> Server logs that record access times, referring URLs, and error reports</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">2.3 Information from Third Parties</h3>
            <p>We may receive information about you from:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li><strong>OAuth Providers:</strong> When you sign in using Google or other authentication services</li>
              <li><strong>Analytics Services:</strong> Aggregated demographic and interest data</li>
              <li><strong>Public Sources:</strong> Publicly available information about products and makers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect to:</p>
            <ul className="list-disc ml-6 space-y-2">
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

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">4. How We Share Your Information</h2>
            <p>We may share your information in the following circumstances:</p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">4.1 Public Information</h3>
            <p>
              Product information you submit (name, description, logo, website) is publicly visible on our platform. 
              Your profile information may also be publicly visible based on your settings.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">4.2 Newsletter Partners</h3>
            <p>
              If your product wins, we share product information with our newsletter partners (50,000+ subscribers) 
              for promotional purposes.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">4.3 Service Providers</h3>
            <p>We share information with third-party vendors who perform services for us:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Supabase (database and authentication)</li>
              <li>Payment processors (Stripe/LemonSqueezy)</li>
              <li>Email service providers (Resend)</li>
              <li>Analytics providers</li>
              <li>Cloud storage services</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">4.4 Legal Requirements</h3>
            <p>We may disclose information if required to do so by law or if we believe such action is necessary to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Comply with legal obligations or respond to lawful requests</li>
              <li>Protect and defend our rights or property</li>
              <li>Prevent fraud or protect against security risks</li>
              <li>Protect the safety of users or the public</li>
            </ul>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">4.5 Business Transfers</h3>
            <p>
              In the event of a merger, acquisition, or sale of assets, your information may be transferred as part 
              of that transaction.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">5. Data Retention</h2>
            <p>We retain your information for as long as necessary to:</p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Provide our services to you</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce agreements</li>
              <li>Maintain business records for analysis and/or audit purposes</li>
            </ul>
            <p>
              When we no longer need your information, we will securely delete or anonymize it in accordance with 
              our data retention policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">6. Data Security</h2>
            <p>
              We implement appropriate technical and organizational measures to protect your personal information against 
              unauthorized access, alteration, disclosure, or destruction. These measures include:
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Encryption of data in transit and at rest</li>
              <li>Regular security assessments and updates</li>
              <li>Access controls and authentication requirements</li>
              <li>Employee training on data protection</li>
              <li>Incident response procedures</li>
            </ul>
            <p>
              However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive 
              to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">7. Your Rights and Choices</h2>
            
            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">7.1 Access and Update</h3>
            <p>
              You can access and update your account information through your dashboard. You may also request a copy 
              of your personal data by contacting us.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">7.2 Email Communications</h3>
            <p>
              You can opt out of promotional emails by clicking the unsubscribe link in any email or updating your 
              email preferences in your account settings. Note that you may still receive transactional emails.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">7.3 Cookies</h3>
            <p>
              Most browsers allow you to refuse or delete cookies. Please note that disabling cookies may limit your 
              ability to use certain features of our Service.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">7.4 Data Deletion</h3>
            <p>
              You can request deletion of your account and personal data by contacting us. We will delete your information 
              except where we need to retain it for legal or legitimate business purposes.
            </p>

            <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">7.5 Data Portability</h3>
            <p>
              You have the right to request your data in a structured, commonly used, and machine-readable format.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. 
              These countries may have data protection laws different from those in your country. We take appropriate 
              safeguards to ensure your information remains protected in accordance with this Privacy Policy.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">9. Children's Privacy</h2>
            <p>
              Our Service is not intended for children under 18 years of age. We do not knowingly collect personal 
              information from children under 18. If we learn we have collected information from a child under 18, 
              we will delete that information promptly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">10. California Privacy Rights</h2>
            <p>
              If you are a California resident, you have additional rights under the California Consumer Privacy Act (CCPA):
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Right to know what personal information we collect, use, and share</li>
              <li>Right to delete personal information (with some exceptions)</li>
              <li>Right to opt-out of the sale of personal information (we do not sell personal information)</li>
              <li>Right to non-discrimination for exercising your privacy rights</li>
            </ul>
            <p>To exercise these rights, please contact us using the information below.</p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">11. European Privacy Rights</h2>
            <p>
              If you are located in the European Economic Area (EEA) or United Kingdom, you have additional rights under 
              the General Data Protection Regulation (GDPR):
            </p>
            <ul className="list-disc ml-6 space-y-2">
              <li>Right to access your personal data</li>
              <li>Right to rectification of inaccurate data</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict processing</li>
              <li>Right to data portability</li>
              <li>Right to object to processing</li>
              <li>Right to withdraw consent</li>
            </ul>
            <p>
              Our legal basis for processing your information is typically your consent, contract performance, or 
              legitimate interests.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">12. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. We will notify you of material changes by posting 
              the new Privacy Policy on this page and updating the "Last Updated" date. We encourage you to review 
              this Privacy Policy periodically.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-[#2D2D2D] mb-4">13. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us:
            </p>
            <div className="bg-[#F5F5F5] p-4 rounded-lg mt-4">
              <p className="font-medium text-[#2D2D2D]">Sheep It Privacy Team</p>
              <p>Email: privacy@sheep-it.com</p>
              <p>Website: https://sheep-it.com</p>
            </div>
            <p className="mt-4">
              For data protection inquiries or to exercise your rights, please email us with "Privacy Request" in the 
              subject line. We will respond to your request within 30 days.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}