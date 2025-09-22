'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProgressRing } from '@/components/ProgressRing';
import { ThemeSelector } from '@/components/ThemeSelector';
import { storyCourses, getCourseById } from '@/data/storyCourses';
import { 
  BookOpen, 
  Play, 
  Star, 
  Target, 
  Trophy, 
  ArrowRight, 
  Brain, 
  Zap, 
  Clock, 
  CheckCircle,
  Badge,
  Sparkles,
  Rocket,
  Shield,
  Lightbulb,
  Users,
  Award,
  TrendingUp,
  Lock,
  Unlock,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge as UIBadge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

export default function Dashboard() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        const { data: progress } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id)
          .single();
        setUserProgress(progress);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const handleStartCourse = (courseId: string) => {
    const course = getCourseById(courseId);
    if (course && course.chapters.length > 0) {
      router.push(course.chapters[0].path);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-blue-500';
      case 'advanced': return 'bg-purple-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getDifficultyIcon = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return <Sparkles className="h-4 w-4" />;
      case 'intermediate': return <Brain className="h-4 w-4" />;
      case 'advanced': return <Rocket className="h-4 w-4" />;
      case 'expert': return <Award className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${themeClasses.text}`}>Loading your AI journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🧠</div>
              <div>
                <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
                  AI Learning Platform
                </h1>
                <p className={`text-sm ${themeClasses.text}/70`}>
                  Your journey to AI mastery
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeSelector />
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${themeClasses.text}`}>
                      {user.email}
                    </p>
                    <p className={`text-xs ${themeClasses.text}/70`}>
                      Level {userProgress?.level || 1}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                </div>
              ) : (
                <Button 
                  onClick={() => router.push('/login')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
            Choose Your AI Journey
          </h2>
          <p className={`text-xl ${themeClasses.text}/70 max-w-3xl mx-auto`}>
            Every great AI practitioner started somewhere. Your journey begins with a single step - 
            choosing the path that calls to you.
          </p>
        </div>

        {/* Story Courses */}
        <div className="space-y-8">
          {storyCourses.map((course, index) => (
            <Card key={course.id} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="text-6xl">{course.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <CardTitle className={`text-3xl ${themeClasses.text}`}>
                          {course.title}
                        </CardTitle>
                        <UIBadge className={`${getDifficultyColor(course.difficulty)} text-white`}>
                          {getDifficultyIcon(course.difficulty)}
                          <span className="ml-1 capitalize">{course.difficulty}</span>
                        </UIBadge>
                      </div>
                      <CardDescription className={`text-xl ${themeClasses.text}/70 mb-4`}>
                        {course.subtitle}
                      </CardDescription>
                      <p className={`text-lg ${themeClasses.text}/80 mb-6`}>
                        {course.description}
                      </p>
                      
                      {/* Story Hook */}
                      <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} mb-6`}>
                        <p className={`${themeClasses.text} italic`}>
                          "{course.story.hook}"
                        </p>
                      </div>

                      {/* Course Stats */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Clock className="h-4 w-4 text-blue-400 mr-1" />
                            <span className={`text-sm font-medium ${themeClasses.text}`}>Duration</span>
                          </div>
                          <p className={`text-sm ${themeClasses.text}/70`}>{course.duration}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <BookOpen className="h-4 w-4 text-green-400 mr-1" />
                            <span className={`text-sm font-medium ${themeClasses.text}`}>Chapters</span>
                          </div>
                          <p className={`text-sm ${themeClasses.text}/70`}>{course.chapters.length}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <Users className="h-4 w-4 text-purple-400 mr-1" />
                            <span className={`text-sm font-medium ${themeClasses.text}`}>Level</span>
                          </div>
                          <p className={`text-sm ${themeClasses.text}/70 capitalize`}>{course.difficulty}</p>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center mb-1">
                            <TrendingUp className="h-4 w-4 text-orange-400 mr-1" />
                            <span className={`text-sm font-medium ${themeClasses.text}`}>Hours</span>
                          </div>
                          <p className={`text-sm ${themeClasses.text}/70`}>{course.estimatedHours}</p>
                        </div>
                      </div>

                      {/* Skills */}
                      <div className="mb-6">
                        <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Skills you'll master:</h4>
                        <div className="flex flex-wrap gap-2">
                          {course.skills.map((skill, skillIndex) => (
                            <UIBadge key={skillIndex} variant="secondary" className={`${themeClasses.card.replace('/10', '/20')}`}>
                              {skill}
                            </UIBadge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {/* Chapter Preview */}
                <div className="mb-6">
                  <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Your Journey:</h4>
                  <div className="space-y-3">
                    {course.chapters.map((chapter, chapterIndex) => (
                      <div key={chapter.id} className={`flex items-center space-x-3 p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                        <div className="text-2xl">{chapter.icon}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h5 className={`font-medium ${themeClasses.text}`}>{chapter.title}</h5>
                            {chapter.locked ? (
                              <Lock className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Unlock className="h-4 w-4 text-green-400" />
                            )}
                          </div>
                          <p className={`text-sm ${themeClasses.text}/70`}>{chapter.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-xs ${themeClasses.text}/60`}>{chapter.duration}</span>
                            <span className={`text-xs ${themeClasses.text}/60`}>{chapter.lessons} lessons</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      onClick={() => handleStartCourse(course.id)}
                      className={`bg-gradient-to-r ${course.gradient} hover:opacity-90 text-white px-8 py-3 text-lg`}
                      disabled={course.chapters[0]?.locked}
                    >
                      {course.chapters[0]?.locked ? (
                        <>
                          <Lock className="h-5 w-5 mr-2" />
                          Complete Previous Course
                        </>
                      ) : (
                        <>
                          <Play className="h-5 w-5 mr-2" />
                          Begin Journey
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="outline"
                      className={`${themeClasses.border} px-6 py-3`}
                      onClick={() => router.push(`/courses/${course.id}`)}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Learn More
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className={`text-sm ${themeClasses.text}/70`}>
                      {course.targetAudience.join(' • ')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} max-w-2xl mx-auto`}>
            <CardContent className="p-8">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>
                Ready to Transform Your Future?
              </h3>
              <p className={`text-lg ${themeClasses.text}/70 mb-6`}>
                Join thousands of learners who are already building the future with AI. 
                Your journey starts with a single click.
              </p>
              <Button
                onClick={() => handleStartCourse('ai-awakening')}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                <Rocket className="h-5 w-5 mr-2" />
                Start Your AI Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}