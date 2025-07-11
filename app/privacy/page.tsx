import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Shield, Eye, Database, Lock, Users, Globe, Mail, FileText, Cookie } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2D2D2D] rounded-full mb-4">
            <Eye className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-medium text-[#2D2D2D] mb-3">Privacy Policy</h1>
          <p className="text-sm text-[#999999]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Privacy Highlights */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6 mb-12">
          <h2 className="text-lg font-medium text-[#2D2D2D] mb-4">Privacy at a Glance</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Database className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[#2D2D2D] mb-1">Minimal Data</h3>
                <p className="text-xs text-[#666666]">We only collect what's necessary</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[#2D2D2D] mb-1">Secure Storage</h3>
                <p className="text-xs text-[#666666]">Your data is encrypted and protected</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-sm text-[#2D2D2D] mb-1">Your Control</h3>
                <p className="text-xs text-[#666666]">Access, update, or delete anytime</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Introduction */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">1. Our Commitment</h2>
            </div>
            
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <p className="text-[#666666] mb-4">
                At Sheep It, we take your privacy seriously. This policy explains how we handle your personal information 
                when you use our platform at sheepit.io.
              </p>
              <div className="bg-[#F5F5F5] rounded-lg p-4">
                <p className="text-sm text-[#666666]">
                  <strong className="text-[#2D2D2D]">In short:</strong> We collect only what we need, protect it carefully, 
                  and give you control over your data.
                </p>
              </div>
            </div>
          </section>

          {/* What We Collect */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Database className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">2. Information We Collect</h2>
            </div>

            <div className="space-y-6">
              {/* Information You Provide */}
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4">Information You Provide</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <div>
                        <p className="text-sm font-medium text-[#2D2D2D]">Account Info</p>
                        <p className="text-xs text-[#999999]">Email, name, profile details</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <div>
                        <p className="text-sm font-medium text-[#2D2D2D]">Product Data</p>
                        <p className="text-xs text-[#999999]">Names, descriptions, logos</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <div>
                        <p className="text-sm font-medium text-[#2D2D2D]">Payments</p>
                        <p className="text-xs text-[#999999]">Via secure third-party processors</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <div>
                        <p className="text-sm font-medium text-[#2D2D2D]">Communications</p>
                        <p className="text-xs text-[#999999]">Support emails, feedback</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Automatic Collection */}
              <div className="bg-[#FFF9F5] rounded-xl border border-[#FFE5D3] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4">Collected Automatically</h3>
                <div className="space-y-2 text-sm text-[#666666]">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#999999]" />
                    <span>Basic usage data (pages viewed, features used)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cookie className="w-4 h-4 text-[#999999]" />
                    <span>Cookies for authentication and preferences</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#999999]" />
                    <span>Technical logs for security and performance</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How We Use It */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">3. How We Use Your Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Core Services</h3>
                <ul className="space-y-2 text-sm text-[#666666]">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Process product submissions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Manage weekly launch cycles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Send winner newsletters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Process payments securely</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Improvements</h3>
                <ul className="space-y-2 text-sm text-[#666666]">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Enhance user experience</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Analyze usage patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Prevent fraud & abuse</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 mt-0.5">✓</span>
                    <span>Customer support</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Sharing Information */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">4. How We Share Information</h2>
            </div>

            <div className="space-y-6">
              {/* Public Information */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Publicly Visible</h3>
                <p className="text-sm text-[#666666] mb-3">
                  Product submissions are public by design. This includes:
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Product name', 'Description', 'Logo', 'Website', 'Maker name'].map((item) => (
                    <span key={item} className="px-3 py-1 bg-white text-xs text-[#666666] rounded-full border border-green-200">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Service Providers */}
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4">Trusted Service Providers</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#666666]">
                      <span className="font-medium">Supabase:</span> Database & Auth
                    </div>
                    <div className="flex items-center gap-2 text-[#666666]">
                      <span className="font-medium">Stripe:</span> Payments
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[#666666]">
                      <span className="font-medium">Resend:</span> Emails
                    </div>
                    <div className="flex items-center gap-2 text-[#666666]">
                      <span className="font-medium">Vercel:</span> Hosting
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Note */}
              <div className="bg-red-50 rounded-xl border border-red-200 p-4">
                <p className="text-sm text-red-700">
                  <strong>We never sell your personal data.</strong> Period.
                </p>
              </div>
            </div>
          </section>

          {/* Your Rights */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">5. Your Rights & Choices</h2>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden">
              <div className="p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4">You Have Control</h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">→</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">Access Your Data</p>
                      <p className="text-xs text-[#999999]">Request a copy anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">→</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">Update Information</p>
                      <p className="text-xs text-[#999999]">Edit via your dashboard</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">→</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">Delete Account</p>
                      <p className="text-xs text-[#999999]">Remove all your data</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 text-sm">→</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#2D2D2D]">Opt Out</p>
                      <p className="text-xs text-[#999999]">Unsubscribe from emails</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-[#F5F5F5] border-t border-[#E5E5E5] p-4">
                <p className="text-xs text-[#666666]">
                  <strong>GDPR & CCPA:</strong> We comply with privacy regulations. Email us for specific requests.
                </p>
              </div>
            </div>
          </section>

          {/* Data Security */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">6. Data Security</h2>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <p className="text-[#666666] mb-4">
                We implement industry-standard security measures:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 text-sm text-[#666666]">
                  <Lock className="w-4 h-4 text-green-600" />
                  <span>Encryption at rest and in transit</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#666666]">
                  <Shield className="w-4 h-4 text-green-600" />
                  <span>Regular security audits</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#666666]">
                  <Users className="w-4 h-4 text-green-600" />
                  <span>Access controls & authentication</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-[#666666]">
                  <Database className="w-4 h-4 text-green-600" />
                  <span>Secure data backups</span>
                </div>
              </div>
            </div>
          </section>

          {/* Children's Privacy */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">7. Age Requirement</h2>
            </div>

            <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
              <p className="text-[#666666]">
                Sheep It is for users <strong className="text-[#2D2D2D]">18 years and older</strong>. 
                We don't knowingly collect data from children.
              </p>
            </div>
          </section>

          {/* Updates */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">8. Policy Updates</h2>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <p className="text-[#666666] mb-3">
                We may update this policy occasionally. When we do:
              </p>
              <ul className="space-y-2 text-sm text-[#666666]">
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">→</span>
                  We'll update the date at the top
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">→</span>
                  For major changes, we'll email you
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-orange-600">→</span>
                  Continued use means acceptance
                </li>
              </ul>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">9. Contact Us</h2>
            </div>

            <div className="bg-[#2D2D2D] text-white rounded-xl p-8">
              <h3 className="text-lg font-medium mb-4">Privacy Questions?</h3>
              <p className="text-gray-300 mb-4">
                We're here to help with any privacy concerns or requests.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <a href="mailto:santiago@sheepit.io" className="hover:text-orange-400 transition-colors">
                    santiago@sheepit.io
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🐑</span>
                  <span className="text-gray-400">Sheep It Privacy Team</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-sm text-gray-400">
                  For privacy-specific requests, please include "Privacy Request" in your email subject.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}