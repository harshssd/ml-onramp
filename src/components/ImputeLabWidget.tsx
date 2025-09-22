'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { ImputeLabConfig } from '@/types/widget-configs';
import { 
  Database, 
  Settings, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw
} from 'lucide-react';

interface ImputeLabWidgetProps {
  onComplete?: () => void;
  config?: ImputeLabConfig;
}

interface ImputationResult {
  strategy: string;
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  description: string;
  pros: string[];
  cons: string[];
}

export default function ImputeLabWidget({ 
  onComplete, 
  config
}: ImputeLabWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [selectedStrategy, setSelectedStrategy] = useState<string>('');
  const [results, setResults] = useState<ImputationResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [completed, setCompleted] = useState(false);

  const imputationStrategies = [
    {
      id: 'mean',
      name: 'Mean Imputation',
      description: 'Fill missing values with the mean of the column',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'blue',
      pros: ['Simple and fast', 'Preserves mean of the data'],
      cons: ['Reduces variance', 'Can create artificial clusters']
    },
    {
      id: 'median',
      name: 'Median Imputation',
      description: 'Fill missing values with the median of the column',
      icon: <BarChart3 className="h-5 w-5" />,
      color: 'green',
      pros: ['Robust to outliers', 'Preserves median'],
      cons: ['Still reduces variance', 'May not capture relationships']
    },
    {
      id: 'most_frequent',
      name: 'Most Frequent',
      description: 'Fill missing values with the most common value',
      icon: <Database className="h-5 w-5" />,
      color: 'purple',
      pros: ['Good for categorical data', 'Preserves mode'],
      cons: ['Can create bias', 'Ignores other values']
    },
    {
      id: 'indicator',
      name: 'Missing Indicator',
      description: 'Add binary flag for missing values + impute',
      icon: <Settings className="h-5 w-5" />,
      color: 'orange',
      pros: ['Preserves missingness signal', 'Often improves performance'],
      cons: ['Increases dimensionality', 'More complex']
    }
  ];

  const simulateImputation = (strategy: string): ImputationResult => {
    // Simulate different performance based on strategy
    const baseMetrics = {
      mean: { accuracy: 0.78, precision: 0.76, recall: 0.78, f1: 0.77 },
      median: { accuracy: 0.79, precision: 0.77, recall: 0.79, f1: 0.78 },
      most_frequent: { accuracy: 0.75, precision: 0.73, recall: 0.75, f1: 0.74 },
      indicator: { accuracy: 0.82, precision: 0.80, recall: 0.82, f1: 0.81 }
    };

    const strategyInfo = imputationStrategies.find(s => s.id === strategy);
    const metrics = baseMetrics[strategy as keyof typeof baseMetrics] || baseMetrics.mean;

    return {
      strategy: strategyInfo?.name || strategy,
      ...metrics,
      description: strategyInfo?.description || '',
      pros: strategyInfo?.pros || [],
      cons: strategyInfo?.cons || []
    };
  };

  const handleRunImputation = async () => {
    if (!selectedStrategy) return;

    setIsRunning(true);
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const result = simulateImputation(selectedStrategy);
    setResults(prev => [...prev, result]);
    setIsRunning(false);
  };

  const handleCompareAll = async () => {
    setIsRunning(true);
    
    // Simulate running all strategies
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const allResults = strategies.map(strategy => simulateImputation(strategy));
    setResults(allResults);
    setIsRunning(false);
    setCompleted(true);
    
    if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    setResults([]);
    setSelectedStrategy('');
    setCompleted(false);
  };

  const getBestStrategy = () => {
    if (results.length === 0) return null;
    return results.reduce((best, current) => 
      current.f1 > best.f1 ? current : best
    );
  };

  const bestStrategy = getBestStrategy();

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Database className="h-5 w-5 mr-2 text-blue-500" />
          Imputation Lab
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Experiment with different imputation strategies and compare their impact on model performance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strategy Selection */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Select Imputation Strategy</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {imputationStrategies.map((strategy) => (
              <div
                key={strategy.id}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedStrategy === strategy.id
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
                onClick={() => setSelectedStrategy(strategy.id)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${
                    selectedStrategy === strategy.id ? 'bg-blue-500' : 'bg-gray-400'
                  } text-white`}>
                    {strategy.icon}
                  </div>
                  <div className="flex-1">
                    <h5 className={`font-medium ${themeClasses.text}`}>
                      {strategy.name}
                    </h5>
                    <p className={`text-sm ${themeClasses.text}/70`}>
                      {strategy.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex space-x-3">
          <Button
            onClick={handleRunImputation}
            disabled={!selectedStrategy || isRunning}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                Running...
              </>
            ) : (
              <>
                <Settings className="h-4 w-4 mr-2" />
                Test Strategy
              </>
            )}
          </Button>
          
          <Button
            onClick={handleCompareAll}
            disabled={isRunning}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            <BarChart3 className="h-4 w-4 mr-2" />
            Compare All
          </Button>
          
          <Button
            onClick={handleReset}
            variant="outline"
            className={themeClasses.border}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Performance Results</h4>
            
            {/* Best Strategy Highlight */}
            {bestStrategy && (
              <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
                <div className="flex items-center space-x-2 mb-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className={`font-semibold ${themeClasses.text}`}>
                    Best Strategy: {bestStrategy.strategy}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Accuracy</div>
                    <div className={`text-lg font-bold text-green-500`}>
                      {bestStrategy.accuracy.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Precision</div>
                    <div className={`text-lg font-bold text-green-500`}>
                      {bestStrategy.precision.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${themeClasses.text}/70`}>Recall</div>
                    <div className={`text-lg font-bold text-green-500`}>
                      {bestStrategy.recall.toFixed(3)}
                    </div>
                  </div>
                  <div>
                    <div className={`text-xs ${themeClasses.text}/70`}>F1 Score</div>
                    <div className={`text-lg font-bold text-green-500`}>
                      {bestStrategy.f1.toFixed(3)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* All Results Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className={`border-b ${themeClasses.border}`}>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Strategy</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Accuracy</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Precision</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Recall</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>F1 Score</th>
                    <th className={`text-left p-2 ${themeClasses.text}`}>Rank</th>
                  </tr>
                </thead>
                <tbody>
                  {results
                    .sort((a, b) => b.f1 - a.f1)
                    .map((result, index) => (
                    <tr key={index} className={`border-b ${themeClasses.border}`}>
                      <td className={`p-2 font-medium ${themeClasses.text}`}>
                        {result.strategy}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.accuracy.toFixed(3)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.precision.toFixed(3)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.recall.toFixed(3)}
                      </td>
                      <td className={`p-2 ${themeClasses.text}`}>
                        {result.f1.toFixed(3)}
                      </td>
                      <td className="p-2">
                        <Badge className={
                          index === 0 ? 'bg-green-500 text-white' :
                          index === 1 ? 'bg-yellow-500 text-white' :
                          index === 2 ? 'bg-orange-500 text-white' :
                          'bg-gray-500 text-white'
                        }>
                          #{index + 1}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
                <strong>Missing Indicator</strong> often performs best because it preserves the signal that a value was missing.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Median imputation</strong> is more robust to outliers than mean imputation.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Always fit imputers on training data only</strong> to avoid data leakage.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Consider the missingness pattern</strong> (MCAR, MAR, MNAR) when choosing strategies.
              </p>
            </div>
          </div>
        </div>

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Imputation Lab Complete!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You've successfully compared different imputation strategies and learned which works best for your data.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
