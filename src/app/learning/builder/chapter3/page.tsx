'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  BookOpen, 
  Clock, 
  Target, 
  Zap, 
  Brain, 
  Settings, 
  BarChart3, 
  CheckCircle,
  Trophy,
  Play,
  ArrowRight,
  Users,
  Award,
  Star
} from 'lucide-react';
import Link from 'next/link';

export default function AIBuilderChapter3Page() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const lessons = [
    {
      id: 'lesson-3-1',
      title: 'Model Selection & Architecture Basics',
      description: 'Compare linear, tree-based, and neural networks. Learn architecture trade-offs and when to use each type.',
      duration: '45-60 min',
      widgets: ['model_comparison_dashboard', 'dataset_explorer'],
      quiz: 'Which model is easiest to explain to stakeholders?',
      icon: <Brain className="h-5 w-5" />,
      color: 'blue'
    },
    {
      id: 'lesson-3-2',
      title: 'Hyperparameter Tuning',
      description: 'Explore grid, random, and Bayesian search. Integrate tuning with CV for stability.',
      duration: '45-60 min',
      widgets: ['hyperparam_tuning_playground', 'cv_visualizer'],
      quiz: 'Why use cross-validation in hyperparameter search?',
      icon: <Settings className="h-5 w-5" />,
      color: 'green'
    },
    {
      id: 'lesson-3-3',
      title: 'Cross-Validation Strategies',
      description: 'Learn k-fold, stratified, and time-series CV. Avoid leakage, ensure balanced evaluation.',
      duration: '45-60 min',
      widgets: ['cv_visualizer', 'transform_preview'],
      quiz: 'Why stratify folds in classification?',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'purple'
    },
    {
      id: 'lesson-3-4',
      title: 'Model Optimization Techniques',
      description: 'Techniques: regularization, dropout, early stopping, learning rate scheduling. Optimize for performance + deployment.',
      duration: '45-60 min',
      widgets: ['optimization_lab', 'performance_tradeoff_explorer'],
      quiz: 'Why is quantization important in production?',
      icon: <Zap className="h-5 w-5" />,
      color: 'orange'
    },
    {
      id: 'lesson-3-5',
      title: 'Production Model Considerations',
      description: 'Trade-offs between accuracy, latency, interpretability. Use compression, distillation, pruning for scaling.',
      duration: '45-60 min',
      widgets: ['performance_tradeoff_explorer', 'deployment_readiness_checker'],
      quiz: 'What is the purpose of shadow mode deployment?',
      icon: <Target className="h-5 w-5" />,
      color: 'red'
    }
  ];

  const widgets = [
    {
      name: 'Model Comparison Dashboard',
      description: 'Compare different model architectures side-by-side',
      icon: <Brain className="h-4 w-4" />
    },
    {
      name: 'Hyperparameter Tuning Playground',
      description: 'Experiment with grid, random, and Bayesian search',
      icon: <Settings className="h-4 w-4" />
    },
    {
      name: 'CV Visualizer',
      description: 'Visualize cross-validation performance and stability',
      icon: <BarChart3 className="h-4 w-4" />
    },
    {
      name: 'Optimization Lab',
      description: 'Apply regularization, dropout, and other optimization techniques',
      icon: <Zap className="h-4 w-4" />
    },
    {
      name: 'Performance Trade-off Explorer',
      description: 'Balance accuracy, latency, cost, and interpretability',
      icon: <Target className="h-4 w-4" />
    },
    {
      name: 'Deployment Readiness Checker',
      description: 'Validate model readiness for production deployment',
      icon: <CheckCircle className="h-4 w-4" />
    }
  ];

  const learningObjectives = [
    'Compare and select the right model architectures',
    'Apply hyperparameter tuning methods (grid, random, Bayesian)',
    'Use cross-validation to ensure robust generalization',
    'Optimize models with regularization, dropout, pruning, and early stopping',
    'Balance accuracy, interpretability, and latency for production readiness'
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      red: 'bg-red-500 text-white'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500 text-white';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white">
              <BookOpen className="h-8 w-8" />
            </div>
          </div>
          <h1 className={`text-4xl font-bold ${themeClasses.text} mb-4`}>
            AI Builder Track – Chapter 3
          </h1>
          <h2 className={`text-2xl font-semibold ${themeClasses.text}/80 mb-4`}>
            Model Architecture & Optimization
          </h2>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className={`${themeClasses.text}/70`}>6-7 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-green-500" />
              <span className={`${themeClasses.text}/70`}>Intermediate-Advanced</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span className={`${themeClasses.text}/70`}>5 Lessons + Project</span>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Learning Objectives
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              By completing this chapter, you will master the art of model architecture selection and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className={`${themeClasses.text}/80`}>{objective}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lessons */}
        <div className="mb-8">
          <h3 className={`text-2xl font-bold ${themeClasses.text} mb-6 text-center`}>
            Lesson Breakdown
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson, index) => (
              <Card key={lesson.id} className={`${themeClasses.card} backdrop-blur-sm hover:shadow-lg transition-shadow`}>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`p-2 rounded-lg ${getColorClasses(lesson.color)}`}>
                      {lesson.icon}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      Lesson {index + 1}
                    </Badge>
                  </div>
                  <CardTitle className={`${themeClasses.text} text-lg`}>
                    {lesson.title}
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    {lesson.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span className={`${themeClasses.text}/70`}>{lesson.duration}</span>
                  </div>
                  
                  <div>
                    <h5 className={`font-medium ${themeClasses.text} mb-2`}>Interactive Widgets:</h5>
                    <div className="flex flex-wrap gap-1">
                      {lesson.widgets.map((widget, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {widget}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                    <h5 className={`font-medium ${themeClasses.text} mb-1`}>Quiz Question:</h5>
                    <p className={`text-sm ${themeClasses.text}/80`}>{lesson.quiz}</p>
                  </div>
                  
                  <Button asChild className="w-full">
                    <Link href={`/learning/builder/chapter3/${lesson.id}`}>
                      <Play className="h-4 w-4 mr-2" />
                      Start Lesson
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Interactive Widgets */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Zap className="h-5 w-5 mr-2 text-purple-500" />
              Interactive Widget Suite
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Hands-on tools for mastering model architecture and optimization
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {widgets.map((widget, index) => (
                <div key={index} className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} hover:shadow-md transition-shadow`}>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20 text-purple-600">
                      {widget.icon}
                    </div>
                    <h4 className={`font-medium ${themeClasses.text}`}>{widget.name}</h4>
                  </div>
                  <p className={`text-sm ${themeClasses.text}/70`}>{widget.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Capstone Project */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Capstone Mini-Project
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Titanic Model Optimization Challenge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Project Overview</h4>
                <p className={`${themeClasses.text}/80 mb-3`}>
                  Build and compare multiple architectures on the Titanic dataset. Tune hyperparameters with CV integration, 
                  apply optimization techniques, and deliver the best model with reflection on trade-offs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className={`font-medium ${themeClasses.text} mb-1`}>Key Activities:</h5>
                    <ul className={`space-y-1 ${themeClasses.text}/70`}>
                      <li>• Compare multiple model architectures</li>
                      <li>• Tune hyperparameters with cross-validation</li>
                      <li>• Apply regularization and optimization techniques</li>
                      <li>• Analyze production trade-offs</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className={`font-medium ${themeClasses.text} mb-1`}>Deliverables:</h5>
                    <ul className={`space-y-1 ${themeClasses.text}/70`}>
                      <li>• Best performing model</li>
                      <li>• Cross-validation analysis</li>
                      <li>• Written reflection on trade-offs</li>
                      <li>• Performance visualization screenshots</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  <span className={`font-medium ${themeClasses.text}`}>Badge: Optimization Master 🥇</span>
                </div>
                <Button asChild>
                  <Link href="/learning/builder/chapter3/mini-project">
                    <Play className="h-4 w-4 mr-2" />
                    Start Project
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessment & Progress */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Star className="h-5 w-5 mr-2 text-green-500" />
              Assessment & Progress
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Track your learning journey and unlock achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-600 w-fit mx-auto mb-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h4 className={`font-semibold ${themeClasses.text} mb-1`}>Checkpoint Quizzes</h4>
                <p className={`text-sm ${themeClasses.text}/70`}>Test your understanding in each lesson</p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 text-green-600 w-fit mx-auto mb-2">
                  <Zap className="h-6 w-6" />
                </div>
                <h4 className={`font-semibold ${themeClasses.text} mb-1`}>Widget Explorations</h4>
                <p className={`text-sm ${themeClasses.text}/70`}>Hands-on experimentation and learning</p>
              </div>
              <div className="text-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900/20 text-purple-600 w-fit mx-auto mb-2">
                  <Trophy className="h-6 w-6" />
                </div>
                <h4 className={`font-semibold ${themeClasses.text} mb-1`}>Badge System</h4>
                <p className={`text-sm ${themeClasses.text}/70`}>Unlock achievements as you progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Button variant="outline" asChild>
            <Link href="/learning/builder/chapter2">
              <ArrowRight className="h-4 w-4 mr-2 rotate-180" />
              Previous Chapter
            </Link>
          </Button>
          <Button asChild>
            <Link href="/learning/builder/chapter3/lesson-3-1">
              Start Chapter
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}