'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  TrendingUp, 
  TrendingDown, 
  Server, 
  Users, 
  Clock,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ScalingStrategySimulatorWidgetProps {
  onComplete: () => void;
  config: any;
}

export default function ScalingStrategySimulatorWidget({ onComplete, config }: ScalingStrategySimulatorWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [isRunning, setIsRunning] = useState(false);
  const [currentUsers, setCurrentUsers] = useState(100);
  const [scalingStrategy, setScalingStrategy] = useState<'vertical' | 'horizontal'>('vertical');
  const [metrics, setMetrics] = useState({
    latency: 50,
    cost: 100,
    instances: 1,
    cpuUsage: 30
  });

  const strategies = {
    vertical: {
      name: 'Vertical Scaling',
      description: 'Scale up by adding more CPU/RAM to existing instances',
      icon: TrendingUp,
      color: 'blue'
    },
    horizontal: {
      name: 'Horizontal Scaling',
      description: 'Scale out by adding more instances',
      icon: TrendingDown,
      color: 'green'
    }
  };

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentUsers(prev => Math.min(prev + Math.floor(Math.random() * 50), 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    // Simulate metrics based on users and strategy
    const baseLatency = scalingStrategy === 'vertical' ? 50 : 30;
    const latency = baseLatency + (currentUsers / 20);
    
    const baseCost = scalingStrategy === 'vertical' ? 100 : 50;
    const cost = baseCost + (currentUsers / 10);
    
    const instances = scalingStrategy === 'vertical' ? 1 : Math.ceil(currentUsers / 200);
    const cpuUsage = Math.min(30 + (currentUsers / 15), 100);

    setMetrics({
      latency: Math.round(latency),
      cost: Math.round(cost),
      instances,
      cpuUsage: Math.round(cpuUsage)
    });
  }, [currentUsers, scalingStrategy]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentUsers(100);
    setScalingStrategy('vertical');
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-500 bg-blue-50 border-blue-200',
      green: 'text-green-500 bg-green-50 border-green-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const currentStrategy = strategies[scalingStrategy];

  return (
    <div className={`${themeClasses.background} p-6 rounded-lg`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Scaling Strategy Simulator
        </h3>
        <p className={`${themeClasses.text}/70`}>
          Simulate different scaling strategies and observe their impact on performance and cost.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={handleStart}
          disabled={isRunning}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Simulation
        </Button>
        <Button
          onClick={handleStop}
          disabled={!isRunning}
          variant="outline"
        >
          <Pause className="h-4 w-4 mr-2" />
          Pause
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Strategy Selection */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text}`}>
            Scaling Strategy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(strategies).map(([key, strategy]) => {
              const IconComponent = strategy.icon;
              const isSelected = scalingStrategy === key;
              
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? `${getColorClasses(strategy.color)} border-2` 
                      : `${themeClasses.card.replace('/10', '/5')} ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')}`
                  }`}
                  onClick={() => setScalingStrategy(key as 'vertical' | 'horizontal')}
                >
                  <div className="flex items-center space-x-3 mb-2">
                    <IconComponent className="h-6 w-6" />
                    <h4 className={`font-semibold ${themeClasses.text}`}>
                      {strategy.name}
                    </h4>
                  </div>
                  <p className={`text-sm ${themeClasses.text}/70`}>
                    {strategy.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Current Metrics */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <Server className="h-5 w-5 mr-2 text-blue-500" />
            Current Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>Users</span>
              </div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {currentUsers}
              </div>
              <div className={`text-xs ${themeClasses.text}/70`}>concurrent</div>
            </div>

            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-green-500" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>Latency</span>
              </div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {metrics.latency}ms
              </div>
              <div className={`text-xs ${themeClasses.text}/70`}>average</div>
            </div>

            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4 text-purple-500" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>Cost</span>
              </div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                ${metrics.cost}
              </div>
              <div className={`text-xs ${themeClasses.text}/70`}>per hour</div>
            </div>

            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Server className="h-4 w-4 text-orange-500" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>Instances</span>
              </div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {metrics.instances}
              </div>
              <div className={`text-xs ${themeClasses.text}/70`}>active</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strategy Comparison */}
      <Card className={`${themeClasses.card} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Strategy Analysis
          </CardTitle>
          <CardDescription className={`${themeClasses.text}/70`}>
            Current strategy: {currentStrategy.name}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${getColorClasses(currentStrategy.color)} border`}>
              <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
                {currentStrategy.name}
              </h4>
              <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
                {currentStrategy.description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className={`text-lg font-bold ${themeClasses.text}`}>
                    {metrics.latency}ms
                  </div>
                  <div className={`text-xs ${themeClasses.text}/70`}>Latency</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${themeClasses.text}`}>
                    ${metrics.cost}
                  </div>
                  <div className={`text-xs ${themeClasses.text}/70`}>Cost/Hour</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${themeClasses.text}`}>
                    {metrics.instances}
                  </div>
                  <div className={`text-xs ${themeClasses.text}/70`}>Instances</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${themeClasses.text}`}>
                    {metrics.cpuUsage}%
                  </div>
                  <div className={`text-xs ${themeClasses.text}/70`}>CPU Usage</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completion Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={onComplete}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
        >
          Complete Simulation
        </Button>
      </div>
    </div>
  );
}
