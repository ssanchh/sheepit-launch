import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { AlertCircle, CheckCircle, XCircle, Clock, Mail, Zap, Crown, CreditCard, FileText } from 'lucide-react'

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#2D2D2D] rounded-full mb-4">
            <CreditCard className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-medium text-[#2D2D2D] mb-3">Refund Policy</h1>
          <p className="text-sm text-[#999999]">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        {/* Quick Summary */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-200 p-6 mb-12">
          <h2 className="text-lg font-medium text-[#2D2D2D] mb-4">30-Second Summary</h2>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#2D2D2D]">14-Day Window</p>
                <p className="text-xs text-[#666666]">Request within 14 days</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#2D2D2D]">Fair Policy</p>
                <p className="text-xs text-[#666666]">Full refunds if we fail</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-[#2D2D2D]">Quick Response</p>
                <p className="text-xs text-[#666666]">3-5 business days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-12">
          {/* Our Promise */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">Our Promise</h2>
            </div>
            
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <p className="text-[#666666] leading-relaxed">
                We believe in fair business. If we don't deliver what we promised, you get your money back. 
                It's that simple. This policy covers all premium services on Sheep It.
              </p>
            </div>
          </section>

          {/* What's Covered */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">Services Covered</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-5 h-5 text-orange-600" />
                  <h3 className="font-medium text-[#2D2D2D]">Queue Skip - $35</h3>
                </div>
                <p className="text-sm text-[#666666] mb-3">
                  Jump ahead in the launch queue
                </p>
                <div className="text-xs text-[#999999]">
                  Refundable until we move your position
                </div>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-orange-600" />
                  <h3 className="font-medium text-[#2D2D2D]">Featured Spot - $49</h3>
                </div>
                <p className="text-sm text-[#666666] mb-3">
                  7 days of premium visibility
                </p>
                <div className="text-xs text-[#999999]">
                  Refundable before feature period starts
                </div>
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">Refund Eligibility</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Eligible */}
              <div className="bg-green-50 rounded-xl border border-green-200 p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  You CAN Get a Refund
                </h3>
                <ul className="space-y-3 text-sm text-[#666666]">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>We failed to deliver the service</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Technical error prevented delivery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>You were charged twice</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>You cancel before service starts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>Product rejected after purchase</span>
                  </li>
                </ul>
              </div>

              {/* Not Eligible */}
              <div className="bg-red-50 rounded-xl border border-red-200 p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  No Refund Available
                </h3>
                <ul className="space-y-3 text-sm text-[#666666]">
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✕</span>
                    <span>Service already delivered</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✕</span>
                    <span>Didn't get expected results</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✕</span>
                    <span>Changed your mind after</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✕</span>
                    <span>Violated our terms</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 mt-0.5">✕</span>
                    <span>Your site was down</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* How to Request */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">How to Request a Refund</h2>
            </div>

            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="space-y-6">
                {/* Steps */}
                <div className="space-y-4">
                  {[
                    { step: '1', title: 'Email Us', desc: 'Send request to santiago@sheepit.io within 14 days', icon: Mail },
                    { step: '2', title: 'Include Details', desc: 'Order number, email used, and reason', icon: FileText },
                    { step: '3', title: 'We Review', desc: 'Response within 3-5 business days', icon: Clock },
                    { step: '4', title: 'Get Refund', desc: 'Processed within 5-10 days if approved', icon: CheckCircle }
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#F5F5F5] rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="font-medium text-[#2D2D2D]">{item.step}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-[#2D2D2D] mb-1">{item.title}</h4>
                        <p className="text-sm text-[#666666]">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Email Template */}
                <div className="bg-[#F5F5F5] rounded-lg p-4">
                  <p className="text-xs font-medium text-[#2D2D2D] mb-2">Email Template:</p>
                  <div className="bg-white rounded border border-[#E5E5E5] p-3 text-xs text-[#666666] font-mono">
                    Subject: Refund Request - [Your Order #]<br/>
                    <br/>
                    Hi Santiago,<br/>
                    <br/>
                    Order: [Your order number]<br/>
                    Email: [Your account email]<br/>
                    Service: [Queue Skip / Featured]<br/>
                    Reason: [Brief explanation]<br/>
                    <br/>
                    Thanks!
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Special Cases */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">Special Situations</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Product Rejected?</h3>
                <p className="text-sm text-[#666666]">
                  Automatic full refund + feedback to help you improve for next time.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Unhappy with Results?</h3>
                <p className="text-sm text-[#666666]">
                  While we can't guarantee specific outcomes, reach out - we might be able to help in other ways.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <h3 className="font-medium text-[#2D2D2D] mb-3">Dispute Resolution</h3>
                <p className="text-sm text-[#666666]">
                  If you disagree with our decision, reply to our email for escalation to management.
                </p>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#F5F5F5] rounded-lg flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#666666]" />
              </div>
              <h2 className="text-2xl font-medium text-[#2D2D2D]">Get in Touch</h2>
            </div>

            <div className="bg-[#2D2D2D] text-white rounded-xl p-8">
              <h3 className="text-lg font-medium mb-4">Need a Refund?</h3>
              <p className="text-gray-300 mb-6">
                We're here to help. Most requests are resolved within 24 hours.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <a href="mailto:santiago@sheepit.io?subject=Refund Request" className="hover:text-orange-400 transition-colors">
                      santiago@sheepit.io
                    </a>
                    <p className="text-xs text-gray-500 mt-1">Include "Refund Request" in subject</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-300">Response Time</p>
                    <p className="text-xs text-gray-500">3-5 business days</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Footer Note */}
          <section className="text-center">
            <div className="bg-[#F5F5F5] rounded-xl p-6">
              <p className="text-sm text-[#666666]">
                This policy is part of our{' '}
                <Link href="/terms-and-conditions" className="text-orange-600 hover:text-orange-700">
                  Terms of Service
                </Link>
                {' '}and works alongside our{' '}
                <Link href="/privacy" className="text-orange-600 hover:text-orange-700">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}