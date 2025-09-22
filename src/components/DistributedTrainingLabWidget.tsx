'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Server, 
  Clock, 
  TrendingUp, 
  Users,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface DistributedTrainingLabWidgetProps {
  onComplete: () => void;
  config: any;
}

export default function DistributedTrainingLabWidget({ onComplete, config }: DistributedTrainingLabWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [isRunning, setIsRunning] = useState(false);
  const [clusterSize, setClusterSize] = useState(1);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [metrics, setMetrics] = useState({
    trainingTime: 0,
    accuracy: 0,
    speedup: 1
  });

  const clusterSizes = [1, 2, 4, 8];

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setTrainingProgress(prev => {
          if (prev >= 100) {
            setIsRunning(false);
            return 100;
          }
          return prev + 2;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  useEffect(() => {
    // Simulate metrics based on cluster size
    const baseTime = 300; // 5 minutes
    const trainingTime = Math.round(baseTime / clusterSize);
    const accuracy = Math.min(0.95, 0.85 + (clusterSize * 0.01));
    const speedup = clusterSize;

    setMetrics({
      trainingTime,
      accuracy: Math.round(accuracy * 100) / 100,
      speedup
    });
  }, [clusterSize]);

  const handleStart = () => {
    setIsRunning(true);
    setTrainingProgress(0);
  };

  const handleStop = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTrainingProgress(0);
    setClusterSize(1);
  };

  return (
    <div className={`${themeClasses.background} p-6 rounded-lg`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Distributed Training Lab
        </h3>
        <p className={`${themeClasses.text}/70`}>
          Experiment with different cluster sizes and observe the impact on training performance.
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
          Start Training
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

      {/* Cluster Size Selection */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text}`}>
            Cluster Size
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {clusterSizes.map((size) => (
              <div
                key={size}
                className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                  clusterSize === size 
                    ? 'text-blue-500 bg-blue-50 border-blue-200 border-2' 
                    : `${themeClasses.card.replace('/10', '/5')} ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')}`
                }`}
                onClick={() => setClusterSize(size)}
              >
                <div className="text-center">
                  <Server className="h-8 w-8 mx-auto mb-2" />
                  <div className={`text-lg font-bold ${themeClasses.text}`}>
                    {size}
                  </div>
                  <div className={`text-xs ${themeClasses.text}/70`}>
                    {size === 1 ? 'Single Node' : `${size} Nodes`}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Progress */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Training Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${themeClasses.text}`}>
                Progress
              </span>
              <span className={`text-sm ${themeClasses.text}/70`}>
                {trainingProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${trainingProgress}%` }}
              ></div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="h-4 w-4 text-green-500" />
                  <span className={`text-sm font-medium ${themeClasses.text}`}>Time</span>
                </div>
                <div className={`text-lg font-bold ${themeClasses.text}`}>
                  {metrics.trainingTime}m
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <TrendingUp className="h-4 w-4 text-purple-500" />
                  <span className={`text-sm font-medium ${themeClasses.text}`}>Accuracy</span>
                </div>
                <div className={`text-lg font-bold ${themeClasses.text}`}>
                  {(metrics.accuracy * 100).toFixed(1)}%
                </div>
              </div>
              
              <div className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <Server className="h-4 w-4 text-orange-500" />
                  <span className={`text-sm font-medium ${themeClasses.text}`}>Speedup</span>
                </div>
                <div className={`text-lg font-bold ${themeClasses.text}`}>
                  {metrics.speedup}x
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
          Complete Lab
        </Button>
      </div>
    </div>
  );
}
