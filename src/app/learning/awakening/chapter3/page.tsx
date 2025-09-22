'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import LessonTemplate from '@/components/LessonTemplate';
import { ArrowLeft, Play, Clock, Star, CheckCircle, BookOpen, Sparkles, Search } from 'lucide-react';

interface LessonContent {
  frontmatter: {
    id: string;
    title: string;
    duration_min: number;
    prereqs: string[];
    tags: string[];
    video?: {
      platform: string;
      id: string;
      start: number;
      end: number;
    };
    widgets: string[];
    goals: string[];
    quiz: Array<{
      q: string;
      options: string[];
      answer: number;
      explain: string;
    }>;
    flashcards: Array<{
      term: string;
      definition: string;
    }>;
    reflection: string[];
    next: string;
  };
  content: string;
}

const lessons = [
  {
    id: 'ai-awakening-ch3-lesson1',
    title: 'Seeing Patterns Everywhere',
    duration: 15,
    description: 'Build intuition that data contains patterns',
    icon: '🔍'
  },
  {
    id: 'ai-awakening-ch3-lesson2', 
    title: 'Classification: Sorting the World',
    duration: 25,
    description: 'Understand classification as labeling data',
    icon: '🏷️'
  },
  {
    id: 'ai-awakening-ch3-lesson3',
    title: 'Clustering: Finding Groups', 
    duration: 20,
    description: 'Discover hidden groups in data without labels',
    icon: '👥'
  },
  {
    id: 'ai-awakening-ch3-lesson4',
    title: 'Features: What Really Matters',
    duration: 25,
    description: 'Learn which data properties matter most for predictions',
    icon: '🎯'
  },
  {
    id: 'ai-awakening-ch3-lesson5',
    title: 'Overfitting vs Generalization',
    duration: 25,
    description: 'Understand the balance between memorizing and learning',
    icon: '⚖️'
  },
  {
    id: 'ai-awakening-ch3-lesson6',
    title: 'Case Study: Recognizing Digits',
    duration: 30,
    description: 'Apply concepts with the classic MNIST dataset',
    icon: '🔢'
  }
];

export default function AIAwakeningChapter3Page() {
  const router = useRouter();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [currentLesson, setCurrentLesson] = useState<LessonContent | null>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLesson = async (lessonId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/content/awakening/lessons/${lessonId}`);
      if (!response.ok) {
        throw new Error('Failed to load lesson');
      }
      
      const lessonData = await response.json();
      setCurrentLesson(lessonData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load lesson');
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => [...prev, lessonId]);
    setCurrentLesson(null);
  };

  const handleNextLesson = (nextLessonId: string) => {
    loadLesson(nextLessonId);
  };

  const getDifficultyColor = (tags: string[]) => {
    if (tags.includes('beginner')) return 'bg-green-500';
    if (tags.includes('intermediate')) return 'bg-yellow-500';
    if (tags.includes('advanced')) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const getDifficultyIcon = (tags: string[]) => {
    if (tags.includes('beginner')) return '🌱';
    if (tags.includes('intermediate')) return '🧠';
    if (tags.includes('advanced')) return '🚀';
    return '❓';
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${themeClasses.text} text-lg`}>Loading your lesson...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} max-w-md`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text}`}>Error Loading Lesson</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`${themeClasses.text}/70 mb-4`}>{error}</p>
            <Button onClick={() => router.push('/app')} className={themeClasses.button}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (currentLesson) {
    return (
      <div className={`min-h-screen ${themeClasses.background} p-4 sm:p-8`}>
        <Button 
          onClick={() => setCurrentLesson(null)} 
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Chapter Overview
        </Button>
        
        <LessonTemplate
          lesson={currentLesson}
          onComplete={() => handleLessonComplete(currentLesson.frontmatter.id)}
          onNext={currentLesson.frontmatter.next ? () => handleNextLesson(currentLesson.frontmatter.next) : undefined}
        />
      </div>
    );
  }

  // Chapter overview
  const totalLessons = lessons.length;
  const completedCount = completedLessons.length;
  const progress = (completedCount / totalLessons) * 100;

  return (
    <div className={`min-h-screen ${themeClasses.background} p-4 sm:p-8`}>
      <Button onClick={() => router.push('/learning/awakening/chapter2')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Chapter 2
      </Button>

      {/* Chapter Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
          Chapter 3: The Pattern Seeker
        </h1>
        <p className={`text-xl ${themeClasses.text}/70 max-w-3xl mx-auto`}>
          Now that you understand how machines learn, discover how they recognize patterns 
          and generalize from data. Learn the fundamental concepts of classification, 
          clustering, and feature selection that power modern AI.
        </p>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
            Chapter Progress
          </h2>
          <span className={`${themeClasses.text}/70`}>
            {completedCount} / {totalLessons} lessons completed
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Story Hook */}
      <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} mb-8`}>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className={`text-2xl font-semibold ${themeClasses.text} mb-4`}>
              The Pattern Discovery Continues...
            </h3>
            <p className={`${themeClasses.text} italic text-lg mb-4`}>
              "You've learned how machines learn, but now it's time to discover HOW they 
              recognize patterns and make sense of the world around them."
            </p>
            <p className={`${themeClasses.text}/80`}>
              Every AI system is fundamentally a pattern recognition machine. By the end of this 
              chapter, you'll understand how machines see patterns in data, classify information, 
              and make predictions that seem almost magical.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson, index) => {
          const isCompleted = completedLessons.includes(lesson.id);
          const isNext = !isCompleted && (index === 0 || completedLessons.includes(lessons[index - 1]?.id));
          
          return (
            <Card
              key={lesson.id}
              className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                isCompleted ? 'ring-2 ring-green-400' : ''
              }`}
              onClick={() => loadLesson(lesson.id)}
            >
              <CardHeader className="text-center">
                <div className="text-4xl mb-3">{lesson.icon}</div>
                <CardTitle className={`text-lg ${themeClasses.text}`}>
                  Lesson {index + 1}: {lesson.title}
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  {lesson.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${themeClasses.text}/70`}>Duration:</span>
                    <span className={`${themeClasses.text}`}>{lesson.duration} min</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${themeClasses.text}/70`}>Status:</span>
                    <Badge 
                      className={`${
                        isCompleted 
                          ? 'bg-green-500 text-white' 
                          : isNext 
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-500 text-white'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </>
                      ) : isNext ? (
                        <>
                          <Play className="h-3 w-3 mr-1" />
                          Start
                        </>
                      ) : (
                        <>
                          <BookOpen className="h-3 w-3 mr-1" />
                          Locked
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Chapter Completion */}
      {completedCount === totalLessons && (
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} mt-8`}>
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>
              Chapter 3 Complete!
            </h3>
            <p className={`${themeClasses.text}/80 mb-6`}>
              Congratulations! You've mastered pattern recognition and machine learning fundamentals. 
              You now understand how AI systems see patterns, classify data, and make predictions.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => router.push('/learning/awakening/chapter2')}
                variant="outline"
                className={`${themeClasses.border}`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Chapter 2
              </Button>
              <Button 
                onClick={() => router.push('/app')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Continue Your Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
