'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { karpathyChapter1, getLessonById, getNextLesson } from '@/data/karpathyChapter1';
import { prerequisiteLessons, getPrerequisiteLessonById } from '@/data/karpathyPrerequisites';
import YouTubeSegment from '@/components/YouTubeSegment';
import CheckpointQuiz from '@/components/CheckpointQuiz';
import RegressionPlayground from '@/components/RegressionPlayground';
import { DerivativeCalculator } from '@/components/KarpathyWidgets';
import { ArrowLeft, Play, Code, Brain, BookOpen, Clock, Star, Trophy, CheckCircle, Video, Zap, Target } from 'lucide-react';

type AppState = 'prerequisites' | 'chapter-overview' | 'lesson' | 'completed';

export default function KarpathyChapter1Page() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const [appState, setAppState] = useState<AppState>('prerequisites');
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  const currentLesson = currentLessonId ? getLessonById(currentLessonId) : null;
  const nextLesson = currentLesson ? getNextLesson(currentLessonId!) : null;

  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;
  const calculateProgress = (xp: number) => ((xp % 100) / 100) * 100;

  const handleLessonComplete = (lessonId: string, xpEarned: number = 50) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    setUserXP(prev => prev + xpEarned);
    setUserLevel(calculateLevel(userXP + xpEarned));
  };

  const handleStartLesson = (lessonId: string) => {
    setCurrentLessonId(lessonId);
    setAppState('lesson');
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      setCurrentLessonId(nextLesson.id);
    } else {
      setAppState('completed');
    }
  };

  const handleBack = () => {
    if (appState === 'lesson') {
      setAppState('chapter-overview');
      setCurrentLessonId(null);
    } else if (appState === 'chapter-overview') {
      setAppState('prerequisites');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const renderInteractiveWidget = (widget: any, onComplete?: () => void) => {
    switch (widget.type) {
      case 'regression_playground':
        return <RegressionPlayground onComplete={onComplete} />;
      case 'derivative_calculator':
        return <DerivativeCalculator onComplete={onComplete} />;
      case 'gradient_visualizer':
        return <div className="p-4 text-center text-gray-500">Gradient Visualizer (Coming Soon)</div>;
      case 'micrograd_builder':
        return <div className="p-4 text-center text-gray-500">Micrograd Builder (Coming Soon)</div>;
      case 'training_simulator':
        return <div className="p-4 text-center text-gray-500">Training Simulator (Coming Soon)</div>;
      default:
        return null;
    }
  };

  if (appState === 'prerequisites') {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              📚 Prerequisites for Chapter 1
            </h1>
            <p className={`text-xl ${themeClasses.text}/70`}>
              Before diving into neural networks, let&apos;s make sure you have the foundational knowledge needed
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {prerequisiteLessons.map((lesson) => (
              <Card key={lesson.id} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className={`${getDifficultyColor('easy')} text-white`}>
                      {lesson.area}
                    </Badge>
                    <span className={`text-sm ${themeClasses.text}/70`}>
                      {lesson.duration_min} min
                    </span>
                  </div>
                  <CardTitle className={`text-xl ${themeClasses.text}`}>
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    {lesson.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Skills you&apos;ll learn:</h4>
                      <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                        {lesson.skills.map((skill, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => handleStartLesson(lesson.id)}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                    >
                      Start Lesson
                      <Play className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button 
              onClick={() => setAppState('chapter-overview')}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-lg px-8 py-3"
            >
              Skip Prerequisites & Go to Chapter
              <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'chapter-overview') {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={handleBack} variant="outline" className={`${themeClasses.border}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Prerequisites
            </Button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className={`${themeClasses.text} font-bold`}>{userXP} XP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-400" />
                <span className={`${themeClasses.text}`}>Level {userLevel}</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              {karpathyChapter1.title}
            </h1>
            <p className={`text-xl ${themeClasses.text}/70 mb-6`}>
              {karpathyChapter1.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className={`${themeClasses.card} backdrop-blur-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-blue-400" />
                    <span className={`${themeClasses.text} font-semibold`}>Duration</span>
                  </div>
                  <p className={`${themeClasses.text}/70 text-sm mt-1`}>{karpathyChapter1.totalDuration}</p>
                </CardContent>
              </Card>
              
              <Card className={`${themeClasses.card} backdrop-blur-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-green-400" />
                    <span className={`${themeClasses.text} font-semibold`}>Lessons</span>
                  </div>
                  <p className={`${themeClasses.text}/70 text-sm mt-1`}>{karpathyChapter1.lessons.length}</p>
                </CardContent>
              </Card>
              
              <Card className={`${themeClasses.card} backdrop-blur-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-yellow-400" />
                    <span className={`${themeClasses.text} font-semibold`}>Difficulty</span>
                  </div>
                  <p className={`${themeClasses.text}/70 text-sm mt-1 capitalize`}>{karpathyChapter1.difficulty}</p>
                </CardContent>
              </Card>
            </div>

            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Video className="h-5 w-5 mr-2 text-red-500" />
                  Base Video
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className={`font-semibold ${themeClasses.text}`}>{karpathyChapter1.baseVideo.title}</h4>
                  <p className={`${themeClasses.text}/70`}>Duration: {karpathyChapter1.baseVideo.duration}</p>
                  <a 
                    href={karpathyChapter1.baseVideo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 underline"
                  >
                    Watch on YouTube
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>Lessons</h2>
            {karpathyChapter1.lessons.map((lesson, index) => (
              <Card key={lesson.id} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl font-bold text-blue-400">1.{index + 1}</div>
                      <div>
                        <CardTitle className={`text-lg ${themeClasses.text}`}>
                          {lesson.title}
                        </CardTitle>
                        <CardDescription className={`${themeClasses.text}/70`}>
                          {lesson.video.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`text-sm ${themeClasses.text}/70`}>
                          {lesson.duration_min} min
                        </div>
                        <div className={`text-sm ${themeClasses.text}/70`}>
                          {lesson.video.start}s - {lesson.video.end}s
                        </div>
                      </div>
                      {completedLessons.has(lesson.id) && (
                        <CheckCircle className="h-6 w-6 text-green-500" />
                      )}
                      <Button
                        onClick={() => handleStartLesson(lesson.id)}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      >
                        {completedLessons.has(lesson.id) ? 'Review' : 'Start'}
                        <Play className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Learning Goals:</h4>
                      <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                        {lesson.goals.map((goal, goalIndex) => (
                          <li key={goalIndex} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                            {goal}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {lesson.tags.map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className={`${themeClasses.card.replace('/10', '/20')}`}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'lesson' && currentLesson) {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-6">
            <Button onClick={handleBack} variant="outline" className={`${themeClasses.border}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chapter
            </Button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className={`${themeClasses.text} font-bold`}>{userXP} XP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-400" />
                <span className={`${themeClasses.text}`}>Level {userLevel}</span>
              </div>
            </div>
          </div>

          <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
            <CardHeader>
              <CardTitle className={`text-2xl ${themeClasses.text} mb-2`}>
                {currentLesson.title}
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                {currentLesson.video.description}
              </CardDescription>
              <div className="flex items-center space-x-4 text-sm mt-4">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span className={`${themeClasses.text}/70`}>{currentLesson.duration_min} min</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Video className="h-4 w-4" />
                  <span className={`${themeClasses.text}/70`}>{currentLesson.video.start}s - {currentLesson.video.end}s</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className={`${themeClasses.text}/70`}>50 XP</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Learning Goals</h4>
                  <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                    {currentLesson.goals.map((goal, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Key Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentLesson.video.keyConcepts.map((concept, index) => (
                      <Badge key={index} variant="secondary" className={`${themeClasses.card.replace('/10', '/20')}`}>
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hook */}
          <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text} flex items-center`}>
                <Brain className="h-5 w-5 mr-2 text-purple-500" />
                Hook
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text}`}>{currentLesson.hook}</p>
            </CardContent>
          </Card>

          {/* Concept */}
          <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text} flex items-center`}>
                <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                Concept
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text}`}>{currentLesson.concept}</p>
            </CardContent>
          </Card>

          {/* Video */}
          <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text} flex items-center`}>
                <Video className="h-5 w-5 mr-2 text-red-500" />
                Watch
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                {currentLesson.video.title} ({currentLesson.video.start}s - {currentLesson.video.end}s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YouTubeSegment
                videoId={karpathyChapter1.baseVideo.id}
                start={currentLesson.video.start}
                end={currentLesson.video.end}
                title={currentLesson.video.title}
              />
            </CardContent>
          </Card>

          {/* Interactive Widgets */}
          {currentLesson.widgets.map((widget, index) => (
            <Card key={index} className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Code className="h-5 w-5 mr-2 text-green-500" />
                  Hands-On: {widget.title}
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  {widget.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderInteractiveWidget(widget, () => handleLessonComplete(currentLesson.id))}
              </CardContent>
            </Card>
          ))}

          {/* Quiz */}
          {currentLesson.quiz.length > 0 && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <CheckCircle className="h-5 w-5 mr-2 text-yellow-500" />
                  Checkpoint Quiz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CheckpointQuiz
                  question={currentLesson.quiz[0].question}
                  options={currentLesson.quiz[0].options.map((opt, i) => ({ id: String(i), label: opt }))}
                  correctId={String(currentLesson.quiz[0].correct)}
                  explanation={currentLesson.quiz[0].explanation}
                  onPass={() => handleLessonComplete(currentLesson.id)}
                />
              </CardContent>
            </Card>
          )}

          {/* Tasks */}
          {currentLesson.tasks.length > 0 && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Target className="h-5 w-5 mr-2 text-orange-500" />
                  Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentLesson.tasks.map((task, index) => (
                    <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                      <p className={`text-sm ${themeClasses.text}`}>{task}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reflection */}
          {currentLesson.reflection.length > 0 && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  Reflection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentLesson.reflection.map((question, index) => (
                    <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                      <p className={`text-sm ${themeClasses.text}`}>{question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* References */}
          {currentLesson.references.length > 0 && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <BookOpen className="h-5 w-5 mr-2 text-blue-500" />
                  References & Further Reading
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {currentLesson.references.map((ref, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className={`text-sm ${themeClasses.text}/70`}>{ref.type}:</span>
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`text-sm text-blue-400 hover:text-blue-300 underline`}
                      >
                        {ref.title}
                      </a>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Lesson Button */}
          <div className="text-center">
            <Button
              onClick={handleNextLesson}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white text-lg px-8 py-3"
            >
              {nextLesson ? `Next: ${nextLesson.title}` : 'Complete Chapter'}
              <ArrowLeft className="h-5 w-5 ml-2 rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'completed') {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-4xl mx-auto py-8 px-4 text-center">
          <div className="mb-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              Chapter 1 Complete!
            </h1>
            <p className={`text-xl ${themeClasses.text}/70`}>
              Congratulations! You&apos;ve mastered the fundamentals of neural networks.
            </p>
          </div>

          <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {completedLessons.size}
                  </div>
                  <div className={`${themeClasses.text}/70`}>Lessons Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {userXP}
                  </div>
                  <div className={`${themeClasses.text}/70`}>XP Earned</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    Level {userLevel}
                  </div>
                  <div className={`${themeClasses.text}/70`}>Current Level</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-x-4">
            <Button
              onClick={() => setAppState('chapter-overview')}
              variant="outline"
              className={`${themeClasses.border}`}
            >
              Review Chapter
            </Button>
            <Button
              onClick={() => window.location.href = '/learning/karpathy'}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
            >
              Continue Learning
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
