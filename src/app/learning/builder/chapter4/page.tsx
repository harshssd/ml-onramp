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
  GraduationCap
} from 'lucide-react';

export default function AIBuilderChapter4Page() {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const lessons = [
    {
      id: 'lesson-4-1',
      title: 'Model Deployment Strategies',
      description: 'Explore REST APIs, batch jobs, edge deployment, and streaming with trade-offs analysis',
      duration: '45-60 min',
      icon: Rocket,
      status: 'completed',
      widgets: ['deployment_pipeline_builder', 'latency_cost_dashboard'],
      quiz: 'When is edge deployment most suitable?',
      link: '/learning/builder/chapter4/lesson4.1'
    },
    {
      id: 'lesson-4-2',
      title: 'MLOps Pipelines',
      description: 'Learn CI/CD automation for ML with GitHub Actions, MLflow, Docker, and Kubernetes',
      duration: '60-75 min',
      icon: Settings,
      status: 'completed',
      widgets: ['mlops_workflow_visualizer', 'pipeline_configurator'],
      quiz: 'Why do we separate training and inference pipelines?',
      link: '/learning/builder/chapter4/lesson4.2'
    },
    {
      id: 'lesson-4-3',
      title: 'Model Monitoring & Maintenance',
      description: 'Implement monitoring, alerting, and drift detection with Prometheus + Grafana',
      duration: '60 min',
      icon: Monitor,
      status: 'completed',
      widgets: ['model_monitoring_dashboard', 'drift_detection_lab', 'alert_configurator'],
      quiz: 'How can you detect concept drift?',
      link: '/learning/builder/chapter4/lesson4.3'
    },
    {
      id: 'lesson-4-4',
      title: 'Scaling AI Systems',
      description: 'Master horizontal scaling, autoscaling, caching, and load balancing techniques',
      duration: '60-75 min',
      icon: Scale,
      status: 'completed',
      widgets: ['scaling_strategy_simulator', 'distributed_training_lab', 'cost_performance_dashboard'],
      quiz: 'When would you use horizontal vs vertical scaling?',
      link: '/learning/builder/chapter4/lesson4.4'
    },
    {
      id: 'lesson-4-5',
      title: 'Production Troubleshooting & Maintenance',
      description: 'Handle common issues with rollback, shadow testing, and canary deployments',
      duration: '60 min',
      icon: Wrench,
      status: 'completed',
      widgets: ['incident_playbook_simulator', 'root_cause_analyzer', 'rollback_scenario_lab'],
      quiz: 'What is the benefit of canary releases?',
      link: '/learning/builder/chapter4/lesson4.5'
    }
  ];

  const capstoneProject = {
    id: 'capstone',
    title: 'End-to-End Deployment with MLOps',
    description: 'Deploy a customer churn prediction service with full MLOps lifecycle',
    duration: '6-8 hours',
    icon: GraduationCap,
    status: 'completed',
    deliverables: [
      'Production-ready ML pipeline',
      'Model registry with version control',
      'CI/CD pipeline for ML',
      'Monitoring + alerting dashboard',
      'Incident response playbook'
    ],
    widgets: ['deployment_pipeline_builder', 'model_monitoring_dashboard', 'rollback_playground'],
    link: '/learning/builder/chapter4/capstone'
  };

  const learningObjectives = [
    'Understand deployment strategies and trade-offs',
    'Build and automate MLOps pipelines',
    'Implement monitoring, alerting, and maintenance practices',
    'Scale AI systems for performance and cost-effectiveness',
    'Troubleshoot and recover from production issues',
    'Deliver a complete end-to-end deployed ML system'
  ];

  const widgetSuite = [
    { name: 'deployment_pipeline_builder', description: 'Build automated ML pipelines' },
    { name: 'latency_cost_dashboard', description: 'Analyze deployment trade-offs' },
    { name: 'mlops_workflow_visualizer', description: 'Visualize MLOps workflows' },
    { name: 'pipeline_configurator', description: 'Configure pipeline stages' },
    { name: 'model_monitoring_dashboard', description: 'Monitor live metrics' },
    { name: 'drift_detection_lab', description: 'Detect data/model drift' },
    { name: 'alert_configurator', description: 'Configure alerting systems' },
    { name: 'scaling_strategy_simulator', description: 'Explore scaling options' },
    { name: 'distributed_training_lab', description: 'Test distributed training' },
    { name: 'cost_performance_dashboard', description: 'Optimize cost-performance' },
    { name: 'incident_playbook_simulator', description: 'Simulate production failures' },
    { name: 'root_cause_analyzer', description: 'Analyze root causes' },
    { name: 'rollback_scenario_lab', description: 'Test rollback workflows' }
  ];

  return (
    <div className={`min-h-screen ${themeClasses.background}`}>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/learning/builder">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to AI Builder Track
              </Button>
            </Link>
            <Badge variant="outline" className="text-sm">
              AI Builder Track (Track 3)
            </Badge>
          </div>
          
          <div className="flex items-center space-x-3 mb-4">
            <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <Rocket className="h-8 w-8 text-blue-500" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${themeClasses.text}`}>
                Chapter 4: Deployment & MLOps
              </h1>
              <p className={`text-lg ${themeClasses.text}/70 mt-2`}>
                Master production deployment, monitoring, and maintenance of ML systems
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className={`${themeClasses.text}/80`}>8-10 hours</span>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4 text-green-500" />
              <span className={`${themeClasses.text}/80`}>5 lessons + capstone</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className={`${themeClasses.text}/80`}>Intermediate-Advanced</span>
            </div>
            <div className="flex items-center space-x-2">
              <Trophy className="h-4 w-4 text-purple-500" />
              <span className={`${themeClasses.text}/80`}>MLOps Practitioner Badge</span>
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
              By completing this chapter, you will master production ML deployment and maintenance
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {learningObjectives.map((objective, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className={`${themeClasses.text}/80`}>{objective}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lessons Grid */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
            <BookOpen className="h-6 w-6 mr-2 text-blue-500" />
            Lessons
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lessons.map((lesson) => {
              const IconComponent = lesson.icon;
              return (
                <Card key={lesson.id} className={`${themeClasses.card} backdrop-blur-sm hover:shadow-lg transition-shadow`}>
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                        <IconComponent className="h-6 w-6 text-blue-500" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {lesson.duration}
                      </Badge>
                    </div>
                    <CardTitle className={`${themeClasses.text} text-lg`}>
                      {lesson.title}
                    </CardTitle>
                    <CardDescription className={`${themeClasses.text}/70`}>
                      {lesson.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h4 className={`text-sm font-medium ${themeClasses.text} mb-2`}>Interactive Widgets:</h4>
                        <div className="flex flex-wrap gap-1">
                          {lesson.widgets.map((widget) => (
                            <Badge key={widget} variant="secondary" className="text-xs">
                              {widget}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div>
                        <h4 className={`text-sm font-medium ${themeClasses.text} mb-1`}>Quiz Question:</h4>
                        <p className={`text-sm ${themeClasses.text}/70`}>{lesson.quiz}</p>
                      </div>
                      
                      <Link href={lesson.link}>
                        <Button className="w-full" size="sm">
                          <Play className="h-4 w-4 mr-2" />
                          Start Lesson
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Capstone Project */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
            <GraduationCap className="h-6 w-6 mr-2 text-purple-500" />
            Capstone Project
          </h2>
          
          <Card className={`${themeClasses.card} backdrop-blur-sm`}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <GraduationCap className="h-8 w-8 text-purple-500" />
                </div>
                <Badge variant="outline" className="text-sm">
                  {capstoneProject.duration}
                </Badge>
              </div>
              <CardTitle className={`${themeClasses.text} text-2xl`}>
                {capstoneProject.title}
              </CardTitle>
              <CardDescription className={`${themeClasses.text}/70 text-lg`}>
                {capstoneProject.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Deliverables:</h4>
                  <div className="space-y-2">
                    {capstoneProject.deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-1 flex-shrink-0" />
                        <p className={`${themeClasses.text}/80 text-sm`}>{deliverable}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-lg font-semibold ${themeClasses.text} mb-3`}>Interactive Widgets:</h4>
                  <div className="flex flex-wrap gap-2">
                    {capstoneProject.widgets.map((widget) => (
                      <Badge key={widget} variant="secondary" className="text-xs">
                        {widget}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="mt-4">
                    <Link href={capstoneProject.link}>
                      <Button className="w-full" size="lg">
                        <Rocket className="h-5 w-5 mr-2" />
                        Start Capstone Project
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Interactive Widget Suite */}
        <div className="mb-8">
          <h2 className={`text-2xl font-bold ${themeClasses.text} mb-6 flex items-center`}>
            <Zap className="h-6 w-6 mr-2 text-yellow-500" />
            Interactive Widget Suite
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgetSuite.map((widget) => (
              <Card key={widget.name} className={`${themeClasses.card} backdrop-blur-sm`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                      <Settings className="h-4 w-4 text-blue-500" />
                    </div>
                    <div>
                      <h4 className={`font-medium ${themeClasses.text}`}>{widget.name}</h4>
                      <p className={`text-sm ${themeClasses.text}/70`}>{widget.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Assessment & Badges */}
        <Card className={`${themeClasses.card} backdrop-blur-sm`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Trophy className="h-5 w-5 mr-2 text-yellow-500" />
              Assessment & Badges
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Complete all lessons and the capstone project to earn your MLOps Practitioner badge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Assessment Components:</h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`${themeClasses.text}/80`}>Checkpoint quizzes after each lesson</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`${themeClasses.text}/80`}>Widget explorations to reinforce concepts</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`${themeClasses.text}/80`}>Capstone project submission with full MLOps pipeline</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className={`${themeClasses.text}/80`}>Badge unlocking system</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Available Badges:</h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                      <Crown className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <h5 className={`font-medium ${themeClasses.text}`}>MLOps Practitioner</h5>
                      <p className={`text-sm ${themeClasses.text}/70`}>Complete Chapter 4 with capstone project</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <Link href="/learning/builder/chapter3">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Previous Chapter
            </Button>
          </Link>
          
          <Link href="/learning/builder">
            <Button variant="outline">
              <BookOpen className="h-4 w-4 mr-2" />
              Track Overview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
