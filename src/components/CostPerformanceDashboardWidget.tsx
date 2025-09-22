'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  BarChart3, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface CostPerformanceDashboardWidgetProps {
  onComplete: () => void;
  config: any;
}

export default function CostPerformanceDashboardWidget({ onComplete, config }: CostPerformanceDashboardWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [isRunning, setIsRunning] = useState(false);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [metrics, setMetrics] = useState({
    cost: 0,
    latency: 0,
    throughput: 0,
    accuracy: 0
  });

  const scenarios = [
    {
      name: 'Cloud GPU',
      cost: 0.15,
      latency: 50,
      throughput: 1000,
      accuracy: 0.95,
      color: 'blue'
    },
    {
      name: 'Cloud CPU',
      cost: 0.05,
      latency: 200,
      throughput: 500,
      accuracy: 0.92,
      color: 'green'
    },
    {
      name: 'Edge Device',
      cost: 0.02,
      latency: 100,
      throughput: 200,
      accuracy: 0.88,
      color: 'purple'
    }
  ];

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setCurrentScenario((prev) => (prev + 1) % scenarios.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    if (scenarios[currentScenario]) {
      setMetrics(scenarios[currentScenario]);
    }
  }, [currentScenario]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentScenario(0);
    setMetrics(scenarios[0]);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-500 bg-blue-50 border-blue-200',
      green: 'text-green-500 bg-green-50 border-green-200',
      purple: 'text-purple-500 bg-purple-50 border-purple-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className={`${themeClasses.background} p-6 rounded-lg`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Cost Performance Dashboard
        </h3>
        <p className={`${themeClasses.text}/70`}>
          Analyze trade-offs between cost, latency, throughput, and accuracy across different deployment options.
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
          Start Analysis
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

      {/* Current Scenario */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <Settings className="h-5 w-5 mr-2 text-blue-500" />
            Current Scenario: {scenarios[currentScenario]?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>Cost</span>
              </div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                ${metrics.cost.toFixed(2)}
              </div>
              <div className={`text-xs ${themeClasses.text}/70`}>per prediction</div>
            </div>

            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-4 w-4 text-blue-500" />
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
                <span className={`text-sm font-medium ${themeClasses.text}`}>Throughput</span>
              </div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {metrics.throughput}
              </div>
              <div className={`text-xs ${themeClasses.text}/70`}>predictions/sec</div>
            </div>

            <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <div className="flex items-center space-x-2 mb-2">
                <BarChart3 className="h-4 w-4 text-orange-500" />
                <span className={`text-sm font-medium ${themeClasses.text}`}>Accuracy</span>
              </div>
              <div className={`text-2xl font-bold ${themeClasses.text}`}>
                {(metrics.accuracy * 100).toFixed(1)}%
              </div>
              <div className={`text-xs ${themeClasses.text}/70`}>model accuracy</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scenarios Comparison */}
      <Card className={`${themeClasses.card} backdrop-blur-sm`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
            Deployment Options Comparison
          </CardTitle>
          <CardDescription className={`${themeClasses.text}/70`}>
            Compare different deployment strategies and their trade-offs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {scenarios.map((scenario, index) => (
              <div
                key={scenario.name}
                className={`p-4 rounded-lg border ${
                  index === currentScenario 
                    ? `${getColorClasses(scenario.color)} border-2` 
                    : `${themeClasses.card.replace('/10', '/5')} ${themeClasses.border}`
                } transition-all duration-300`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className={`font-semibold ${themeClasses.text}`}>
                    {scenario.name}
                  </h4>
                  {index === currentScenario && (
                    <Badge variant="outline" className="text-xs">
                      Current
                    </Badge>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>
                      ${scenario.cost.toFixed(2)}
                    </div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Cost</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>
                      {scenario.latency}ms
                    </div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Latency</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>
                      {scenario.throughput}
                    </div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Throughput</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-lg font-bold ${themeClasses.text}`}>
                      {(scenario.accuracy * 100).toFixed(1)}%
                    </div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Accuracy</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Completion Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={onComplete}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
        >
          Complete Analysis
        </Button>
      </div>
    </div>
  );
}
