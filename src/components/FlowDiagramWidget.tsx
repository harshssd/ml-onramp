'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowRight, Play, RotateCcw, CheckCircle } from 'lucide-react';

interface FlowDiagramWidgetProps {
  onComplete?: () => void;
  data?: string[];
}

interface FlowStep {
  id: string;
  title: string;
  description: string;
  type: 'input' | 'process' | 'output';
}

export default function FlowDiagramWidget({ onComplete, data = ["Input: Email text", "Process: ML Spam Filter", "Output: Inbox/Spam decision"] }: FlowDiagramWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);

  const steps: FlowStep[] = [
    {
      id: 'input',
      title: 'Input',
      description: 'Raw email text arrives at the system',
      type: 'input'
    },
    {
      id: 'process',
      title: 'Process',
      description: 'ML algorithm analyzes text patterns and features',
      type: 'process'
    },
    {
      id: 'output',
      title: 'Output',
      description: 'Decision: Inbox or Spam folder',
      type: 'output'
    }
  ];

  const getStepColor = (type: string) => {
    switch (type) {
      case 'input': return 'bg-blue-500';
      case 'process': return 'bg-purple-500';
      case 'output': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStepIcon = (type: string) => {
    switch (type) {
      case 'input': return '📧';
      case 'process': return '🧠';
      case 'output': return '📁';
      default: return '❓';
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setCompleted(false);
    setIsAnimating(false);
  };

  const handleComplete = () => {
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Play className="h-5 w-5 mr-2 text-blue-500" />
          AI System Flow Diagram
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Explore how AI systems work by following the data flow from input to output
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Instructions:</h4>
          <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
            <li>• Click "Next Step" to follow the data flow</li>
            <li>• Watch how data transforms at each stage</li>
            <li>• Understand the input → process → output pattern</li>
            <li>• This is how most AI systems work!</li>
          </ul>
        </div>

        {/* Flow Diagram */}
        <div className="relative">
          {/* Flow Arrows */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-300 dark:bg-gray-600 transform -translate-y-1/2 z-0">
            <div className="flex justify-between">
              <div className="w-1/3 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
              <div className="w-1/3 h-0.5 bg-gray-300 dark:bg-gray-600"></div>
            </div>
          </div>

          {/* Flow Steps */}
          <div className="grid grid-cols-3 gap-4 relative z-10">
            {steps.map((step, index) => {
              const isActive = index <= currentStep;
              const isCurrent = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`text-center transition-all duration-300 ${
                    isActive ? 'opacity-100' : 'opacity-50'
                  } ${isAnimating && isCurrent ? 'scale-110' : ''}`}
                >
                  {/* Step Circle */}
                  <div className={`w-16 h-16 mx-auto rounded-full ${getStepColor(step.type)} flex items-center justify-center text-2xl mb-3 transition-all duration-300 ${
                    isCurrent ? 'ring-4 ring-blue-300 dark:ring-blue-700' : ''
                  } ${isCompleted ? 'ring-4 ring-green-300 dark:ring-green-700' : ''}`}>
                    {isCompleted ? <CheckCircle className="h-8 w-8 text-white" /> : getStepIcon(step.type)}
                  </div>
                  
                  {/* Step Title */}
                  <h3 className={`font-semibold ${themeClasses.text} mb-2`}>
                    {step.title}
                  </h3>
                  
                  {/* Step Description */}
                  <p className={`text-sm ${themeClasses.text}/70`}>
                    {step.description}
                  </p>

                  {/* Arrow */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-8 left-full transform translate-x-2">
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Step Details */}
        {currentStep < steps.length && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
              Current Step: {steps[currentStep].title}
            </h4>
            <p className={`${themeClasses.text}/80`}>
              {steps[currentStep].description}
            </p>
            
            {/* Step-specific details */}
            {steps[currentStep].type === 'input' && (
              <div className="mt-3">
                <p className={`text-sm ${themeClasses.text}/70`}>
                  <strong>Example:</strong> "Congratulations! You've won $1000! Click here to claim your prize!"
                </p>
              </div>
            )}
            
            {steps[currentStep].type === 'process' && (
              <div className="mt-3">
                <p className={`text-sm ${themeClasses.text}/70`}>
                  <strong>What happens:</strong> The algorithm looks for patterns like:
                </p>
                <ul className={`text-sm ${themeClasses.text}/70 mt-1 space-y-1`}>
                  <li>• Suspicious keywords ("win", "free", "urgent")</li>
                  <li>• Unusual formatting or links</li>
                  <li>• Sender reputation and history</li>
                </ul>
              </div>
            )}
            
            {steps[currentStep].type === 'output' && (
              <div className="mt-3">
                <p className={`text-sm ${themeClasses.text}/70`}>
                  <strong>Result:</strong> Based on the analysis, the email is classified as either:
                </p>
                <div className="flex space-x-4 mt-2">
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-full text-sm">
                    ✅ Inbox
                  </span>
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 rounded-full text-sm">
                    🗑️ Spam
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completion Message */}
        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Flow Complete!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully traced the data flow through an AI system. This input → process → output 
              pattern is fundamental to understanding how AI works!
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          {!completed ? (
            <Button
              onClick={handleNext}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {currentStep < steps.length - 1 ? 'Next Step' : 'Complete Flow'}
            </Button>
          ) : (
            <div className="flex space-x-4">
              <Button
                onClick={handleReset}
                variant="outline"
                className={`${themeClasses.border}`}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
              >
                Continue Learning
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
