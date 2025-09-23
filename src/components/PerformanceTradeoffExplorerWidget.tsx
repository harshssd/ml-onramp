'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { PerformanceTradeoffConfig } from '@/types/widget-configs';
import { 
  BarChart3, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Clock,
  Target,
  Zap,
  Brain,
  Activity,
  Settings
} from 'lucide-react';

interface PerformanceTradeoffExplorerWidgetProps {
  onComplete?: () => void;
  config?: PerformanceTradeoffConfig;
}

interface ModelComparison {
  model: string;
  metrics: {
    accuracy: number;
    latency_ms: number;
    model_size_mb: number;
    cost_per_prediction: number;
    interpretability_score: number;
  };
  optimization_applied: string[];
  overall_score: number;
}

export default function PerformanceTradeoffExplorerWidget({ 
  onComplete, 
  config
}: PerformanceTradeoffExplorerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedScenario, setSelectedScenario] = useState<string>('');
  const [selectedOptimizations, setSelectedOptimizations] = useState<string[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [comparisons, setComparisons] = useState<ModelComparison[]>([]);
  const [completed, setCompleted] = useState(false);

  const models = config?.models || [];
  const scenarios = config?.production_scenarios || [];
  const dimensions = config?.dimensions || [];

  const simulateComparison = async (scenarioName: string, optimizations: string[]) => {
    setIsRunning(true);
    
    // Simulate comparison computation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const scenario = scenarios.find(s => s.name === scenarioName);
    if (!scenario) return;
    
    const newComparisons: ModelComparison[] = models.map(model => {
      // Apply optimizations to baseline metrics
      const metrics = { ...model.baseline_metrics };
      const appliedOptimizations: string[] = [];
      
      optimizations.forEach(optName => {
        const optimization = model.optimization_strategies?.find(opt => opt.name === optName);
        if (optimization) {
          Object.keys(optimization.impact).forEach(key => {
            if (key in metrics) {
              metrics[key as keyof typeof metrics] += optimization.impact[key as keyof typeof optimization.impact] as number;
            }
          });
          appliedOptimizations.push(optName);
        }
      });
      
      // Calculate overall score based on scenario priorities
      const overallScore = Object.entries(scenario.priority_weights).reduce((score, [dimension, weight]) => {
        const value = metrics[dimension as keyof typeof metrics] as number;
        const dimensionConfig = dimensions.find(d => d.name === dimension);
        if (!dimensionConfig) return score;
        
        // Normalize value (0-1 scale)
        const normalizedValue = dimensionConfig.higher_is_better ? value : 1 - value;
        return score + (normalizedValue * weight);
      }, 0);
      
      return {
        model: model.name,
        metrics,
        optimization_applied: appliedOptimizations,
        overall_score: overallScore
      };
    });
    
    // Sort by overall score
    newComparisons.sort((a, b) => b.overall_score - a.overall_score);
    
    setComparisons(newComparisons);
    setIsRunning(false);
  };

  const handleStartComparison = () => {
    if (selectedScenario) {
      simulateComparison(selectedScenario, selectedOptimizations);
    }
  };

  const handleCompareAll = async () => {
    if (!selectedScenario) return;
    
    setIsRunning(true);
    
    // Run comparison with all available optimizations
    const allOptimizations = models.flatMap(model => 
      model.optimization_strategies?.map(opt => opt.name) || []
    );
    const uniqueOptimizations = [...new Set(allOptimizations)];
    
    await simulateComparison(selectedScenario, uniqueOptimizations);
    
    setIsRunning(false);
    setCompleted(true);
    
    if (onComplete) {
      onComplete();
    }
  };

  const getBestModel = () => {
    if (comparisons.length === 0) return null;
    return comparisons[0]; // Already sorted by overall score
  };

  const bestModel = getBestModel();

  // Get scenario details from config
  const getScenarioDetails = (scenarioName: string) => {
    return config?.production_scenarios?.find(s => s.name === scenarioName);
  };

  // Get dimension details from config
  const getDimensionDetails = (dimensionName: string) => {
    return config?.dimensions?.find(d => d.name === dimensionName);
  };

  // Get all available optimizations
  const getAllOptimizations = () => {
    const allOpts = models.flatMap(model => 
      model.optimization_strategies?.map(opt => opt.name) || []
    );
    return [...new Set(allOpts)];
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          {config?.title || 'Performance Trade-off Explorer'}
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Compare models across multiple dimensions and find the best trade-offs for production
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Production Scenario
            </label>
            <select
              value={selectedScenario}
              onChange={(e) => setSelectedScenario(e.target.value)}
              className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
            >
              <option value="">Choose a scenario...</option>
              {scenarios.map((scenario) => (
                <option key={scenario.name} value={scenario.name}>
                  {scenario.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Optimization Strategies
            </label>
            <div className="flex flex-wrap gap-2">
              {getAllOptimizations().map((optimization) => (
                <Button
                  key={optimization}
                  variant={selectedOptimizations.includes(optimization) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedOptimizations(prev => 
                      prev.includes(optimization) 
                        ? prev.filter(opt => opt !== optimization)
                        : [...prev, optimization]
                    );
                  }}
                >
                  {optimization}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Scenario Description */}
        {selectedScenario && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
              {getScenarioDetails(selectedScenario)?.name}
            </h4>
            <p className={`text-sm ${themeClasses.text}/80 mb-3`}>
              {getScenarioDetails(selectedScenario)?.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Constraints:</h5>
                <ul className="space-y-1">
                  {Object.entries(getScenarioDetails(selectedScenario)?.constraints || {}).map(([key, value]) => (
                    <li key={key} className={`${themeClasses.text}/70`}>
                      {key}: {value} {getDimensionDetails(key)?.unit || ''}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className={`font-medium ${themeClasses.text} mb-1`}>Priority Weights:</h5>
                <ul className="space-y-1">
                  {Object.entries(getScenarioDetails(selectedScenario)?.priority_weights || {}).map(([key, value]) => (
                    <li key={key} className={`${themeClasses.text}/70`}>
                      {key}: {(value as number * 100).toFixed(0)}%
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button 
            onClick={handleStartComparison}
            disabled={!selectedScenario || isRunning}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Comparing...' : 'Compare Models'}
          </Button>
          <Button 
            onClick={handleCompareAll}
            disabled={!selectedScenario || isRunning}
            variant="outline"
            className="flex-1"
          >
            <Activity className="h-4 w-4 mr-2" />
            Compare All Optimizations
          </Button>
        </div>

        {/* Results */}
        {comparisons.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-green-500" />
              Model Comparison Results
            </h4>
            
            <div className="space-y-4">
              {comparisons.map((comparison, index) => {
                const isBest = index === 0;
                return (
                  <Card key={index} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border} ${
                    isBest ? 'ring-2 ring-green-500' : ''
                  }`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-lg ${themeClasses.text}`}>
                          {comparison.model}
                          {isBest && (
                            <Badge className="ml-2 bg-green-500 text-white">
                              Best Match
                            </Badge>
                          )}
                        </CardTitle>
                        <div className="text-right">
                          <div className={`text-sm ${themeClasses.text}/60`}>Overall Score</div>
                          <div className={`text-lg font-bold ${themeClasses.text}`}>
                            {(comparison.overall_score * 100).toFixed(1)}%
                          </div>
                        </div>
                      </div>
                      {comparison.optimization_applied.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {comparison.optimization_applied.map((opt, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {opt}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                        {Object.entries(comparison.metrics).map(([key, value]) => {
                          const dimension = getDimensionDetails(key);
                          if (!dimension) return null;
                          
                          return (
                            <div key={key} className="text-center">
                              <div className={`${themeClasses.text}/60 text-xs`}>
                                {dimension.display_name}
                              </div>
                              <div className={`font-medium ${themeClasses.text}`}>
                                {typeof value === 'number' 
                                  ? value.toFixed(dimension.unit === '%' ? 1 : 2)
                                  : value
                                }{dimension.unit}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Best Model Summary */}
            {bestModel && (
              <Card className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h5 className={`font-semibold ${themeClasses.text}`}>Recommended Model</h5>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`${themeClasses.text}/60`}>Model:</span>
                      <div className={`font-medium ${themeClasses.text}`}>{bestModel.model}</div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Score:</span>
                      <div className={`font-medium ${themeClasses.text}`}>
                        {(bestModel.overall_score * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Accuracy:</span>
                      <div className={`font-medium ${themeClasses.text}`}>
                        {(bestModel.metrics.accuracy * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Latency:</span>
                      <div className={`font-medium ${themeClasses.text}`}>
                        {bestModel.metrics.latency_ms.toFixed(0)}ms
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Common Trade-offs */}
        {config?.common_trade_offs && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Common Trade-offs</h4>
            <div className="space-y-3">
              {config.common_trade_offs.map((tradeoff, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <h5 className={`font-medium ${themeClasses.text} mb-1`}>{tradeoff.trade_off}</h5>
                      <p className={`text-sm ${themeClasses.text}/80 mb-2`}>{tradeoff.description}</p>
                      <div className="text-xs">
                        <div className={`${themeClasses.text}/60 mb-1`}><strong>Solution:</strong> {tradeoff.solution}</div>
                        <div className={`${themeClasses.text}/60`}><strong>Example:</strong> {tradeoff.example}</div>
                      </div>
                    </div>
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
                <strong>Accuracy isn't everything</strong> - consider latency, cost, and interpretability.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Optimization strategies</strong> can significantly improve production performance.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Choose based on constraints</strong> - different scenarios have different priorities.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Test in production</strong> - real-world performance may differ from benchmarks.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Trade-off Analysis Complete!</h5>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully analyzed model trade-offs for production deployment. Use these insights to choose the best model for your use case.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
