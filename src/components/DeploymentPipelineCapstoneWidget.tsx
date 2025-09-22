'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  GitBranch, 
  CheckCircle, 
  Clock, 
  Server,
  Play,
  RotateCcw
} from 'lucide-react';

interface DeploymentPipelineCapstoneWidgetProps {
  onComplete: () => void;
  config: any;
}

export default function DeploymentPipelineCapstoneWidget({ onComplete, config }: DeploymentPipelineCapstoneWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [currentStage, setCurrentStage] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [pipelineComplete, setPipelineComplete] = useState(false);

  const pipelineStages = [
    {
      id: 'build',
      title: 'Build',
      description: 'Compile and package the application',
      icon: GitBranch,
      color: 'blue',
      duration: '2 min'
    },
    {
      id: 'test',
      title: 'Test',
      description: 'Run automated tests and validation',
      icon: CheckCircle,
      color: 'green',
      duration: '5 min'
    },
    {
      id: 'deploy',
      title: 'Deploy',
      description: 'Deploy to staging environment',
      icon: Server,
      color: 'purple',
      duration: '3 min'
    },
    {
      id: 'validate',
      title: 'Validate',
      description: 'Validate deployment and run smoke tests',
      icon: Clock,
      color: 'orange',
      duration: '2 min'
    }
  ];

  const handleStartPipeline = () => {
    setIsRunning(true);
    setCurrentStage(0);
    setPipelineComplete(false);
  };

  const handleNextStage = () => {
    if (currentStage < pipelineStages.length - 1) {
      setCurrentStage(currentStage + 1);
    } else {
      setIsRunning(false);
      setPipelineComplete(true);
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentStage(0);
    setPipelineComplete(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-500 bg-blue-50 border-blue-200',
      green: 'text-green-500 bg-green-50 border-green-200',
      purple: 'text-purple-500 bg-purple-50 border-purple-200',
      orange: 'text-orange-500 bg-orange-50 border-orange-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const currentStageData = pipelineStages[currentStage];

  return (
    <div className={`${themeClasses.background} p-6 rounded-lg`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Deployment Pipeline Builder
        </h3>
        <p className={`${themeClasses.text}/70`}>
          Build and execute a complete CI/CD pipeline for your ML model deployment.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={handleStartPipeline}
          disabled={isRunning}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Pipeline
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Pipeline Stages */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text}`}>
            Pipeline Stages
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pipelineStages.map((stage, index) => {
              const IconComponent = stage.icon;
              const isActive = index === currentStage && isRunning;
              const isCompleted = index < currentStage;
              
              return (
                <div
                  key={stage.id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    isActive 
                      ? `${getColorClasses(stage.color)} border-2` 
                      : isCompleted
                      ? 'text-green-500 bg-green-50 border-green-200'
                      : `${themeClasses.card.replace('/10', '/5')} ${themeClasses.border}`
                  }`}
                >
                  <div className="text-center">
                    <IconComponent className="h-8 w-8 mx-auto mb-2" />
                    <h4 className={`font-semibold ${themeClasses.text} mb-1`}>
                      {stage.title}
                    </h4>
                    <div className={`text-xs ${themeClasses.text}/70`}>
                      {stage.duration}
                    </div>
                    {isCompleted && (
                      <CheckCircle className="h-4 w-4 text-green-500 mx-auto mt-2" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Stage Details */}
      {isRunning && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <currentStageData.icon className="h-5 w-5 mr-2" />
              Current Stage: {currentStageData.title}
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              {currentStageData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${getColorClasses(currentStageData.color)} border`}>
                <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
                  Stage Details:
                </h4>
                <ul className={`space-y-1 ${themeClasses.text}/80`}>
                  {currentStage.id === 'build' && (
                    <>
                      <li>• Compiling Python application</li>
                      <li>• Installing dependencies</li>
                      <li>• Creating Docker image</li>
                    </>
                  )}
                  {currentStage.id === 'test' && (
                    <>
                      <li>• Running unit tests</li>
                      <li>• Validating model performance</li>
                      <li>• Checking code quality</li>
                    </>
                  )}
                  {currentStage.id === 'deploy' && (
                    <>
                      <li>• Deploying to staging</li>
                      <li>• Updating load balancer</li>
                      <li>• Configuring environment</li>
                    </>
                  )}
                  {currentStage.id === 'validate' && (
                    <>
                      <li>• Running smoke tests</li>
                      <li>• Checking health endpoints</li>
                      <li>• Validating performance</li>
                    </>
                  )}
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleNextStage}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {currentStage < pipelineStages.length - 1 ? 'Next Stage' : 'Complete Pipeline'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Pipeline Complete */}
      {pipelineComplete && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
              Pipeline Complete!
            </h3>
            <p className={`${themeClasses.text}/70 mb-4`}>
              Your ML model has been successfully deployed to staging.
            </p>
            <Badge variant="outline" className="text-green-500 border-green-500">
              Deployment Master
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Completion Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={onComplete}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
        >
          Complete Pipeline
        </Button>
      </div>
    </div>
  );
}
