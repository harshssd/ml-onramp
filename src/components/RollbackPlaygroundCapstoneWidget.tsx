'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle, 
  Clock,
  Play,
  RotateCcw as ResetIcon
} from 'lucide-react';

interface RollbackPlaygroundCapstoneWidgetProps {
  onComplete: () => void;
  config: any;
}

export default function RollbackPlaygroundCapstoneWidget({ onComplete, config }: RollbackPlaygroundCapstoneWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [currentStep, setCurrentStep] = useState(0);
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [rollbackComplete, setRollbackComplete] = useState(false);

  const rollbackSteps = [
    {
      id: 'assess',
      title: 'Assess Situation',
      description: 'Evaluate the severity and impact of the current issue',
      icon: AlertTriangle,
      color: 'red',
      actions: [
        'Check error rates and user impact',
        'Review monitoring dashboards',
        'Assess business impact'
      ]
    },
    {
      id: 'prepare',
      title: 'Prepare Rollback',
      description: 'Identify target version and prepare rollback plan',
      icon: Clock,
      color: 'orange',
      actions: [
        'Identify target version (v1.0)',
        'Prepare rollback configuration',
        'Notify stakeholders'
      ]
    },
    {
      id: 'execute',
      title: 'Execute Rollback',
      description: 'Deploy the previous stable version',
      icon: RotateCcw,
      color: 'yellow',
      actions: [
        'Deploy v1.0 to production',
        'Update load balancer configuration',
        'Monitor deployment progress'
      ]
    },
    {
      id: 'validate',
      title: 'Validate Rollback',
      description: 'Verify that the rollback was successful',
      icon: CheckCircle,
      color: 'green',
      actions: [
        'Verify service is responding',
        'Check error rates are normal',
        'Confirm rollback success'
      ]
    }
  ];

  const modelVersions = [
    { version: 'v1.0', accuracy: 0.92, status: 'stable', issues: [] },
    { version: 'v1.1', accuracy: 0.94, status: 'current', issues: ['High latency'] },
    { version: 'v1.2', accuracy: 0.96, status: 'failed', issues: ['Accuracy drop', 'Memory leak'] }
  ];

  const handleStartRollback = () => {
    setIsRollingBack(true);
    setCurrentStep(0);
    setRollbackComplete(false);
  };

  const handleNextStep = () => {
    if (currentStep < rollbackSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsRollingBack(false);
      setRollbackComplete(true);
    }
  };

  const handleReset = () => {
    setIsRollingBack(false);
    setCurrentStep(0);
    setRollbackComplete(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      red: 'text-red-500 bg-red-50 border-red-200',
      orange: 'text-orange-500 bg-orange-50 border-orange-200',
      yellow: 'text-yellow-500 bg-yellow-50 border-yellow-200',
      green: 'text-green-500 bg-green-50 border-green-200'
    };
    return colorMap[color] || colorMap.red;
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      stable: 'text-green-500 bg-green-50 border-green-200',
      current: 'text-blue-500 bg-blue-50 border-blue-200',
      failed: 'text-red-500 bg-red-50 border-red-200'
    };
    return colorMap[status] || colorMap.stable;
  };

  const currentStepData = rollbackSteps[currentStep];

  return (
    <div className={`${themeClasses.background} p-6 rounded-lg`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Rollback Playground
        </h3>
        <p className={`${themeClasses.text}/70`}>
          Practice rollback procedures and learn how to safely revert to previous model versions.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={handleStartRollback}
          disabled={isRollingBack}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Rollback
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
        >
          <ResetIcon className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Model Versions */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text}`}>
            Model Versions
          </CardTitle>
          <CardDescription className={`${themeClasses.text}/70`}>
            Current model versions and their status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modelVersions.map((version, index) => (
              <div
                key={version.version}
                className={`p-4 rounded-lg border ${getStatusColor(version.status)}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-semibold ${themeClasses.text}`}>
                    {version.version}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {version.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className={`text-sm ${themeClasses.text}/70`}>Accuracy</div>
                    <div className={`text-lg font-bold ${themeClasses.text}`}>
                      {(version.accuracy * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm ${themeClasses.text}/70`}>Issues</div>
                    <div className={`text-sm ${themeClasses.text}`}>
                      {version.issues.length > 0 ? version.issues.join(', ') : 'None'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rollback Steps */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text}`}>
            Rollback Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rollbackSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep && isRollingBack;
              const isCompleted = index < currentStep;
              
              return (
                <div
                  key={step.id}
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    isActive 
                      ? `${getColorClasses(step.color)} border-2` 
                      : isCompleted
                      ? 'text-green-500 bg-green-50 border-green-200'
                      : `${themeClasses.card.replace('/10', '/5')} ${themeClasses.border}`
                  }`}
                >
                  <div className="text-center">
                    <IconComponent className="h-8 w-8 mx-auto mb-2" />
                    <h4 className={`font-semibold ${themeClasses.text} mb-1`}>
                      {step.title}
                    </h4>
                    <div className={`text-xs ${themeClasses.text}/70`}>
                      Step {index + 1}
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

      {/* Current Step Details */}
      {isRollingBack && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <currentStepData.icon className="h-5 w-5 mr-2" />
              Current Step: {currentStepData.title}
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              {currentStepData.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${getColorClasses(currentStepData.color)} border`}>
                <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
                  Actions Required:
                </h4>
                <ul className={`space-y-1 ${themeClasses.text}/80`}>
                  {currentStepData.actions.map((action, index) => (
                    <li key={index}>• {action}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleNextStep}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {currentStep < rollbackSteps.length - 1 ? 'Next Step' : 'Complete Rollback'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rollback Complete */}
      {rollbackComplete && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
              Rollback Complete!
            </h3>
            <p className={`${themeClasses.text}/70 mb-4`}>
              Successfully rolled back to v1.0. Service is now stable.
            </p>
            <Badge variant="outline" className="text-green-500 border-green-500">
              Rollback Master
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
          Complete Playground
        </Button>
      </div>
    </div>
  );
}
