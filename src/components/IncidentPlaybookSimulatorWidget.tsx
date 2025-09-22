'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Users,
  Play,
  RotateCcw
} from 'lucide-react';

interface IncidentPlaybookSimulatorWidgetProps {
  onComplete: () => void;
  config: any;
}

export default function IncidentPlaybookSimulatorWidget({ onComplete, config }: IncidentPlaybookSimulatorWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);

  const incidentSteps = [
    {
      id: 'detect',
      title: 'Detect',
      description: 'Identify the incident through monitoring alerts',
      icon: AlertTriangle,
      color: 'red',
      actions: ['Check monitoring dashboard', 'Verify alert validity', 'Assess impact scope']
    },
    {
      id: 'diagnose',
      title: 'Diagnose',
      description: 'Investigate root cause and gather information',
      icon: Users,
      color: 'orange',
      actions: ['Gather logs and metrics', 'Interview affected users', 'Analyze system state']
    },
    {
      id: 'mitigate',
      title: 'Mitigate',
      description: 'Implement temporary fixes to restore service',
      icon: CheckCircle,
      color: 'yellow',
      actions: ['Apply hotfixes', 'Scale resources', 'Implement circuit breakers']
    },
    {
      id: 'recover',
      title: 'Recover',
      description: 'Restore full service and validate functionality',
      icon: Clock,
      color: 'green',
      actions: ['Deploy permanent fix', 'Validate system health', 'Monitor for stability']
    }
  ];

  const handleNextStep = () => {
    if (currentStep < incidentSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSimulating(false);
    }
  };

  const handleStartSimulation = () => {
    setIsSimulating(true);
    setCurrentStep(0);
  };

  const handleReset = () => {
    setIsSimulating(false);
    setCurrentStep(0);
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

  const currentIncidentStep = incidentSteps[currentStep];

  return (
    <div className={`${themeClasses.background} p-6 rounded-lg`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Incident Playbook Simulator
        </h3>
        <p className={`${themeClasses.text}/70`}>
          Practice incident response procedures and learn best practices for handling production issues.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={handleStartSimulation}
          disabled={isSimulating}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Simulation
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Incident Steps Overview */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text}`}>
            Incident Response Steps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {incidentSteps.map((step, index) => {
              const IconComponent = step.icon;
              const isActive = index === currentStep;
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
      {isSimulating && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <currentIncidentStep.icon className="h-5 w-5 mr-2" />
              Current Step: {currentIncidentStep.title}
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              {currentIncidentStep.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className={`font-semibold ${themeClasses.text} mb-3`}>
                  Actions to Take:
                </h4>
                <div className="space-y-2">
                  {currentIncidentStep.actions.map((action, index) => (
                    <div
                      key={index}
                      className={`flex items-center space-x-3 p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}
                    >
                      <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className={`${themeClasses.text}`}>{action}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button
                  onClick={handleNextStep}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {currentStep < incidentSteps.length - 1 ? 'Next Step' : 'Complete Simulation'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Simulation Complete */}
      {!isSimulating && currentStep === incidentSteps.length - 1 && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardContent className="p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
              Simulation Complete!
            </h3>
            <p className={`${themeClasses.text}/70 mb-4`}>
              You've successfully completed the incident response playbook simulation.
            </p>
            <Badge variant="outline" className="text-green-500 border-green-500">
              Incident Response Master
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
          Complete Simulator
        </Button>
      </div>
    </div>
  );
}
