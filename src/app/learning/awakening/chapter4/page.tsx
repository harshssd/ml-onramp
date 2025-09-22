'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import LessonTemplate from '@/components/LessonTemplate';
import { ArrowLeft, Play, Clock, Star, CheckCircle, BookOpen, Sparkles, Trophy, Crown, Rocket } from 'lucide-react';

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
    id: 'ai-awakening-ch4-lesson1',
    title: 'From Learner to Creator',
    duration: 20,
    description: 'Shift mindset from AI consumer to AI builder',
    icon: '🚀'
  },
  {
    id: 'ai-awakening-ch4-lesson2', 
    title: 'Your First AI Assistant',
    duration: 30,
    description: 'Build a simple rule-based chatbot',
    icon: '🤖'
  },
  {
    id: 'ai-awakening-ch4-lesson3',
    title: 'AI for Creativity', 
    duration: 25,
    description: 'Explore how AI creates art, music, and stories',
    icon: '🎨'
  },
  {
    id: 'ai-awakening-ch4-lesson4',
    title: 'Building Your AI Project Showcase',
    duration: 40,
    description: 'Create your first AI portfolio project',
    icon: '🏆'
  }
];

export default function AIAwakeningChapter4Page() {
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
      <Button onClick={() => router.push('/learning/awakening/chapter3')} className="mb-6">
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Chapter 3
      </Button>

      {/* Chapter Header */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
          Chapter 4: The AI Creator
        </h1>
        <p className={`text-xl ${themeClasses.text}/70 max-w-3xl mx-auto`}>
          The capstone chapter! You've learned how AI works - now it's time to become a creator. 
          Build your first AI projects, explore creative applications, and showcase your skills 
          to the world.
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

      {/* Capstone Story */}
      <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} mb-8`}>
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className={`text-2xl font-semibold ${themeClasses.text} mb-4`}>
              Your Journey to AI Creator
            </h3>
            <p className={`${themeClasses.text} italic text-lg mb-4`}>
              "You started as someone curious about AI. You learned what it is, how it works, 
              and how it finds patterns. Now you're ready to create."
            </p>
            <p className={`${themeClasses.text}/80`}>
              This is your moment to shine. Build something amazing. Show the world what you've learned. 
              You're not just learning about AI anymore - you're becoming an AI creator.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

      {/* Final Project Showcase */}
      <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} mt-8`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <Trophy className="h-6 w-6 mr-2 text-yellow-500" />
            Your Final Project
          </CardTitle>
          <CardDescription className={`${themeClasses.text}/70`}>
            Choose one project to showcase your AI skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <h4 className={`font-semibold ${themeClasses.text} mb-2`}>1. Spam Classifier</h4>
              <p className={`text-sm ${themeClasses.text}/70 mb-3`}>
                Build a simple keyword-based spam detector using the concepts you've learned.
              </p>
              <Badge className="bg-blue-500 text-white">Classification</Badge>
            </div>
            
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <h4 className={`font-semibold ${themeClasses.text} mb-2`}>2. Digit Recognizer</h4>
              <p className={`text-sm ${themeClasses.text}/70 mb-3`}>
                Create your own version of the MNIST digit recognition system.
              </p>
              <Badge className="bg-green-500 text-white">Pattern Recognition</Badge>
            </div>
            
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <h4 className={`font-semibold ${themeClasses.text} mb-2`}>3. Creative AI Project</h4>
              <p className={`text-sm ${themeClasses.text}/70 mb-3`}>
                Build an image generator, story creator, or music composer using AI.
              </p>
              <Badge className="bg-purple-500 text-white">Generative AI</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter Completion */}
      {completedCount === totalLessons && (
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} mt-8`}>
          <CardContent className="p-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className={`text-3xl font-bold ${themeClasses.text} mb-4`}>
              Congratulations, AI Creator!
            </h3>
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-yellow-500 mr-2" />
              <span className={`text-xl ${themeClasses.text}`}>You've earned the AI Creator Badge! 🏅</span>
            </div>
            <p className={`${themeClasses.text}/80 mb-6 max-w-2xl mx-auto`}>
              You've completed the entire AI Awakening journey! From curious beginner to confident creator, 
              you now understand AI fundamentals and have built your first projects. The world of AI is 
              now open to you.
            </p>
            <div className="flex justify-center space-x-4">
              <Button 
                onClick={() => router.push('/learning/awakening/chapter3')}
                variant="outline"
                className={`${themeClasses.border}`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Review Previous Chapters
              </Button>
              <Button 
                onClick={() => router.push('/app')}
                className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white"
              >
                <Rocket className="h-4 w-4 mr-2" />
                Continue Your AI Journey
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
