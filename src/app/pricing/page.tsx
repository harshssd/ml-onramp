'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto text-center">
          {/* Navigation */}
          <div className="mb-8">
            <Link href="/">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 mb-4">
                🏠 Back to Home
              </Button>
            </Link>
          </div>

          {/* Header */}
          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Master AI
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Choose your learning path and unlock your AI potential
          </p>

          {/* Gaming-Style Pricing Section */}
          <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                LEVEL UP YOUR AI SKILLS!
              </h2>
              <p className="text-xl text-white/80 mb-2">Choose your learning path and unlock your potential</p>
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <span className="text-2xl">⚡</span>
                <span className="text-lg font-semibold">Limited Time: 50% OFF First Month!</span>
                <span className="text-2xl">⚡</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Rookie Tier */}
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm rounded-2xl p-6 border border-blue-400/30 hover:border-blue-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">🥉</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Rookie</h3>
                  <div className="text-3xl font-bold text-blue-300 mb-2">$9<span className="text-lg text-white/60">/month</span></div>
                  <p className="text-white/80 mb-6">Perfect for beginners</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    AI Awakening Track (4 chapters)
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    Interactive widgets & quizzes
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    Community access
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    Progress tracking
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 rounded-xl">
                  Start as Rookie
                </Button>
              </div>

              {/* Hero Tier */}
              <div className="bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm rounded-2xl p-6 border-2 border-purple-400/50 hover:border-purple-400/70 transition-all duration-300 hover:scale-105 hover:shadow-xl relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-4">🥇</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Hero</h3>
                  <div className="text-3xl font-bold text-purple-300 mb-2">$19<span className="text-lg text-white/60">/month</span></div>
                  <p className="text-white/80 mb-6">For serious learners</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    All Rookie features
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    AI Builder Track (4 chapters)
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    Advanced projects & capstones
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    Priority support
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    Certificate of completion
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 rounded-xl">
                  Become a Hero
                </Button>
              </div>

              {/* Legend Tier */}
              <div className="bg-gradient-to-br from-yellow-500/20 to-red-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-300 hover:scale-105 hover:shadow-xl">
                <div className="text-center">
                  <div className="text-4xl mb-4">🏆</div>
                  <h3 className="text-2xl font-bold text-white mb-2">Legend</h3>
                  <div className="text-3xl font-bold text-yellow-300 mb-2">$39<span className="text-lg text-white/60">/month</span></div>
                  <p className="text-white/80 mb-6">For AI masters</p>
                </div>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    All Hero features
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    AI Mastery Track (4 chapters)
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    1-on-1 mentorship sessions
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    Custom project guidance
                  </li>
                  <li className="flex items-center text-white/90">
                    <span className="text-green-400 mr-2">✓</span>
                    Lifetime access to all content
                  </li>
                </ul>
                <Button className="w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-semibold py-3 rounded-xl">
                  Achieve Legend Status
                </Button>
              </div>
            </div>

            <div className="text-center mt-8">
              <p className="text-white/70 text-sm">
                All plans include 7-day free trial • Cancel anytime • No hidden fees
              </p>
            </div>
          </div>

          {/* Additional CTA */}
          <div className="mt-12">
            <Link href="/signup">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
                🚀 Start Your AI Journey Today
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
