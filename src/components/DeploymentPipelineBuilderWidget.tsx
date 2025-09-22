'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { DeploymentPipelineConfig } from '@/types/widget-configs';
import { 
  Settings, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Zap,
  Activity,
  Cloud,
  Smartphone,
  Layers,
  Database,
  Cpu,
  Globe,
  Scale,
  HardDrive
} from 'lucide-react';

interface DeploymentPipelineBuilderWidgetProps {
  onComplete?: () => void;
  config?: DeploymentPipelineConfig;
}

interface PipelineComponent {
  id: string;
  name: string;
  type: string;
  x: number;
  y: number;
}

interface PipelineConnection {
  from: string;
  to: string;
  type: string;
}

export default function DeploymentPipelineBuilderWidget({ 
  onComplete, 
  config
}: DeploymentPipelineBuilderWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('');
  const [pipelineComponents, setPipelineComponents] = useState<PipelineComponent[]>([]);
  const [connections, setConnections] = useState<PipelineConnection[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [completed, setCompleted] = useState(false);

  const strategies = config?.deployment_strategies || [];
  const environments = config?.deployment_environments || [];
  const components = config?.pipeline_components || [];
  const scenarios = config?.scenarios || [];

  const getIcon = (iconName: string) => {
    const iconMap = {
      clock: <Clock className="h-4 w-4" />,
      zap: <Zap className="h-4 w-4" />,
      activity: <Activity className="h-4 w-4" />,
      cloud: <Cloud className="h-4 w-4" />,
      smartphone: <Smartphone className="h-4 w-4" />,
      layers: <Layers className="h-4 w-4" />,
      database: <Database className="h-4 w-4" />,
      cpu: <Cpu className="h-4 w-4" />,
      globe: <Globe className="h-4 w-4" />,
      scale: <Scale className="h-4 w-4" />,
      'hard-drive': <HardDrive className="h-4 w-4" />
    };
    return iconMap[iconName as keyof typeof iconMap] || <Settings className="h-4 w-4" />;
  };

  const buildPipeline = async () => {
    if (!selectedStrategy || !selectedEnvironment) return;
    
    setIsBuilding(true);
    
    // Simulate pipeline building
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate pipeline components based on strategy and environment
    const strategy = strategies.find(s => s.name === selectedStrategy);
    const environment = environments.find(e => e.name === selectedEnvironment);
    
    if (strategy && environment) {
      const newComponents: PipelineComponent[] = [];
      const newConnections: PipelineConnection[] = [];
      
      // Add components based on strategy type
      if (strategy.type === 'batch') {
        newComponents.push(
          { id: 'data-ingestion', name: 'Data Ingestion', type: 'batch', x: 100, y: 100 },
          { id: 'model-serving', name: 'Model Serving', type: 'batch', x: 300, y: 100 },
          { id: 'storage', name: 'Storage', type: 'batch', x: 500, y: 100 },
          { id: 'monitoring', name: 'Monitoring', type: 'batch', x: 300, y: 200 }
        );
        newConnections.push(
          { from: 'data-ingestion', to: 'model-serving', type: 'data' },
          { from: 'model-serving', to: 'storage', type: 'results' },
          { from: 'model-serving', to: 'monitoring', type: 'metrics' }
        );
      } else if (strategy.type === 'realtime') {
        newComponents.push(
          { id: 'api-gateway', name: 'API Gateway', type: 'realtime', x: 100, y: 100 },
          { id: 'load-balancer', name: 'Load Balancer', type: 'realtime', x: 200, y: 100 },
          { id: 'model-serving', name: 'Model Serving', type: 'realtime', x: 300, y: 100 },
          { id: 'storage', name: 'Storage', type: 'realtime', x: 400, y: 100 },
          { id: 'monitoring', name: 'Monitoring', type: 'realtime', x: 300, y: 200 }
        );
        newConnections.push(
          { from: 'api-gateway', to: 'load-balancer', type: 'request' },
          { from: 'load-balancer', to: 'model-serving', type: 'request' },
          { from: 'model-serving', to: 'storage', type: 'results' },
          { from: 'model-serving', to: 'monitoring', type: 'metrics' }
        );
      } else if (strategy.type === 'streaming') {
        newComponents.push(
          { id: 'data-ingestion', name: 'Data Ingestion', type: 'streaming', x: 100, y: 100 },
          { id: 'model-serving', name: 'Model Serving', type: 'streaming', x: 300, y: 100 },
          { id: 'storage', name: 'Storage', type: 'streaming', x: 500, y: 100 },
          { id: 'monitoring', name: 'Monitoring', type: 'streaming', x: 300, y: 200 }
        );
        newConnections.push(
          { from: 'data-ingestion', to: 'model-serving', type: 'stream' },
          { from: 'model-serving', to: 'storage', type: 'results' },
          { from: 'model-serving', to: 'monitoring', type: 'metrics' }
        );
      }
      
      setPipelineComponents(newComponents);
      setConnections(newConnections);
    }
    
    setIsBuilding(false);
    setCompleted(true);
    
    if (onComplete) {
      onComplete();
    }
  };

  const getStrategyDetails = (strategyName: string) => {
    return strategies.find(s => s.name === strategyName);
  };

  const getEnvironmentDetails = (environmentName: string) => {
    return environments.find(e => e.name === environmentName);
  };

  const getComponentDetails = (componentName: string) => {
    return components.find(c => c.name === componentName);
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Settings className="h-5 w-5 mr-2 text-blue-500" />
          {config?.title || 'Deployment Pipeline Builder'}
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Build and visualize deployment pipelines for different strategies and environments
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strategy and Environment Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Deployment Strategy
            </label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
            >
              <option value="">Choose a strategy...</option>
              {strategies.map((strategy) => (
                <option key={strategy.name} value={strategy.name}>
                  {strategy.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Deployment Environment
            </label>
            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
            >
              <option value="">Choose an environment...</option>
              {environments.map((environment) => (
                <option key={environment.name} value={environment.name}>
                  {environment.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Strategy Details */}
        {selectedStrategy && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
              {getStrategyDetails(selectedStrategy)?.name}
            </h4>
            <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
              {getStrategyDetails(selectedStrategy)?.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Characteristics:</h5>
                <ul className="space-y-1">
                  {Object.entries(getStrategyDetails(selectedStrategy)?.characteristics || {}).map(([key, value]) => (
                    <li key={key} className={`${themeClasses.text}/70`}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Use Cases:</h5>
                <ul className="space-y-1">
                  {getStrategyDetails(selectedStrategy)?.use_cases?.map((useCase, index) => (
                    <li key={index} className={`${themeClasses.text}/70`}>• {useCase}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Environment Details */}
        {selectedEnvironment && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
              {getEnvironmentDetails(selectedEnvironment)?.name}
            </h4>
            <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
              {getEnvironmentDetails(selectedEnvironment)?.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Characteristics:</h5>
                <ul className="space-y-1">
                  {Object.entries(getEnvironmentDetails(selectedEnvironment)?.characteristics || {}).map(([key, value]) => (
                    <li key={key} className={`${themeClasses.text}/70`}>
                      {key}: {value}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Platforms:</h5>
                <ul className="space-y-1">
                  {getEnvironmentDetails(selectedEnvironment)?.platforms?.map((platform, index) => (
                    <li key={index} className={`${themeClasses.text}/70`}>• {platform.name}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Build Pipeline Button */}
        <div className="flex justify-center">
          <Button 
            onClick={buildPipeline}
            disabled={!selectedStrategy || !selectedEnvironment || isBuilding}
            className="px-8"
          >
            <Play className="h-4 w-4 mr-2" />
            {isBuilding ? 'Building Pipeline...' : 'Build Pipeline'}
          </Button>
        </div>

        {/* Pipeline Visualization */}
        {pipelineComponents.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <Activity className="h-5 w-5 mr-2 text-green-500" />
              Generated Pipeline
            </h4>
            
            <div className={`p-6 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} relative`} style={{ minHeight: '300px' }}>
              {/* Pipeline Components */}
              {pipelineComponents.map((component) => (
                <div
                  key={component.id}
                  className={`absolute p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} hover:shadow-md transition-shadow`}
                  style={{ left: component.x, top: component.y, width: '120px' }}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    {getIcon(getComponentDetails(component.name)?.icon || 'settings')}
                    <span className={`text-xs font-medium ${themeClasses.text}`}>
                      {component.name}
                    </span>
                  </div>
                  <div className="text-xs">
                    <Badge variant="outline" className="text-xs">
                      {component.type}
                    </Badge>
                  </div>
                </div>
              ))}
              
              {/* Pipeline Connections */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {connections.map((connection, index) => {
                  const fromComponent = pipelineComponents.find(c => c.id === connection.from);
                  const toComponent = pipelineComponents.find(c => c.id === connection.to);
                  
                  if (!fromComponent || !toComponent) return null;
                  
                  const fromX = fromComponent.x + 60;
                  const fromY = fromComponent.y + 40;
                  const toX = toComponent.x + 60;
                  const toY = toComponent.y + 40;
                  
                  return (
                    <line
                      key={index}
                      x1={fromX}
                      y1={fromY}
                      x2={toX}
                      y2={toY}
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-blue-500"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}
                
                {/* Arrow marker definition */}
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon
                      points="0 0, 10 3.5, 0 7"
                      fill="currentColor"
                      className="text-blue-500"
                    />
                  </marker>
                </defs>
              </svg>
            </div>
          </div>
        )}

        {/* Scenarios */}
        {scenarios.length > 0 && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Deployment Scenarios</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {scenarios.map((scenario, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <h5 className={`font-medium ${themeClasses.text} mb-2`}>{scenario.name}</h5>
                  <p className={`text-sm ${themeClasses.text}/80 mb-2`}>{scenario.description}</p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/60`}>Strategy:</span>
                      <Badge variant="outline" className="text-xs">
                        {scenario.recommended_strategy}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className={`${themeClasses.text}/60`}>Environment:</span>
                      <Badge variant="outline" className="text-xs">
                        {scenario.recommended_environment}
                      </Badge>
                    </div>
                    <p className={`text-xs ${themeClasses.text}/70 mt-2`}>{scenario.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Key Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Start with batch</strong> for non-urgent use cases to prove value.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Use real-time APIs</strong> for user-facing applications requiring low latency.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Consider streaming</strong> for continuous data processing and IoT applications.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Choose environment</strong> based on latency, cost, and scalability requirements.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Pipeline Built Successfully!</h5>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully built a deployment pipeline. Use this as a foundation for your production deployment strategy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
