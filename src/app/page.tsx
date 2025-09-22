'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/app');
      } else {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [router, supabase.auth]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center">
          {/* Hero Section */}
          <div className="mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
              <span className="text-white/90 text-sm font-medium">🤖 Learn AI & Machine Learning</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              AI Learning for <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Everybody</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Master <span className="text-yellow-400 font-semibold">Artificial Intelligence</span> and 
              <span className="text-yellow-400 font-semibold"> Machine Learning</span> from scratch! 
              Interactive courses, hands-on projects, and real-world applications for everyone.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/learning">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  🚀 Start Learning AI
                </Button>
              </Link>
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  📚 Join Free
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 rounded-xl backdrop-blur-sm"
                >
                  🔑 Sign In
                </Button>
              </Link>
            </div>
          </div>

          {/* Learning Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Interactive Learning
              </h3>
              <p className="text-white/80">
                Hands-on coding challenges, interactive playgrounds, and real-world projects that make AI learning engaging!
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Achievements & Progress
              </h3>
              <p className="text-white/80">
                Earn badges, track your progress, and celebrate milestones as you master AI and machine learning!
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold text-white mb-3">
                For Everyone
              </h3>
              <p className="text-white/80">
                No prerequisites needed! Start from zero and build your AI expertise with our comprehensive curriculum!
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10 mb-16">
            <h3 className="text-2xl font-bold text-white mb-6">Join the AI Learning Community!</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-2">1000+</div>
                <div className="text-white/80">Active Learners</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-400 mb-2">50+</div>
                <div className="text-white/80">Interactive Lessons</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
                <div className="text-white/80">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Gaming-Style Pricing Section */}
          <div className="relative">
            {/* Anime-style background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">✨</div>
            <div className="absolute -bottom-10 right-10 text-4xl animate-pulse">🌟</div>
            <div className="absolute top-1/2 -left-5 text-3xl animate-spin">⚡</div>
            <div className="absolute top-1/4 -right-5 text-3xl animate-pulse">💫</div>
            
            <div className="relative bg-gradient-to-br from-purple-900/90 via-pink-900/90 to-blue-900/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 border-2 border-white/20 shadow-2xl">
              {/* Header with anime styling */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold text-lg mb-6 animate-pulse">
                  🎮 LEVEL UP YOUR AI SKILLS! 🎮
                </div>
                <h2 className="text-4xl md:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Choose Your Adventure
                </h2>
                <p className="text-xl text-white/80 max-w-2xl mx-auto">
                  Embark on an epic journey to become an AI master! Select your path and unlock incredible powers! 🚀
                </p>
              </div>

              {/* Pricing Cards with Gaming Theme */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Free Tier - Rookie */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border-2 border-green-400/50 hover:border-green-400 transition-all duration-300 transform hover:scale-105">
                    <div className="text-center">
                      <div className="text-5xl mb-4">🥉</div>
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500 text-black font-bold text-sm mb-4">
                        ROOKIE LEVEL
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">Free Forever</h3>
                      <div className="text-4xl font-bold text-green-400 mb-6">$0</div>
                      
                      <div className="space-y-4 text-left mb-8">
                        <div className="flex items-center text-white/90">
                          <span className="text-green-400 mr-3">✓</span>
                          <span>AI Awakening Track (Beginner)</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-green-400 mr-3">✓</span>
                          <span>Interactive Coding Playgrounds</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-green-400 mr-3">✓</span>
                          <span>Basic Projects & Challenges</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-green-400 mr-3">✓</span>
                          <span>Community Support</span>
                        </div>
                        <div className="flex items-center text-white/60">
                          <span className="text-gray-500 mr-3">✗</span>
                          <span>Advanced Tracks</span>
                        </div>
                        <div className="flex items-center text-white/60">
                          <span className="text-gray-500 mr-3">✗</span>
                          <span>Certificates & Badges</span>
                        </div>
                      </div>
                      
                      <Link href="/signup">
                        <Button className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-200">
                          🎯 Start as Rookie
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Pro Tier - Hero */}
                <div className="relative group lg:scale-110">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-4 py-1 rounded-full text-sm font-bold animate-bounce">
                    🔥 MOST POPULAR! 🔥
                  </div>
                  <div className="relative bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl p-8 border-2 border-purple-400/50 hover:border-purple-400 transition-all duration-300 transform hover:scale-105">
                    <div className="text-center">
                      <div className="text-5xl mb-4">🥇</div>
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm mb-4">
                        HERO LEVEL
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">AI Builder Pro</h3>
                      <div className="text-4xl font-bold text-purple-400 mb-6">
                        $29<span className="text-lg text-white/60">/month</span>
                      </div>
                      
                      <div className="space-y-4 text-left mb-8">
                        <div className="flex items-center text-white/90">
                          <span className="text-purple-400 mr-3">✓</span>
                          <span>Everything in Free +</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-purple-400 mr-3">✓</span>
                          <span>AI Builder Track (Advanced)</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-purple-400 mr-3">✓</span>
                          <span>20+ Interactive Widgets</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-purple-400 mr-3">✓</span>
                          <span>Mini-Projects & Capstones</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-purple-400 mr-3">✓</span>
                          <span>Certificates & Badges</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-purple-400 mr-3">✓</span>
                          <span>Priority Support</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-purple-400 mr-3">✓</span>
                          <span>Download Projects</span>
                        </div>
                      </div>
                      
                      <Link href="/signup?plan=pro">
                        <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-200">
                          ⚡ Become a Hero
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Enterprise Tier - Legend */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                  <div className="relative bg-gradient-to-br from-yellow-900 to-orange-900 rounded-2xl p-8 border-2 border-yellow-400/50 hover:border-yellow-400 transition-all duration-300 transform hover:scale-105">
                    <div className="text-center">
                      <div className="text-5xl mb-4">👑</div>
                      <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold text-sm mb-4">
                        LEGEND LEVEL
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">AI Master</h3>
                      <div className="text-4xl font-bold text-yellow-400 mb-6">
                        $99<span className="text-lg text-white/60">/month</span>
                      </div>
                      
                      <div className="space-y-4 text-left mb-8">
                        <div className="flex items-center text-white/90">
                          <span className="text-yellow-400 mr-3">✓</span>
                          <span>Everything in Pro +</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-yellow-400 mr-3">✓</span>
                          <span>1-on-1 Mentoring Sessions</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-yellow-400 mr-3">✓</span>
                          <span>Custom AI Projects</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-yellow-400 mr-3">✓</span>
                          <span>Job Placement Assistance</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-yellow-400 mr-3">✓</span>
                          <span>Exclusive Discord Community</span>
                        </div>
                        <div className="flex items-center text-white/90">
                          <span className="text-yellow-400 mr-3">✓</span>
                          <span>Lifetime Access</span>
                        </div>
                      </div>
                      
                      <Link href="/signup?plan=enterprise">
                        <Button className="w-full bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-black font-bold py-3 rounded-xl transform hover:scale-105 transition-all duration-200">
                          👑 Become a Legend
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center mt-12">
                <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-8 border border-white/20">
                  <h3 className="text-3xl font-bold text-white mb-4">🎮 Ready to Level Up?</h3>
                  <p className="text-xl text-white/80 mb-6">
                    Join thousands of AI adventurers on their quest to master artificial intelligence!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/learning">
                      <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200">
                        🚀 Start Your Quest Now
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button variant="outline" className="border-2 border-white/30 text-white hover:bg-white/10 font-bold text-lg px-8 py-4 rounded-xl backdrop-blur-sm">
                        🎯 Join the Adventure
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}