import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Shield, Users, Gavel, CreditCard, Lock, AlertCircle, Mail, CheckCircle, Zap, Crown } from 'lucide-react'

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2D2D2D] rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-medium text-[#2D2D2D] mb-3">Terms of Service</h1>
          <p className="text-sm text-[#999999]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Quick Navigation */}
        <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 mb-12">
          <h2 className="text-sm font-medium text-[#2D2D2D] mb-4 uppercase tracking-wide">Quick Navigation</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: Users, label: 'User Agreement', href: '#agreement' },
              { icon: Gavel, label: 'Product Submissions', href: '#submissions' },
              { icon: CreditCard, label: 'Payments', href: '#payments' },
              { icon: Lock, label: 'Privacy', href: '#privacy' },
              { icon: AlertCircle, label: 'Liability', href: '#liability' },
              { icon: Mail, label: 'Contact', href: '#contact' }
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 p-3 rounded-lg hover:bg-[#F5F5F5] transition-colors"
              >
                <item.icon className="w-4 h-4 text-[#666666]" />
                <span className="text-sm text-[#666666]">{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Agreement Section */}
          <section id="agreement" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">1. Agreement to Terms</h2>
            </div>
            
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 space-y-4">
              <p className="text-[#666666] leading-relaxed">
                By accessing or using Sheep It ("we", "us", "our", "Service"), you agree to be bound by these Terms of Service. 
                If you disagree with any part of these terms, you do not have permission to access the Service.
              </p>
              
              <div className="bg-[#FFF9F5] rounded-lg p-4 border border-[#FFE5D3]">
                <p className="text-sm text-[#666666]">
                  <strong className="text-[#2D2D2D]">Important:</strong> These Terms apply to all visitors, users, product makers, 
                  voters, and newsletter subscribers.
                </p>
              </div>
            </div>
          </section>

          {/* Use of Service */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">2. Use of Service</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Eligibility</h3>
                <p className="text-sm text-[#666666] mb-3">
                  You must be at least 18 years old to use this Service.
                </p>
                <div className="text-sm text-[#999999]">
                  By using Sheep It, you confirm you meet this requirement.
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Account Security</h3>
                <ul className="space-y-2 text-sm text-[#666666]">
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Keep your credentials secure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>Notify us of unauthorized access</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 mt-0.5">•</span>
                    <span>You're responsible for account activity</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Product Submissions */}
          <section id="submissions" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Gavel className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">3. Product Submissions</h2>
            </div>

            <div className="space-y-6">
              {/* Submission Guidelines */}
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4">Submission Guidelines</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#666666]">Legal right to promote the product</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#666666]">Accurate, non-misleading information</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#666666]">Compliance with laws & regulations</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#666666]">No third-party rights infringement</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Prohibited Products */}
              <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4">Prohibited Products</h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-red-500">✕</span> Illegal products or services
                  </div>
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-red-500">✕</span> Hate speech or violence
                  </div>
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-red-500">✕</span> Adult content
                  </div>
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-red-500">✕</span> Scams or pyramid schemes
                  </div>
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-red-500">✕</span> IP violations
                  </div>
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-red-500">✕</span> Malware or harmful software
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Voting Rules */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">4. Voting & Community</h2>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
              <div className="p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4">Fair Play Rules</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="text-sm text-[#666666]">Vote based on genuine interest and product merit</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="text-sm text-[#666666]">One vote per product per week</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-red-600 text-sm">✕</span>
                    </div>
                    <p className="text-sm text-[#666666]">No vote manipulation or automation</p>
                  </div>
                </div>
              </div>
              <div className="bg-[#FFF9F5] border-t border-[#FFE5D3] p-4">
                <p className="text-xs text-[#666666]">
                  <strong>Penalty:</strong> Vote manipulation results in immediate account termination
                </p>
              </div>
            </div>
          </section>

          {/* Premium Services */}
          <section id="payments" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">5. Premium Services & Payments</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h3 className="font-medium text-[#2D2D2D]">Queue Skip - $35</h3>
                </div>
                <p className="text-sm text-[#666666] mb-3">
                  Jump ahead in the launch queue for faster visibility.
                </p>
                <Link href="/refund" className="text-sm text-orange-600 hover:text-orange-700">
                  View refund policy →
                </Link>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-orange-600" />
                  <h3 className="font-medium text-[#2D2D2D]">Featured Spot - $49</h3>
                </div>
                <p className="text-sm text-[#666666] mb-3">
                  Premium placement at the top of homepage for 7 days.
                </p>
                <Link href="/refund" className="text-sm text-orange-600 hover:text-orange-700">
                  View refund policy →
                </Link>
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#F5F5F5] rounded-lg">
              <p className="text-sm text-[#666666]">
                <strong>Note:</strong> Premium features don't guarantee specific results. All purchases subject to approval.
              </p>
            </div>
          </section>

          {/* Content Rights */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">6. Content Rights & Licenses</h2>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6 space-y-6">
              <div>
                <h3 className="font-medium text-[#2D2D2D] mb-3">Your Content</h3>
                <p className="text-sm text-[#666666] mb-3">
                  You retain all rights to your content. By submitting, you grant us license to:
                </p>
                <div className="space-y-2 text-sm text-[#666666]">
                  <div className="flex items-start gap-2">
                    <span className="text-[#999999] mt-0.5">•</span>
                    Display your product on our platform
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#999999] mt-0.5">•</span>
                    Include winners in our 50k+ subscriber newsletter
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[#999999] mt-0.5">•</span>
                    Promote your product through our channels
                  </div>
                </div>
              </div>
              
              <div className="pt-6 border-t border-[#E5E5E5]">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Our Content</h3>
                <p className="text-sm text-[#666666]">
                  The Sheep It platform and its original content are protected by copyright and trademark laws.
                </p>
              </div>
            </div>
          </section>

          {/* Privacy */}
          <section id="privacy" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">7. Privacy</h2>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
              <p className="text-[#666666] mb-4">
                Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information.
              </p>
              <Link 
                href="/privacy" 
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
              >
                Read our Privacy Policy
                <span>→</span>
              </Link>
            </div>
          </section>

          {/* Liability */}
          <section id="liability" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">8. Disclaimers & Limitations</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Service Provided "As Is"</h3>
                <p className="text-sm text-[#666666]">
                  The Service is provided without warranties of any kind. We don't guarantee uninterrupted or error-free service.
                </p>
              </div>

              <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Third-Party Products</h3>
                <p className="text-sm text-[#666666]">
                  We're not responsible for the quality, safety, or legality of products listed. Transactions are between you and the maker.
                </p>
              </div>
            </div>
          </section>

          {/* Updates to Terms */}
          <section className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">9. Changes to Terms</h2>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <p className="text-[#666666] mb-4">
                We may update these Terms at any time. We'll notify users of material changes by:
              </p>
              <div className="space-y-2 text-sm text-[#666666]">
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">→</span>
                  Posting the new Terms on this page
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">→</span>
                  Updating the "Last Updated" date
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-orange-600">→</span>
                  Sending email notifications for major changes
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="scroll-mt-24">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">10. Contact Information</h2>
            </div>

            <div className="bg-[#2D2D2D] text-white rounded-xl p-8">
              <h3 className="text-lg font-medium mb-4">Questions about these Terms?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href="mailto:santiago@sheepit.io" className="hover:text-orange-400 transition-colors">
                    santiago@sheepit.io
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🐑</span>
                  <span className="text-gray-400">Sheep It - Weekly launches for indie makers</span>
                </div>
              </div>
            </div>
          </section>

          {/* Final Acceptance */}
          <section className="mt-16 text-center">
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-8">
              <CheckCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">By using Sheep It</h3>
              <p className="text-[#666666]">
                You acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}