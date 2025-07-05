'use client'

import Header from '@/components/Header'
import CountdownTimer from '@/components/CountdownTimer'
import ProductCard from '@/components/ProductCard'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Launch Today, Get a Badge & Community Love 🚀
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            The weekly launchpad for indie startups. Submit your product, get votes, and win your place in the spotlight.
          </p>
        </div>

        <CountdownTimer />

        <div className="max-w-4xl mx-auto mb-12">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl font-bold mb-4">🚀 Get Featured</h2>
            <p className="text-lg mb-6">Premium visibility for your product. Limited spots available.</p>
            <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Learn More →
            </button>
          </div>
        </div>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Launching Now</h2>
          <div className="text-center">
            <div className="text-6xl text-gray-300 mb-4">🏆</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products this week yet!</h3>
            <p className="text-gray-600 mb-6">Be the first to launch your product this week.</p>
            <button className="bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
              Submit Your Product
            </button>
          </div>
        </section>
      </main>
    </div>
  )
} 