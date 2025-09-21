"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, BookOpen, Star, Play, Target, Trophy, Zap, ArrowRight } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { aiFundamentalsContent, getUnitById, LearningUnit } from "@/data/unifiedContent";
import { UnifiedLearningUnit } from "@/components/UnifiedLearningUnit";
import Link from "next/link";

export default function FundamentalsPathPage() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [selectedUnit, setSelectedUnit] = useState<LearningUnit | null>(null);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [userXP, setUserXP] = useState(0);
  const [userLevel, setUserLevel] = useState(1);

  const calculateLevel = (xp: number) => {
    return Math.floor(xp / 100) + 1;
  };

  const calculateProgress = (xp: number) => {
    const currentLevel = calculateLevel(xp);
    const currentLevelXP = (currentLevel - 1) * 100;
    const nextLevelXP = currentLevel * 100;
    return ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500';
      case 'intermediate': return 'bg-yellow-500';
      case 'advanced': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const handleUnitComplete = (unitId: string, xpEarned: number) => {
    setUserXP(prev => prev + xpEarned);
    setUserLevel(calculateLevel(userXP + xpEarned));
    setUserProgress(prev => ({ ...prev, [unitId]: 100 }));
    setSelectedUnit(null);
  };

  const handleStartUnit = (unit: LearningUnit) => {
    setSelectedUnit(unit);
  };

  if (selectedUnit) {
    return (
      <div className={`min-h-screen ${themeClasses.background}`}>
        <div className="max-w-4xl mx-auto py-8 px-4">
          <UnifiedLearningUnit
            unit={selectedUnit}
            isStoryMode={false}
            onComplete={handleUnitComplete}
            onBack={() => setSelectedUnit(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      {/* Header */}
      <div className={`${themeClasses.card} backdrop-blur-sm border-b ${themeClasses.border}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🎮</div>
            <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
              AI Fundamentals Quest
            </h1>
            <p className={`text-xl ${themeClasses.text}/70 mb-6`}>
              Master AI fundamentals through interactive quests and unlock your potential
            </p>
            
            {/* User Stats */}
            <div className="flex justify-center items-center space-x-8 mb-6">
              <div className="text-center">
                <div className={`text-2xl font-bold ${themeClasses.text}`}>Level {userLevel}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Current Level</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${themeClasses.text}`}>{userXP} XP</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Experience Points</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${themeClasses.text}`}>
                  {Object.values(userProgress).filter(p => p === 100).length}
                </div>
                <div className={`text-sm ${themeClasses.text}/70`}>Quests Completed</div>
              </div>
            </div>

            {/* XP Progress Bar */}
            <div className="w-full max-w-md mx-auto">
              <div className="flex justify-between text-sm mb-2">
                <span className={`${themeClasses.text}/70`}>Progress to Level {userLevel + 1}</span>
                <span className={`${themeClasses.text}`}>{userXP % 100}/100 XP</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${calculateProgress(userXP)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weeks */}
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
                    <div className={`text-sm ${themeClasses.text}/70`}>Theme</div>
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
                      onClick={() => handleStartUnit(unit)}
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
                        <CardTitle className={`text-lg ${themeClasses.text}`}>
                          {unit.title}
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
                            handleStartUnit(unit);
                          }}
                        >
                          {userProgress[unit.id] === 100 ? '🔄 Replay Quest' : '🚀 Start Quest'}
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

        {/* Back to Dashboard */}
        <div className="text-center mt-8">
          <Link href="/app">
            <Button variant="outline" className={`${themeClasses.border} ${themeClasses.text} hover:${themeClasses.card.replace('/10', '/20')}`}>
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}