'use client'

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { TrendingUp, Users, Trophy, Target } from 'lucide-react'

const stats = [
  {
    icon: TrendingUp,
    value: '0',
    label: 'Products Launched',
    description: 'Total products that have launched on Sheep It'
  },
  {
    icon: Users,
    value: '0',
    label: 'Community Members',
    description: 'Active makers and early adopters'
  },
  {
    icon: Trophy,
    value: '0',
    label: 'Winners Featured',
    description: 'Top products from each weekly launch'
  },
  {
    icon: Target,
    value: '100%',
    label: 'Success Rate',
    description: 'Of launched products that gained valuable feedback'
  }
]

const insights = [
  {
    title: 'Best Launch Day',
    value: 'Monday',
    description: 'Products launched on Mondays get 40% more engagement'
  },
  {
    title: 'Average Votes',
    value: '150+',
    description: 'Average number of votes per launched product'
  },
  {
    title: 'Peak Activity',
    value: '10-11 AM EST',
    description: 'When most makers and voters are active'
  },
  {
    title: 'Top Category',
    value: 'SaaS Tools',
    description: 'Most popular type of product launched'
  }
]

export default function StatsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCFA]">
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
            Sheep It Launch Statistics
          </h1>
          <p className="text-lg text-[#666666] max-w-2xl mx-auto">
            Real data from our community of indie makers and the products they launch every week.
          </p>
          <p className="text-sm text-[#999999] mt-2">
            Updated daily • Launch begins August 4th, 2025
          </p>
        </div>

        {/* Main Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6 text-center">
                <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-3xl font-bold text-[#2D2D2D] mb-2">
                  {stat.value}
                </div>
                <div className="text-sm font-medium text-[#2D2D2D] mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-[#666666]">
                  {stat.description}
                </div>
              </div>
            )
          })}
        </div>

        {/* Launch Insights */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6 text-center">
            Launch Insights
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight, index) => (
              <div key={index} className="bg-white rounded-xl border-4 border-[#E5E5E5] p-6">
                <div className="text-2xl font-bold text-orange-600 mb-2">
                  {insight.value}
                </div>
                <div className="text-lg font-semibold text-[#2D2D2D] mb-1">
                  {insight.title}
                </div>
                <div className="text-sm text-[#666666]">
                  {insight.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Launch Calendar */}
        <div className="bg-white rounded-xl border-4 border-[#E5E5E5] p-8 mb-12">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6 text-center">
            Launch Calendar
          </h2>
          <div className="text-center text-[#666666] mb-6">
            <p>New products launch every Monday at 12:00 PM EST</p>
          </div>
          
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-2 text-sm font-medium text-[#666666]">
                {day}
              </div>
            ))}
            
            {/* Sample calendar grid - you can make this dynamic later */}
            {Array.from({ length: 35 }, (_, i) => {
              const isLaunchDay = (i + 1) % 7 === 2 && i > 6 && i < 28 // Mondays
              return (
                <div 
                  key={i} 
                  className={`py-2 text-sm ${
                    isLaunchDay 
                      ? 'bg-orange-100 text-orange-600 font-semibold rounded-lg' 
                      : 'text-[#999999]'
                  }`}
                >
                  {i > 6 && i < 28 ? i - 6 : ''}
                </div>
              )
            })}
          </div>
          
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-[#666666]">
              <div className="w-3 h-3 bg-orange-100 rounded"></div>
              Launch Days
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border-4 border-orange-200 p-8 text-center">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-4">
            Ready to Launch Your Product?
          </h2>
          <p className="text-[#666666] mb-6 max-w-2xl mx-auto">
            Join hundreds of indie makers who have successfully launched their products on Sheep It.
          </p>
          <a
            href="/submit"
            className="inline-flex items-center bg-[#2D2D2D] text-white px-6 py-3 rounded-lg hover:bg-[#1D1D1D] transition-colors"
          >
            Submit Your Product
          </a>
        </div>
      </main>
      <Footer />
    </div>
  )
}