'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { MLOpsWorkflowConfig } from '@/types/widget-configs';
import { 
  Settings, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Database,
  Cpu,
  CheckCircle2,
  Rocket,
  Activity,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';

interface MLOpsWorkflowVisualizerWidgetProps {
  onComplete?: () => void;
  config?: MLOpsWorkflowConfig;
}

interface WorkflowStage {
  id: string;
  name: string;
  x: number;
  y: number;
  connected: string[];
}

interface WorkflowConnection {
  from: string;
  to: string;
  type: string;
}

export default function MLOpsWorkflowVisualizerWidget({ 
  onComplete, 
  config
}: MLOpsWorkflowVisualizerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [workflowStages, setWorkflowStages] = useState<WorkflowStage[]>([]);
  const [connections, setConnections] = useState<WorkflowConnection[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResults, setSimulationResults] = useState<any>(null);
  const [completed, setCompleted] = useState(false);

  const templates = config?.workflow_templates || [];
  const stages = config?.pipeline_stages || [];
  const scenarios = config?.scenarios || [];

  const getIcon = (iconName: string) => {
    const iconMap = {
      database: <Database className="h-4 w-4" />,
      settings: <Settings className="h-4 w-4" />,
      cpu: <Cpu className="h-4 w-4" />,
      'check-circle': <CheckCircle2 className="h-4 w-4" />,
      rocket: <Rocket className="h-4 w-4" />,
      activity: <Activity className="h-4 w-4" />
    };
    return iconMap[iconName as keyof typeof iconMap] || <Settings className="h-4 w-4" />;
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-500 text-white',
      green: 'bg-green-500 text-white',
      purple: 'bg-purple-500 text-white',
      orange: 'bg-orange-500 text-white',
      red: 'bg-red-500 text-white',
      teal: 'bg-teal-500 text-white'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-500 text-white';
  };

  const buildWorkflow = async () => {
    if (!selectedTemplate) return;
    
    setIsSimulating(true);
    
    // Simulate workflow building
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = templates.find(t => t.name === selectedTemplate);
    if (!template) return;
    
    const newStages: WorkflowStage[] = [];
    const newConnections: WorkflowConnection[] = [];
    
    // Build stages based on template
    template.stages.forEach((stageId, index) => {
      const stageConfig = stages.find(s => s.id === stageId);
      if (stageConfig) {
        newStages.push({
          id: stageConfig.id,
          name: stageConfig.name,
          x: 100 + (index * 200),
          y: 100,
          connected: stageConfig.outputs || []
        });
        
        // Add connections
        if (index > 0) {
          const prevStage = template.stages[index - 1];
          newConnections.push({
            from: prevStage,
            to: stageId,
            type: 'data_flow'
          });
        }
      }
    });
    
    setWorkflowStages(newStages);
    setConnections(newConnections);
    setIsSimulating(false);
  };

  const simulateWorkflow = async () => {
    if (workflowStages.length === 0) return;
    
    setIsSimulating(true);
    
    // Simulate workflow execution
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const results = {
      total_duration: '4.5 hours',
      total_cost: '$150',
      success_rate: '95%',
      stages_completed: workflowStages.length,
      issues_found: 0,
      recommendations: [
        'Consider adding more validation stages',
        'Implement automated retraining triggers',
        'Add comprehensive monitoring'
      ]
    };
    
    setSimulationResults(results);
    setIsSimulating(false);
    setCompleted(true);
    
    if (onComplete) {
      onComplete();
    }
  };

  const getTemplateDetails = (templateName: string) => {
    return templates.find(t => t.name === templateName);
  };

  const getStageDetails = (stageId: string) => {
    return stages.find(s => s.id === stageId);
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Activity className="h-5 w-5 mr-2 text-purple-500" />
          {config?.title || 'MLOps Workflow Visualizer'}
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Build and visualize MLOps pipelines with drag-and-drop components
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Selection */}
        <div>
          <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            Workflow Template
          </label>
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
          >
            <option value="">Choose a template...</option>
            {templates.map((template) => (
              <option key={template.name} value={template.name}>
                {template.name} - {template.description}
              </option>
            ))}
          </select>
        </div>

        {/* Template Details */}
        {selectedTemplate && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
              {getTemplateDetails(selectedTemplate)?.name}
            </h4>
            <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
              {getTemplateDetails(selectedTemplate)?.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Duration:</h5>
                <p className={`${themeClasses.text}/70`}>{getTemplateDetails(selectedTemplate)?.estimated_duration}</p>
              </div>
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Complexity:</h5>
                <Badge variant="outline" className="text-xs">
                  {getTemplateDetails(selectedTemplate)?.complexity}
                </Badge>
              </div>
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Cost:</h5>
                <Badge variant="outline" className="text-xs">
                  {getTemplateDetails(selectedTemplate)?.cost}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Build Workflow Button */}
        <div className="flex justify-center">
          <Button 
            onClick={buildWorkflow}
            disabled={!selectedTemplate || isSimulating}
            className="px-8"
          >
            <Play className="h-4 w-4 mr-2" />
            {isSimulating ? 'Building Workflow...' : 'Build Workflow'}
          </Button>
        </div>

        {/* Workflow Visualization */}
        {workflowStages.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-green-500" />
              MLOps Workflow
            </h4>
            
            <div className={`p-6 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} relative`} style={{ minHeight: '400px' }}>
              {/* Workflow Stages */}
              {workflowStages.map((stage) => {
                const stageConfig = getStageDetails(stage.id);
                if (!stageConfig) return null;
                
                return (
                  <div
                    key={stage.id}
                    className={`absolute p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} hover:shadow-md transition-shadow`}
                    style={{ left: stage.x, top: stage.y, width: '150px' }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <div className={`p-1 rounded ${getColorClasses(stageConfig.color)}`}>
                        {getIcon(stageConfig.icon)}
                      </div>
                      <span className={`text-sm font-medium ${themeClasses.text}`}>
                        {stage.name}
                      </span>
                    </div>
                    <p className={`text-xs ${themeClasses.text}/70 mb-2`}>
                      {stageConfig.description}
                    </p>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className={`${themeClasses.text}/60`}>Duration:</span>
                        <span className={`${themeClasses.text}/80`}>{stageConfig.estimated_duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className={`${themeClasses.text}/60`}>Cost:</span>
                        <span className={`${themeClasses.text}/80`}>{stageConfig.cost}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {/* Workflow Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((connection, index) => {
                  const fromStage = workflowStages.find(s => s.id === connection.from);
                  const toStage = workflowStages.find(s => s.id === connection.to);
                  
                  if (!fromStage || !toStage) return null;
                  
                  const fromX = fromStage.x + 75;
                  const fromY = fromStage.y + 80;
                  const toX = toStage.x + 75;
                  const toY = toStage.y + 20;
                  
                  return (
                    <g key={index}>
                      <line
                        x1={fromX}
                        y1={fromY}
                        x2={toX}
                        y2={toY}
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-blue-500"
                        markerEnd="url(#arrowhead)"
                      />
                      <ArrowRight
                        x={toX - 10}
                        y={toY - 5}
                        className="text-blue-500"
                        size={16}
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>
        )}

        {/* Simulation Button */}
        {workflowStages.length > 0 && (
          <div className="flex justify-center">
            <Button 
              onClick={simulateWorkflow}
              disabled={isSimulating}
              variant="outline"
              className="px-8"
            >
              <Zap className="h-4 w-4 mr-2" />
              {isSimulating ? 'Simulating...' : 'Simulate Workflow'}
            </Button>
          </div>
        )}

        {/* Simulation Results */}
        {simulationResults && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Simulation Results
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <CardContent className="p-4 text-center">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h5 className={`font-semibold ${themeClasses.text} mb-1`}>Total Duration</h5>
                  <p className={`text-lg font-bold ${themeClasses.text}`}>{simulationResults.total_duration}</p>
                </CardContent>
              </Card>
              
              <Card className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <CardContent className="p-4 text-center">
                  <Target className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h5 className={`font-semibold ${themeClasses.text} mb-1`}>Success Rate</h5>
                  <p className={`text-lg font-bold ${themeClasses.text}`}>{simulationResults.success_rate}</p>
                </CardContent>
              </Card>
              
              <Card className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <CardContent className="p-4 text-center">
                  <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h5 className={`font-semibold ${themeClasses.text} mb-1`}>Total Cost</h5>
                  <p className={`text-lg font-bold ${themeClasses.text}`}>{simulationResults.total_cost}</p>
                </CardContent>
              </Card>
            </div>
            
            {simulationResults.recommendations && (
              <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <h5 className={`font-semibold ${themeClasses.text} mb-2`}>Recommendations</h5>
                <ul className="space-y-1">
                  {simulationResults.recommendations.map((rec: string, index: number) => (
                    <li key={index} className={`text-sm ${themeClasses.text}/80 flex items-start space-x-2`}>
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Scenarios */}
        {scenarios.length > 0 && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Workflow Scenarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h5 className={`font-medium ${themeClasses.text} mb-2`}>{scenario.name}</h5>
                  <p className={`text-sm ${themeClasses.text}/80 mb-2`}>{scenario.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/60`}>Trigger:</span>
                      <Badge variant="outline" className="text-xs">
                        {scenario.trigger}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/60`}>Outcome:</span>
                      <span className={`${themeClasses.text}/70`}>{scenario.expected_outcome}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Best Practices */}
        {config?.best_practices && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Best Practices</h4>
            <div className="space-y-3">
              {config.best_practices.map((category, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h5 className={`font-medium ${themeClasses.text} mb-2`}>{category.category}</h5>
                  <ul className="space-y-1">
                    {category.practices.map((practice, idx) => (
                      <li key={idx} className={`text-sm ${themeClasses.text}/80 flex items-start space-x-2`}>
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                        <span>{practice}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Workflow Simulation Complete!</h5>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully built and simulated an MLOps workflow. Use these insights to design your production pipeline.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
