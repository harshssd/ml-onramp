'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { RegressionPlayground } from '@/components/RegressionPlayground';
import { ProgressRing } from '@/components/ProgressRing';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle, Clock, BookOpen } from 'lucide-react';
import type { Lesson } from '@/components/LessonCard';

export default function LessonPage() {
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [progress, setProgress] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
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
    } catch (error) {
      console.error('Unexpected error updating progress:', error);
      alert(`Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const markAsComplete = () => {
    updateProgress(100);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Lesson not found</h1>
          <Button onClick={() => router.push('/app')}>
            Back to Lessons
          </Button>
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
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/app')}
                className="flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Lessons
              </Button>
              <div className="h-6 w-px bg-gray-300" />
              <h1 className="text-xl font-semibold text-gray-900">{lesson.title}</h1>
            </div>
            <div className="flex items-center space-x-4">
              <ProgressRing progress={progress} size={60} />
              {isCompleted && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  <span className="text-sm font-medium">Completed</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lesson Content */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {lesson.duration} min
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <BookOpen className="h-4 w-4 mr-1" />
                    {lesson.difficulty}
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{lesson.description}</p>
                
                {/* Lesson sections */}
                {lesson.content?.sections?.map((section: any, index: number) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {section.title}
                    </h3>
                    <p className="text-gray-700">{section.content}</p>
                  </div>
                ))}
              </div>

              {/* Interactive Playground for specific lessons */}
              {lesson.slug === 'linear-regression-fundamentals' && (
                <RegressionPlayground />
              )}

              {/* Completion Button */}
              {!isCompleted && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="text-center">
                    <p className="text-gray-700 mb-4">
                      Ready to mark this lesson as complete?
                    </p>
                    <Button onClick={markAsComplete} size="lg">
                      Mark as Complete
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress</h3>
                <div className="text-center">
                  <ProgressRing progress={progress} size={120} />
                  <p className="mt-4 text-sm text-gray-600">
                    {progress}% Complete
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Lesson Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Duration:</span>
                    <span className="text-sm font-medium">{lesson.duration} minutes</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Difficulty:</span>
                    <span className="text-sm font-medium capitalize">{lesson.difficulty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="text-sm font-medium">
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
