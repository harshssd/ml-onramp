'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  ArrowLeft, 
  Clock, 
  BookOpen, 
  Star, 
  Play, 
  Trophy, 
  Target, 
  Zap, 
  Crown, 
  Shield, 
  Sword,
  CheckCircle,
  Rocket,
  Settings,
  Monitor,
  Scale,
  Wrench,
  GraduationCap,
  Brain,
  Cpu,
  Database,
  Layers,
  TrendingUp,
  Users,
  Award,
  ChevronRight,
  BarChart3,
  GitBranch,
  Activity
} from 'lucide-react';

export default function AIBuilderTrackPage() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const chapters = [
    {
      id: 'chapter-1',
      title: 'Advanced Machine Learning',
      description: 'Master algorithms, ensembles, neural networks, and evaluation metrics',
      duration: '6-8 hours',
      lessonCount: 4,
      icon: Brain,
      status: 'completed',
      color: 'blue',
      lessons: [
        { title: 'Deep Dive into Algorithms', duration: '45-60 min' },
        { title: 'Ensemble Methods', duration: '45-60 min' },
        { title: 'Neural Networks Fundamentals', duration: '45-60 min' },
        { title: 'Model Evaluation Deep Dive', duration: '45-60 min' }
      ],
      miniProject: {
        title: 'Iris Classifier',
        description: 'In-browser ML with Pyodide and NumPy',
        duration: '2-3 hours'
      },
      widgets: ['algorithm_explorer', 'ensemble_visualizer', 'neural_network_visualizer', 'metrics_dashboard'],
      link: '/learning/builder/chapter1'
    },
    {
      id: 'chapter-2',
      title: 'Feature Engineering Mastery',
      description: 'Advanced preprocessing, feature selection, missing data handling, and scaling',
      duration: '6-8 hours',
      lessonCount: 4,
      icon: Database,
      status: 'completed',
      color: 'green',
      lessons: [
        { title: 'Advanced Data Preprocessing', duration: '45-60 min' },
        { title: 'Feature Selection Strategies', duration: '45-60 min' },
        { title: 'Handling Missing Data', duration: '45-60 min' },
        { title: 'Feature Scaling & Normalization', duration: '45-60 min' }
      ],
      widgets: ['transform_preview', 'feature_selector', 'impute_lab', 'scaling_playground'],
      link: '/learning/builder/chapter2'
    },
    {
      id: 'chapter-3',
      title: 'Model Architecture & Optimization',
      description: 'Model selection, hyperparameter tuning, cross-validation, and optimization techniques',
      duration: '8-10 hours',
      lessonCount: 5,
      icon: Cpu,
      status: 'completed',
      color: 'purple',
      lessons: [
        { title: 'Model Selection & Architecture Basics', duration: '45-60 min' },
        { title: 'Hyperparameter Tuning', duration: '45-60 min' },
        { title: 'Cross-Validation Strategies', duration: '45-60 min' },
        { title: 'Model Optimization Techniques', duration: '45-60 min' },
        { title: 'Production Model Considerations', duration: '45-60 min' }
      ],
      miniProject: {
        title: 'Titanic Model Optimization Challenge',
        description: 'Build the best survivor predictor with CV and tuning',
        duration: '3-4 hours'
      },
      widgets: ['model_comparison_dashboard', 'hyperparam_tuning_playground', 'cv_visualizer', 'optimization_lab', 'performance_tradeoff_explorer'],
      link: '/learning/builder/chapter3'
    },
    {
      id: 'chapter-4',
      title: 'Deployment & MLOps',
      description: 'Production deployment, monitoring, scaling, and troubleshooting',
      duration: '8-10 hours',
      lessonCount: 5,
      icon: Rocket,
      status: 'completed',
      color: 'orange',
      lessons: [
        { title: 'Model Deployment Strategies', duration: '45-60 min' },
        { title: 'MLOps Pipelines', duration: '60-75 min' },
        { title: 'Model Monitoring & Maintenance', duration: '60 min' },
        { title: 'Scaling AI Systems', duration: '60-75 min' },
        { title: 'Production Troubleshooting & Maintenance', duration: '60 min' }
      ],
      capstoneProject: {
        title: 'End-to-End Deployment with MLOps',
        description: 'Complete MLOps pipeline: train → containerize → deploy → monitor → troubleshoot',
        duration: '6-8 hours'
      },
      widgets: ['deployment_pipeline_builder', 'model_monitoring_dashboard', 'scaling_strategy_simulator', 'rollback_playground'],
      link: '/learning/builder/chapter4'
    }
  ];

  const trackOutcomes = [
    'Develop advanced ML algorithms and architectures',
    'Master feature engineering, optimization, and tuning',
    'Understand and apply cross-validation and evaluation metrics',
    'Optimize models for performance, fairness, and scalability',
    'Deploy models into production environments with MLOps',
    'Monitor, troubleshoot, and maintain deployed ML systems',
    'Complete a real-world end-to-end deployment capstone project'
  ];

  const coreWidgets = [
    { name: 'Algorithm Explorer', description: 'Compare ML algorithms interactively', icon: Brain },
    { name: 'Ensemble Visualizer', description: 'Bagging, boosting, stacking demos', icon: Layers },
    { name: 'Neural Network Visualizer', description: 'Build and tweak architectures', icon: Cpu },
    { name: 'Metrics Dashboard', description: 'Explore accuracy, precision, recall, F1', icon: BarChart3 },
    { name: 'Dataset Explorer', description: 'Browse and analyze datasets', icon: Database },
    { name: 'Transform Preview', description: 'See preprocessing steps in real-time', icon: Settings },
    { name: 'Feature Selector', description: 'Choose optimal features dynamically', icon: Target },
    { name: 'Impute Lab', description: 'Handle missing values', icon: Wrench },
    { name: 'Scaling Playground', description: 'Compare normalization methods', icon: Scale },
    { name: 'Hyperparam Tuning Playground', description: 'Tune models interactively', icon: TrendingUp },
    { name: 'CV Visualizer', description: 'See cross-validation splits in action', icon: Activity },
    { name: 'Optimization Lab', description: 'Experiment with regularization, dropout, pruning', icon: Settings },
    { name: 'Performance Trade-off Explorer', description: 'Balance accuracy vs latency', icon: Scale },
    { name: 'Deployment Pipeline Builder', description: 'Drag-and-drop MLOps pipeline creation', icon: GitBranch },
    { name: 'Monitoring Dashboard', description: 'Accuracy, latency, drift visualization', icon: Monitor },
    { name: 'Rollback Playground', description: 'Practice rollback workflows', icon: Shield }
  ];

  const badges = [
    { name: 'Algorithm Expert', icon: Brain, color: 'blue', description: 'Complete Chapter 1' },
    { name: 'Feature Engineering Master', icon: Database, color: 'green', description: 'Complete Chapter 2' },
    { name: 'Optimization Master', icon: Cpu, color: 'purple', description: 'Complete Chapter 3' },
    { name: 'MLOps Practitioner', icon: Rocket, color: 'orange', description: 'Complete Chapter 4' },
    { name: 'AI Builder Graduate', icon: GraduationCap, color: 'gold', description: 'Complete entire track' }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-500 bg-blue-50 border-blue-200',
      green: 'text-green-500 bg-green-50 border-green-200',
      purple: 'text-purple-500 bg-purple-50 border-purple-200',
      orange: 'text-orange-500 bg-orange-50 border-orange-200',
      gold: 'text-yellow-500 bg-yellow-50 border-yellow-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/learning">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Learning Hub
              </Button>
            </Link>
            <Badge variant="outline" className="text-sm">
              Intermediate Track
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <Crown className="h-8 w-8 text-purple-500" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${themeClasses.text}`}>
                AI Builder Track (Intermediate)
              </h1>
              <p className={`text-lg ${themeClasses.text}/70 mt-2`}>
                Build, optimize, and deploy real-world AI systems with production-ready skills
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className={`${themeClasses.text}/80`}>30-40 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span className={`${themeClasses.text}/80`}>16-18 lessons</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className={`${themeClasses.text}/80`}>Intermediate-Advanced</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-purple-500" />
              <span className={`${themeClasses.text}/80`}>5 badges + certification</span>
            </div>
          </div>
        </div>

        {/* Track Learning Outcomes */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-blue-500" />
              Track Learning Outcomes
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              By completing the AI Builder Track, you will master production-ready AI development
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trackOutcomes.map((outcome, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className={`${themeClasses.text}/80`}>{outcome}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Chapters Grid */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
            <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
            Chapters
          </h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {chapters.map((chapter) => {
              const IconComponent = chapter.icon;
              const colorClasses = getColorClasses(chapter.color);
              
              return (
                <Card key={chapter.id} className={`${themeClasses.card} backdrop-blur-sm hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-3 rounded-lg ${colorClasses} border`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="text-xs mb-1">
                          {chapter.duration}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {chapter.lessonCount} lessons
                        </Badge>
                      </div>
                    </div>
                    <CardTitle className={`${themeClasses.text} text-xl`}>
                      {chapter.title}
                    </CardTitle>
                    <CardDescription className={`${themeClasses.text}/70`}>
                      {chapter.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Lessons */}
                      <div>
                        <h4 className={`text-sm font-medium ${themeClasses.text} mb-2`}>Lessons:</h4>
                        <div className="space-y-1">
                          {chapter.lessons.map((lesson, index) => (
                            <div key={index} className="flex items-center justify-between text-sm">
                              <span className={`${themeClasses.text}/80`}>{lesson.title}</span>
                              <span className={`${themeClasses.text}/60`}>{lesson.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Mini Project or Capstone */}
                      {(chapter.miniProject || chapter.capstoneProject) && (
                        <div>
                          <h4 className={`text-sm font-medium ${themeClasses.text} mb-2`}>
                            {chapter.capstoneProject ? 'Capstone Project:' : 'Mini-Project:'}
                          </h4>
                          <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                            <h5 className={`font-medium ${themeClasses.text}`}>
                              {chapter.capstoneProject?.title || chapter.miniProject?.title}
                            </h5>
                            <p className={`text-sm ${themeClasses.text}/70 mt-1`}>
                              {chapter.capstoneProject?.description || chapter.miniProject?.description}
                            </p>
                            <Badge variant="outline" className="text-xs mt-2">
                              {chapter.capstoneProject?.duration || chapter.miniProject?.duration}
                            </Badge>
                          </div>
                        </div>
                      )}

                      {/* Widgets */}
                      <div>
                        <h4 className={`text-sm font-medium ${themeClasses.text} mb-2`}>Key Widgets:</h4>
                        <div className="flex flex-wrap gap-1">
                          {chapter.widgets.slice(0, 3).map((widget) => (
                            <Badge key={widget} variant="secondary" className="text-xs">
                              {widget}
                            </Badge>
                          ))}
                          {chapter.widgets.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{chapter.widgets.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Link href={chapter.link}>
                        <Button className="w-full" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Start Chapter
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Core Interactive Widget Suite */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
            <Zap className="h-6 w-6 mr-2 text-yellow-500" />
            Core Interactive Widget Suite
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {coreWidgets.map((widget) => {
              const IconComponent = widget.icon;
              return (
                <Card key={widget.name} className={`${themeClasses.card} backdrop-blur-sm`}>
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                        <IconComponent className="h-4 w-4 text-blue-500" />
                      </div>
                      <div>
                        <h4 className={`font-medium ${themeClasses.text} text-sm`}>{widget.name}</h4>
                        <p className={`text-xs ${themeClasses.text}/70`}>{widget.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Assessment & Recognition */}
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-8`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Assessment & Recognition
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Complete all chapters to earn badges and certification
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Assessment Components:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`${themeClasses.text}/80`}>Checkpoint quizzes in every lesson</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`${themeClasses.text}/80`}>Widget-based interactive challenges</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`${themeClasses.text}/80`}>Mini-projects at end of Chapters 1 & 3</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`${themeClasses.text}/80`}>Capstone project at end of Chapter 4</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Available Badges:</h4>
                <div className="space-y-3">
                  {badges.map((badge) => {
                    const IconComponent = badge.icon;
                    const colorClasses = getColorClasses(badge.color);
                    return (
                      <div key={badge.name} className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${colorClasses} border`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h5 className={`font-medium ${themeClasses.text}`}>{badge.name}</h5>
                          <p className={`text-sm ${themeClasses.text}/70`}>{badge.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link href="/learning">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning Hub
            </Button>
          </Link>
          
          <Link href="/learning/builder/chapter1">
            <Button>
              <Play className="h-4 w-4 mr-2" />
              Start AI Builder Track
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
