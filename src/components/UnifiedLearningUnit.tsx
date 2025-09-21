'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { LearningUnit, Superpower } from '@/data/unifiedContent';
import YouTubeSegment from './YouTubeSegment';
import CheckpointQuiz from './CheckpointQuiz';
import PyodideRunner from './PyodideRunner';
import FlashcardSystem from './FlashcardSystem';
import { 
  Play, 
  Code, 
  CheckCircle, 
  Star, 
  Zap, 
  Clock, 
  Target, 
  BookOpen,
  Video,
  Brain,
  Trophy
} from 'lucide-react';

interface UnifiedLearningUnitProps {
  unit: LearningUnit;
  isStoryMode?: boolean;
  characterName?: string;
  onComplete?: (unitId: string, xpEarned: number, superpower?: Superpower) => void;
  onBack?: () => void;
}

export function UnifiedLearningUnit({ 
  unit, 
  isStoryMode = false, 
  characterName,
  onComplete,
  onBack 
}: UnifiedLearningUnitProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [currentSection, setCurrentSection] = useState<'content' | 'quiz' | 'coding' | 'flashcards'>('content');
  const [completedSections, setCompletedSections] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [earnedXP, setEarnedXP] = useState(0);
  const [unlockedSuperpower, setUnlockedSuperpower] = useState<Superpower | null>(null);

  const getUnitIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'coding': return <Code className="h-5 w-5" />;
      case 'interactive': return <Play className="h-5 w-5" />;
      case 'quiz': return <CheckCircle className="h-5 w-5" />;
      case 'project': return <Target className="h-5 w-5" />;
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

  const handleSectionComplete = (section: string) => {
    setCompletedSections(prev => new Set([...prev, section]));
    
    // Award XP for completing sections
    const xpPerSection = 25;
    setEarnedXP(prev => prev + xpPerSection);
  };

  const handleUnitComplete = () => {
    const totalXP = 100 + (completedSections.size * 25);
    setEarnedXP(totalXP);
    
    // Convert unit superpower to Superpower type
    if (unit.superpower) {
      const superpower: Superpower = {
        id: unit.superpower.id,
        name: unit.superpower.name,
        description: unit.superpower.description,
        icon: unit.superpower.icon,
        color: unit.superpower.color,
        unlockedAt: unit.id,
        level: 1,
        maxLevel: 5
      };
      setUnlockedSuperpower(superpower);
    } else {
      setUnlockedSuperpower(null);
    }
    
    setShowCelebration(true);
    
    if (onComplete) {
      onComplete(unit.id, totalXP, unit.superpower ? {
        id: unit.superpower.id,
        name: unit.superpower.name,
        description: unit.superpower.description,
        icon: unit.superpower.icon,
        color: unit.superpower.color,
        unlockedAt: unit.id,
        level: 1,
        maxLevel: 5
      } : undefined);
    }
  };

  const isUnitComplete = completedSections.size >= 3; // Complete when 3+ sections done

  return (
    <div className="space-y-6">
      {/* Unit Header */}
      <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl">🎮</div>
              <div>
                <CardTitle className={`text-2xl ${themeClasses.text} flex items-center`}>
                  {getUnitIcon(unit.type)}
                  <span className="ml-2">{unit.title}</span>
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  {isStoryMode ? `${characterName}'s Quest` : 'Learning Unit'} • {unit.duration_min} minutes
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getDifficultyColor(unit.difficulty)} text-white`}>
                {unit.difficulty}
              </Badge>
              {onBack && (
                <Button onClick={onBack} variant="outline" size="sm">
                  Back
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className={`${themeClasses.text}/80 mb-4`}>{unit.description}</p>
          
          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className={`${themeClasses.text}/70`}>Progress</span>
              <span className={`${themeClasses.text}`}>{completedSections.size}/4 sections</span>
            </div>
            <Progress value={(completedSections.size / 4) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Navigation Tabs */}
      <div className="flex space-x-2">
        <Button
          onClick={() => setCurrentSection('content')}
          variant={currentSection === 'content' ? 'default' : 'outline'}
          className="flex-1"
        >
          <BookOpen className="h-4 w-4 mr-2" />
          Content
        </Button>
        {unit.quiz && (
          <Button
            onClick={() => setCurrentSection('quiz')}
            variant={currentSection === 'quiz' ? 'default' : 'outline'}
            className="flex-1"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Quiz
          </Button>
        )}
        {unit.coding && (
          <Button
            onClick={() => setCurrentSection('coding')}
            variant={currentSection === 'coding' ? 'default' : 'outline'}
            className="flex-1"
          >
            <Code className="h-4 w-4 mr-2" />
            Code
          </Button>
        )}
        <Button
          onClick={() => setCurrentSection('flashcards')}
          variant={currentSection === 'flashcards' ? 'default' : 'outline'}
          className="flex-1"
        >
          <Brain className="h-4 w-4 mr-2" />
          Practice
        </Button>
      </div>

      {/* Content Section */}
      {currentSection === 'content' && (
        <div className="space-y-6">
          {/* Video Content */}
          {unit.video && (
            <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Video className="h-5 w-5 mr-2 text-red-500" />
                  Video Lesson
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  {unit.video.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <YouTubeSegment
                  videoId={unit.video.id}
                  start={unit.video.start}
                  end={unit.video.end}
                  title={unit.video.title}
                />
                {unit.video.transcript && (
                  <div className="mt-4">
                    <details className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-4`}>
                      <summary className={`${themeClasses.text} font-medium cursor-pointer`}>
                        View Transcript
                      </summary>
                      <div className={`${themeClasses.text}/80 text-sm mt-2`}>
                        {unit.video.transcript}
                      </div>
                    </details>
                  </div>
                )}
                <div className="mt-4">
                  <Button
                    onClick={() => handleSectionComplete('video')}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Video
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Interactive Content */}
          {unit.type === 'interactive' && (
            <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Play className="h-5 w-5 mr-2 text-blue-500" />
                  Interactive Exercise
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`${themeClasses.text}/80`}>
                  {unit.description}
                </div>
                <div className="mt-4">
                  <Button
                    onClick={() => handleSectionComplete('interactive')}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Exercise
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Quiz Section */}
      {currentSection === 'quiz' && unit.quiz && (
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Knowledge Check
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CheckpointQuiz
              question={unit.quiz.questions[0].question}
              options={unit.quiz.questions[0].options.map((opt, i) => ({
                id: i.toString(),
                label: opt
              }))}
              correctId={unit.quiz.questions[0].correct.toString()}
              explanation={unit.quiz.questions[0].explanation}
              onPass={() => handleSectionComplete('quiz')}
            />
          </CardContent>
        </Card>
      )}

      {/* Coding Section */}
      {currentSection === 'coding' && unit.coding && (
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Code className="h-5 w-5 mr-2 text-purple-500" />
              Coding Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PyodideRunner
              starterCode={unit.coding.starterCode}
              solution={unit.coding.solution}
              onComplete={() => handleSectionComplete('coding')}
            />
          </CardContent>
        </Card>
      )}

      {/* Flashcards Section */}
      {currentSection === 'flashcards' && (
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Brain className="h-5 w-5 mr-2 text-orange-500" />
              Practice with Flashcards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FlashcardSystem
              flashcards={unit.flashcards}
              onComplete={() => handleSectionComplete('flashcards')}
            />
          </CardContent>
        </Card>
      )}

      {/* Complete Unit Button */}
      {isUnitComplete && (
        <div className="text-center">
          <Button
            onClick={handleUnitComplete}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-lg px-8 py-3"
          >
            <Trophy className="h-5 w-5 mr-2" />
            Complete Quest
          </Button>
        </div>
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} max-w-md mx-4`}>
            <CardHeader className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <CardTitle className={`text-2xl ${themeClasses.text}`}>
                Quest Complete!
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70`}>
                You earned {earnedXP} XP!
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              {unlockedSuperpower && (
                <div className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-4`}>
                  <div className="text-3xl mb-2">{unlockedSuperpower.icon}</div>
                  <div className={`font-semibold ${unlockedSuperpower.color}`}>
                    New Superpower: {unlockedSuperpower.name}
                  </div>
                  <div className={`text-sm ${themeClasses.text}/70`}>
                    {unlockedSuperpower.description}
                  </div>
                </div>
              )}
              <Button
                onClick={() => setShowCelebration(false)}
                className="w-full"
              >
                Continue Journey
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
