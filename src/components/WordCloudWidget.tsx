'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/contexts/ThemeContext';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';

interface WordCloudWidgetProps {
  onComplete?: () => void;
}

interface WordData {
  text: string;
  count: number;
  size: number;
}

export default function WordCloudWidget({ onComplete }: WordCloudWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [userInput, setUserInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [words, setWords] = useState<WordData[]>([]);
  const [showResults, setShowResults] = useState(false);

  // Sample intelligence-related words for the cloud
  const sampleWords = [
    { text: 'Problem Solving', count: 15, size: 24 },
    { text: 'Learning', count: 12, size: 20 },
    { text: 'Adaptation', count: 10, size: 18 },
    { text: 'Creativity', count: 8, size: 16 },
    { text: 'Memory', count: 7, size: 14 },
    { text: 'Reasoning', count: 6, size: 12 },
    { text: 'Pattern Recognition', count: 5, size: 10 },
    { text: 'Decision Making', count: 4, size: 8 },
    { text: 'Innovation', count: 3, size: 6 },
    { text: 'Curiosity', count: 2, size: 4 }
  ];

  useEffect(() => {
    if (submitted) {
      // Add user's word to the cloud
      const userWord = userInput.trim();
      if (userWord) {
        const newWord: WordData = {
          text: userWord,
          count: 1,
          size: 16
        };
        setWords([...sampleWords, newWord]);
      } else {
        setWords(sampleWords);
      }
      setShowResults(true);
    }
  }, [submitted, userInput]);

  const handleSubmit = () => {
    if (userInput.trim()) {
      setSubmitted(true);
    }
  };

  const getRandomPosition = () => ({
    x: Math.random() * 80 + 10, // 10% to 90%
    y: Math.random() * 60 + 20  // 20% to 80%
  });

  const getRandomColor = () => {
    const colors = [
      'text-blue-400',
      'text-green-400', 
      'text-purple-400',
      'text-pink-400',
      'text-yellow-400',
      'text-cyan-400',
      'text-orange-400',
      'text-red-400'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <MessageSquare className="h-5 w-5 mr-2 text-blue-500" />
          Intelligence Word Cloud
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Share your definition of intelligence and see how others define it
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!submitted ? (
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                What does "intelligence" mean to you? (One word or short phrase)
              </label>
              <div className="flex space-x-2">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g., problem-solving, creativity, learning..."
                  className={`${themeClasses.text} bg-white/10 border ${themeClasses.border} rounded px-3 py-2`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                />
                <Button 
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Submit
                </Button>
              </div>
            </div>
            
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Instructions:</h4>
              <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
                <li>• Think about what makes someone or something "intelligent"</li>
                <li>• Enter a single word or short phrase that captures this</li>
                <li>• Your response will be added to the community word cloud</li>
                <li>• See how your definition compares to others'</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-2`}>
                Community Intelligence Word Cloud
              </h3>
              <p className={`text-sm ${themeClasses.text}/70`}>
                Your word: <span className="font-semibold text-blue-400">"{userInput}"</span>
              </p>
            </div>

            <div className="relative h-64 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-lg overflow-hidden">
              {words.map((word, index) => {
                const position = getRandomPosition();
                const color = getRandomColor();
                return (
                  <div
                    key={index}
                    className={`absolute ${color} font-semibold hover:scale-110 transition-transform cursor-pointer`}
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                      fontSize: `${word.size}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    title={`${word.text} (${word.count} mentions)`}
                  >
                    {word.text}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <Users className="h-6 w-6 text-blue-400 mx-auto mb-1" />
                <div className={`text-sm ${themeClasses.text}/70`}>Participants</div>
                <div className={`font-semibold ${themeClasses.text}`}>{words.length}</div>
              </div>
              <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-1" />
                <div className={`text-sm ${themeClasses.text}/70`}>Most Common</div>
                <div className={`font-semibold ${themeClasses.text}`}>Problem Solving</div>
              </div>
              <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <MessageSquare className="h-6 w-6 text-purple-400 mx-auto mb-1" />
                <div className={`text-sm ${themeClasses.text}/70`}>Your Word</div>
                <div className={`font-semibold ${themeClasses.text}`}>Added!</div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Reflection:</h4>
              <p className={`text-sm ${themeClasses.text}/80`}>
                Notice how different people define intelligence. Some focus on problem-solving, 
                others on creativity or learning. This diversity shows that intelligence is 
                complex and multifaceted - both in humans and in the AI systems we're building.
              </p>
            </div>

            {onComplete && (
              <div className="text-center">
                <Button 
                  onClick={onComplete}
                  className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
                >
                  Continue Learning
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
