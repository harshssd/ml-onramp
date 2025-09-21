'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { Character } from '@/data/storyData';
import { Star, Trophy, ArrowRight } from 'lucide-react';

interface LearningPath {
  id: string;
  title: string;
  description: string;
  story: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  chapters: number;
  skills: string[];
  prerequisites: string[];
  rewards: {
    xp: number;
    badges: string[];
    unlocks: string[];
  };
  icon: string;
  color: string;
  status: 'locked' | 'available' | 'in-progress' | 'completed';
}

interface LearningPathSelectorProps {
  character: Character;
  onPathSelect: (pathId: string) => void;
  onBack: () => void;
}

const learningPaths: LearningPath[] = [
  {
    id: 'data-explorer',
    title: 'The Data Explorer\'s Journey',
    description: 'Begin your adventure in the Academy of Data! Learn the fundamentals of Machine Learning from the ground up.',
    story: 'Welcome to the Academy of Data! You are a curious explorer who has discovered the ancient art of Machine Learning. Your journey begins in the Library of Statistics, where you\'ll learn to read the language of data and unlock its hidden secrets.',
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
    title: 'The ML Practitioner\'s Quest',
    description: 'Master the art of Machine Learning! Build real models and solve practical problems.',
    story: 'You are an aspiring ML Practitioner! The Academy has recognized your potential. Your quest is to master the ancient algorithms and build models that can predict the future.',
    difficulty: 'intermediate',
    estimatedTime: '12-16 weeks',
    chapters: 8,
    skills: ['Advanced Python', 'Feature Engineering', 'Model Selection', 'Evaluation', 'Deployment'],
    prerequisites: ['data-explorer'],
    rewards: {
      xp: 2000,
      badges: ['ML Practitioner', 'Algorithm Master', 'Model Deployer', 'Problem Solver'],
      unlocks: ['ML Engineer Track', 'Specialization Tracks', 'Mentor Program']
    },
    icon: '🧙‍♂️',
    color: 'bg-gradient-to-r from-green-500 to-teal-600',
    status: 'locked'
  },
  {
    id: 'ml-engineer',
    title: 'The ML Engineer\'s Odyssey',
    description: 'Bridge the gap between data science and production! Learn MLOps and system design.',
    story: 'You are a skilled developer who has been chosen to become an ML Engineer! Your mission is to bridge the gap between data science and production systems.',
    difficulty: 'advanced',
    estimatedTime: '16-20 weeks',
    chapters: 10,
    skills: ['Docker', 'Kubernetes', 'MLOps', 'Cloud ML', 'System Design'],
    prerequisites: ['ml-practitioner'],
    rewards: {
      xp: 3000,
      badges: ['ML Engineer', 'System Architect', 'DevOps Master', 'Cloud Expert'],
      unlocks: ['ML Architect Track', 'Leadership Program', 'Industry Mentorship']
    },
    icon: '⚙️',
    color: 'bg-gradient-to-r from-orange-500 to-red-600',
    status: 'locked'
  },
  {
    id: 'deep-learning-sage',
    title: 'The Deep Learning Sage\'s Path',
    description: 'Master the most powerful magic - Deep Learning! Explore neural networks and AI.',
    story: 'You are a seasoned ML practitioner seeking to master the most powerful magic - Deep Learning! The Neural Network Academy awaits your arrival.',
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
    status: 'locked'
  },
  {
    id: 'ml-architect',
    title: 'The ML Architect\'s Legacy',
    description: 'Design and build enterprise-scale ML systems! Lead the future of AI.',
    story: 'You are a Master of ML who must design and build enterprise-scale ML systems! The Architecture Academy needs your wisdom to solve the most complex challenges.',
    difficulty: 'advanced',
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
    status: 'locked'
  }
];

export function LearningPathSelector({ character, onPathSelect, onBack }: LearningPathSelectorProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [selectedPath, setSelectedPath] = useState<string | null>(null);

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

  const canAccessPath = (path: LearningPath) => {
    if (path.status === 'available' || path.status === 'in-progress' || path.status === 'completed') {
      return true;
    }
    // Check prerequisites
    return path.prerequisites.length === 0 || 
           path.prerequisites.every(prereq => 
             learningPaths.find(p => p.id === prereq)?.status === 'completed'
           );
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-8`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
            Choose Your Learning Path 🛤️
          </h1>
          <p className={`text-xl ${themeClasses.text}/80`}>
            Welcome, {character.name}! Select the journey that calls to you.
          </p>
        </div>

        {/* Character Info */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="text-4xl">🧙‍♂️</div>
                <div>
                  <h2 className={`text-xl font-semibold ${themeClasses.text}`}>
                    {character.name} - {character.background}
                  </h2>
                  <p className={`${themeClasses.text}/70`}>
                    Motivation: {character.motivation} • Experience: {character.experience}
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
          </CardContent>
        </Card>

        {/* Learning Paths Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {learningPaths.map((path) => {
            const isAccessible = canAccessPath(path);
            const isSelected = selectedPath === path.id;
            
            return (
              <Card
                key={path.id}
                className={`${themeClasses.card} backdrop-blur-sm border ${themeClasses.border} transition-all duration-200 ${
                  isSelected ? 'ring-2 ring-blue-500' : ''
                } ${
                  !isAccessible ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
                }`}
                onClick={() => isAccessible && setSelectedPath(path.id)}
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
                  {/* Story Preview */}
                  <div className={`${themeClasses.card.replace('/10', '/5')} rounded-lg p-3 mb-4`}>
                            <p className={`text-sm ${themeClasses.text}/80 italic`}>
                              &ldquo;{path.story.substring(0, 100)}...&rdquo;
                            </p>
                  </div>

                  {/* Stats */}
                  <div className="space-y-2 mb-4">
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
                  </div>

                  {/* Skills */}
                  <div className="mb-4">
                    <h4 className={`text-sm font-semibold ${themeClasses.text} mb-2`}>
                      Skills You&apos;ll Learn:
                    </h4>
                    <div className="flex flex-wrap gap-1">
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
                  </div>

                  {/* Prerequisites */}
                  {path.prerequisites.length > 0 && (
                    <div className="mb-4">
                      <h4 className={`text-sm font-semibold ${themeClasses.text} mb-2`}>
                        Prerequisites:
                      </h4>
                      <div className="flex flex-wrap gap-1">
                        {path.prerequisites.map((prereq, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {prereq}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Button */}
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isAccessible) {
                        onPathSelect(path.id);
                      }
                    }}
                    disabled={!isAccessible}
                    className={`w-full ${path.color} hover:opacity-90`}
                  >
                    {path.status === 'completed' ? 'Review Journey' : 
                     path.status === 'in-progress' ? 'Continue Journey' :
                     path.status === 'available' ? 'Start Journey' : 'Locked'}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Path Details */}
        {selectedPath && (
          <Card className={`${themeClasses.card} backdrop-blur-sm mt-8`}>
            <CardHeader>
              <CardTitle className={`text-2xl ${themeClasses.text}`}>
                {learningPaths.find(p => p.id === selectedPath)?.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>
                    🏆 Rewards
                  </h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span className={`${themeClasses.text}/80`}>
                        {learningPaths.find(p => p.id === selectedPath)?.rewards.xp} XP
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Trophy className="h-4 w-4 text-purple-400" />
                      <span className={`${themeClasses.text}/80`}>
                        {learningPaths.find(p => p.id === selectedPath)?.rewards.badges.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>
                  🎯 What You&apos;ll Unlock
                </h4>
                  <ul className="space-y-1">
                    {learningPaths.find(p => p.id === selectedPath)?.rewards.unlocks.map((unlock, index) => (
                      <li key={index} className={`flex items-center space-x-2 ${themeClasses.text}/80`}>
                        <ArrowRight className="h-3 w-3" />
                        <span className="text-sm">{unlock}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button onClick={onBack} variant="outline">
            Back to Character Creation
          </Button>
          {selectedPath && (
            <Button
              onClick={() => onPathSelect(selectedPath)}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Begin Your Journey!
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
