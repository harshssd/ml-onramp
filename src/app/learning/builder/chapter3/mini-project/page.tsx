'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Trophy, 
  Target, 
  CheckCircle, 
  Clock, 
  Users, 
  BarChart3,
  Settings,
  Play,
  BookOpen,
  Award
} from 'lucide-react';

interface MiniProjectPageProps {
  // Add props here if needed
}

export default function MiniProjectPage({}: MiniProjectPageProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [projectData, setProjectData] = useState({
    baselineAccuracy: 0,
    bestAccuracy: 0,
    modelsTrained: 0,
    hyperparametersTuned: 0,
    cvCompleted: false
  });

  const steps = [
    {
      id: 1,
      title: "Baseline Model with CV",
      description: "Train Logistic Regression with 5-fold cross-validation",
      icon: Target,
      status: "pending"
    },
    {
      id: 2,
      title: "Competing Architectures with CV",
      description: "Try Random Forest, Neural Network, and Gradient Boosting with stratified CV",
      icon: BarChart3,
      status: "pending"
    },
    {
      id: 3,
      title: "Hyperparameter Tuning + CV",
      description: "Optimize parameters with CV integration and stratified validation",
      icon: Settings,
      status: "pending"
    },
    {
      id: 4,
      title: "CV Strategy Exploration",
      description: "Compare k-fold, stratified, and time-series CV strategies",
      icon: Users,
      status: "pending"
    },
    {
      id: 5,
      title: "Final Optimization",
      description: "Apply regularization, early stopping, and model compression",
      icon: Trophy,
      status: "pending"
    }
  ];

  const handleStepComplete = (stepId: number) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const progress = (completedSteps.length / steps.length) * 100;
  const isComplete = completedSteps.length === steps.length;

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Trophy className="h-8 w-8 text-yellow-500" />
            <h1 className={`text-4xl font-bold ${themeClasses.text}`}>
              Titanic Model Optimization Challenge
            </h1>
          </div>
          <p className={`text-xl ${themeClasses.text}/80 max-w-3xl mx-auto`}>
            Build the best possible Titanic survival predictor by experimenting with different 
            model architectures, hyperparameter tuning, and cross-validation strategies.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className={`${themeClasses.text}/80`}>90 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-yellow-500" />
              <span className={`${themeClasses.text}/80`}>Optimization Master Badge</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-green-500" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`${themeClasses.text}/80`}>Overall Progress</span>
                <span className={`${themeClasses.text}/80`}>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>
                    {projectData.modelsTrained}
                  </div>
                  <div className={`${themeClasses.text}/60`}>Models Trained</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>
                    {projectData.hyperparametersTuned}
                  </div>
                  <div className={`${themeClasses.text}/60`}>Models Tuned</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>
                    {projectData.bestAccuracy.toFixed(1)}%
                  </div>
                  <div className={`${themeClasses.text}/60`}>Best Accuracy</div>
                </div>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>
                    {projectData.cvCompleted ? 'Yes' : 'No'}
                  </div>
                  <div className={`${themeClasses.text}/60`}>CV Completed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id);
            const isCurrent = currentStep === index;
            const Icon = step.icon;
            
            return (
              <Card 
                key={step.id}
                className={`${themeClasses.card} backdrop-blur-sm cursor-pointer transition-all duration-200 ${
                  isCurrent ? 'ring-2 ring-blue-500' : ''
                } ${isCompleted ? 'opacity-75' : ''}`}
                onClick={() => setCurrentStep(index)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        isCompleted ? 'bg-green-500' : isCurrent ? 'bg-blue-500' : 'bg-gray-500'
                      }`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className={`${themeClasses.text} text-lg`}>
                          Step {step.id}
                        </CardTitle>
                        <CardDescription className={`${themeClasses.text}/70`}>
                          {step.title}
                        </CardDescription>
                      </div>
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className={`${themeClasses.text}/80 text-sm`}>
                    {step.description}
                  </p>
                  {isCurrent && (
                    <Button 
                      className="w-full mt-4"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleStepComplete(step.id);
                      }}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Step
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Interactive Widgets */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Settings className="h-5 w-5 mr-2 text-purple-500" />
              Interactive Tools
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Use these widgets to complete your optimization challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Dataset Explorer</h4>
                <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
                  Inspect Titanic features and data quality
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explore Data
                </Button>
              </div>
              
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Model Comparison</h4>
                <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
                  Compare different model architectures
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Compare Models
                </Button>
              </div>
              
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Hyperparameter Tuning</h4>
                <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
                  Optimize model hyperparameters
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h-4 w-4 mr-2" />
                  Tune Parameters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Success Criteria */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Award className="h-5 w-5 mr-2 text-yellow-500" />
              Success Criteria
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Minimum Requirements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className={`${themeClasses.text}/80`}>≥ 80% mean accuracy with stratified 5-fold CV</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className={`${themeClasses.text}/80`}>Train at least 3 model architectures with CV</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className={`${themeClasses.text}/80`}>Tune hyperparameters for 2+ models using CV</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className={`${themeClasses.text}/80`}>Compare at least 2 CV strategies</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className={`${themeClasses.text}/80`}>CV standard deviation ≤ 5% for best model</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Excellence Criteria</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-yellow-500" />
                      <span className={`${themeClasses.text}/80`}>≥ 85% mean accuracy with stratified 5-fold CV</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-yellow-500" />
                      <span className={`${themeClasses.text}/80`}>Test all 5 model types with CV</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-yellow-500" />
                      <span className={`${themeClasses.text}/80`}>Use Bayesian optimization with CV integration</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-yellow-500" />
                      <span className={`${themeClasses.text}/80`}>Test k-fold, stratified, and time-series CV</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-yellow-500" />
                      <span className={`${themeClasses.text}/80`}>Detailed stability analysis and trade-offs</span>
                    </li>
                  </ul>
                </div>
            </div>
          </CardContent>
        </Card>

        {/* Completion Status */}
        {isComplete && (
          <Card className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
                <h3 className="text-2xl font-bold text-green-800 dark:text-green-200">
                  Congratulations! 🎉
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  You've completed the Titanic Model Optimization Challenge and earned the 
                  <Badge variant="secondary" className="ml-2">
                    Optimization Master 🥇
                  </Badge> badge!
                </p>
                <div className="flex justify-center space-x-4">
                  <Button variant="outline">
                    View Results
                  </Button>
                  <Button>
                    Continue Learning
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
