'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { type Lesson } from '@/components/LessonCard';
import { ProgressRing } from '@/components/ProgressRing';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LogOut, User, Trophy, Star, Target, BookOpen, Play, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

// Learning Paths Data
const learningPaths = [
  {
    id: 'data-explorer',
    title: 'AI Fundamentals for Everyone',
    description: 'Start your AI journey from scratch! Learn the basics of Artificial Intelligence and Machine Learning with no prior experience needed.',
    story: 'Welcome to the world of AI! You are about to embark on an exciting journey into Artificial Intelligence and Machine Learning. No prior experience needed - we\'ll guide you every step of the way.',
    difficulty: 'beginner',
    estimatedTime: '8-12 weeks',
    chapters: 5,
    skills: ['Python Basics', 'Data Analysis', 'Visualization', 'ML Fundamentals', 'First Model'],
    prerequisites: [],
    rewards: {
      xp: 1000,
      badges: ['Data Explorer', 'Python Initiate', 'Visualization Artist', 'Model Builder'],
      unlocks: ['ML Practitioner Track', 'Advanced Algorithms', 'Community Access']
    },
    icon: '🌟',
    color: 'bg-gradient-to-r from-blue-500 to-purple-600',
    status: 'available'
  },
  {
    id: 'ml-practitioner',
    title: 'AI Applications & Projects',
    description: 'Build real AI projects and applications! Learn advanced machine learning techniques through hands-on projects.',
    story: 'You\'ve learned the fundamentals! Now it\'s time to build real AI applications and solve practical problems with machine learning.',
    difficulty: 'intermediate',
    estimatedTime: '12-16 weeks',
    chapters: 8,
    skills: ['Advanced Python', 'Feature Engineering', 'Model Selection', 'Evaluation', 'Deployment'],
    prerequisites: [],
    rewards: {
      xp: 2000,
      badges: ['ML Practitioner', 'Algorithm Master', 'Model Deployer', 'Problem Solver'],
      unlocks: ['ML Engineer Track', 'Specialization Tracks', 'Mentor Program']
    },
    icon: '🧙‍♂️',
    color: 'bg-gradient-to-r from-green-500 to-teal-600',
    status: 'available'
  },
  {
    id: 'ml-engineer',
    title: 'AI Systems & Deployment',
    description: 'Master AI system design and deployment! Learn to build, deploy, and maintain AI systems in production.',
    story: 'You\'re ready for the big leagues! Learn to design, build, and deploy AI systems that work in the real world.',
    difficulty: 'advanced',
    estimatedTime: '16-20 weeks',
    chapters: 10,
    skills: ['Docker', 'Kubernetes', 'MLOps', 'Cloud ML', 'System Design'],
    prerequisites: [],
    rewards: {
      xp: 3000,
      badges: ['ML Engineer', 'System Architect', 'DevOps Master', 'Cloud Expert'],
      unlocks: ['ML Architect Track', 'Leadership Program', 'Industry Mentorship']
    },
    icon: '⚙️',
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    status: 'available'
  },
  {
    id: 'deep-learning-sage',
    title: 'The Deep Learning Sage\'s Path',
    description: 'Master the most powerful magic - Deep Learning! Explore neural networks and AI.',
    story: 'You are a seasoned ML practitioner seeking to master the most powerful magic - Deep Learning!',
    difficulty: 'advanced',
    estimatedTime: '20-24 weeks',
    chapters: 12,
    skills: ['Neural Networks', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP'],
    prerequisites: ['ml-practitioner'],
    rewards: {
      xp: 4000,
      badges: ['Deep Learning Sage', 'Neural Network Master', 'AI Visionary', 'Research Pioneer'],
      unlocks: ['Research Track', 'AI Ethics Program', 'Industry Leadership']
    },
    icon: '🧠',
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    status: 'available'
  },
  {
    id: 'ml-architect',
    title: 'The ML Architect\'s Legacy',
    description: 'Design and build enterprise-scale ML systems! Lead the future of AI.',
    story: 'You are a Master of ML who must design and build enterprise-scale ML systems!',
    difficulty: 'expert',
    estimatedTime: '24-30 weeks',
    chapters: 15,
    skills: ['System Design', 'MLOps', 'Model Optimization', 'AI Ethics', 'Leadership'],
    prerequisites: ['ml-engineer', 'deep-learning-sage'],
    rewards: {
      xp: 5000,
      badges: ['ML Architect', 'System Designer', 'AI Leader', 'Industry Expert'],
      unlocks: ['Master\'s Program', 'Executive Track', 'Industry Advisory']
    },
    icon: '🏛️',
    color: 'bg-gradient-to-r from-indigo-500 to-purple-600',
    status: 'available'
  }
];

export default function AppPage() {
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showLearningPaths, setShowLearningPaths] = useState(false);
  const router = useRouter();
  const supabase = createClient();
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

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

  const handleStartLearningPath = (pathId: string) => {
    router.push(`/learning?path=${pathId}`);
  };

  const handleStartStorytelling = () => {
    router.push('/learning');
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-orange-500';
      case 'expert': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'available': return '🚀';
      case 'locked': return '🔒';
      default: return '❓';
    }
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
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className={`mt-4 ${themeClasses.text}/80 text-lg`}>Loading your quest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} relative overflow-hidden`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 left-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
      </div>

      <div className="relative z-10">
        {/* Game Header */}
        <header className={`${themeClasses.card} backdrop-blur-sm border-b ${themeClasses.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">🤖</div>
                <div>
                  <h1 className={`text-2xl font-bold ${themeClasses.text}`}>AI Learning Hub</h1>
                  <p className={`${themeClasses.text}/70 text-sm`}>Level {calculateLevel()} • {calculateXP()} XP</p>
            </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {/* Theme Selector */}
                <ThemeSelector />
                
                {/* XP Bar */}
                <div className="flex items-center space-x-3">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <div className="w-32 bg-white/20 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${(calculateXP() % 100)}%` }}
                    ></div>
                  </div>
                  <span className={`${themeClasses.text}/80 text-sm font-medium`}>{calculateXP() % 100}/100</span>
                </div>

                <div className="flex items-center space-x-2">
                  <User className={`h-5 w-5 ${themeClasses.text}/70`} />
                  <span className={`${themeClasses.text}/90 text-sm`}>{user?.email?.split('@')[0]}</span>
                </div>
                
                <Button 
                  onClick={handleSignOut} 
                  variant="outline" 
                  size="sm"
                  className={`${themeClasses.border} ${themeClasses.text} hover:${themeClasses.card.replace('bg-', 'bg-').replace('/10', '/20')} border-2`}
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
            <div className={`${themeClasses.card} backdrop-blur-sm rounded-3xl p-8 border ${themeClasses.border}`}>
              <div className="flex flex-col lg:flex-row items-center justify-between mb-6">
                <div>
                  <h2 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>Welcome back, Wizard! 🧙‍♂️</h2>
                  <p className={`${themeClasses.text}/80 text-lg`}>Ready to continue your machine learning journey?</p>
                </div>
                <div className="mt-4 lg:mt-0">
                  <ProgressRing progress={calculateOverallProgress()} size={120} />
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">{calculateLevel()}</div>
                  <div className={`${themeClasses.text}/70 text-sm`}>Level</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">{getCompletedLessons()}</div>
                  <div className={`${themeClasses.text}/70 text-sm`}>Quests Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">{getCurrentStreak()}</div>
                  <div className={`${themeClasses.text}/70 text-sm`}>Day Streak</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">{Math.round(calculateOverallProgress())}%</div>
                  <div className={`${themeClasses.text}/70 text-sm`}>Overall Progress</div>
                </div>
              </div>
            </div>
          </div>

          {/* RPG Learning Experience Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <BookOpen className="h-6 w-6 mr-2 text-blue-400" />
                🎮 AI Learning Quest
              </h3>
              <div className="flex space-x-3">
                <Button
                  onClick={() => router.push('/learning-path/fundamentals')}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white font-semibold"
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Start 4-Week Quest
                </Button>
                <Button
                  onClick={handleStartStorytelling}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Story Mode
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer`}
          onClick={() => router.push('/learning-path/fundamentals')}>
          <CardHeader>
            <CardTitle className={`text-xl ${themeClasses.text} flex items-center`}>
              📚 4-Week AI Fundamentals Quest
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Embark on an epic journey through AI fundamentals with RPG-style progression
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Quests:</span>
                <span className={`${themeClasses.text}`}>16</span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Duration:</span>
                <span className={`${themeClasses.text}`}>12-16 hours</span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>XP Available:</span>
                <span className={`${themeClasses.text}`}>2,000+</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer`}
          onClick={() => router.push('/learning/karpathy')}>
          <CardHeader>
            <CardTitle className={`text-xl ${themeClasses.text} flex items-center`}>
              🧠 Neural Networks: Zero to Hero
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Master neural networks with Andrej Karpathy's legendary course, enhanced with interactive learning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Tracks:</span>
                <span className={`${themeClasses.text}`}>2 (Beginner/Advanced)</span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Duration:</span>
                <span className={`${themeClasses.text}`}>20-35 hours</span>
              </div>
              <div className="flex justify-between">
                <span className={`${themeClasses.text}/70`}>Features:</span>
                <span className={`${themeClasses.text}`}>Interactive Widgets</span>
              </div>
            </div>
          </CardContent>
        </Card>

              <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                onClick={() => router.push('/lesson/fundamentals-ch1-lesson1')}>
                <CardHeader>
                  <CardTitle className={`text-xl ${themeClasses.text} flex items-center`}>
                    🎯 Try Sample Quest
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    Experience the RPG-style lesson format with interactive elements
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Topic:</span>
                      <span className={`${themeClasses.text}`}>What is AI?</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Duration:</span>
                      <span className={`${themeClasses.text}`}>20 minutes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Level:</span>
                      <span className={`${themeClasses.text}`}>Beginner</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                onClick={() => router.push('/flashcards/fundamentals')}>
                <CardHeader>
                  <CardTitle className={`text-xl ${themeClasses.text} flex items-center`}>
                    🃏 Memory Training Arena
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    Master AI concepts with gamified flashcard practice
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Cards:</span>
                      <span className={`${themeClasses.text}`}>10+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Method:</span>
                      <span className={`${themeClasses.text}`}>Spaced Repetition</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Streak:</span>
                      <span className={`${themeClasses.text}`}>Track Progress</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </main>
        </div>
    </div>
  );
}
