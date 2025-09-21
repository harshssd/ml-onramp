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
              <span className="text-white/90 text-sm font-medium">🚀 Level Up Your ML Skills</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              ML <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">Onramp</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform into a <span className="text-yellow-400 font-semibold">Machine Learning Wizard</span> through 
              interactive quests, hands-on challenges, and epic achievements!
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/signup">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                >
                  🎮 Start Your Quest
                </Button>
              </Link>
              <Link href="/login">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10 font-semibold text-lg px-8 py-4 rounded-xl backdrop-blur-sm"
                >
                  ⚡ Continue Journey
                </Button>
              </Link>
            </div>
          </div>

          {/* Game Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Interactive Quests
              </h3>
              <p className="text-white/80">
                Complete hands-on challenges and interactive playgrounds that make learning feel like gaming!
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Achievements & XP
              </h3>
              <p className="text-white/80">
                Earn badges, level up, and unlock new content as you master machine learning concepts!
              </p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-xl font-bold text-white mb-3">
                Progress Tracking
              </h3>
              <p className="text-white/80">
                Visualize your learning journey with detailed stats, streaks, and progress indicators!
              </p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold text-white mb-6">Join the ML Quest!</h3>
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
        </div>
      </div>
    </div>
  );
}