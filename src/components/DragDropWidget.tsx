'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { CheckCircle, XCircle, RotateCcw, Target } from 'lucide-react';

interface DragDropWidgetProps {
  onComplete?: () => void;
  data?: string[];
}

interface DraggableItem {
  id: string;
  text: string;
  category: 'ai' | 'not-ai' | 'unplaced';
}

const DEFAULT_DATA = ["Chess program","Calculator","Siri","Dishwasher"];

export default function DragDropWidget({ onComplete, data = DEFAULT_DATA }: DragDropWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [items, setItems] = useState<DraggableItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  // Correct answers
  const correctAnswers = {
    'Chess program': 'ai',
    'Calculator': 'not-ai', 
    'Siri': 'ai',
    'Dishwasher': 'not-ai'
  };

  useEffect(() => {
    // Initialize items
    const initialItems: DraggableItem[] = data.map((item, index) => ({
      id: `item-${index}`,
      text: item,
      category: 'unplaced'
    }));
    setItems(initialItems);
  }, [data]);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, category: 'ai' | 'not-ai') => {
    e.preventDefault();
    if (draggedItem) {
      setItems(prev => prev.map(item => 
        item.id === draggedItem 
          ? { ...item, category }
          : item
      ));
      setDraggedItem(null);
    }
  };

  const checkAnswers = () => {
    const allCorrect = items.every(item => 
      correctAnswers[item.text as keyof typeof correctAnswers] === item.category
    );
    
    setShowFeedback(true);
    if (allCorrect) {
      setCompleted(true);
    }
  };

  const reset = () => {
    setItems(prev => prev.map(item => ({ ...item, category: 'unplaced' })));
    setCompleted(false);
    setShowFeedback(false);
  };

  const getItemStyle = (item: DraggableItem) => {
    const baseStyle = `p-3 rounded-lg border-2 border-dashed cursor-move transition-all duration-200 hover:scale-105 ${
      themeClasses.card.replace('/10', '/20')
    }`;
    
    if (item.category === 'ai') {
      return `${baseStyle} border-green-400 bg-green-50 dark:bg-green-900/20`;
    } else if (item.category === 'not-ai') {
      return `${baseStyle} border-red-400 bg-red-50 dark:bg-red-900/20`;
    } else {
      return `${baseStyle} border-gray-300 bg-gray-50 dark:bg-gray-800/50`;
    }
  };

  const getFeedbackIcon = (item: DraggableItem) => {
    if (!showFeedback) return null;
    
    const correct = correctAnswers[item.text as keyof typeof correctAnswers] === item.category;
    return correct ? (
      <CheckCircle className="h-4 w-4 text-green-500" />
    ) : (
      <XCircle className="h-4 w-4 text-red-500" />
    );
  };

  const unplacedItems = items.filter(item => item.category === 'unplaced');
  const aiItems = items.filter(item => item.category === 'ai');
  const notAiItems = items.filter(item => item.category === 'not-ai');

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          AI vs Not AI Classification
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Drag each item to the correct category. Think about what makes something AI-powered.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Instructions:</h4>
          <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
            <li>• <strong>AI</strong>: Systems that learn, adapt, or make decisions from data</li>
            <li>• <strong>Not AI</strong>: Rule-based systems that follow fixed instructions</li>
            <li>• Drag items from the center to the appropriate category</li>
            <li>• Click "Check Answers" when you're done</li>
          </ul>
        </div>

        {/* Drag and Drop Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Not AI Column */}
          <div 
            className={`p-4 rounded-lg border-2 border-dashed border-red-300 min-h-32 ${
              themeClasses.card.replace('/10', '/5')
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'not-ai')}
          >
            <h3 className={`font-semibold ${themeClasses.text} mb-3 text-center`}>
              ❌ Not AI
            </h3>
            <div className="space-y-2">
              {notAiItems.map(item => (
                <div
                  key={item.id}
                  className={`${getItemStyle(item)} flex items-center justify-between`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                >
                  <span className={`${themeClasses.text}`}>{item.text}</span>
                  {getFeedbackIcon(item)}
                </div>
              ))}
            </div>
          </div>

          {/* Unplaced Items */}
          <div className={`p-4 rounded-lg border-2 border-dashed border-gray-300 min-h-32 ${
            themeClasses.card.replace('/10', '/5')
          }`}>
            <h3 className={`font-semibold ${themeClasses.text} mb-3 text-center`}>
              🎯 Drag Items Here
            </h3>
            <div className="space-y-2">
              {unplacedItems.map(item => (
                <div
                  key={item.id}
                  className={`${getItemStyle(item)} flex items-center justify-between`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                >
                  <span className={`${themeClasses.text}`}>{item.text}</span>
                  {getFeedbackIcon(item)}
                </div>
              ))}
            </div>
          </div>

          {/* AI Column */}
          <div 
            className={`p-4 rounded-lg border-2 border-dashed border-green-300 min-h-32 ${
              themeClasses.card.replace('/10', '/5')
            }`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'ai')}
          >
            <h3 className={`font-semibold ${themeClasses.text} mb-3 text-center`}>
              ✅ AI
            </h3>
            <div className="space-y-2">
              {aiItems.map(item => (
                <div
                  key={item.id}
                  className={`${getItemStyle(item)} flex items-center justify-between`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                >
                  <span className={`${themeClasses.text}`}>{item.text}</span>
                  {getFeedbackIcon(item)}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Button
            onClick={checkAnswers}
            disabled={unplacedItems.length > 0}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Check Answers
          </Button>
          <Button
            onClick={reset}
            variant="outline"
            className={`${themeClasses.border}`}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <div className={`p-4 rounded-lg ${
            completed 
              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
          } border`}>
            <div className="flex items-center space-x-2 mb-2">
              {completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-yellow-500" />
              )}
              <h4 className={`font-semibold ${themeClasses.text}`}>
                {completed ? 'Excellent!' : 'Not quite right'}
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              {completed 
                ? 'You correctly identified which systems use AI and which don\'t. Great job!'
                : 'Check your answers and try again. Remember: AI systems learn and adapt, while non-AI systems follow fixed rules.'
              }
            </p>
          </div>
        )}

        {completed && onComplete && (
          <div className="text-center">
            <Button 
              onClick={onComplete}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              Continue Learning
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
