"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BookOpen, Star, Play, Target, Trophy, Zap } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import Link from "next/link";

interface Lesson {
  id: string;
  title: string;
  duration_min: number;
  tags: string[];
  goals: string[];
  prereqs: string[];
}

interface Week {
  title: string;
  description: string;
  lessons: Lesson[];
  duration: string;
  focus: string;
}

export default function FundamentalsPathPage() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userXP] = useState(1250); // Mock XP
  // const [userLevel] = useState(3); // Mock level
  const [currentStreak] = useState(7); // Mock streak

  // Calculate level and XP
  const calculateLevel = (xp: number) => Math.floor(xp / 500) + 1;
  const calculateXP = (xp: number) => xp % 500;
  const calculateProgress = (xp: number) => (xp % 500) / 500 * 100;

  useEffect(() => {
    loadLearningPath();
  }, []);

  const loadLearningPath = async () => {
    try {
      // Load all lessons from API
      const response = await fetch('/api/content/lessons');
      const allLessons = await response.json();
      
      // Organize into 4-week structure
      const weekStructure: Week[] = [
        {
          title: "Week 1: On-ramp",
          description: "Get comfortable with AI concepts and your first code",
          duration: "4 lessons • 2-3 hours",
          focus: "Building mental models and first steps",
          lessons: allLessons.filter((lesson: { frontmatter: { id: string } }) => 
            lesson.frontmatter.id.includes('ch1') || 
            lesson.frontmatter.id.includes('lesson-1')
          ).map((lesson: { frontmatter: { id: string; title: string; duration_min: number; tags: string[]; goals: string[] }; content: string }) => ({
            id: lesson.frontmatter.id,
            title: lesson.frontmatter.title,
            duration_min: lesson.frontmatter.duration_min,
            tags: lesson.frontmatter.tags,
            goals: lesson.frontmatter.goals,
            prereqs: lesson.frontmatter.prereqs
          }))
        },
        {
          title: "Week 2: Data",
          description: "Master the fuel that powers AI systems",
          duration: "4 lessons • 3-4 hours", 
          focus: "Data quality, exploration, and preparation",
          lessons: allLessons.filter((lesson: { frontmatter: { id: string } }) => 
            lesson.frontmatter.id.includes('ch2') || 
            lesson.frontmatter.id.includes('lesson-2')
          ).map((lesson: { frontmatter: { id: string; title: string; duration_min: number; tags: string[]; goals: string[] }; content: string }) => ({
            id: lesson.frontmatter.id,
            title: lesson.frontmatter.title,
            duration_min: lesson.frontmatter.duration_min,
            tags: lesson.frontmatter.tags,
            goals: lesson.frontmatter.goals,
            prereqs: lesson.frontmatter.prereqs
          }))
        },
        {
          title: "Week 3: First ML Models",
          description: "Build and evaluate your first machine learning models",
          duration: "4 lessons • 4-5 hours",
          focus: "Supervised learning and model evaluation",
          lessons: allLessons.filter((lesson: { frontmatter: { id: string } }) => 
            lesson.frontmatter.id.includes('ch3') || 
            lesson.frontmatter.id.includes('lesson-3')
          ).map((lesson: { frontmatter: { id: string; title: string; duration_min: number; tags: string[]; goals: string[] }; content: string }) => ({
            id: lesson.frontmatter.id,
            title: lesson.frontmatter.title,
            duration_min: lesson.frontmatter.duration_min,
            tags: lesson.frontmatter.tags,
            goals: lesson.frontmatter.goals,
            prereqs: lesson.frontmatter.prereqs
          }))
        },
        {
          title: "Week 4: Apply & Ethics",
          description: "Real-world applications and responsible AI",
          duration: "4 lessons • 3-4 hours",
          focus: "Practical applications and ethical considerations",
          lessons: allLessons.filter((lesson: { frontmatter: { id: string } }) => 
            lesson.frontmatter.id.includes('ch4') || 
            lesson.frontmatter.id.includes('lesson-4')
          ).map((lesson: { frontmatter: { id: string; title: string; duration_min: number; tags: string[]; goals: string[] }; content: string }) => ({
            id: lesson.frontmatter.id,
            title: lesson.frontmatter.title,
            duration_min: lesson.frontmatter.duration_min,
            tags: lesson.frontmatter.tags,
            goals: lesson.frontmatter.goals,
            prereqs: lesson.frontmatter.prereqs
          }))
        }
      ];

      setWeeks(weekStructure);
    } catch (error) {
      console.error('Error loading learning path:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getDifficultyColor = (tags: string[]) => {
    if (tags.includes('beginner')) return 'bg-green-100 text-green-800';
    if (tags.includes('intermediate')) return 'bg-yellow-100 text-yellow-800';
    if (tags.includes('advanced')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getWeekStatus = (weekIndex: number) => {
    // Mock progress - in real app, this would come from user data
    const completedLessons = Math.floor(Math.random() * 4);
    if (completedLessons === 0) return 'locked';
    if (completedLessons === 4) return 'completed';
    return 'in-progress';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your learning path...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      {/* RPG-Style Header */}
      <header className={`${themeClasses.card} backdrop-blur-sm border-b ${themeClasses.border}`}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="text-6xl">⚔️</div>
              <div>
                <h1 className={`text-4xl font-bold ${themeClasses.text} mb-2`}>
                  AI Fundamentals Quest
                </h1>
                <p className={`text-xl ${themeClasses.text}/70`}>
                  A 4-week epic journey from novice to AI practitioner
                </p>
              </div>
              <div className="text-6xl">🛡️</div>
            </div>
            
            <div className="flex justify-center space-x-8 text-sm text-gray-500 mb-6">
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                12-16 hours total
              </span>
              <span className="flex items-center">
                <Target className="h-4 w-4 mr-1" />
                16 quests
              </span>
              <span className="flex items-center">
                <Star className="h-4 w-4 mr-1" />
                800+ XP available
              </span>
            </div>

            {/* XP and Level Display */}
            <div className="flex justify-center space-x-8 mb-6">
              <div className="flex items-center space-x-2">
                <Trophy className="h-6 w-6 text-yellow-500" />
                <div className="text-center">
                  <div className={`text-lg font-bold ${themeClasses.text}`}>Level {calculateLevel(userXP)}</div>
                  <div className="text-sm text-gray-500">{userXP} XP</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-blue-500" />
                <div className="text-center">
                  <div className={`text-lg font-bold ${themeClasses.text}`}>{currentStreak} day streak</div>
                  <div className="text-sm text-gray-500">Keep it up!</div>
                </div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="max-w-md mx-auto">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress to Level {calculateLevel(userXP) + 1}</span>
                <span>{calculateXP(userXP)}/500 XP</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(userXP)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Learning Path */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {weeks.map((week, weekIndex) => {
            const status = getWeekStatus(weekIndex);
            const isLocked = status === 'locked';
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in-progress';

            return (
              <Card key={weekIndex} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} shadow-lg ${isLocked ? 'opacity-60' : ''} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">
                        {weekIndex === 0 ? '🌟' : weekIndex === 1 ? '⚡' : weekIndex === 2 ? '🔥' : '💎'}
                      </div>
                      <div>
                        <CardTitle className={`text-2xl ${themeClasses.text}`}>{week.title}</CardTitle>
                        <CardDescription className={`text-lg mt-2 ${themeClasses.text}/70`}>
                          {week.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`mb-2 ${isCompleted ? 'bg-green-100 text-green-800' : isInProgress ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                        {isCompleted ? '✅ Completed' : isInProgress ? '⚡ In Progress' : '🔒 Locked'}
                      </Badge>
                      <p className="text-sm text-gray-600">{week.duration}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className={`text-sm ${themeClasses.text}/70`}>
                      <strong>Focus:</strong> {week.focus}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {week.lessons.length > 0 ? (
                      week.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className={`flex items-center justify-between p-4 ${themeClasses.card} border ${themeClasses.border} rounded-lg hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-200`}>
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              {isCompleted ? (
                                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                              ) : isInProgress && lessonIndex === 0 ? (
                                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                  <Play className="h-5 w-5 text-white" />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-gradient-to-r from-gray-400 to-gray-500 rounded-full flex items-center justify-center">
                                  <BookOpen className="h-5 w-5 text-white" />
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className={`font-semibold ${themeClasses.text}`}>{lesson.title}</h3>
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {lesson.duration_min} min
                                </span>
                                <Badge className={getDifficultyColor(lesson.tags)}>
                                  {lesson.tags[0]}
                                </Badge>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                  <span className="text-xs font-bold text-yellow-600">+{lesson.duration_min * 2} XP</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {lesson.goals.length > 0 && (
                              <span className="text-xs text-gray-500">
                                {lesson.goals.length} objectives
                              </span>
                            )}
                            {!isLocked ? (
                              <Link href={`/lesson/${lesson.id}`}>
                                <Button 
                                  size="sm" 
                                  className={`${isCompleted ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold`}
                                >
                                  {isCompleted ? '🔄 Review Quest' : '⚔️ Start Quest'}
                                </Button>
                              </Link>
                            ) : (
                              <Button size="sm" disabled className="bg-gray-400 text-gray-600">
                                🔒 Locked
                              </Button>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>Lessons coming soon!</p>
                        <p className="text-sm">This week&apos;s content is being prepared.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Start Your AI Journey?
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Join thousands of learners building AI skills from scratch
              </p>
              <div className="flex justify-center space-x-4">
                <Link href="/lesson/fundamentals-ch1-lesson1">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                    Start First Lesson
                  </Button>
                </Link>
                <Link href="/flashcards/fundamentals">
                  <Button size="lg" variant="outline">
                    Practice with Flashcards
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
