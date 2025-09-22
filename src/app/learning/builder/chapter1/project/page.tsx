'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ArrowLeft, 
  Play, 
  CheckCircle, 
  Code, 
  BarChart3, 
  Brain, 
  Target, 
  Zap,
  Award,
  Flower2,
  BookOpen,
  Lightbulb,
  Trophy
} from 'lucide-react';
import Link from 'next/link';

interface ProjectStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  icon: React.ReactNode;
  estimatedTime: string;
}

interface ModelResult {
  name: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  trainingTime: number;
  auc: number;
}

export default function IrisClassifierProject() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showCode, setShowCode] = useState(false);
  const [modelResults, setModelResults] = useState<ModelResult[]>([]);
  const [projectCompleted, setProjectCompleted] = useState(false);

  const steps: ProjectStep[] = [
    {
      id: 'setup',
      title: 'Setup Environment',
      description: 'Import libraries and load the Iris dataset',
      completed: completedSteps.includes('setup'),
      icon: <Code className="h-5 w-5" />,
      estimatedTime: '5 min'
    },
    {
      id: 'data-prep',
      title: 'Data Preparation',
      description: 'Split data and visualize feature distributions',
      completed: completedSteps.includes('data-prep'),
      icon: <BarChart3 className="h-5 w-5" />,
      estimatedTime: '10 min'
    },
    {
      id: 'train-models',
      title: 'Train Models (Algorithms)',
      description: 'Train Decision Tree, Random Forest, KNN, and SVM',
      completed: completedSteps.includes('train-models'),
      icon: <Brain className="h-5 w-5" />,
      estimatedTime: '15 min'
    },
    {
      id: 'ensemble',
      title: 'Ensemble Methods',
      description: 'Apply Bagging and Boosting techniques',
      completed: completedSteps.includes('ensemble'),
      icon: <Zap className="h-5 w-5" />,
      estimatedTime: '10 min'
    },
    {
      id: 'neural-network',
      title: 'Neural Network',
      description: 'Build and train a simple MLPClassifier',
      completed: completedSteps.includes('neural-network'),
      icon: <Brain className="h-5 w-5" />,
      estimatedTime: '10 min'
    },
    {
      id: 'evaluation',
      title: 'Model Evaluation Dashboard',
      description: 'Create confusion matrices, ROC curves, and metrics',
      completed: completedSteps.includes('evaluation'),
      icon: <Target className="h-5 w-5" />,
      estimatedTime: '15 min'
    },
    {
      id: 'report',
      title: 'Report & Reflection',
      description: 'Summarize findings and create model report',
      completed: completedSteps.includes('report'),
      icon: <BookOpen className="h-5 w-5" />,
      estimatedTime: '10 min'
    }
  ];

  const totalSteps = steps.length;
  const completedCount = completedSteps.length;
  const progressPercentage = (completedCount / totalSteps) * 100;

  // Simulate model results for demonstration
  useEffect(() => {
    if (completedSteps.includes('evaluation')) {
      setModelResults([
        { name: 'Decision Tree', accuracy: 0.93, precision: 0.94, recall: 0.93, f1: 0.93, trainingTime: 0.001, auc: 0.95 },
        { name: 'Random Forest', accuracy: 0.97, precision: 0.97, recall: 0.97, f1: 0.97, trainingTime: 0.015, auc: 0.99 },
        { name: 'KNN', accuracy: 0.97, precision: 0.97, recall: 0.97, f1: 0.97, trainingTime: 0.002, auc: 0.98 },
        { name: 'SVM', accuracy: 0.98, precision: 0.98, recall: 0.98, f1: 0.98, trainingTime: 0.008, auc: 0.99 },
        { name: 'Bagging', accuracy: 0.97, precision: 0.97, recall: 0.97, f1: 0.97, trainingTime: 0.025, auc: 0.99 },
        { name: 'AdaBoost', accuracy: 0.95, precision: 0.95, recall: 0.95, f1: 0.95, trainingTime: 0.020, auc: 0.97 },
        { name: 'Neural Network', accuracy: 0.98, precision: 0.98, recall: 0.98, f1: 0.98, trainingTime: 0.050, auc: 0.99 }
      ]);
    }
  }, [completedSteps]);

  const handleStepComplete = (stepId: string) => {
    if (!completedSteps.includes(stepId)) {
      setCompletedSteps(prev => [...prev, stepId]);
    }
    
    if (stepId === 'report') {
      setProjectCompleted(true);
    }
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepContent = (step: ProjectStep) => {
    switch (step.id) {
      case 'setup':
        return (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Step 1: Setup Environment</h4>
            <p className={`${themeClasses.text}/80`}>
              Import the necessary libraries and load the famous Iris dataset. This dataset contains 
              150 samples of iris flowers with 4 features (sepal length, sepal width, petal length, petal width) 
              and 3 classes (setosa, versicolor, virginica).
            </p>
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>Required Libraries:</h5>
              <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                <li>• sklearn.datasets (for Iris dataset)</li>
                <li>• sklearn.model_selection (for train/test split)</li>
                <li>• sklearn.ensemble (for Random Forest, Bagging, AdaBoost)</li>
                <li>• sklearn.tree (for Decision Tree)</li>
                <li>• sklearn.neighbors (for KNN)</li>
                <li>• sklearn.svm (for SVM)</li>
                <li>• sklearn.neural_network (for MLPClassifier)</li>
                <li>• matplotlib/seaborn (for visualizations)</li>
              </ul>
            </div>
            <Button 
              onClick={() => handleStepComplete('setup')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Setup Complete
            </Button>
          </div>
        );

      case 'data-prep':
        return (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Step 2: Data Preparation</h4>
            <p className={`${themeClasses.text}/80`}>
              Split your data into training (80%) and testing (20%) sets, then create visualizations 
              to understand the feature distributions and class separability.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h5 className={`font-medium ${themeClasses.text} mb-2`}>Data Split:</h5>
                <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                  <li>• 120 training samples</li>
                  <li>• 30 test samples</li>
                  <li>• Stratified split (maintains class proportions)</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h5 className={`font-medium ${themeClasses.text} mb-2`}>Visualizations:</h5>
                <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                  <li>• Pair plot of all features</li>
                  <li>• Box plots by class</li>
                  <li>• Correlation heatmap</li>
                </ul>
              </div>
            </div>
            <Button 
              onClick={() => handleStepComplete('data-prep')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Data Prep Complete
            </Button>
          </div>
        );

      case 'train-models':
        return (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Step 3: Train Models (Algorithms)</h4>
            <p className={`${themeClasses.text}/80`}>
              Train four different classifiers and record their performance metrics and training times.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Decision Tree', desc: 'Simple, interpretable tree-based model' },
                { name: 'Random Forest', desc: 'Ensemble of decision trees' },
                { name: 'KNN', desc: 'K-Nearest Neighbors classifier' },
                { name: 'SVM', desc: 'Support Vector Machine with RBF kernel' }
              ].map((model, idx) => (
                <div key={idx} className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h5 className={`font-medium ${themeClasses.text} mb-2`}>{model.name}</h5>
                  <p className={`text-sm ${themeClasses.text}/80`}>{model.desc}</p>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => handleStepComplete('train-models')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Training Complete
            </Button>
          </div>
        );

      case 'ensemble':
        return (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Step 4: Ensemble Methods</h4>
            <p className={`${themeClasses.text}/80`}>
              Apply bagging and boosting techniques to improve model performance and compare with single models.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h5 className={`font-medium ${themeClasses.text} mb-2`}>Bagging (Bootstrap Aggregating):</h5>
                <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                  <li>• Train multiple models on different data subsets</li>
                  <li>• Reduces variance and overfitting</li>
                  <li>• Use BaggingClassifier with Decision Trees</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h5 className={`font-medium ${themeClasses.text} mb-2`}>Boosting (AdaBoost):</h5>
                <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                  <li>• Sequentially train models on misclassified samples</li>
                  <li>• Reduces bias and improves accuracy</li>
                  <li>• Use AdaBoostClassifier with Decision Trees</li>
                </ul>
              </div>
            </div>
            <Button 
              onClick={() => handleStepComplete('ensemble')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Ensemble Complete
            </Button>
          </div>
        );

      case 'neural-network':
        return (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Step 5: Neural Network</h4>
            <p className={`${themeClasses.text}/80`}>
              Build and train a simple Multi-Layer Perceptron (MLP) classifier with one hidden layer.
            </p>
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>MLP Configuration:</h5>
              <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                <li>• Input layer: 4 features</li>
                <li>• Hidden layer: 10 neurons with ReLU activation</li>
                <li>• Output layer: 3 classes with softmax activation</li>
                <li>• Optimizer: Adam</li>
                <li>• Max iterations: 1000</li>
              </ul>
            </div>
            <Button 
              onClick={() => handleStepComplete('neural-network')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Neural Network Complete
            </Button>
          </div>
        );

      case 'evaluation':
        return (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Step 6: Model Evaluation Dashboard</h4>
            <p className={`${themeClasses.text}/80`}>
              Create comprehensive evaluation visualizations and metrics for all models.
            </p>
            
            {modelResults.length > 0 && (
              <div className="space-y-4">
                <h5 className={`font-medium ${themeClasses.text}`}>Model Performance Comparison:</h5>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className={`${themeClasses.border} border-b`}>
                        <th className={`text-left p-2 ${themeClasses.text}`}>Model</th>
                        <th className={`text-left p-2 ${themeClasses.text}`}>Accuracy</th>
                        <th className={`text-left p-2 ${themeClasses.text}`}>Precision</th>
                        <th className={`text-left p-2 ${themeClasses.text}`}>Recall</th>
                        <th className={`text-left p-2 ${themeClasses.text}`}>F1 Score</th>
                        <th className={`text-left p-2 ${themeClasses.text}`}>AUC</th>
                        <th className={`text-left p-2 ${themeClasses.text}`}>Time (s)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {modelResults.map((model, idx) => (
                        <tr key={idx} className={`${themeClasses.border} border-b`}>
                          <td className={`p-2 ${themeClasses.text}`}>{model.name}</td>
                          <td className={`p-2 ${themeClasses.text}`}>{model.accuracy.toFixed(3)}</td>
                          <td className={`p-2 ${themeClasses.text}`}>{model.precision.toFixed(3)}</td>
                          <td className={`p-2 ${themeClasses.text}`}>{model.recall.toFixed(3)}</td>
                          <td className={`p-2 ${themeClasses.text}`}>{model.f1.toFixed(3)}</td>
                          <td className={`p-2 ${themeClasses.text}`}>{model.auc.toFixed(3)}</td>
                          <td className={`p-2 ${themeClasses.text}`}>{model.trainingTime.toFixed(3)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h5 className={`font-medium ${themeClasses.text} mb-2`}>Required Visualizations:</h5>
                <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                  <li>• Confusion matrices for all models</li>
                  <li>• ROC curves with AUC scores</li>
                  <li>• Precision-Recall curves</li>
                  <li>• Training time comparison</li>
                </ul>
              </div>
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h5 className={`font-medium ${themeClasses.text} mb-2`}>Key Metrics:</h5>
                <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                  <li>• Accuracy, Precision, Recall, F1</li>
                  <li>• AUC-ROC for each class</li>
                  <li>• Training and prediction times</li>
                  <li>• Model complexity analysis</li>
                </ul>
              </div>
            </div>
            <Button 
              onClick={() => handleStepComplete('evaluation')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark Evaluation Complete
            </Button>
          </div>
        );

      case 'report':
        return (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Step 7: Report & Reflection</h4>
            <p className={`${themeClasses.text}/80`}>
              Create a one-page model report summarizing your findings and insights.
            </p>
            
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <h5 className={`font-medium ${themeClasses.text} mb-3`}>Report Sections:</h5>
              <div className="space-y-3">
                <div>
                  <h6 className={`font-medium ${themeClasses.text} mb-1`}>1. Best Model Analysis</h6>
                  <p className={`text-sm ${themeClasses.text}/80`}>
                    Which model performed best? Why do you think it was most effective for this dataset?
                  </p>
                </div>
                <div>
                  <h6 className={`font-medium ${themeClasses.text} mb-1`}>2. Trade-offs Discussion</h6>
                  <p className={`text-sm ${themeClasses.text}/80`}>
                    Compare accuracy vs interpretability. When would you choose each model?
                  </p>
                </div>
                <div>
                  <h6 className={`font-medium ${themeClasses.text} mb-1`}>3. Ensemble Insights</h6>
                  <p className={`text-sm ${themeClasses.text}/80`}>
                    Did ensemble methods improve performance? Which technique worked better?
                  </p>
                </div>
                <div>
                  <h6 className={`font-medium ${themeClasses.text} mb-1`}>4. Next Steps</h6>
                  <p className={`text-sm ${themeClasses.text}/80`}>
                    What would you try next? (hyperparameter tuning, more data, different algorithms)
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800`}>
              <h5 className={`font-medium ${themeClasses.text} mb-2`}>Reflection Questions:</h5>
              <ul className={`text-sm ${themeClasses.text}/80 space-y-1`}>
                <li>• Why might Random Forest outperform a single Decision Tree?</li>
                <li>• Which metric matters most if misclassifying a rare flower species has high cost?</li>
                <li>• How did the neural network compare to traditional algorithms?</li>
                <li>• What surprised you most about the results?</li>
              </ul>
            </div>
            
            <Button 
              onClick={() => handleStepComplete('report')}
              className="bg-green-500 hover:bg-green-600 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Complete Project
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen ${themeClasses.background} p-6`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <Flower2 className="h-8 w-8 text-pink-500" />
            <h1 className={`text-4xl font-bold ${themeClasses.text}`}>
              Mini Project: Iris Classifier
            </h1>
          </div>
          <p className={`text-xl ${themeClasses.text}/70 max-w-3xl mx-auto`}>
            Build, train, and evaluate a machine learning model that classifies flowers from the famous Iris dataset, 
            using all the algorithms and evaluation techniques from Chapter 1.
          </p>
          <div className="flex items-center justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className={themeClasses.text}>~75 minutes</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span className={themeClasses.text}>7 steps</span>
            </div>
            <div className="flex items-center space-x-2">
              <Award className="h-4 w-4 text-purple-500" />
              <span className={themeClasses.text}>Capstone Project</span>
            </div>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className={`font-medium ${themeClasses.text}`}>
                  {completedCount} of {totalSteps} steps completed
                </span>
                <span className={`text-sm ${themeClasses.text}/70`}>
                  {progressPercentage.toFixed(0)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-3" />
              {projectCompleted && (
                <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-green-500" />
                    <span className={`font-semibold ${themeClasses.text}`}>
                      🌸 Iris Classifier Builder Badge Earned!
                    </span>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Project Steps */}
        <div className="space-y-6">
          <h3 className={`text-2xl font-bold ${themeClasses.text} text-center`}>
            Project Steps
          </h3>
          
          {/* Step Navigation */}
          <div className="flex justify-center space-x-2 mb-8">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all ${
                  index === currentStep
                    ? 'bg-blue-500 text-white'
                    : step.completed
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setCurrentStep(index)}
              >
                {step.completed ? <CheckCircle className="h-4 w-4" /> : index + 1}
              </div>
            ))}
          </div>

          {/* Current Step Content */}
          <Card className={`${themeClasses.card} backdrop-blur-sm`}>
            <CardHeader>
              <div className="flex items-center space-x-3">
                {steps[currentStep].icon}
                <div>
                  <CardTitle className={`${themeClasses.text}`}>
                    Step {currentStep + 1}: {steps[currentStep].title}
                  </CardTitle>
                  <CardDescription className={`${themeClasses.text}/70`}>
                    {steps[currentStep].description} • {steps[currentStep].estimatedTime}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {getStepContent(steps[currentStep])}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <Button
              onClick={handlePrevStep}
              disabled={currentStep === 0}
              variant="outline"
              className={themeClasses.border}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Step
            </Button>
            
            <div className="flex space-x-4">
              <Button
                onClick={() => setShowCode(!showCode)}
                variant="outline"
                className={themeClasses.border}
              >
                <Code className="h-4 w-4 mr-2" />
                {showCode ? 'Hide' : 'Show'} Code Template
              </Button>
              
              {currentStep < totalSteps - 1 && (
                <Button
                  onClick={handleNextStep}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Next Step
                  <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              )}
            </div>
          </div>

          {/* Code Template */}
          {showCode && (
            <Card className={`${themeClasses.card} backdrop-blur-sm`}>
              <CardHeader>
                <CardTitle className={`${themeClasses.text} flex items-center`}>
                  <Code className="h-5 w-5 mr-2 text-blue-500" />
                  Code Template for {steps[currentStep].title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg bg-gray-900 text-green-400 font-mono text-sm overflow-x-auto`}>
                  {getCodeTemplate(steps[currentStep].id)}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <Link href="/learning/builder/chapter1">
            <Button variant="outline" className={themeClasses.border}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Chapter 1
            </Button>
          </Link>
          
          {projectCompleted && (
            <Link href="/learning/builder/chapter2">
              <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                Next: Chapter 2 →
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function getCodeTemplate(stepId: string): string {
  switch (stepId) {
    case 'setup':
      return `# Step 1: Setup Environment
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier, BaggingClassifier, AdaBoostClassifier
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier
from sklearn.svm import SVC
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_curve, auc
import time

# Load the Iris dataset
iris = load_iris()
X, y = iris.data, iris.target
feature_names = iris.feature_names
target_names = iris.target_names

print("Dataset shape:", X.shape)
print("Features:", feature_names)
print("Classes:", target_names)`;

    case 'data-prep':
      return `# Step 2: Data Preparation
# Split the data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

print(f"Training set: {X_train.shape[0]} samples")
print(f"Test set: {X_test.shape[0]} samples")

# Create visualizations
fig, axes = plt.subplots(2, 2, figsize=(12, 10))

# Pair plot
sns.scatterplot(data=pd.DataFrame(X_train, columns=feature_names), 
                x='sepal length (cm)', y='sepal width (cm)', 
                hue=y_train, ax=axes[0,0])

# Box plots
sns.boxplot(data=pd.DataFrame(X_train, columns=feature_names), ax=axes[0,1])

# Correlation heatmap
corr_matrix = pd.DataFrame(X_train, columns=feature_names).corr()
sns.heatmap(corr_matrix, annot=True, ax=axes[1,0])

plt.tight_layout()
plt.show()`;

    case 'train-models':
      return `# Step 3: Train Models (Algorithms)
models = {
    'Decision Tree': DecisionTreeClassifier(random_state=42),
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42),
    'KNN': KNeighborsClassifier(n_neighbors=3),
    'SVM': SVC(probability=True, random_state=42)
}

results = {}

for name, model in models.items():
    start_time = time.time()
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    
    y_pred = model.predict(X_test)
    accuracy = model.score(X_test, y_test)
    
    results[name] = {
        'model': model,
        'accuracy': accuracy,
        'training_time': training_time,
        'predictions': y_pred
    }
    
    print(f"{name}: Accuracy = {accuracy:.3f}, Time = {training_time:.3f}s")`;

    case 'ensemble':
      return `# Step 4: Ensemble Methods
ensemble_models = {
    'Bagging': BaggingClassifier(
        base_estimator=DecisionTreeClassifier(),
        n_estimators=10,
        random_state=42
    ),
    'AdaBoost': AdaBoostClassifier(
        base_estimator=DecisionTreeClassifier(max_depth=1),
        n_estimators=50,
        random_state=42
    )
}

for name, model in ensemble_models.items():
    start_time = time.time()
    model.fit(X_train, y_train)
    training_time = time.time() - start_time
    
    y_pred = model.predict(X_test)
    accuracy = model.score(X_test, y_test)
    
    results[name] = {
        'model': model,
        'accuracy': accuracy,
        'training_time': training_time,
        'predictions': y_pred
    }
    
    print(f"{name}: Accuracy = {accuracy:.3f}, Time = {training_time:.3f}s")`;

    case 'neural-network':
      return `# Step 5: Neural Network
nn_model = MLPClassifier(
    hidden_layer_sizes=(10,),
    activation='relu',
    solver='adam',
    max_iter=1000,
    random_state=42
)

start_time = time.time()
nn_model.fit(X_train, y_train)
training_time = time.time() - start_time

y_pred_nn = nn_model.predict(X_test)
accuracy_nn = nn_model.score(X_test, y_test)

results['Neural Network'] = {
    'model': nn_model,
    'accuracy': accuracy_nn,
    'training_time': training_time,
    'predictions': y_pred_nn
}

print(f"Neural Network: Accuracy = {accuracy_nn:.3f}, Time = {training_time:.3f}s")`;

    case 'evaluation':
      return `# Step 6: Model Evaluation Dashboard
from sklearn.metrics import precision_recall_fscore_support, roc_curve, auc
from sklearn.preprocessing import label_binarize

# Binarize the output for multi-class ROC
y_test_bin = label_binarize(y_test, classes=[0, 1, 2])
n_classes = y_test_bin.shape[1]

# Create evaluation plots
fig, axes = plt.subplots(2, 3, figsize=(18, 12))
axes = axes.ravel()

for i, (name, result) in enumerate(results.items()):
    model = result['model']
    y_pred = result['predictions']
    
    # Confusion Matrix
    cm = confusion_matrix(y_test, y_pred)
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=axes[i])
    axes[i].set_title(f'{name}\\nAccuracy: {result["accuracy"]:.3f}')
    axes[i].set_xlabel('Predicted')
    axes[i].set_ylabel('Actual')

plt.tight_layout()
plt.show()

# Print detailed metrics
for name, result in results.items():
    y_pred = result['predictions']
    precision, recall, f1, _ = precision_recall_fscore_support(y_test, y_pred, average='weighted')
    print(f"\\n{name}:")
    print(f"  Accuracy: {result['accuracy']:.3f}")
    print(f"  Precision: {precision:.3f}")
    print(f"  Recall: {recall:.3f}")
    print(f"  F1-Score: {f1:.3f}")
    print(f"  Training Time: {result['training_time']:.3f}s")`;

    case 'report':
      return `# Step 7: Report & Reflection
# Create a comprehensive model comparison
comparison_df = pd.DataFrame({
    'Model': list(results.keys()),
    'Accuracy': [r['accuracy'] for r in results.values()],
    'Training_Time': [r['training_time'] for r in results.values()]
})

print("\\n=== FINAL MODEL COMPARISON ===")
print(comparison_df.sort_values('Accuracy', ascending=False))

# Find best model
best_model_name = comparison_df.loc[comparison_df['Accuracy'].idxmax(), 'Model']
print(f"\\nBest Model: {best_model_name}")

# Reflection questions to answer:
print("\\n=== REFLECTION QUESTIONS ===")
print("1. Which model performed best and why?")
print("2. What are the trade-offs between accuracy and interpretability?")
print("3. Did ensemble methods improve performance?")
print("4. How did the neural network compare to traditional algorithms?")
print("5. What would you try next to improve performance?")

# Save results for future reference
comparison_df.to_csv('iris_classifier_results.csv', index=False)
print("\\nResults saved to 'iris_classifier_results.csv'")`;

    default:
      return `# Code template for ${stepId}`;
  }
}
