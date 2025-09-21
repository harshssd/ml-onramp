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

          {/* Learning Paths Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <BookOpen className="h-6 w-6 mr-2 text-blue-400" />
                AI Learning Paths
              </h3>
              <Button
                onClick={handleStartStorytelling}
                className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold"
              >
                <Play className="h-4 w-4 mr-2" />
                Start AI Learning Journey
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {learningPaths.slice(0, 3).map((path) => (
                <Card
                  key={path.id}
                  className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                  onClick={() => handleStartLearningPath(path.id)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{path.icon}</span>
                        <span className="text-sm">{getStatusIcon(path.status)}</span>
                      </div>
                      <Badge className={`${getDifficultyColor(path.difficulty)} text-white`}>
                        {path.difficulty}
                      </Badge>
                    </div>
                    <CardTitle className={`text-lg ${themeClasses.text}`}>
                      {path.title}
                    </CardTitle>
                    <CardDescription className={`${themeClasses.text}/70`}>
                      {path.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${themeClasses.text}/70`}>Chapters:</span>
                        <span className={`${themeClasses.text}`}>{path.chapters}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${themeClasses.text}/70`}>Duration:</span>
                        <span className={`${themeClasses.text}`}>{path.estimatedTime}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className={`${themeClasses.text}/70`}>XP Reward:</span>
                        <span className={`${themeClasses.text}`}>{path.rewards.xp}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-1 mt-3">
                        {path.skills.slice(0, 3).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {path.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{path.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                      
                      <Button
                        className={`w-full ${path.color} hover:opacity-90 text-white font-semibold`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartLearningPath(path.id);
                        }}
                      >
                        {path.status === 'available' ? 'Start Journey' : 
                         path.status === 'in-progress' ? 'Continue Journey' : 'Locked'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-6">
              <Button
                onClick={() => setShowLearningPaths(!showLearningPaths)}
                variant="outline"
                className={`${themeClasses.border} ${themeClasses.text} hover:${themeClasses.card.replace('/10', '/20')}`}
              >
                {showLearningPaths ? 'Show Less' : 'View All Learning Paths'}
                <ArrowRight className={`h-4 w-4 ml-2 transition-transform ${showLearningPaths ? 'rotate-180' : ''}`} />
              </Button>
            </div>
            
            {/* Expanded Learning Paths View */}
            {showLearningPaths && (
              <div className="mt-8">
                <h4 className={`text-xl font-bold ${themeClasses.text} mb-6`}>
                  All Available AI Learning Paths
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {learningPaths.map((path) => (
                    <Card
                      key={path.id}
                      className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                      onClick={() => handleStartLearningPath(path.id)}
                    >
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">{path.icon}</span>
                            <span className="text-sm">{getStatusIcon(path.status)}</span>
                          </div>
                          <Badge className={`${getDifficultyColor(path.difficulty)} text-white`}>
                            {path.difficulty}
                          </Badge>
                        </div>
                        <CardTitle className={`text-xl ${themeClasses.text}`}>
                          {path.title}
                        </CardTitle>
                        <CardDescription className={`${themeClasses.text}/70`}>
                          {path.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-3`}>
                            <p className={`text-sm ${themeClasses.text}/80 italic`}>
                              &ldquo;{path.story.substring(0, 120)}...&rdquo;
                            </p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center justify-between">
                              <span className={`${themeClasses.text}/70`}>Chapters:</span>
                              <span className={`${themeClasses.text}`}>{path.chapters}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`${themeClasses.text}/70`}>Duration:</span>
                              <span className={`${themeClasses.text}`}>{path.estimatedTime}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`${themeClasses.text}/70`}>XP Reward:</span>
                              <span className={`${themeClasses.text}`}>{path.rewards.xp}</span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className={`${themeClasses.text}/70`}>Status:</span>
                              <span className={`${themeClasses.text}`}>{path.status}</span>
                            </div>
                          </div>
                          
                          <div>
                            <h5 className={`text-sm font-semibold ${themeClasses.text} mb-2`}>
                              Skills You&apos;ll Learn:
                            </h5>
                            <div className="flex flex-wrap gap-1">
                              {path.skills.map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          {path.prerequisites.length > 0 && (
                            <div>
                              <h5 className={`text-sm font-semibold ${themeClasses.text} mb-2`}>
                                Prerequisites:
                              </h5>
                              <div className="flex flex-wrap gap-1">
                                {path.prerequisites.map((prereq, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {prereq}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <Button
                            className={`w-full ${path.color} hover:opacity-90 text-white font-semibold`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartLearningPath(path.id);
                            }}
                            disabled={path.status === 'locked'}
                          >
                            {path.status === 'available' ? 'Start Journey' : 
                             path.status === 'in-progress' ? 'Continue Journey' : 
                             path.status === 'completed' ? 'Review Journey' : 'Locked'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Achievements Section */}
          <div className="mb-8">
            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
              <Trophy className="h-6 w-6 mr-2 text-yellow-400" />
              Recent Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 backdrop-blur-sm rounded-2xl p-6 border border-yellow-400/30">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🎯</div>
                  <div>
                    <div className={`${themeClasses.text} font-semibold`}>First Quest</div>
                    <div className={`${themeClasses.text}/70 text-sm`}>Complete your first lesson</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-green-400/20 to-emerald-500/20 backdrop-blur-sm rounded-2xl p-6 border border-green-400/30">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">⚡</div>
                  <div>
                    <div className={`${themeClasses.text} font-semibold`}>Streak Master</div>
                    <div className={`${themeClasses.text}/70 text-sm`}>3 day learning streak</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-purple-400/20 to-pink-500/20 backdrop-blur-sm rounded-2xl p-6 border border-purple-400/30">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">🏆</div>
                  <div>
                    <div className={`${themeClasses.text} font-semibold`}>Progress Champion</div>
                    <div className={`${themeClasses.text}/70 text-sm`}>50% overall progress</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lessons Grid */}
          <div className="mb-8">
            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
              <Target className="h-6 w-6 mr-2 text-blue-400" />
              Available Quests
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lessons.map((lesson, index) => (
                <div key={lesson.id} className="group">
                  <div className={`${themeClasses.card} backdrop-blur-sm rounded-2xl p-6 border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 hover:shadow-2xl`}>
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
                        <div className={`${themeClasses.text}/60 text-sm`}>Quest #{index + 1}</div>
                      </div>
                    </div>
                    
                    <h4 className={`text-xl font-bold ${themeClasses.text} mb-3 group-hover:text-yellow-400 transition-colors`}>
                      {lesson.title}
                    </h4>
                    
                    <p className={`${themeClasses.text}/70 mb-4 text-sm leading-relaxed`}>
                      {lesson.description}
                    </p>
                    
                    <div className="mb-4">
                      <div className={`flex justify-between text-sm ${themeClasses.text}/60 mb-1`}>
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
                      className={`w-full ${themeClasses.button} text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105`}
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
