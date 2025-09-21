"use client";

import React, { useState, useEffect } from "react";
import YouTubeSegment from "./YouTubeSegment";
import CheckpointQuiz from "./CheckpointQuiz";
import PyodideRunner from "./PyodideRunner";
import RegressionPlayground from "./RegressionPlayground";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ProgressRing } from "./ProgressRing";
import { ArrowLeft, Clock, BookOpen, Star, CheckCircle, Play, Pause, Volume2, VolumeX, Trophy, Target, Zap, Crown, Shield, Sword } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import type { LessonContent, LessonFrontmatter } from "@/lib/content-parser";

interface LessonTemplateProps {
  lesson: LessonContent;
  onComplete?: (lessonId: string) => void;
  onNext?: (nextLessonId: string) => void;
}

export default function LessonTemplate({ lesson, onComplete, onNext }: LessonTemplateProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [showSimpleExplanation, setShowSimpleExplanation] = useState(true);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [userXP, setUserXP] = useState(1250); // Mock XP
  const [userLevel, setUserLevel] = useState(3); // Mock level
  const [currentStreak, setCurrentStreak] = useState(7); // Mock streak

  const { frontmatter, content } = lesson;

  // Calculate level and XP
  const calculateLevel = (xp: number) => Math.floor(xp / 500) + 1;
  const calculateXP = (xp: number) => xp % 500;
  const calculateProgress = (xp: number) => (xp % 500) / 500 * 100;

  // Helper function for difficulty colors
  const getDifficultyColor = (tags: string[]) => {
    if (tags.includes('beginner')) return 'bg-green-100 text-green-800';
    if (tags.includes('intermediate')) return 'bg-yellow-100 text-yellow-800';
    if (tags.includes('advanced')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  // Parse content sections
  const sections = content.split('\n## ').map((section, index) => {
    if (index === 0) return section;
    return '## ' + section;
  });

  const handleQuizPass = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    setUserXP(prev => prev + 25); // Award XP
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
    
    if (onComplete) {
      onComplete(frontmatter.id);
    }
  };

  const handleCodeComplete = (sectionId: string) => {
    setCompletedSections(prev => new Set([...prev, sectionId]));
    setUserXP(prev => prev + 50); // Award more XP for coding
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3000);
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < frontmatter.quiz.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      handleQuizPass('quiz');
    }
  };

  const handleNextLesson = () => {
    if (onNext && frontmatter.next) {
      onNext(frontmatter.next);
    }
  };

  const toggleAudio = () => {
    setIsAudioPlaying(!isAudioPlaying);
    // TODO: Implement TTS
  };

  const renderWidget = (widgetType: string) => {
    switch (widgetType) {
      case 'regression_playground':
        return <RegressionPlayground />;
      case 'pyodide_snippet':
        return (
          <PyodideRunner
            starterCode={`# You can edit the nums list and re-run.
nums = [3, 1, 4, 1, 5, 9]   # ← try your own
mean = sum(nums) / len(nums)

# TODO: compute the median (hint: sort then pick middle or average two)
print("Count:", len(nums))
print("Mean:", round(mean, 3))`}
            solution={`# You can edit the nums list and re-run.
nums = [3, 1, 4, 1, 5, 9]   # ← try your own
mean = sum(nums) / len(nums)

# Compute the median
sorted_nums = sorted(nums)
n = len(sorted_nums)
if n % 2 == 0:
    median = (sorted_nums[n//2-1] + sorted_nums[n//2]) / 2
else:
    median = sorted_nums[n//2]

print("Count:", len(nums))
print("Mean:", round(mean, 3))
print("Median:", median)`}
            hints={[
              "Use sorted() to sort the list",
              "Check if length is even or odd",
              "For even length, average the two middle values"
            ]}
            onComplete={() => handleCodeComplete('pyodide')}
          />
        );
      default:
        return <div>Widget type {widgetType} not implemented</div>;
    }
  };

  const renderContentSection = (section: string, index: number) => {
    const title = section.match(/^## (.+)$/m)?.[1];
    const body = section.replace(/^## .+$/m, '').trim();

    if (!title) return null;

    return (
      <section key={index} className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="prose prose-gray max-w-none">
          {body.split('\n').map((line, lineIndex) => {
            if (line.startsWith('**Plain:**') || line.startsWith('**Precise:**')) {
              return (
                <div key={lineIndex} className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <button
                      onClick={() => setShowSimpleExplanation(!showSimpleExplanation)}
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      {showSimpleExplanation ? 'Show Technical' : 'Show Simple'}
                    </button>
                  </div>
                  {showSimpleExplanation ? (
                    <p className="text-lg font-medium text-blue-800">
                      {line.replace('**Plain:**', '').trim()}
                    </p>
                  ) : (
                    <p className="text-lg font-medium text-gray-800">
                      {line.replace('**Precise:**', '').trim()}
                    </p>
                  )}
                </div>
              );
            }
            return <p key={lineIndex} className="mb-2">{line}</p>;
          })}
        </div>
      </section>
    );
  };

  return (
    <main className={`min-h-screen ${themeClasses.background}`}>
      {/* RPG-Style Header */}
      <header className={`${themeClasses.card} backdrop-blur-sm border-b ${themeClasses.border} sticky top-0 z-10`}>
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className={`${themeClasses.text} hover:${themeClasses.card} flex items-center`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Quest
              </Button>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">⚔️</div>
                <div>
                  <h1 className={`text-xl font-bold ${themeClasses.text}`}>{frontmatter.title}</h1>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {frontmatter.duration_min} min
                    </span>
                    <Badge className={`${getDifficultyColor(frontmatter.tags)} text-white`}>
                      {frontmatter.tags[0]}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
            
            {/* XP and Level Display */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <div className="text-right">
                  <div className={`text-sm font-bold ${themeClasses.text}`}>Level {calculateLevel(userXP)}</div>
                  <div className="text-xs text-gray-500">{userXP} XP</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-blue-500" />
                <div className="text-right">
                  <div className={`text-sm font-bold ${themeClasses.text}`}>{currentStreak} day streak</div>
                  <div className="text-xs text-gray-500">Keep it up!</div>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAudio}
                className="flex items-center space-x-1"
              >
                {isAudioPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span className="text-xs">Audio</span>
              </Button>
            </div>
          </div>
          
          {/* XP Progress Bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Progress to Level {calculateLevel(userXP) + 1}</span>
              <span>{calculateXP(userXP)}/500 XP</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-yellow-400 to-orange-500 h-2 rounded-full transition-all duration-500"
                style={{ width: `${calculateProgress(userXP)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* RPG Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-8 text-center shadow-2xl transform animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-white mb-2">Quest Complete!</h2>
            <p className="text-white/90 mb-4">You've gained experience and leveled up!</p>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center justify-center space-x-4 text-white">
                <Star className="h-6 w-6" />
                <span className="text-xl font-bold">+{completedSections.size * 25} XP</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Quest Objectives */}
        {frontmatter.goals.length > 0 && (
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <Target className="h-6 w-6 mr-3 text-blue-500" />
                Quest Objectives
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                Complete these objectives to master this quest and earn XP!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {frontmatter.goals.map((goal, index) => (
                  <div key={index} className={`flex items-start p-4 rounded-lg ${themeClasses.card} border ${themeClasses.border}`}>
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className={`font-semibold ${themeClasses.text} mb-1`}>Objective {index + 1}</h3>
                      <p className={`text-sm ${themeClasses.text}/70`}>{goal}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Video Section */}
        {frontmatter.video && (
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <Play className="h-6 w-6 mr-3 text-red-500" />
                Watch & Learn
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                Master the knowledge through this interactive video segment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <YouTubeSegment
                videoId={frontmatter.video.id}
                start={frontmatter.video.start}
                end={frontmatter.video.end}
                title={`${frontmatter.title} - Video Segment`}
              />
              <div className="mt-4 flex items-center justify-between text-sm">
                <div className="flex items-center space-x-4">
                  <span className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    {Math.floor((frontmatter.video.end - frontmatter.video.start) / 60)} min video
                  </span>
                  <span className="flex items-center text-gray-600">
                    <Zap className="h-4 w-4 mr-1" />
                    Interactive
                  </span>
                </div>
                <div className="text-gray-500">
                  Press <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">k</kbd> to play/pause
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content Sections */}
        {sections.map((section, index) => renderContentSection(section, index))}

        {/* Quiz Section */}
        {frontmatter.quiz.length > 0 && (
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <Shield className="h-6 w-6 mr-3 text-green-500" />
                Knowledge Challenge ({currentQuizIndex + 1}/{frontmatter.quiz.length})
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                Test your understanding and earn XP for correct answers!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Question {currentQuizIndex + 1}</span>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-bold text-yellow-600">+25 XP</span>
                  </div>
                </div>
              </div>
              <CheckpointQuiz
                question={frontmatter.quiz[currentQuizIndex].q}
                options={frontmatter.quiz[currentQuizIndex].options.map((option, i) => ({
                  id: i.toString(),
                  label: option
                }))}
                correctId={frontmatter.quiz[currentQuizIndex].answer.toString()}
                explanation={frontmatter.quiz[currentQuizIndex].explain}
                onPass={currentQuizIndex < frontmatter.quiz.length - 1 ? handleNextQuiz : () => handleQuizPass('quiz')}
              />
            </CardContent>
          </Card>
        )}

        {/* Interactive Widgets */}
        {frontmatter.widgets.map((widget, index) => (
          <Card key={index} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <Sword className="h-6 w-6 mr-3 text-purple-500" />
                Practice Arena
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                Apply your skills and earn bonus XP for completing challenges!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600">Interactive Challenge</span>
                  <div className="flex items-center space-x-2">
                    <Crown className="h-4 w-4 text-purple-500" />
                    <span className="text-sm font-bold text-purple-600">+50 XP</span>
                  </div>
                </div>
              </div>
              {renderWidget(widget)}
            </CardContent>
          </Card>
        ))}

        {/* Tasks */}
        {frontmatter.tasks.length > 0 && (
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <Target className="h-6 w-6 mr-3 text-orange-500" />
                Quest Tasks
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                Complete these tasks to master this quest and unlock rewards!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {frontmatter.tasks.map((task, index) => (
                  <div key={index} className={`flex items-start p-4 rounded-lg ${themeClasses.card} border ${themeClasses.border}`}>
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className={`font-semibold ${themeClasses.text} mb-1`}>Task {index + 1}</h3>
                      <p className={`text-sm ${themeClasses.text}/70`}>{task}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-bold text-yellow-600">+15 XP</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reflection */}
        {frontmatter.reflection.length > 0 && (
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
                <BookOpen className="h-6 w-6 mr-3 text-indigo-500" />
                Wisdom Reflection
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                Think deeply about what you've learned and how it applies to your journey
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {frontmatter.reflection.map((question, index) => (
                  <div key={index} className={`p-4 rounded-lg ${themeClasses.card} border ${themeClasses.border}`}>
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-sm">?</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-semibold ${themeClasses.text} mb-2`}>Reflection Question {index + 1}</h3>
                        <p className={`text-sm ${themeClasses.text}/70`}>{question}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Next Lesson */}
        {frontmatter.next && (
          <Card className={`bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg`}>
            <CardHeader>
              <CardTitle className={`text-2xl font-bold text-green-900 flex items-center`}>
                <Trophy className="h-6 w-6 mr-3 text-green-600" />
                Quest Complete! What's Next?
              </CardTitle>
              <CardDescription className="text-green-800">
                You've mastered this quest! Ready to continue your AI learning journey?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">🎉</div>
                  <div>
                    <h3 className="text-lg font-semibold text-green-900">Congratulations!</h3>
                    <p className="text-green-700">You've gained valuable experience and knowledge.</p>
                  </div>
                </div>
                <Button 
                  onClick={handleNextLesson} 
                  className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                >
                  Continue Quest
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Summary */}
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} shadow-lg`}>
          <CardHeader>
            <CardTitle className={`text-2xl font-bold ${themeClasses.text} flex items-center`}>
              <Crown className="h-6 w-6 mr-3 text-yellow-500" />
              Quest Summary
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Your progress and achievements in this learning quest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-white">{completedSections.size}</span>
                </div>
                <div className="text-sm font-semibold text-gray-600">Sections Completed</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-white">+{completedSections.size * 25}</span>
                </div>
                <div className="text-sm font-semibold text-gray-600">XP Earned</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-white">{frontmatter.duration_min}</span>
                </div>
                <div className="text-sm font-semibold text-gray-600">Minutes Spent</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-2xl font-bold text-white">{frontmatter.tags[0].charAt(0).toUpperCase()}</span>
                </div>
                <div className="text-sm font-semibold text-gray-600">Difficulty</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
