'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';

interface Character {
  name: string;
  background: 'student' | 'professional' | 'career-changer' | 'curious-explorer';
  motivation: 'career' | 'hobby' | 'research' | 'problem-solving';
  experience: 'none' | 'basic' | 'some';
}

const backgroundOptions = [
  {
    id: 'student' as const,
    title: 'Student Explorer',
    description: 'Currently studying and eager to learn ML concepts',
    icon: '🎓',
    color: 'bg-blue-500',
  },
  {
    id: 'professional' as const,
    title: 'Working Professional',
    description: 'Looking to add ML skills to your current role',
    icon: '💼',
    color: 'bg-green-500',
  },
  {
    id: 'career-changer' as const,
    title: 'Career Changer',
    description: 'Transitioning into a data or tech career',
    icon: '🔄',
    color: 'bg-purple-500',
  },
  {
    id: 'curious-explorer' as const,
    title: 'Curious Explorer',
    description: 'Simply fascinated by the world of data and AI',
    icon: '🔍',
    color: 'bg-orange-500',
  },
];

const motivationOptions = [
  {
    id: 'career' as const,
    title: 'Career Advancement',
    description: 'Boost my professional opportunities',
    icon: '🚀',
  },
  {
    id: 'hobby' as const,
    title: 'Personal Interest',
    description: 'Learn for fun and personal growth',
    icon: '🎯',
  },
  {
    id: 'research' as const,
    title: 'Research & Analysis',
    description: 'Apply ML to my research or projects',
    icon: '🔬',
  },
  {
    id: 'problem-solving' as const,
    title: 'Problem Solving',
    description: 'Solve real-world challenges with data',
    icon: '🧩',
  },
];

const experienceLevels = [
  {
    id: 'none' as const,
    title: 'Complete Beginner',
    description: 'No programming or ML experience',
    icon: '🌱',
    estimatedTime: '8-12 weeks',
  },
  {
    id: 'basic' as const,
    title: 'Basic Knowledge',
    description: 'Some programming or math background',
    icon: '🌿',
    estimatedTime: '6-8 weeks',
  },
  {
    id: 'some' as const,
    title: 'Some Experience',
    description: 'Familiar with basic concepts',
    icon: '🌳',
    estimatedTime: '4-6 weeks',
  },
];

interface CharacterCreationProps {
  onComplete: (character: Character) => void;
}

export function CharacterCreation({ onComplete }: CharacterCreationProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [step, setStep] = useState(1);
  const [character, setCharacter] = useState<Character>({
    name: '',
    background: 'curious-explorer',
    motivation: 'hobby',
    experience: 'none',
  });

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      onComplete(character);
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateCharacter = (field: keyof Character, value: string) => {
    setCharacter(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-8`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
            Welcome to AI Learning for Everybody! 🤖
          </h1>
        <p className={`text-xl ${themeClasses.text}/80`}>
          Let&apos;s create your character and begin your journey into AI and Machine Learning
        </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${themeClasses.text}/70`}>Step {step} of 4</span>
            <span className={`text-sm ${themeClasses.text}/70`}>{Math.round((step / 4) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-400 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Step Content */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} text-2xl`}>
              {step === 1 && 'What should we call you?'}
              {step === 2 && 'What brings you to the Academy?'}
              {step === 3 && 'What drives your learning?'}
              {step === 4 && 'What&apos;s your experience level?'}
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              {step === 1 && 'Choose a name for your character in this learning adventure'}
              {step === 2 && 'Select your background to personalize your learning journey'}
              {step === 3 && 'Understanding your motivation helps us tailor your experience'}
              {step === 4 && 'This helps us set the right pace for your learning'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {step === 1 && (
              <div className="space-y-4">
                <div>
                  <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                    Character Name
                  </label>
                  <input
                    type="text"
                    value={character.name}
                    onChange={(e) => updateCharacter('name', e.target.value)}
                    placeholder="Enter your character name..."
                    className={`w-full p-3 rounded-lg ${themeClasses.card} border ${themeClasses.border} ${themeClasses.text} placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>
                <div className="text-center">
                  <p className={`text-sm ${themeClasses.text}/70`}>
                    This will be your identity throughout your ML learning journey
                  </p>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {backgroundOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updateCharacter('background', option.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      character.background === option.id
                        ? 'border-blue-500 bg-blue-500/20'
                        : `${themeClasses.border} hover:border-blue-300`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <h3 className={`font-semibold ${themeClasses.text}`}>{option.title}</h3>
                        <p className={`text-sm ${themeClasses.text}/70`}>{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {motivationOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updateCharacter('motivation', option.id)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      character.motivation === option.id
                        ? 'border-green-500 bg-green-500/20'
                        : `${themeClasses.border} hover:border-green-300`
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <h3 className={`font-semibold ${themeClasses.text}`}>{option.title}</h3>
                        <p className={`text-sm ${themeClasses.text}/70`}>{option.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {experienceLevels.map((level) => (
                  <button
                    key={level.id}
                    onClick={() => updateCharacter('experience', level.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                      character.experience === level.id
                        ? 'border-purple-500 bg-purple-500/20'
                        : `${themeClasses.border} hover:border-purple-300`
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{level.icon}</span>
                        <div>
                          <h3 className={`font-semibold ${themeClasses.text}`}>{level.title}</h3>
                          <p className={`text-sm ${themeClasses.text}/70`}>{level.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {level.estimatedTime}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8">
              <Button
                onClick={handlePrevious}
                disabled={step === 1}
                variant="outline"
                className={`${themeClasses.border} ${themeClasses.text}`}
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={step === 1 && !character.name.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {step === 4 ? 'Begin Journey!' : 'Next'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
