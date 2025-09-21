'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type Lesson } from '@/components/LessonCard';
import { ProgressRing } from '@/components/ProgressRing';
import { LogOut, User, Trophy, Star, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppPage() {
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  const loadLessons = useCallback(async () => {
    try {
      const response = await fetch('/api/lessons');
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  }, []);

  const loadUserProgress = useCallback(async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_progress')
        .select('lesson_id, progress_percentage, completed')
        .eq('user_id', userId);

      const progressMap: Record<string, number> = {};
      data?.forEach((item) => {
        progressMap[item.lesson_id] = item.progress_percentage;
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading user progress:', error);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
      await loadLessons();
      await loadUserProgress(user.id);
    };

    getUser();
  }, [router, supabase.auth, loadLessons, loadUserProgress]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const handleStartLesson = (slug: string) => {
    router.push(`/lesson/${slug}`);
  };

  const calculateOverallProgress = () => {
    if (lessons.length === 0) return 0;
    const totalProgress = Object.values(userProgress).reduce((sum, progress) => sum + progress, 0);
    return totalProgress / lessons.length;
  };

  const calculateXP = () => {
    return Math.floor(calculateOverallProgress() * 1000);
  };

  const calculateLevel = () => {
    return Math.floor(calculateXP() / 100) + 1;
  };

  const getCompletedLessons = () => {
    return Object.values(userProgress).filter(progress => progress === 100).length;
  };

  const getCurrentStreak = () => {
    // Mock streak calculation - in real app, this would be calculated from actual data
    return Math.floor(Math.random() * 7) + 1;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className="mt-4 text-white/80 text-lg">Loading your quest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Game Header */}
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🧙‍♂️</div>
                <div>
                  <h1 className="text-2xl font-bold text-white">ML Quest</h1>
                  <p className="text-white/70 text-sm">Level {calculateLevel()} • {calculateXP()} XP</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                {/* XP Bar */}
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <div className="w-32 bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(calculateXP() % 100)}%` }}
                    ></div>
                  </div>
                  <span className="text-white/80 text-sm font-medium">{calculateXP() % 100}/100</span>
                </div>

                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-white/70" />
                  <span className="text-white/90 text-sm">{user?.email?.split('@')[0]}</span>
                </div>
                
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Exit Quest
                </Button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Hero Stats Section */}
          <div className="mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Welcome back, Wizard! 🧙‍♂️</h2>
                  <p className="text-white/80 text-lg">Ready to continue your machine learning journey?</p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <ProgressRing progress={calculateOverallProgress()} size={120} />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{calculateLevel()}</div>
                  <div className="text-white/70 text-sm">Level</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">{getCompletedLessons()}</div>
                  <div className="text-white/70 text-sm">Quests Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{getCurrentStreak()}</div>
                  <div className="text-white/70 text-sm">Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{Math.round(calculateOverallProgress())}%</div>
                  <div className="text-white/70 text-sm">Overall Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Trophy className="h-6 w-6 mr-2 text-yellow-400" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className="text-white font-semibold">First Quest</div>
                    <div className="text-white/70 text-sm">Complete your first lesson</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className="text-white font-semibold">Streak Master</div>
                    <div className="text-white/70 text-sm">3 day learning streak</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className="text-white font-semibold">Progress Champion</div>
                    <div className="text-white/70 text-sm">50% overall progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Target className="h-6 w-6 mr-2 text-blue-400" />
              Available Quests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="group">
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl">
                        {lesson.title.includes('Regression') ? '📊' : 
                         lesson.title.includes('Classification') ? '🎯' : 
                         lesson.title.includes('Clustering') ? '🔍' : '📚'}
                      </div>
                      <div className="flex items-center space-x-2">
                        {userProgress[lesson.id] === 100 && (
                          <div className="text-green-400 text-xl">✅</div>
                        )}
                        <div className="text-white/60 text-sm">Quest #{index + 1}</div>
                      </div>
                    </div>
                    
                    <h4 className="text-xl font-bold text-white mb-3 group-hover:text-yellow-400 transition-colors">
                      {lesson.title}
                    </h4>
                    
                    <p className="text-white/70 mb-4 text-sm leading-relaxed">
                      {lesson.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-white/60 mb-1">
                        <span>Progress</span>
                        <span>{userProgress[lesson.id] || 0}%</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${userProgress[lesson.id] || 0}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleStartLesson(lesson.slug)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105"
                    >
                      {userProgress[lesson.id] === 100 ? '🔄 Replay Quest' : 
                       userProgress[lesson.id] > 0 ? '⚡ Continue Quest' : '🚀 Start Quest'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
