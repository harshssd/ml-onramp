'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { CVVisualizerConfig } from '@/types/widget-configs';
import { 
  BarChart3, 
  Play, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  Clock,
  Target,
  Users,
  Activity
} from 'lucide-react';

interface CVVisualizerWidgetProps {
  onComplete?: () => void;
  config?: CVVisualizerConfig;
}

interface CVResult {
  strategy: string;
  model: string;
  folds: number;
  scores: number[];
  meanScore: number;
  stdScore: number;
  timeElapsed: number;
}

export default function CVVisualizerWidget({ 
  onComplete, 
  config
}: CVVisualizerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedModel, setSelectedModel] = useState<string>('');
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [selectedFolds, setSelectedFolds] = useState<number>(5);
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<CVResult[]>([]);
  const [completed, setCompleted] = useState(false);

  const models = config?.models || [];
  const strategies = config?.cv_strategies || [];
  const metrics = config?.metrics || ['accuracy'];

  const simulateCV = async (modelName: string, strategyName: string, folds: number) => {
    setIsRunning(true);
    
    // Simulate CV computation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate realistic CV scores
    const baseScore = 0.75 + Math.random() * 0.2; // 75-95% base accuracy
    const scores = Array.from({ length: folds }, () => 
      baseScore + (Math.random() - 0.5) * 0.1 // Add some variance
    );
    
    const meanScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const stdScore = Math.sqrt(scores.reduce((sum, score) => sum + Math.pow(score - meanScore, 2), 0) / scores.length);
    
    const newResult: CVResult = {
      strategy: strategyName,
      model: modelName,
      folds,
      scores,
      meanScore,
      stdScore,
      timeElapsed: Math.random() * 5 + 1 // 1-6 seconds
    };
    
    setResults(prev => [...prev, newResult]);
    setIsRunning(false);
  };

  const handleStartCV = () => {
    if (selectedModel && selectedStrategy) {
      simulateCV(selectedModel, selectedStrategy, selectedFolds);
    }
  };

  const handleCompareAll = async () => {
    if (!selectedModel) return;
    
    setIsRunning(true);
    
    // Run all strategies
    for (const strategy of strategies) {
      const folds = Array.isArray(strategy.folds) ? strategy.folds[0] : strategy.folds;
      await simulateCV(selectedModel, strategy.name, folds);
      await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between strategies
    }
    
    setIsRunning(false);
    setCompleted(true);
    
    if (onComplete) {
      onComplete();
    }
  };

  const getBestResult = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) => 
      current.meanScore > best.meanScore ? current : best
    );
  };

  const bestResult = getBestResult();

  // Get strategy details from config
  const getStrategyDetails = (strategyName: string) => {
    return config?.cv_strategies?.find(s => s.name === strategyName);
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          {config?.title || 'Cross-Validation Visualizer'}
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Compare different cross-validation strategies and visualize fold stability
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Select Model
            </label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
            >
              <option value="">Choose a model...</option>
              {models.map((model) => (
                <option key={model.name} value={model.name}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              CV Strategy
            </label>
            <select
              value={selectedStrategy}
              onChange={(e) => setSelectedStrategy(e.target.value)}
              className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
            >
              <option value="">Choose strategy...</option>
              {strategies.map((strategy) => (
                <option key={strategy.name} value={strategy.name}>
                  {strategy.display_name || strategy.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
              Number of Folds
            </label>
            <select
              value={selectedFolds}
              onChange={(e) => setSelectedFolds(Number(e.target.value))}
              className={`w-full p-2 rounded-lg border ${themeClasses.border} ${themeClasses.background} ${themeClasses.text}`}
            >
              <option value={3}>3 folds</option>
              <option value={5}>5 folds</option>
              <option value={10}>10 folds</option>
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <Button 
            onClick={handleStartCV}
            disabled={!selectedModel || !selectedStrategy || isRunning}
            className="flex-1"
          >
            <Play className="h-4 w-4 mr-2" />
            {isRunning ? 'Running CV...' : 'Run Cross-Validation'}
          </Button>
          <Button 
            onClick={handleCompareAll}
            disabled={!selectedModel || isRunning}
            variant="outline"
            className="flex-1"
          >
            <Activity className="h-4 w-4 mr-2" />
            Compare All Strategies
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text} flex items-center`}>
              <Target className="h-5 w-5 mr-2 text-green-500" />
              Cross-Validation Results
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result, index) => {
                const strategyDetails = getStrategyDetails(result.strategy);
                return (
                  <Card key={index} className={`${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className={`text-sm ${themeClasses.text}`}>
                          {result.model}
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                          {result.strategy}
                        </Badge>
                      </div>
                      <CardDescription className={`text-xs ${themeClasses.text}/70`}>
                        {strategyDetails?.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/80`}>Mean Score:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {(result.meanScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/80`}>Std Dev:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {(result.stdScore * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/80`}>Folds:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {result.folds}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className={`${themeClasses.text}/80`}>Time:</span>
                        <span className={`font-medium ${themeClasses.text}`}>
                          {result.timeElapsed.toFixed(1)}s
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Best Result */}
            {bestResult && (
              <Card className={`bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <h5 className={`font-semibold ${themeClasses.text}`}>Best Result</h5>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className={`${themeClasses.text}/60`}>Model:</span>
                      <div className={`font-medium ${themeClasses.text}`}>{bestResult.model}</div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Strategy:</span>
                      <div className={`font-medium ${themeClasses.text}`}>{bestResult.strategy}</div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Score:</span>
                      <div className={`font-medium ${themeClasses.text}`}>
                        {(bestResult.meanScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className={`${themeClasses.text}/60`}>Stability:</span>
                      <div className={`font-medium ${themeClasses.text}`}>
                        {(bestResult.stdScore * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* CV Scenarios */}
        {config?.scenarios && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>When to Use Each Strategy</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {config.scenarios.map((scenario, index) => (
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
                      <span className={`${themeClasses.text}/60`}>Folds:</span>
                      <span className={`${themeClasses.text}/80`}>{scenario.recommended_folds}</span>
                    </div>
                    <p className={`text-xs ${themeClasses.text}/70 mt-2`}>{scenario.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Common Pitfalls */}
        {config?.common_pitfalls && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Common Pitfalls to Avoid</h4>
            <div className="space-y-3">
              {config.common_pitfalls.map((pitfall, index) => (
                <div key={index} className={`p-3 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
                  <div className="flex items-start space-x-2">
                    <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <h5 className={`font-medium ${themeClasses.text} mb-1`}>{pitfall.pitfall}</h5>
                      <p className={`text-sm ${themeClasses.text}/80 mb-2`}>{pitfall.description}</p>
                      <div className="text-xs">
                        <div className={`${themeClasses.text}/60 mb-1`}><strong>Solution:</strong> {pitfall.solution}</div>
                        <div className={`${themeClasses.text}/60`}><strong>Example:</strong> {pitfall.example}</div>
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
                <strong>Stratified CV</strong> is essential for imbalanced datasets to maintain class distribution.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Time-series CV</strong> prevents data leakage by respecting temporal order.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>More folds</strong> give more reliable estimates but are computationally expensive.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Check fold variance</strong> to assess model stability and reliability.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h5 className={`font-semibold ${themeClasses.text}`}>Cross-Validation Complete!</h5>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully compared different CV strategies. Use these insights to choose the right validation approach for your models.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
