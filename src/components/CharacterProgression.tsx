'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { CharacterProgression as CharacterProgressionType, Superpower, calculateCharacterLevel, getNextLevelXP } from '@/data/unifiedContent';
import { Star, Trophy, Zap, Crown, Share2, Download, Twitter, Facebook } from 'lucide-react';

interface CharacterProgressionProps {
  character: CharacterProgressionType;
  onShare?: () => void;
}

export function CharacterProgression({ character, onShare }: CharacterProgressionProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareText, setShareText] = useState('');

  const currentLevel = calculateCharacterLevel(character.xp);
  const nextLevelXP = getNextLevelXP(currentLevel);
  const progressToNext = ((character.xp % 100) / 100) * 100;

  useEffect(() => {
    // Generate share text when character is ready to share
    if (character.superpowers.length >= 4) {
      setShareText(`🎮 I've completed the AI Learning Quest! My character ${character.name} has gained ${character.superpowers.length} AI superpowers and is ready to conquer the world of AI! 🚀 #AILearning #Superpowers`);
    }
  }, [character]);

  const handleShare = (platform: string) => {
    const text = shareText;
    const url = window.location.origin;
    
    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`);
        break;
      case 'copy':
        navigator.clipboard.writeText(`${text} ${url}`);
        break;
    }
    
    if (onShare) onShare();
  };

  const isReadyToConquer = character.superpowers.length >= 4 && character.completedLessons.length >= 12;

  return (
    <div className="space-y-6">
      {/* Character Header */}
      <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-4xl">🤖</div>
              <div>
                <CardTitle className={`text-2xl ${themeClasses.text}`}>
                  {character.name}
                </CardTitle>
                <CardDescription className={`${themeClasses.text}/70`}>
                  Level {currentLevel} AI Explorer
                </CardDescription>
              </div>
            </div>
            {isReadyToConquer && (
              <div className="text-right">
                <div className="flex items-center space-x-2 text-yellow-500">
                  <Crown className="h-6 w-6" />
                  <span className="font-bold">Ready to Conquer!</span>
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* XP Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className={`${themeClasses.text}/70`}>Experience Points</span>
                <span className={`${themeClasses.text}`}>{character.xp} XP</span>
              </div>
              <Progress value={progressToNext} className="h-3" />
              <div className="text-xs text-center mt-1">
                {100 - (character.xp % 100)} XP to Level {currentLevel + 1}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-3`}>
                <div className="text-2xl font-bold text-blue-500">{character.completedLessons.length}</div>
                <div className={`text-xs ${themeClasses.text}/70`}>Quests Completed</div>
              </div>
              <div className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-3`}>
                <div className="text-2xl font-bold text-green-500">{character.currentStreak}</div>
                <div className={`text-xs ${themeClasses.text}/70`}>Day Streak</div>
              </div>
              <div className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-3`}>
                <div className="text-2xl font-bold text-purple-500">{character.totalLearningTime}</div>
                <div className={`text-xs ${themeClasses.text}/70`}>Minutes Learned</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Superpowers */}
      <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
        <CardHeader>
          <CardTitle className={`text-xl ${themeClasses.text} flex items-center`}>
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            AI Superpowers
          </CardTitle>
          <CardDescription className={`${themeClasses.text}/70`}>
            Powers gained through your AI learning journey
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {character.superpowers.map((superpower) => (
              <div
                key={superpower.id}
                className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-4 border ${themeClasses.border}`}
              >
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{superpower.icon}</div>
                  <div className="flex-1">
                    <div className={`font-semibold ${superpower.color}`}>
                      {superpower.name}
                    </div>
                    <div className={`text-sm ${themeClasses.text}/70`}>
                      {superpower.description}
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        Level {superpower.level}
                      </Badge>
                      <div className="flex space-x-1">
                        {Array.from({ length: superpower.maxLevel }).map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < superpower.level ? 'bg-yellow-400' : 'bg-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      {character.achievements.length > 0 && (
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
          <CardHeader>
            <CardTitle className={`text-xl ${themeClasses.text} flex items-center`}>
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {character.achievements.map((achievement, index) => (
                <div
                  key={index}
                  className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-3 flex items-center space-x-3`}
                >
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  <span className={`${themeClasses.text}`}>{achievement}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Share Character */}
      {isReadyToConquer && (
        <Card className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border}`}>
          <CardHeader>
            <CardTitle className={`text-xl ${themeClasses.text} flex items-center`}>
              <Share2 className="h-5 w-5 mr-2 text-blue-500" />
              Share Your AI Superhero
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Show off your character&apos;s AI superpowers to the world!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-4`}>
                <div className={`text-sm ${themeClasses.text}/80 mb-2`}>Share Text:</div>
                <div className={`text-sm ${themeClasses.text} italic`}>
                  &ldquo;{shareText}&rdquo;
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => handleShare('twitter')}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  <Twitter className="h-4 w-4 mr-2" />
                  Share on Twitter
                </Button>
                <Button
                  onClick={() => handleShare('facebook')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Facebook className="h-4 w-4 mr-2" />
                  Share on Facebook
                </Button>
                <Button
                  onClick={() => handleShare('copy')}
                  variant="outline"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
