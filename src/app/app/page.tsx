'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LessonCard, ProgressRing, type Lesson } from '@/components/LessonCard';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppPage() {
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

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
  }, [router, supabase.auth]);

  const loadLessons = async () => {
    try {
      const response = await fetch('/api/lessons');
      const data = await response.json();
      setLessons(data);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const loadUserProgress = async (userId: string) => {
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
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your progress...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">ML Onramp</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm text-gray-700">{user?.email}</span>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Progress Overview */}
          <div className="mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Your Progress</h2>
              <div className="flex items-center space-x-6">
                <ProgressRing progress={calculateOverallProgress()} size={80} />
                <div>
                  <p className="text-sm text-gray-600">
                    Overall Progress: {Math.round(calculateOverallProgress())}%
                  </p>
                  <p className="text-sm text-gray-500">
                    {lessons.length} lessons available
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Available Lessons</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <LessonCard
                  key={lesson.id}
                  lesson={{
                    ...lesson,
                    isCompleted: userProgress[lesson.id] === 100,
                  }}
                  onStart={handleStartLesson}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
