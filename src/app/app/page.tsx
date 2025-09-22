'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { ProgressRing } from '@/components/ProgressRing';
import { ThemeSelector } from '@/components/ThemeSelector';
import { aiAwakeningCourse, neuralMasteryCourse, aiBuilderCourse } from '@/data/storyCourses';
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

  const getCourseById = (courseId: string) => {
    const courses = [aiAwakeningCourse, neuralMasteryCourse, aiBuilderCourse];
    return courses.find(course => course.id === courseId);
  };

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

        {/* Quest Selection */}
        <div className="mb-12">
          <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6 text-center`}>
            Choose Your Quest
          </h3>
          <p className={`text-lg ${themeClasses.text}/70 text-center mb-8 max-w-2xl mx-auto`}>
            Each quest is a complete journey with its own story, challenges, and rewards. 
            Start where you feel most comfortable.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[aiAwakeningCourse, neuralMasteryCourse, aiBuilderCourse].map((course, index) => (
              <Card 
                key={course.id} 
                className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer group`}
                onClick={() => {
                  if (course.id === 'ai-awakening') {
                    router.push('/learning/awakening/chapter1');
                  } else if (course.id === 'neural-mastery') {
                    router.push('/learning/karpathy/chapter1');
                  } else if (course.id === 'ai-builder') {
                    router.push('/learning/builder/chapter1');
                  } else {
                    router.push(`/courses/${course.id}`);
                  }
                }}
              >
                <CardHeader className="pb-4">
                  <div className="text-center">
                    <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {course.icon}
                    </div>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <CardTitle className={`text-lg ${themeClasses.text}`}>
                        {course.title}
                      </CardTitle>
                      <UIBadge className={`${getDifficultyColor(course.difficulty)} text-white text-xs`}>
                        {getDifficultyIcon(course.difficulty)}
                      </UIBadge>
                    </div>
                    <CardDescription className={`text-sm ${themeClasses.text}/70`}>
                      {course.subtitle}
                    </CardDescription>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Story Hook */}
                  <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} mb-4`}>
                    <p className={`${themeClasses.text} italic text-sm`}>
                      "{course.story.hook}"
                    </p>
                  </div>

                  {/* Quick Stats */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${themeClasses.text}/70`}>Duration:</span>
                      <span className={`${themeClasses.text}`}>{course.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${themeClasses.text}/70`}>Chapters:</span>
                      <span className={`${themeClasses.text}`}>{course.chapters.length}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className={`${themeClasses.text}/70`}>Level:</span>
                      <span className={`${themeClasses.text} capitalize`}>{course.difficulty}</span>
                    </div>
                  </div>

                  {/* Skills Preview */}
                  <div className="mb-4">
                    <h4 className={`font-semibold ${themeClasses.text} text-sm mb-2`}>Skills:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.skills.slice(0, 3).map((skill, skillIndex) => (
                        <UIBadge key={skillIndex} variant="secondary" className={`${themeClasses.card.replace('/10', '/20')} text-xs`}>
                          {skill}
                        </UIBadge>
                      ))}
                      {course.skills.length > 3 && (
                        <UIBadge variant="secondary" className={`${themeClasses.card.replace('/10', '/20')} text-xs`}>
                          +{course.skills.length - 3} more
                        </UIBadge>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    className={`w-full bg-gradient-to-r ${course.gradient} hover:opacity-90 text-white`}
                    disabled={course.chapters[0]?.locked}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!course.chapters[0]?.locked) {
                        handleStartCourse(course.id);
                      }
                    }}
                  >
                    {course.chapters[0]?.locked ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Locked
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Quest
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Featured Quest - AI Awakening */}
        <div className="mb-12">
          <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6 text-center`}>
            🌟 Featured Quest: The AI Awakening
          </h3>
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="text-6xl mb-4">🌟</div>
                  <h4 className={`text-2xl font-bold ${themeClasses.text} mb-4`}>
                    From Curious to Capable
                  </h4>
                  <p className={`text-lg ${themeClasses.text}/80 mb-6`}>
                    Begin your transformation from AI curious to AI capable. Discover the magic behind 
                    intelligent machines and build your first AI-powered creations.
                  </p>
                  
                  {/* Story Elements */}
                  <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                      <h5 className={`font-semibold ${themeClasses.text} mb-2`}>The Hook</h5>
                      <p className={`${themeClasses.text} italic`}>
                        "You've seen AI everywhere - in your phone, your apps, your daily life. 
                        But have you ever wondered: 'How does it actually work?' This is your awakening."
                      </p>
                    </div>
                    
                    <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                      <h5 className={`font-semibold ${themeClasses.text} mb-2`}>The Journey</h5>
                      <p className={`${themeClasses.text}`}>
                        Follow the journey of a curious mind discovering the secrets of artificial intelligence. 
                        From simple concepts to building your first neural network, you'll experience the "aha!" moments that change everything.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className={`font-semibold ${themeClasses.text} mb-4`}>Your Learning Path:</h5>
                  <div className="space-y-3">
                    {aiAwakeningCourse.chapters.map((chapter, index) => (
                      <div key={chapter.id} className={`flex items-center space-x-3 p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                        <div className="text-2xl">{chapter.icon}</div>
                        <div className="flex-1">
                          <h6 className={`font-medium ${themeClasses.text}`}>
                            Chapter {index + 1}: {chapter.title}
                          </h6>
                          <p className={`text-sm ${themeClasses.text}/70`}>{chapter.description}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className={`text-xs ${themeClasses.text}/60`}>{chapter.duration}</span>
                            <span className={`text-xs ${themeClasses.text}/60`}>{chapter.lessons} lessons</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6">
                      <Button
                        onClick={() => router.push('/learning/awakening/chapter1')}
                        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 text-lg"
                      >
                      <Play className="h-5 w-5 mr-2" />
                      Begin Your AI Awakening
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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