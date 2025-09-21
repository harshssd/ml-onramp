'use client';

import React, { useState, useEffect } from 'react';
import { CharacterCreation } from '@/components/CharacterCreation';
import { LearningPathSelector } from '@/components/LearningPathSelector';
import { StoryInterface } from '@/components/StoryInterface';
import { Character } from '@/data/storyData';
import { aiFundamentalsContent, getUnitById, LearningUnit, CharacterProgression as CharacterProgressionType, Superpower } from '@/data/unifiedContent';
import { UnifiedLearningUnit } from '@/components/UnifiedLearningUnit';
import { CharacterProgression } from '@/components/CharacterProgression';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { Star, Trophy, Zap, ArrowRight, Play, Video, Code, CheckCircle, Brain } from 'lucide-react';

type AppState = 'character-creation' | 'path-selection' | 'story' | 'unified-learning' | 'character-showcase';

export default function LearningPage() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [appState, setAppState] = useState<AppState>('character-creation');
  const [character, setCharacter] = useState<Character | null>(null);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [currentChapter, setCurrentChapter] = useState<string>('chapter-1');
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [completedChapters, setCompletedChapters] = useState<Set<string>>(new Set());
  const [currentUnit, setCurrentUnit] = useState<LearningUnit | null>(null);
  const [showCharacterProgression, setShowCharacterProgression] = useState(false);
  
  // Character progression state
  const [characterProgression, setCharacterProgression] = useState<CharacterProgressionType>({
    characterId: 'default',
    name: 'AI Explorer',
    level: 1,
    xp: 0,
    superpowers: [],
    achievements: [],
    completedLessons: [],
    currentStreak: 0,
    totalLearningTime: 0
  });

  // Check for path parameter in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const pathParam = urlParams.get('path');
    if (pathParam) {
      setSelectedPath(pathParam);
      setAppState('story');
    }
  }, []);

  const handleCharacterComplete = (newCharacter: Character) => {
    setCharacter(newCharacter);
    setCharacterProgression(prev => ({
      ...prev,
      characterId: newCharacter.name.toLowerCase().replace(/\s+/g, '-'),
      name: newCharacter.name
    }));
    setAppState('unified-learning');
  };

  const handlePathSelect = (pathId: string) => {
    setSelectedPath(pathId);
    setAppState('story');
    // Set the first chapter based on the selected path
    if (pathId === 'data-explorer') {
      setCurrentChapter('chapter-1');
    }
    // Add other path mappings here
  };

  const handleLessonComplete = (lessonId: string) => {
    setCompletedLessons(prev => new Set([...prev, lessonId]));
  };

  const handleChapterComplete = (chapterId: string) => {
    setCompletedChapters(prev => new Set([...prev, chapterId]));
    // Move to next chapter or complete the path
    if (chapterId === 'chapter-1') {
      setCurrentChapter('chapter-2');
    } else if (chapterId === 'chapter-2') {
      setCurrentChapter('chapter-3');
    } else if (chapterId === 'chapter-3') {
      setCurrentChapter('chapter-4');
    } else if (chapterId === 'chapter-4') {
      setCurrentChapter('chapter-5');
    } else if (chapterId === 'chapter-5') {
      // Path completed!
      setAppState('path-selection');
    }
  };

  const handleUnitComplete = (unitId: string, xpEarned: number, superpower?: Superpower) => {
    setCharacterProgression(prev => {
      const newXP = prev.xp + xpEarned;
      const newLevel = Math.floor(newXP / 100) + 1;
      const newSuperpowers = superpower ? [...prev.superpowers, superpower] : prev.superpowers;
      const newCompletedLessons = [...prev.completedLessons, unitId];
      
      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        superpowers: newSuperpowers,
        completedLessons: newCompletedLessons,
        totalLearningTime: prev.totalLearningTime + 30 // Assume 30 min per unit
      };
    });
    
    setCurrentUnit(null);
  };

  const startUnit = (unit: LearningUnit) => {
    setCurrentUnit(unit);
  };

  const getUnitIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-5 w-5" />;
      case 'coding': return <Code className="h-5 w-5" />;
      case 'interactive': return <Play className="h-5 w-5" />;
      case 'quiz': return <CheckCircle className="h-5 w-5" />;
      case 'project': return <Trophy className="h-5 w-5" />;
      default: return <Brain className="h-5 w-5" />;
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

  // const handleBackToPathSelection = () => {
  //   setAppState('path-selection');
  // };

  const handleBackToCharacterCreation = () => {
    setAppState('character-creation');
    setCharacter(null);
    setSelectedPath(null);
    setCurrentChapter('chapter-1');
    setCompletedLessons(new Set());
    setCompletedChapters(new Set());
  };

  if (!character) {
    return (
      <CharacterCreation onComplete={handleCharacterComplete} />
    );
  }

  if (currentUnit) {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <UnifiedLearningUnit
            unit={currentUnit}
            isStoryMode={true}
            characterName={character.name}
            onComplete={handleUnitComplete}
            onBack={() => setCurrentUnit(null)}
          />
        </div>
      </div>
    );
  }

  if (showCharacterProgression) {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${themeClasses.text}`}>
              {character.name}&apos;s AI Superpowers
            </h2>
            <Button
              onClick={() => setShowCharacterProgression(false)}
              variant="outline"
            >
              Back to Learning
            </Button>
          </div>
          <CharacterProgression
            character={characterProgression}
            onShare={() => {
              console.log('Sharing character progression');
            }}
          />
        </div>
      </div>
    );
  }

  if (appState === 'unified-learning') {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        {/* Character Header */}
        <div className={`${themeClasses.card} backdrop-blur-sm border-b ${themeClasses.border}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🤖</div>
                <div>
                  <h1 className={`text-2xl font-bold ${themeClasses.text}`}>
                    Welcome, {character.name}!
                  </h1>
                  <p className={`${themeClasses.text}/70`}>
                    {character.background} • {character.motivation}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <Star className="h-5 w-5 text-yellow-400" />
                    <span className={`${themeClasses.text} font-bold`}>{characterProgression.xp} XP</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5 text-purple-400" />
                    <span className={`${themeClasses.text}/70`}>Level {characterProgression.level} AI Explorer</span>
                  </div>
                </div>
                <Button
                  onClick={() => setShowCharacterProgression(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white"
                >
                  <Trophy className="h-4 w-4 mr-2" />
                  View Superpowers
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Learning Content */}
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {aiFundamentalsContent.map((week, weekIndex) => (
              <Card key={week.id} className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">{week.icon}</div>
                      <div>
                        <CardTitle className={`text-2xl ${themeClasses.text}`}>
                          {week.title}
                        </CardTitle>
                        <CardDescription className={`${themeClasses.text}/70`}>
                          {week.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm ${themeClasses.text}/70`}>Superpower Theme</div>
                      <div className={`font-semibold ${themeClasses.text}`}>{week.superpowerTheme}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {week.units.map((unit, unitIndex) => (
                      <Card
                        key={unit.id}
                        className={`${themeClasses.card.replace('/10', '/5')} backdrop-blur-sm border ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')} transition-all duration-300 transform hover:scale-105 cursor-pointer`}
                        onClick={() => startUnit(unit)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="text-2xl">🎯</div>
                              <span className="text-sm text-green-400">Quest #{weekIndex * 4 + unitIndex + 1}</span>
                            </div>
                            <Badge className={`${getDifficultyColor(unit.difficulty)} text-white`}>
                              {unit.difficulty}
                            </Badge>
                          </div>
                          <CardTitle className={`text-lg ${themeClasses.text} flex items-center`}>
                            {getUnitIcon(unit.type)}
                            <span className="ml-2">{unit.title}</span>
                          </CardTitle>
                          <CardDescription className={`${themeClasses.text}/70 text-sm`}>
                            {unit.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className={`${themeClasses.text}/70`}>Duration:</span>
                              <span className={`${themeClasses.text}`}>{unit.duration_min} min</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${themeClasses.text}/70`}>Type:</span>
                              <span className={`${themeClasses.text}`}>{unit.type}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className={`${themeClasses.text}/70`}>XP Reward:</span>
                              <span className={`${themeClasses.text} font-semibold`}>100+</span>
                            </div>
                          </div>
                          
                          {unit.superpower && (
                            <div className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-2 mt-3`}>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">{unit.superpower.icon}</span>
                                <div>
                                  <div className={`text-xs font-semibold ${unit.superpower.color}`}>
                                    Unlocks: {unit.superpower.name}
                                  </div>
                                  <div className={`text-xs ${themeClasses.text}/70`}>
                                    {unit.superpower.description}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          <Button
                            className="w-full mt-4 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                            onClick={(e) => {
                              e.stopPropagation();
                              startUnit(unit);
                            }}
                          >
                            {characterProgression.completedLessons.includes(unit.id) ? '🔄 Replay Quest' : '🚀 Start Quest'}
                            <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (appState === 'path-selection') {
    return (
      <LearningPathSelector
        character={character}
        onPathSelect={handlePathSelect}
        onBack={handleBackToCharacterCreation}
      />
    );
  }

  if (appState === 'story' && selectedPath) {
    return (
      <StoryInterface
        character={character}
        currentChapterId={currentChapter}
        onChapterComplete={handleChapterComplete}
        onLessonComplete={handleLessonComplete}
      />
    );
  }

  return null;
}
