'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { Chapter, Lesson, Character, getChapterById } from '@/data/storyData';
import { BookOpen, Code, Play, CheckCircle, Star, Trophy, Target, Clock, Video } from 'lucide-react';
import YouTubeSegment from './YouTubeSegment';

interface StoryInterfaceProps {
  character: Character;
  currentChapterId: string;
  onChapterComplete: (chapterId: string) => void;
  onLessonComplete: (lessonId: string) => void;
}

export function StoryInterface({ 
  character, 
  currentChapterId, 
  onChapterComplete, 
  onLessonComplete 
}: StoryInterfaceProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [currentChapter, setCurrentChapter] = useState<Chapter | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  // const [userProgress] = useState(0);
  const [showNarrative, setShowNarrative] = useState(true);

  useEffect(() => {
    // Load chapter data (in real app, this would come from API)
    const chapter = loadChapter(currentChapterId);
    setCurrentChapter(chapter);
  }, [currentChapterId]);

  const loadChapter = (id: string): Chapter | null => {
    // Use the imported function for now
    return getChapterById('data-explorer', id) || null;
  };

  const startLesson = (lesson: Lesson) => {
    setCurrentLesson(lesson);
    setShowNarrative(false);
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
    onLessonComplete(lessonId);
    
    // Check if all lessons in chapter are complete
    if (currentChapter && currentChapter.lessons.every(lesson => 
      completedLessons.has(lesson.id) || lesson.id === lessonId
    )) {
      onChapterComplete(currentChapter.id);
    }
  };

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'theory': return <BookOpen className="h-5 w-5" />;
      case 'coding': return <Code className="h-5 w-5" />;
      case 'interactive': return <Play className="h-5 w-5" />;
      case 'project': return <Target className="h-5 w-5" />;
      case 'quiz': return <CheckCircle className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
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

  if (!currentChapter) {
    return (
      <div className={`min-h-screen ${themeClasses.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-400 mx-auto"></div>
          <p className={`mt-4 ${themeClasses.text}/80 text-lg`}>Loading your story...</p>
        </div>
      </div>
    );
  }

  if (currentLesson) {
    return (
      <LessonInterface 
        lesson={currentLesson}
        character={character}
        onComplete={() => {
          completeLesson(currentLesson.id);
          setCurrentLesson(null);
          setShowNarrative(true);
        }}
        onBack={() => {
          setCurrentLesson(null);
          setShowNarrative(true);
        }}
      />
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background} p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Character Header */}
        <div className={`${themeClasses.card} backdrop-blur-sm rounded-2xl p-6 mb-8 border ${themeClasses.border}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🧙‍♂️</div>
              <div>
                <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
                  Welcome, {character.name}!
                </h1>
                <p className={`${themeClasses.text}/70`}>
                  {character.background} • {character.motivation} • {character.experience} experience
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-2 mb-2">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className={`${themeClasses.text} font-bold`}>1,250 XP</span>
              </div>
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-purple-400" />
                <span className={`${themeClasses.text}/70`}>Level 3 Explorer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter Header */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="text-3xl">📚</div>
                <div>
                  <CardTitle className={`text-3xl ${themeClasses.text}`}>
                    {currentChapter.title}
                  </CardTitle>
                  <CardDescription className={`text-lg ${themeClasses.text}/70`}>
                    {currentChapter.title}
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <Badge className={`${getDifficultyColor('beginner')} text-white`}>
                  Beginner
                </Badge>
                <div className="flex items-center space-x-1 mt-2">
                  <Clock className="h-4 w-4" />
                  <span className={`text-sm ${themeClasses.text}/70`}>
                    2-3 hours
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {showNarrative && (
              <div className="mb-6">
                <div className={`${themeClasses.card.replace('/10', '/5')} rounded-xl p-6 mb-4`}>
                  <h3 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>
                    📖 Story
                  </h3>
                  <p className={`${themeClasses.text}/80 leading-relaxed`}>
                    {currentChapter.storyText.replace(/'/g, '&apos;')}
                  </p>
                </div>
                
                <div className={`${themeClasses.card.replace('/10', '/5')} rounded-xl p-6`}>
                  <h3 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>
                    🎯 Learning Objectives
                  </h3>
                  <ul className="space-y-2">
                    {currentChapter.objectives.map((objective, index) => (
                      <li key={index} className={`flex items-center space-x-2 ${themeClasses.text}/80`}>
                        <CheckCircle className="h-4 w-4 text-green-400" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Lessons */}
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${themeClasses.text} mb-4`}>
                📚 Lessons
              </h3>
              {currentChapter.lessons.map((lesson, index) => (
                <Card 
                  key={lesson.id}
                  className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-200`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getLessonIcon(lesson.type)}
                          <span className={`text-sm font-medium ${themeClasses.text}/70`}>
                            {lesson.type.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h4 className={`text-lg font-semibold ${themeClasses.text}`}>
                            {index + 1}. {lesson.title}
                          </h4>
                          <p className={`${themeClasses.text}/70 text-sm`}>
                            {lesson.content}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        {completedLessons.has(lesson.id) && (
                          <CheckCircle className="h-6 w-6 text-green-400" />
                        )}
                        <Button
                          onClick={() => startLesson(lesson)}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                        >
                          {completedLessons.has(lesson.id) ? 'Review' : 'Start'}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Chapter Progress */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${themeClasses.text}`}>
                  Chapter Progress
                </span>
                <span className={`text-sm ${themeClasses.text}/70`}>
                  {completedLessons.size} / {currentChapter.lessons.length} lessons
                </span>
              </div>
              <Progress 
                value={(completedLessons.size / currentChapter.lessons.length) * 100} 
                className="h-2"
              />
            </div>

            {/* Rewards */}
            <div className="mt-6">
              <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>
                🏆 Chapter Rewards
              </h4>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Star className="h-5 w-5 text-yellow-400" />
                  <span className={`${themeClasses.text}/80`}>
                    +100 XP
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="h-5 w-5 text-purple-400" />
                  <span className={`${themeClasses.text}/80`}>
                    First Steps, Python Initiate
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Lesson Interface Component
interface LessonInterfaceProps {
  lesson: Lesson;
  character: Character;
  onComplete: () => void;
  onBack: () => void;
}

function LessonInterface({ lesson, character, onComplete, onBack }: LessonInterfaceProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showSolution, setShowSolution] = useState(false);
  const [userCode, setUserCode] = useState(lesson.code || '');

  return (
    <div className={`min-h-screen ${themeClasses.background} p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Lesson Header */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`text-2xl ${themeClasses.text}`}>
                  {lesson.title}
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  {lesson.type.toUpperCase()} • {character.name}&apos;s Journey
                </CardDescription>
              </div>
              <Button onClick={onBack} variant="outline">
                Back to Chapter
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Lesson Content */}
        <div className="space-y-6">
          {/* Instructions */}
          <Card className={`${themeClasses.card} backdrop-blur-sm`}>
            <CardHeader>
              <CardTitle className={`${themeClasses.text}`}>Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`${themeClasses.text}/80 leading-relaxed`}>
                {lesson.instructions}
              </p>
            </CardContent>
          </Card>

          {/* Code Editor */}
          {lesson.type === 'coding' && (
            <Card className={`${themeClasses.card} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text}`}>Code Editor</CardTitle>
              </CardHeader>
              <CardContent>
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className={`w-full h-64 p-4 rounded-lg ${themeClasses.card} border ${themeClasses.border} ${themeClasses.text} font-mono text-sm`}
                  placeholder="Write your code here..."
                />
                <div className="flex justify-between mt-4">
                  <Button
                    onClick={() => setShowSolution(!showSolution)}
                    variant="outline"
                  >
                    {showSolution ? 'Hide' : 'Show'} Solution
                  </Button>
                  <Button
                    onClick={onComplete}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    Complete Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Video Content */}
          {lesson.type === 'video' && lesson.video && (
            <Card className={`${themeClasses.card} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Video className="h-5 w-5 mr-2 text-red-500" />
                  Video Lesson
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  {lesson.video.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <YouTubeSegment
                  videoId={lesson.video.id}
                  start={lesson.video.start}
                  end={lesson.video.end}
                  title={lesson.video.title}
                />
                <div className="mt-4">
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
                    What to Watch For:
                  </h4>
                  <p className={`${themeClasses.text}/80 text-sm`}>
                    {lesson.instructions}
                  </p>
                </div>
                <div className="mt-6">
                  <Button
                    onClick={onComplete}
                    className="bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Video Lesson
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Solution */}
          {showSolution && lesson.solution && (
            <Card className={`${themeClasses.card} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text}`}>Solution</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className={`${themeClasses.card} p-4 rounded-lg overflow-x-auto`}>
                  <code className={`${themeClasses.text} font-mono text-sm`}>
                    {lesson.solution}
                  </code>
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Resources */}
          {lesson.resources && lesson.resources.length > 0 && (
            <Card className={`${themeClasses.card} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text}`}>Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {lesson.resources.map((resource, index) => (
                    <a
                      key={index}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} hover:${themeClasses.card.replace('/10', '/20')} transition-colors`}
                    >
                      <div className="flex items-center space-x-3">
                        <BookOpen className="h-5 w-5 text-blue-400" />
                        <div>
                          <h4 className={`font-semibold ${themeClasses.text}`}>
                            {resource.title}
                          </h4>
                          <p className={`text-sm ${themeClasses.text}/70`}>
                            {resource.type.toUpperCase()}
                          </p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
