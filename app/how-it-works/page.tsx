'use client'

import Header from '@/components/Header'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Trophy, Heart, Shield, Clock, Users, Star, MessageCircle } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      
      <main className="max-w-5xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-[#F5F5F5] px-4 py-2 rounded-full text-sm text-[#666666] mb-6">
            <Sparkles className="w-4 h-4" />
            <span>The friendlier way to launch</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#2D2D2D] mb-6 leading-tight">
            10 products. 7 days.<br />
            <span className="text-[#666666]">Real feedback.</span>
          </h1>
          <p className="text-xl text-[#666666] leading-relaxed max-w-2xl mx-auto">
            Every Monday, we showcase 10 new products to our community of early adopters. 
            No algorithms. No pay-to-win. Just great products and engaged users.
          </p>
        </div>

        {/* Visual Process */}
        <section className="mb-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-[#F5F5F5] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2D2D2D] transition-colors">
                <Zap className="w-8 h-8 text-[#666666] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">Monday Launch</h3>
              <p className="text-[#666666]">
                10 products go live at midnight. Yours could be one of them.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-[#F5F5F5] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2D2D2D] transition-colors">
                <Heart className="w-8 h-8 text-[#666666] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">Week of Votes</h3>
              <p className="text-[#666666]">
                Community discovers, tries, and votes for their favorites.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-[#F5F5F5] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#2D2D2D] transition-colors">
                <Trophy className="w-8 h-8 text-[#666666] group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-2">Sunday Winners</h3>
              <p className="text-[#666666]">
                Top 3 products win badges and permanent recognition.
              </p>
            </div>
          </div>
        </section>

        {/* Why it's different */}
        <section className="mb-24">
          <div className="bg-[#2D2D2D] text-white rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Why we limit to 10</h2>
            <p className="text-xl opacity-90 leading-relaxed max-w-2xl mx-auto">
              Other platforms have hundreds of launches daily. Good products get buried 
              in minutes. We do things differently. With just 10 products per week, 
              every maker gets a fair shot at success.
            </p>
          </div>
        </section>

        {/* For Makers & Early Adopters - Side by Side */}
        <section className="mb-24">
          <div className="grid md:grid-cols-2 gap-12">
            {/* For Makers */}
            <div>
              <h2 className="text-3xl font-semibold text-[#2D2D2D] mb-8">For makers</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D2D2D] mb-1">Fair competition</h3>
                    <p className="text-sm text-[#666666]">Compete with 9 others, not hundreds</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D2D2D] mb-1">Full week exposure</h3>
                    <p className="text-sm text-[#666666]">Not buried in minutes like other platforms</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D2D2D] mb-1">Real feedback</h3>
                    <p className="text-sm text-[#666666]">From users who love trying new products</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D2D2D] mb-1">Simple process</h3>
                    <p className="text-sm text-[#666666]">Submit once, we handle the rest</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Early Adopters */}
            <div>
              <h2 className="text-3xl font-semibold text-[#2D2D2D] mb-8">For explorers</h2>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D2D2D] mb-1">Curated quality</h3>
                    <p className="text-sm text-[#666666]">Every product is reviewed before launch</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D2D2D] mb-1">Be first</h3>
                    <p className="text-sm text-[#666666]">Discover products before they go mainstream</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Heart className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D2D2D] mb-1">Shape the future</h3>
                    <p className="text-sm text-[#666666]">Your feedback directly impacts success</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-[#F5F5F5] rounded-xl flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-[#666666]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[#2D2D2D] mb-1">Fresh weekly</h3>
                    <p className="text-sm text-[#666666]">10 new products every Monday</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How to Submit */}
        <section className="mb-24">
          <div className="bg-white rounded-3xl border border-[#E5E5E5] p-10">
            <h2 className="text-3xl font-semibold text-[#2D2D2D] mb-8 text-center">Ready to launch?</h2>
            <div className="grid md:grid-cols-3 gap-6 mb-10">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#2D2D2D] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  1
                </div>
                <h3 className="font-medium text-[#2D2D2D] mb-2">Submit</h3>
                <p className="text-sm text-[#666666]">Tell us about your product with screenshots and details</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#2D2D2D] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  2
                </div>
                <h3 className="font-medium text-[#2D2D2D] mb-2">Get Approved</h3>
                <p className="text-sm text-[#666666]">We review daily and approve quality products</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-[#2D2D2D] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-lg font-bold">
                  3
                </div>
                <h3 className="font-medium text-[#2D2D2D] mb-2">Launch Monday</h3>
                <p className="text-sm text-[#666666]">Your product goes live automatically at midnight</p>
              </div>
            </div>

            <div className="text-center">
              <Link 
                href="/submit"
                className="inline-flex items-center gap-2 bg-[#2D2D2D] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#1D1D1D] transition-colors"
              >
                Submit your product
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Quick FAQ */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="font-medium text-[#2D2D2D] mb-2">Is it really free?</h3>
              <p className="text-[#666666]">Yes! Basic submission and launch are free. Paid options available for queue priority.</p>
            </div>
            <div>
              <h3 className="font-medium text-[#2D2D2D] mb-2">When are winners announced?</h3>
              <p className="text-[#666666]">Every Sunday at 11:59 PM. Top 3 products get permanent winner badges.</p>
            </div>
            <div>
              <h3 className="font-medium text-[#2D2D2D] mb-2">Can I submit multiple products?</h3>
              <p className="text-[#666666]">Yes, but only one product per maker can launch each week.</p>
            </div>
            <div>
              <h3 className="font-medium text-[#2D2D2D] mb-2">How long is the queue?</h3>
              <p className="text-[#666666]">Varies by demand. Typically 2-4 weeks. Skip the line options available.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}