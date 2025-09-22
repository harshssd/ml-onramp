'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { ModelMonitoringConfig } from '@/types/widget-configs';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  RefreshCw,
  Bell,
  Target,
  BarChart3
} from 'lucide-react';

interface ModelMonitoringDashboardWidgetProps {
  onComplete?: () => void;
  config?: ModelMonitoringConfig;
}

export default function ModelMonitoringDashboardWidget({ 
  onComplete, 
  config
}: ModelMonitoringDashboardWidgetWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedDimension, setSelectedDimension] = useState<string>('overall');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [completed, setCompleted] = useState(false);

  const metrics = config?.metrics || [];
  const dimensions = config?.dimensions || [];
  const driftMetrics = config?.drift_metrics || [];
  const fairnessMetrics = config?.fairness_metrics || [];
  const alerts = config?.alerts || [];
  const timeSeriesData = config?.time_series_data || {};

  const getStatusColor = (status: string) => {
    const colorMap = {
      good: 'text-green-500',
      warning: 'text-yellow-500',
      alert: 'text-orange-500',
      critical: 'text-red-500'
    };
    return colorMap[status as keyof typeof colorMap] || 'text-gray-500';
  };

  const getStatusIcon = (status: string) => {
    const iconMap = {
      good: <CheckCircle className="h-4 w-4" />,
      warning: <AlertTriangle className="h-4 w-4" />,
      alert: <AlertTriangle className="h-4 w-4" />,
      critical: <AlertTriangle className="h-4 w-4" />
    };
    return iconMap[status as keyof typeof iconMap] || <Minus className="h-4 w-4" />;
  };

  const getTrendIcon = (trend: string) => {
    const iconMap = {
      increasing: <TrendingUp className="h-4 w-4" />,
      decreasing: <TrendingDown className="h-4 w-4" />,
      stable: <Minus className="h-4 w-4" />
    };
    return iconMap[trend as keyof typeof iconMap] || <Minus className="h-4 w-4" />;
  };

  const getTrendColor = (trend: string, higherIsBetter: boolean) => {
    if (trend === 'stable') return 'text-gray-500';
    if (higherIsBetter) {
      return trend === 'increasing' ? 'text-green-500' : 'text-red-500';
    } else {
      return trend === 'increasing' ? 'text-red-500' : 'text-green-500';
    }
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    
    // Simulate data refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsRefreshing(false);
  };

  const getDimensionMetrics = () => {
    const dimension = dimensions.find(d => d.name === selectedDimension);
    if (!dimension) return metrics;
    
    return metrics.filter(metric => 
      dimension.metrics.includes(metric.name)
    );
  };

  const getActiveAlerts = () => {
    return alerts.filter(alert => alert.status === 'active');
  };

  const getCriticalAlerts = () => {
    return alerts.filter(alert => alert.severity === 'critical' && alert.status === 'active');
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <Activity className="h-5 w-5 mr-2 text-blue-500" />
              {config?.title || 'Model Monitoring Dashboard'}
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Real-time monitoring of model performance and health
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={refreshData}
              disabled={isRefreshing}
              size="sm"
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
            <Badge variant="outline" className="text-xs">
              {config?.refresh_rate || 'Real-time'}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Alert Summary */}
        {alerts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <CardContent className="p-4 text-center">
                <Bell className="h-6 w-6 text-blue-500 mx-auto mb-2" />
                <h5 className={`font-semibold ${themeClasses.text} mb-1`}>Active Alerts</h5>
                <p className={`text-2xl font-bold ${themeClasses.text}`}>
                  {getActiveAlerts().length}
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <CardContent className="p4 text-center">
                <AlertTriangle className="h-6 w-6 text-red-500 mx-auto mb-2" />
                <h5 className={`font-semibold ${themeClasses.text} mb-1`}>Critical Alerts</h5>
                <p className={`text-2xl font-bold text-red-500`}>
                  {getCriticalAlerts().length}
                </p>
              </CardContent>
            </Card>
            
            <Card className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <CardContent className="p-4 text-center">
                <Target className="h-6 w-6 text-green-500 mx-auto mb-2" />
                <h5 className={`font-semibold ${themeClasses.text} mb-1`}>System Status</h5>
                <p className={`text-lg font-bold ${getCriticalAlerts().length > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {getCriticalAlerts().length > 0 ? 'Degraded' : 'Healthy'}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Dimension Selector */}
        <div>
          <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
            View Dimension
          </label>
          <div className="flex space-x-2">
            {dimensions.map((dimension) => (
              <Button
                key={dimension.name}
                variant={selectedDimension === dimension.name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDimension(dimension.name)}
              >
                {dimension.display_name}
              </Button>
            ))}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getDimensionMetrics().map((metric) => (
            <Card key={metric.name} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h5 className={`font-semibold ${themeClasses.text}`}>
                    {metric.display_name}
                  </h5>
                  <div className="flex items-center space-x-1">
                    {getStatusIcon(metric.status)}
                    <span className={`text-sm ${getStatusColor(metric.status)}`}>
                      {metric.status}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={`${themeClasses.text}/60`}>Current:</span>
                    <span className={`font-medium ${themeClasses.text}`}>
                      {metric.current_value}{metric.unit}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={`${themeClasses.text}/60`}>Baseline:</span>
                    <span className={`${themeClasses.text}/80`}>
                      {metric.baseline_value}{metric.unit}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className={`${themeClasses.text}/60`}>Threshold:</span>
                    <span className={`${themeClasses.text}/80`}>
                      {metric.threshold}{metric.unit}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className={`${themeClasses.text}/60`}>Trend:</span>
                    <div className="flex items-center space-x-1">
                      <span className={getTrendColor(metric.trend, metric.higher_is_better)}>
                        {getTrendIcon(metric.trend)}
                      </span>
                      <span className={`${themeClasses.text}/80`}>
                        {metric.trend}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Drift Metrics */}
        {driftMetrics.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <BarChart3 className="h-5 w-5 mr-2 text-orange-500" />
              Drift Detection
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {driftMetrics.map((drift) => (
                <Card key={drift.name} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className={`font-semibold ${themeClasses.text}`}>
                        {drift.display_name}
                      </h5>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(drift.status)}
                        <span className={`text-sm ${getStatusColor(drift.status)}`}>
                          {drift.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/60`}>Method:</span>
                        <span className={`${themeClasses.text}/80`}>{drift.method}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/60`}>Score:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {drift.current_value}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/60`}>Threshold:</span>
                        <span className={`${themeClasses.text}/80`}>
                          {drift.threshold}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/60`}>Features:</span>
                        <span className={`${themeClasses.text}/80`}>
                          {drift.features.join(', ')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Fairness Metrics */}
        {fairnessMetrics.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-purple-500" />
              Fairness Metrics
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fairnessMetrics.map((fairness) => (
                <Card key={fairness.name} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className={`font-semibold ${themeClasses.text}`}>
                        {fairness.display_name}
                      </h5>
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(fairness.status)}
                        <span className={`text-sm ${getStatusColor(fairness.status)}`}>
                          {fairness.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/60`}>Current:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {fairness.current_value}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/60`}>Baseline:</span>
                        <span className={`${themeClasses.text}/80`}>
                          {fairness.baseline_value}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/60`}>Threshold:</span>
                        <span className={`${themeClasses.text}/80`}>
                          {fairness.threshold}
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/60`}>Subgroups:</span>
                        <span className={`${themeClasses.text}/80`}>
                          {fairness.subgroups.join(', ')}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Active Alerts */}
        {getActiveAlerts().length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <Bell className="h-5 w-5 mr-2 text-red-500" />
              Active Alerts
            </h4>
            
            <div className="space-y-2">
              {getActiveAlerts().map((alert) => (
                <Card key={alert.id} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} ${
                  alert.severity === 'critical' ? 'border-red-500' : 
                  alert.severity === 'alert' ? 'border-orange-500' : 
                  'border-yellow-500'
                }`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className={`h-4 w-4 ${
                          alert.severity === 'critical' ? 'text-red-500' : 
                          alert.severity === 'alert' ? 'text-orange-500' : 
                          'text-yellow-500'
                        }`} />
                        <span className={`font-medium ${themeClasses.text}`}>
                          {alert.message}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {alert.severity}
                        </Badge>
                        <span className={`text-xs ${themeClasses.text}/60`}>
                          {new Date(alert.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
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
                <strong>Monitor continuously</strong> to detect performance degradation early.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Set appropriate thresholds</strong> based on business requirements.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Investigate drift alerts</strong> promptly to prevent model degradation.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Use fairness metrics</strong> to ensure equitable model performance.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Monitoring Dashboard Complete!</h5>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully set up model monitoring. Use these insights to maintain model health in production.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
