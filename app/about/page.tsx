import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'
import { Users, Target, Shield, Zap, Globe, Heart } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA] flex flex-col">
      <Header />
      
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1">
        <div className="mb-12">
          <h1 className="text-3xl font-medium text-[#2D2D2D] mb-3">About Sheep It</h1>
          <p className="text-lg text-[#666666]">
            Empowering indie makers to launch and grow their products
          </p>
        </div>

        <div className="prose prose-gray max-w-none">
          {/* Our Story */}
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">Our Story</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              Sheep It was born from a simple observation: indie makers needed a better way to launch their products. 
              While existing platforms catered to well-funded startups, solo founders and small teams were often overlooked.
            </p>
            <p className="text-[#666666] leading-relaxed mb-4">
              Founded in 2024 by Santiago Sánchez, Sheep It creates a level playing field where every product gets a fair 
              chance to shine. We believe great ideas can come from anywhere, and success shouldn't depend on having a 
              large marketing budget.
            </p>
            <p className="text-[#666666] leading-relaxed">
              Today, we're proud to serve thousands of indie makers worldwide, helping them reach over 50,000 early 
              adopters who are eager to discover and support new products.
            </p>
          </section>

          {/* What We Do */}
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <Target className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Weekly Launches</h3>
                <p className="text-sm text-[#666666]">
                  Every Monday, new products go live for a week-long showcase. Our community votes for their favorites, 
                  and the top 3 win valuable prizes.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <Users className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Community First</h3>
                <p className="text-sm text-[#666666]">
                  Our 50,000+ subscribers are early adopters who love trying new products. They provide valuable 
                  feedback and become your first customers.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <Zap className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Fair Competition</h3>
                <p className="text-sm text-[#666666]">
                  Unlike other platforms, we limit launches per week to ensure every product gets attention. 
                  No getting lost in an endless feed.
                </p>
              </div>
              <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
                <Shield className="w-8 h-8 text-orange-600 mb-3" />
                <h3 className="text-lg font-medium text-[#2D2D2D] mb-2">Quality Control</h3>
                <p className="text-sm text-[#666666]">
                  Every submission is reviewed to ensure it meets our standards. We maintain a high-quality 
                  platform that users trust.
                </p>
              </div>
            </div>
          </section>

          {/* Our Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">Our Values</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-[#2D2D2D]">Support Indie Makers</h3>
                  <p className="text-sm text-[#666666]">
                    We champion solo founders and small teams who are building without venture capital.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-[#2D2D2D]">Global Community</h3>
                  <p className="text-sm text-[#666666]">
                    We connect makers and users from around the world, fostering a diverse ecosystem.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-[#2D2D2D]">Transparency</h3>
                  <p className="text-sm text-[#666666]">
                    Clear rules, fair voting, and honest communication guide everything we do.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Company Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">Company Information</h2>
            <div className="bg-white rounded-xl border border-[#E5E5E5] p-6">
              <div className="space-y-2">
                <p className="text-[#666666]">
                  <span className="font-medium text-[#2D2D2D]">Business Name:</span> Sheep It
                </p>
                <p className="text-[#666666]">
                  <span className="font-medium text-[#2D2D2D]">Operated by:</span> Santiago Sánchez (Sole Proprietor)
                </p>
                <p className="text-[#666666]">
                  <span className="font-medium text-[#2D2D2D]">Founded:</span> 2024
                </p>
                <p className="text-[#666666]">
                  <span className="font-medium text-[#2D2D2D]">Headquarters:</span> Pedro Berro 1238, Montevideo, 11300, Uruguay
                </p>
                <p className="text-[#666666]">
                  <span className="font-medium text-[#2D2D2D]">Contact:</span> santiago@sheepit.io
                </p>
                <p className="text-[#666666]">
                  <span className="font-medium text-[#2D2D2D]">Website:</span> https://sheepit.io
                </p>
              </div>
            </div>
          </section>

          {/* Get in Touch */}
          <section className="mb-12">
            <h2 className="text-2xl font-medium text-[#2D2D2D] mb-4">Get in Touch</h2>
            <p className="text-[#666666] leading-relaxed mb-4">
              Have questions, feedback, or want to partner with us? We'd love to hear from you.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="mailto:santiago@sheepit.io"
                className="bg-[#2D2D2D] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
              >
                Email Us
              </Link>
              <Link
                href="/submit"
                className="bg-white text-[#2D2D2D] border-2 border-[#E5E5E5] px-6 py-3 rounded-lg font-medium hover:border-[#D5D5D5] transition-colors"
              >
                Launch Your Product
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  )
}