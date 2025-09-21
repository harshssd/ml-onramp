'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { karpathyTracks, getKarpathyTrackById, getKarpathyChapterById, getKarpathyLessonById } from '@/data/karpathyContent';
import { DerivativeCalculator, GradientVisualizer, NeuralNetworkBuilder, BackpropSimulator } from '@/components/KarpathyWidgets';
import YouTubeSegment from '@/components/YouTubeSegment';
import CheckpointQuiz from '@/components/CheckpointQuiz';
import PyodideRunner from '@/components/PyodideRunner';
import { ArrowLeft, Play, Code, Brain, BookOpen, Clock, Star, Trophy, CheckCircle, Video, Zap } from 'lucide-react';

type AppState = 'track-selection' | 'chapter-selection' | 'lesson' | 'completed';

export default function KarpathyLearningPage() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const [appState, setAppState] = useState<AppState>('track-selection');
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  const currentTrack = selectedTrack ? getKarpathyTrackById(selectedTrack) : null;
  const currentChapter = selectedChapter && selectedTrack ? getKarpathyChapterById(selectedTrack, selectedChapter) : null;
  const currentLesson = selectedLesson && selectedChapter && selectedTrack ? getKarpathyLessonById(selectedTrack, selectedChapter, selectedLesson) : null;

  const calculateLevel = (xp: number) => Math.floor(xp / 100) + 1;
  const calculateProgress = (xp: number) => ((xp % 100) / 100) * 100;

  const handleTrackSelect = (trackId: string) => {
    setSelectedTrack(trackId);
    setAppState('chapter-selection');
  };

  const handleChapterSelect = (chapterId: string) => {
    setSelectedChapter(chapterId);
    setAppState('lesson');
  };

  const handleLessonSelect = (lessonId: string) => {
    setSelectedLesson(lessonId);
  };

  const handleLessonComplete = (lessonId: string, xpEarned: number = 50) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    setUserXP(prev => prev + xpEarned);
    setUserLevel(calculateLevel(userXP + xpEarned));
  };

  const handleBack = () => {
    if (appState === 'lesson' && selectedLesson) {
      setSelectedLesson(null);
    } else if (appState === 'lesson' && selectedChapter) {
      setSelectedChapter(null);
      setAppState('chapter-selection');
    } else if (appState === 'chapter-selection' && selectedTrack) {
      setSelectedTrack(null);
      setAppState('track-selection');
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'coding': return <Code className="h-5 w-5" />;
      case 'interactive': return <Play className="h-5 w-5" />;
      case 'quiz': return <CheckCircle className="h-5 w-5" />;
      case 'prerequisite': return <BookOpen className="h-5 w-5" />;
      case 'capstone': return <Trophy className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
    }
  };

  const renderInteractiveWidget = (widget: { type: string }, onComplete?: () => void) => {
    switch (widget.type) {
      case 'derivative_calculator':
        return <DerivativeCalculator onComplete={onComplete} />;
      case 'gradient_visualizer':
        return <GradientVisualizer onComplete={onComplete} />;
      case 'neural_network_builder':
        return <NeuralNetworkBuilder onComplete={onComplete} />;
      case 'backprop_simulator':
        return <BackpropSimulator onComplete={onComplete} />;
      default:
        return null;
    }
  };

  if (appState === 'track-selection') {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="text-center mb-8">
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              🧠 Neural Networks: Zero to Hero
            </h1>
            <p className={`text-xl ${themeClasses.text}/70`}>
              Master neural networks with Andrej Karpathy&apos;s legendary course, enhanced with interactive learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {karpathyTracks.map((track) => (
              <Card key={track.id} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                onClick={() => handleTrackSelect(track.id)}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-4xl">{track.icon}</div>
                    <Badge className={`${getDifficultyColor(track.difficulty)} text-white`}>
                      {track.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className={`text-2xl ${themeClasses.text}`}>
                    {track.title}
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    {track.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Duration:</span>
                      <span className={`${themeClasses.text}`}>{track.totalDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Chapters:</span>
                      <span className={`${themeClasses.text}`}>{track.chapters.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/70`}>Prerequisites:</span>
                      <span className={`${themeClasses.text}`}>{track.prerequisites.join(', ')}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <h4 className={`font-semibold ${themeClasses.text} mb-2`}>What you'll learn:</h4>
                    <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                      {track.outcomes.slice(0, 3).map((outcome, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    Start Learning Journey
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'chapter-selection' && currentTrack) {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-6xl mx-auto py-8 px-4">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={handleBack} variant="outline" className={`${themeClasses.border}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tracks
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
            <h1 className={`text-3xl font-bold ${themeClasses.text} mb-2`}>
              {currentTrack.title}
            </h1>
            <p className={`text-lg ${themeClasses.text}/70`}>
              {currentTrack.description}
            </p>
          </div>

          <div className="space-y-6">
            {currentTrack.chapters.map((chapter, index) => (
              <Card key={chapter.id} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{chapter.icon}</div>
                      <div>
                        <CardTitle className={`text-xl ${themeClasses.text}`}>
                          {chapter.title}
                        </CardTitle>
                        <CardDescription className={`${themeClasses.text}/70`}>
                          {chapter.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={`${getDifficultyColor(chapter.difficulty)} text-white mb-2`}>
                        {chapter.difficulty}
                      </Badge>
                      <div className={`text-sm ${themeClasses.text}/70`}>
                        {chapter.estimatedTime}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {chapter.lessons.map((lesson) => (
                      <Card
                        key={lesson.id}
                        className={`${themeClasses.card.replace('/10', '/5')} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 cursor-pointer`}
                        onClick={() => {
                          handleLessonSelect(lesson.id);
                          handleChapterSelect(chapter.id);
                        }}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getLessonIcon(lesson.type)}
                              <span className={`text-sm ${themeClasses.text}/70`}>
                                {lesson.duration_min} min
                              </span>
                            </div>
                            {completedLessons.has(lesson.id) && (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            )}
                          </div>
                          <CardTitle className={`text-sm ${themeClasses.text}`}>
                            {lesson.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <p className={`text-xs ${themeClasses.text}/70`}>
                            {lesson.description}
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <Button
                    onClick={() => handleChapterSelect(chapter.id)}
                    className="w-full mt-4 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                  >
                    Start Chapter
                    <Play className="h-4 w-4 ml-2" />
                  </Button>
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
              <div className="flex items-center space-x-3 mb-4">
                {getLessonIcon(currentLesson.type)}
                <div>
                  <CardTitle className={`text-2xl ${themeClasses.text}`}>
                    {currentLesson.title}
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    {currentLesson.description}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span className={`${themeClasses.text}/70`}>{currentLesson.duration_min} min</span>
                </div>
                <Badge className={`${getDifficultyColor(currentLesson.difficulty)} text-white`}>
                  {currentLesson.difficulty}
                </Badge>
                <div className="flex items-center space-x-1">
                  <Zap className="h-4 w-4 text-yellow-400" />
                  <span className={`${themeClasses.text}/70`}>50 XP</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Learning Objectives</h4>
                  <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                    {currentLesson.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2" />
                        {objective}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Key Concepts</h4>
                  <div className="flex flex-wrap gap-2">
                    {currentLesson.keyConcepts.map((concept, index) => (
                      <Badge key={index} variant="secondary" className={`${themeClasses.card.replace('/10', '/20')}`}>
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Video Content */}
          {currentLesson.type === 'video' && currentLesson.videoSegment && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Video className="h-5 w-5 mr-2 text-red-500" />
                  Video Lesson
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  {currentLesson.videoSegment.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <YouTubeSegment
                  videoId={currentLesson.videoSegment.id}
                  start={currentLesson.videoSegment.start}
                  end={currentLesson.videoSegment.end}
                  title={currentLesson.videoSegment.title}
                />
                <Button
                  onClick={() => handleLessonComplete(currentLesson.id)}
                  className="mt-4 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Video Lesson
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Interactive Widget */}
          {currentLesson.interactiveWidget && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Brain className="h-5 w-5 mr-2 text-blue-500" />
                  Interactive Learning
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  {currentLesson.interactiveWidget.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {renderInteractiveWidget(currentLesson.interactiveWidget, () => 
                  handleLessonComplete(currentLesson.id)
                )}
              </CardContent>
            </Card>
          )}

          {/* Coding Content */}
          {currentLesson.type === 'coding' && currentLesson.coding && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Code className="h-5 w-5 mr-2 text-purple-500" />
                  Coding Challenge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <PyodideRunner
                  starterCode={currentLesson.coding.starterCode}
                  solution={currentLesson.coding.solution}
                  onComplete={() => handleLessonComplete(currentLesson.id)}
                />
              </CardContent>
            </Card>
          )}

          {/* Quiz Content */}
          {currentLesson.quiz && currentLesson.quiz.length > 0 && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                  Knowledge Check
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

          {/* References */}
          {currentLesson.references && currentLesson.references.length > 0 && (
            <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <BookOpen className="h-5 w-5 mr-2 text-orange-500" />
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

          {/* Reflection */}
          {currentLesson.reflection && currentLesson.reflection.length > 0 && (
            <Card className={`${themeClasses.card} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  Reflection Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentLesson.reflection.map((question, index) => (
                    <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')}`}>
                      <p className={`text-sm ${themeClasses.text}`}>{question}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    );
  }

  return null;
}
