'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Brain, 
  Target, 
  Zap, 
  BarChart3, 
  Clock, 
  BookOpen, 
  Trophy, 
  CheckCircle, 
  Play,
  ArrowRight,
  Users,
  Award,
  Lightbulb,
  Flower2
} from 'lucide-react';
import Link from 'next/link';

export default function AIBuilderChapter1Overview() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  
  const lessons = [
    {
      id: 'ai-builder-ch1-lesson1',
      title: 'Deep Dive into Algorithms',
      duration: '35 min',
      icon: <Brain className="h-5 w-5" />,
      description: 'Decision Trees, Random Forests, SVMs, KNN',
      widget: 'Algorithm Explorer',
      concepts: ['Supervised vs Unsupervised Learning', 'Trees vs boundaries vs neighbors'],
      quizSample: 'Which is NOT supervised? → K-means clustering',
      video: 'StatQuest: ML Algorithms Overview',
      completed: completedLessons.includes('ai-builder-ch1-lesson1')
    },
    {
      id: 'ai-builder-ch1-lesson2',
      title: 'Ensemble Methods',
      duration: '40 min',
      icon: <Users className="h-5 w-5" />,
      description: 'Bagging, Boosting, Stacking',
      widget: 'Ensemble Visualizer',
      concepts: ['Wisdom of crowds in ML', 'Bagging (variance reduction)', 'Boosting (bias reduction)', 'Stacking (meta-models)'],
      quizSample: 'Bagging works by training models on different subsets',
      video: 'StatQuest: Ensemble Methods',
      completed: completedLessons.includes('ai-builder-ch1-lesson2')
    },
    {
      id: 'ai-builder-ch1-lesson3',
      title: 'Neural Networks Fundamentals',
      duration: '40 min',
      icon: <Zap className="h-5 w-5" />,
      description: 'Structure, activations, forward propagation',
      widget: 'NN Visualizer',
      concepts: ['Input → Hidden → Output layers', 'Weights, biases, activation functions', 'Forward pass intuition'],
      quizSample: 'Activation introduces non-linearity',
      video: '3Blue1Brown Neural Networks',
      completed: completedLessons.includes('ai-builder-ch1-lesson3')
    },
    {
      id: 'ai-builder-ch1-lesson4',
      title: 'Model Evaluation Deep Dive',
      duration: '40 min',
      icon: <BarChart3 className="h-5 w-5" />,
      description: 'Metrics for classification & regression',
      widget: 'Metrics Dashboard',
      concepts: ['Classification: Accuracy, Precision, Recall, F1', 'Regression: MSE, RMSE, MAE, R²', 'Confusion Matrix, ROC, AUC'],
      quizSample: 'Which metric for fraud detection? → Precision/Recall',
      video: 'StatQuest: Model Evaluation',
      completed: completedLessons.includes('ai-builder-ch1-lesson4')
    }
  ];

  const totalLessons = lessons.length;
  const completedCount = completedLessons.length;
  const progressPercentage = (completedCount / totalLessons) * 100;

  const handleStartLesson = (lessonId: string) => {
    // Navigate to the specific lesson
    window.location.href = `/learning/builder/chapter1?lesson=${lessonId}`;
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Brain className="h-8 w-8 text-blue-500" />
            <h1 className={`text-4xl font-bold ${themeClasses.text}`}>
              AI Builder – Chapter 1
            </h1>
          </div>
          <h2 className={`text-2xl font-semibold ${themeClasses.text}/80`}>
            Advanced Machine Learning
          </h2>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className={themeClasses.text}>~3 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span className={themeClasses.text}>4 lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-4 w-4 text-purple-500" />
              <span className={themeClasses.text}>Intermediate</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${themeClasses.text}`}>
                  {completedCount} of {totalLessons} lessons completed
                </span>
                <span className={`text-sm ${themeClasses.text}/70`}>
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              {completedCount === totalLessons && (
                <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <span className={`font-semibold ${themeClasses.text}`}>
                      🥇 ML Algorithms Explorer Badge Earned!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Objectives */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Learning Objectives
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              By the end of this chapter, you will be able to:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className={`${themeClasses.text}/80`}>
                  Compare major ML algorithms and their trade-offs
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className={`${themeClasses.text}/80`}>
                  Understand ensemble techniques (bagging, boosting, stacking)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className={`${themeClasses.text}/80`}>
                  Grasp neural network fundamentals (layers, activations, forward pass)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <p className={`${themeClasses.text}/80`}>
                  Apply proper model evaluation using classification & regression metrics
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        <div className="space-y-6">
          <h3 className={`text-2xl font-bold ${themeClasses.text} text-center`}>
            Lessons
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lessons.map((lesson, index) => (
              <Card 
                key={lesson.id} 
                className={`${themeClasses.card} backdrop-blur-sm transition-all duration-200 hover:shadow-lg ${
                  lesson.completed ? 'ring-2 ring-green-500' : ''
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${
                        lesson.completed ? 'bg-green-500' : 'bg-blue-500'
                      } text-white`}>
                        {lesson.completed ? <CheckCircle className="h-5 w-5" /> : lesson.icon}
                      </div>
                      <div>
                        <CardTitle className={`${themeClasses.text} text-lg`}>
                          {lesson.title}
                        </CardTitle>
                        <CardDescription className={`${themeClasses.text}/70`}>
                          {lesson.description}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={themeClasses.border}>
                      {lesson.duration}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Key Concepts */}
                  <div>
                    <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Key Concepts:</h4>
                    <ul className="space-y-1">
                      {lesson.concepts.map((concept, idx) => (
                        <li key={idx} className={`text-sm ${themeClasses.text}/80 flex items-start`}>
                          <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                          {concept}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Interactive Widget */}
                  <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-yellow-500" />
                      <span className={`font-medium ${themeClasses.text}`}>Interactive Widget:</span>
                    </div>
                    <p className={`text-sm ${themeClasses.text}/80`}>{lesson.widget}</p>
                  </div>

                  {/* Quiz Sample */}
                  <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-4 w-4 text-purple-500" />
                      <span className={`font-medium ${themeClasses.text}`}>Quiz Sample:</span>
                    </div>
                    <p className={`text-sm ${themeClasses.text}/80 italic`}>"{lesson.quizSample}"</p>
                  </div>

                  {/* Video Reference */}
                  <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                    <div className="flex items-center space-x-2 mb-2">
                      <Play className="h-4 w-4 text-red-500" />
                      <span className={`font-medium ${themeClasses.text}`}>Video:</span>
                    </div>
                    <p className={`text-sm ${themeClasses.text}/80`}>{lesson.video}</p>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={() => handleStartLesson(lesson.id)}
                    className={`w-full ${
                      lesson.completed 
                        ? 'bg-green-500 hover:bg-green-600 text-white' 
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {lesson.completed ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Review Lesson
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Start Lesson
                      </>
                    )}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Mini Project */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Flower2 className="h-5 w-5 mr-2 text-pink-500" />
              Mini Project: Iris Classifier
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Apply all Chapter 1 concepts in a hands-on capstone project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className={`${themeClasses.text}/80`}>
                Build, train, and evaluate a machine learning model that classifies flowers from the famous Iris dataset. 
                This project integrates all the algorithms and evaluation techniques from Chapter 1.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h4 className={`font-medium ${themeClasses.text} mb-2`}>What You'll Build:</h4>
                  <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                    <li>• Train 4+ ML algorithms (Decision Tree, Random Forest, KNN, SVM)</li>
                    <li>• Apply ensemble methods (Bagging, AdaBoost)</li>
                    <li>• Build a simple neural network</li>
                    <li>• Create evaluation dashboard with metrics</li>
                  </ul>
                </div>
                <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h4 className={`font-medium ${themeClasses.text} mb-2`}>Skills Applied:</h4>
                  <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                    <li>• Algorithm comparison and selection</li>
                    <li>• Ensemble method implementation</li>
                    <li>• Neural network fundamentals</li>
                    <li>• Model evaluation and visualization</li>
                  </ul>
                </div>
              </div>

              <div className="text-center">
                <Link href="/learning/builder/chapter1/project">
                  <Button className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white">
                    <Flower2 className="h-4 w-4 mr-2" />
                    Start Mini Project
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Final Checkpoint */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Final Checkpoint
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Complete these requirements to earn your ML Algorithms Explorer badge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className={`font-medium ${themeClasses.text}`}>
                    Pass quizzes (80%+) across all lessons
                  </p>
                  <p className={`text-sm ${themeClasses.text}/70`}>
                    Demonstrate understanding of key concepts
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className={`font-medium ${themeClasses.text}`}>
                    Complete the Iris Classifier mini-project
                  </p>
                  <p className={`text-sm ${themeClasses.text}/70`}>
                    Apply your knowledge with hands-on practice
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className={`font-medium ${themeClasses.text}`}>
                    Evaluate with Precision/Recall & ROC curve
                  </p>
                  <p className={`text-sm ${themeClasses.text}/70`}>
                    Demonstrate proper model evaluation techniques
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/learning/builder">
            <Button variant="outline" className={themeClasses.border}>
              ← Back to AI Builder Track
            </Button>
          </Link>
          <Link href="/learning/builder/chapter2">
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">
              Next: Chapter 2 →
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
