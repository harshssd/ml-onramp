'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RegressionPlayground } from '@/components/RegressionPlayground';
import { ProgressRing } from '@/components/ProgressRing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, BookOpen, Star, Trophy, Zap, Target, Award, Flame } from 'lucide-react';
import type { Lesson } from '@/components/LessonCard';

export default function LessonPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const router = useRouter();
  const params = useParams();
  const supabase = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);
    };

    getUser();
  }, [router, supabase.auth]);

  useEffect(() => {
    if (user && params?.slug) {
      loadLesson();
    }
  }, [user, params?.slug]);

  // Refresh progress when user or lesson changes
  useEffect(() => {
    if (user && lesson) {
      loadUserProgress(lesson.id);
    }
  }, [user, lesson]);

  const loadLesson = async () => {
    if (!params?.slug) return;
    
    try {
      const response = await fetch(`/api/lessons/${params.slug}`);
      if (!response.ok) {
        router.push('/app');
        return;
      }
      const data = await response.json();
      setLesson(data);
      
      // Load user progress for this lesson
      if (user) {
        await loadUserProgress(data.id);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      router.push('/app');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserProgress = async (lessonId: string) => {
    try {
      const { data, error } = await supabase
        .from('user_progress')
        .select('progress_percentage, completed')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .maybeSingle();

      if (error) {
        console.error('Error loading user progress:', error);
        return;
      }

      if (data) {
        setProgress(data.progress_percentage || 0);
        setIsCompleted(data.completed || false);
      } else {
        // No progress record exists yet
        setProgress(0);
        setIsCompleted(false);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
      setProgress(0);
      setIsCompleted(false);
    }
  };

  const updateProgress = async (newProgress: number) => {
    if (!user || !lesson) {
      console.error('Missing user or lesson data:', { user: !!user, lesson: !!lesson });
      return;
    }

    try {
      console.log('Updating progress:', {
        user_id: user.id,
        lesson_id: lesson.id,
        progress_percentage: newProgress,
        completed: newProgress === 100
      });

      const { data, error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lesson.id,
          progress_percentage: newProgress,
          completed: newProgress === 100,
          completed_at: newProgress === 100 ? new Date().toISOString() : null,
        }, {
          onConflict: 'user_id,lesson_id'
        })
        .select();

      if (error) {
        console.error('Supabase error updating progress:', error);
        alert(`Error updating progress: ${error.message}`);
        return;
      }

      console.log('Progress updated successfully:', data);
      setProgress(newProgress);
      setIsCompleted(newProgress === 100);
      
      // Show celebration for completion
      if (newProgress === 100) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    } catch (error) {
      console.error('Unexpected error updating progress:', error);
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const markAsComplete = () => {
    updateProgress(100);
  };

  const getQuestIcon = (title: string) => {
    if (title.includes('Regression')) return '📊';
    if (title.includes('Classification')) return '🎯';
    if (title.includes('Clustering')) return '🔍';
    if (title.includes('Neural')) return '🧠';
    return '📚';
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'text-green-400 bg-green-400/20';
      case 'intermediate': return 'text-yellow-400 bg-yellow-400/20';
      case 'advanced': return 'text-red-400 bg-red-400/20';
      default: return 'text-blue-400 bg-blue-400/20';
    }
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

  if (!lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Quest not found</h1>
          <Button 
            onClick={() => router.push('/app')}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
          >
            Back to Quest Board
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      </div>

      {/* Celebration overlay */}
      {showCelebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-3xl p-8 text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-black mb-2">Quest Completed!</h2>
            <p className="text-black/80 text-lg">+100 XP • +1 Achievement</p>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Game Header */}
        <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => router.push('/app')}
                  className="flex items-center text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Quest Board
                </Button>
                <div className="h-6 w-px bg-white/20" />
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{getQuestIcon(lesson.title)}</div>
                  <div>
                    <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
                    <p className="text-white/70 text-sm">Quest in Progress</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <div className="w-32 bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <span className="text-white/80 text-sm font-medium">{progress}%</span>
                </div>

                {isCompleted && (
                  <div className="flex items-center text-green-400">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Quest Complete!</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Quest Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quest Header */}
              <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </div>
                    <div className="flex items-center text-white/70 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      {lesson.duration} min
                    </div>
                    <div className="flex items-center text-white/70 text-sm">
                      <BookOpen className="h-4 w-4 mr-1" />
                      Interactive Quest
                    </div>
                  </div>
                  <div className="text-4xl">{getQuestIcon(lesson.title)}</div>
                </div>
                
                <h2 className="text-3xl font-bold text-white mb-4">{lesson.title}</h2>
                <p className="text-white/80 text-lg leading-relaxed mb-6">{lesson.description}</p>
                
                {/* Quest Progress */}
                <div className="bg-white/5 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white/80 font-medium">Quest Progress</span>
                    <span className="text-white font-bold">{progress}%</span>
                  </div>
                  <div className="w-full bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-blue-400 to-purple-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Quest Sections */}
              <div className="space-y-6">
                {lesson.content?.sections?.map((section: any, index: number) => ( // eslint-disable-line @typescript-eslint/no-explicit-any
                  <div key={index} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                      <h3 className="text-xl font-bold text-white">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-white/80 leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Playground */}
              {lesson.slug === 'linear-regression-fundamentals' && (
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="text-2xl">🎮</div>
                    <h3 className="text-xl font-bold text-white">Interactive Playground</h3>
                  </div>
                  <RegressionPlayground />
                </div>
              )}

              {/* Quest Completion */}
              {!isCompleted ? (
                <div className="bg-gradient-to-r from-green-500/20 to-emerald-600/20 backdrop-blur-sm rounded-2xl p-8 border border-green-400/30 text-center">
                  <div className="text-4xl mb-4">⚔️</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Ready to Complete This Quest?</h3>
                  <p className="text-white/80 mb-6">
                    You've learned the fundamentals! Mark this quest as complete to earn XP and unlock new challenges.
                  </p>
                  <Button 
                    onClick={markAsComplete} 
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-2xl transform hover:scale-105 transition-all duration-200"
                  >
                    🏆 Complete Quest (+100 XP)
                  </Button>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-8 border border-yellow-400/30 text-center">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-2xl font-bold text-white mb-4">Quest Completed!</h3>
                  <p className="text-white/80 mb-6">
                    Congratulations! You've mastered this quest and earned valuable XP.
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Button 
                      onClick={() => router.push('/app')}
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-6 py-3 rounded-xl"
                    >
                      Back to Quest Board
                    </Button>
                    <Button 
                      onClick={() => window.location.reload()}
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-xl"
                    >
                      Replay Quest
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Quest Sidebar */}
            <div className="space-y-6">
              {/* Quest Stats */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-400" />
                  Quest Stats
                </h3>
                <div className="text-center mb-6">
                  <ProgressRing progress={progress} size={120} />
                  <p className="mt-4 text-white/80 font-medium">
                    {progress}% Complete
                  </p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Duration:</span>
                    <span className="text-white font-semibold">{lesson.duration} min</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Difficulty:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(lesson.difficulty)}`}>
                      {lesson.difficulty}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Status:</span>
                    <span className="text-white font-semibold">
                      {isCompleted ? '✅ Completed' : '🔄 In Progress'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                  <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                  Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                    <div className="text-2xl">🎯</div>
                    <div>
                      <div className="text-white font-semibold text-sm">Quest Starter</div>
                      <div className="text-white/60 text-xs">Start your first quest</div>
                    </div>
                  </div>
                  
                  {progress > 0 && (
                    <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                      <div className="text-2xl">⚡</div>
                      <div>
                        <div className="text-white font-semibold text-sm">Progress Maker</div>
                        <div className="text-white/60 text-xs">Make progress on a quest</div>
                      </div>
                    </div>
                  )}
                  
                  {isCompleted && (
                    <div className="flex items-center space-x-3 p-3 bg-gradient-to-r from-yellow-400/20 to-orange-500/20 rounded-xl border border-yellow-400/30">
                      <div className="text-2xl">🏆</div>
                      <div>
                        <div className="text-white font-semibold text-sm">Quest Master</div>
                        <div className="text-white/60 text-xs">Complete a quest</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* XP Rewards */}
              <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                  <Star className="h-5 w-5 mr-2 text-purple-400" />
                  XP Rewards
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Quest Completion:</span>
                    <span className="text-yellow-400 font-bold">+100 XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">First Time Bonus:</span>
                    <span className="text-green-400 font-bold">+50 XP</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/70">Streak Bonus:</span>
                    <span className="text-blue-400 font-bold">+25 XP</span>
                  </div>
                  <div className="border-t border-white/20 pt-3 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-semibold">Total:</span>
                      <span className="text-white font-bold text-lg">+175 XP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
