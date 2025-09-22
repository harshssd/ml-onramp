'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Monitor, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Clock,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

interface ModelMonitoringCapstoneWidgetProps {
  onComplete: () => void;
  config: any;
}

export default function ModelMonitoringCapstoneWidget({ onComplete, config }: ModelMonitoringCapstoneWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [alerts, setAlerts] = useState<any[]>([]);

  const metrics = {
    accuracy: 0.95,
    latency: 45,
    throughput: 1200,
    errorRate: 0.02
  };

  const alertThresholds = {
    accuracy: 0.90,
    latency: 100,
    throughput: 800,
    errorRate: 0.05
  };

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        setCurrentTime(prev => prev + 1);
        
        // Simulate random metric fluctuations
        const randomAlert = Math.random();
        if (randomAlert < 0.1) { // 10% chance of alert
          const alertTypes = ['accuracy', 'latency', 'throughput', 'errorRate'];
          const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
          const newAlert = {
            id: Date.now(),
            type: alertType,
            message: `${alertType} threshold exceeded`,
            timestamp: new Date().toLocaleTimeString(),
            severity: 'warning'
          };
          setAlerts(prev => [...prev, newAlert]);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const handleStartMonitoring = () => {
    setIsMonitoring(true);
    setCurrentTime(0);
    setAlerts([]);
  };

  const handleStopMonitoring = () => {
    setIsMonitoring(false);
  };

  const handleReset = () => {
    setIsMonitoring(false);
    setCurrentTime(0);
    setAlerts([]);
  };

  const getMetricStatus = (metric: string, value: number, threshold: number) => {
    if (metric === 'accuracy' || metric === 'throughput') {
      return value >= threshold ? 'good' : 'warning';
    } else {
      return value <= threshold ? 'good' : 'warning';
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'good' ? 'text-green-500' : 'text-red-500';
  };

  const getStatusIcon = (status: string) => {
    return status === 'good' ? TrendingUp : TrendingDown;
  };

  return (
    <div className={`${themeClasses.background} p-6 rounded-lg`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Model Monitoring Dashboard
        </h3>
        <p className={`${themeClasses.text}/70`}>
          Monitor your deployed ML model in real-time and track key performance metrics.
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4 mb-6">
        <Button
          onClick={handleStartMonitoring}
          disabled={isMonitoring}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          <Play className="h-4 w-4 mr-2" />
          Start Monitoring
        </Button>
        <Button
          onClick={handleStopMonitoring}
          disabled={!isMonitoring}
          variant="outline"
        >
          <Pause className="h-4 w-4 mr-2" />
          Stop Monitoring
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Monitoring Status */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <Monitor className="h-5 w-5 mr-2 text-blue-500" />
            Monitoring Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${isMonitoring ? 'bg-green-500' : 'bg-gray-400'}`}></div>
              <span className={`${themeClasses.text}`}>
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
              </span>
            </div>
            <div className={`text-sm ${themeClasses.text}/70`}>
              Runtime: {Math.floor(currentTime / 60)}:{(currentTime % 60).toString().padStart(2, '0')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Dashboard */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <TrendingUp className="h-5 w-5 mr-2 text-blue-500" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(metrics).map(([metric, value]) => {
              const threshold = alertThresholds[metric as keyof typeof alertThresholds];
              const status = getMetricStatus(metric, value, threshold);
              const StatusIcon = getStatusIcon(status);
              
              return (
                <div
                  key={metric}
                  className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-sm font-medium ${themeClasses.text}`}>
                      {metric.charAt(0).toUpperCase() + metric.slice(1)}
                    </span>
                    <StatusIcon className={`h-4 w-4 ${getStatusColor(status)}`} />
                  </div>
                  <div className={`text-2xl font-bold ${themeClasses.text}`}>
                    {metric === 'accuracy' || metric === 'errorRate' 
                      ? `${(value * 100).toFixed(1)}%` 
                      : metric === 'latency' 
                      ? `${value}ms` 
                      : value.toLocaleString()}
                  </div>
                  <div className={`text-xs ${themeClasses.text}/70`}>
                    Threshold: {metric === 'accuracy' || metric === 'errorRate' 
                      ? `${(threshold * 100).toFixed(1)}%` 
                      : metric === 'latency' 
                      ? `${threshold}ms` 
                      : threshold.toLocaleString()}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
            Alerts ({alerts.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className={`text-center py-8 ${themeClasses.text}/70`}>
              No alerts at this time
            </div>
          ) : (
            <div className="space-y-3">
              {alerts.slice(-5).reverse().map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border ${
                    alert.severity === 'critical' 
                      ? 'text-red-500 bg-red-50 border-red-200' 
                      : 'text-orange-500 bg-orange-50 border-orange-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">{alert.message}</span>
                    </div>
                    <span className="text-sm">{alert.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Completion Button */}
      <div className="mt-6 text-center">
        <Button
          onClick={onComplete}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
        >
          Complete Monitoring
        </Button>
      </div>
    </div>
  );
}
