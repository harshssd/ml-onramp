'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useTheme } from '@/contexts/ThemeContext';
import { Target, CheckCircle, TrendingUp, BarChart3, Zap, XCircle, AlertTriangle } from 'lucide-react';

interface FeatureSelectorWidgetProps {
  onComplete?: () => void;
}

interface Feature {
  name: string;
  importance: number;
  selected: boolean;
  description: string;
}

interface ModelPerformance {
  accuracy: number;
  features: number;
  complexity: number;
}

export default function FeatureSelectorWidget({ onComplete }: FeatureSelectorWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [features, setFeatures] = useState<Feature[]>([]);
  const [performance, setPerformance] = useState<ModelPerformance>({ accuracy: 0, features: 0, complexity: 0 });
  const [completed, setCompleted] = useState(false);

  // Initialize features
  useEffect(() => {
    const initialFeatures: Feature[] = [
      { name: 'Age', importance: 0.8, selected: true, description: 'Customer age in years' },
      { name: 'Income', importance: 0.9, selected: true, description: 'Annual income in dollars' },
      { name: 'Education', importance: 0.7, selected: true, description: 'Years of education' },
      { name: 'Credit Score', importance: 0.95, selected: true, description: 'Credit rating (300-850)' },
      { name: 'Employment Years', importance: 0.6, selected: false, description: 'Years at current job' },
      { name: 'Debt Ratio', importance: 0.85, selected: false, description: 'Monthly debt / income' },
      { name: 'Loan Amount', importance: 0.75, selected: false, description: 'Requested loan amount' },
      { name: 'Home Ownership', importance: 0.5, selected: false, description: 'Owns home (yes/no)' },
      { name: 'Marital Status', importance: 0.3, selected: false, description: 'Single, married, divorced' },
      { name: 'Number of Dependents', importance: 0.4, selected: false, description: 'Children count' },
      { name: 'Zip Code', importance: 0.2, selected: false, description: 'Postal code' },
      { name: 'Favorite Color', importance: 0.1, selected: false, description: 'Preferred color' }
    ];
    setFeatures(initialFeatures);
  }, []);

  // Calculate model performance based on selected features
  useEffect(() => {
    const selectedFeatures = features.filter(f => f.selected);
    const selectedCount = selectedFeatures.length;
    
    if (selectedCount === 0) {
      setPerformance({ accuracy: 0, features: 0, complexity: 0 });
      return;
    }
    
    // Calculate weighted importance
    const totalImportance = selectedFeatures.reduce((sum, f) => sum + f.importance, 0);
    const avgImportance = totalImportance / selectedCount;
    
    // Calculate accuracy based on feature importance and count
    const baseAccuracy = Math.min(95, avgImportance * 100);
    const countPenalty = Math.max(0, (selectedCount - 5) * 2); // Penalty for too many features
    const accuracy = Math.max(0, baseAccuracy - countPenalty);
    
    // Calculate complexity (higher with more features)
    const complexity = Math.min(100, selectedCount * 10);
    
    setPerformance({
      accuracy: Math.round(accuracy),
      features: selectedCount,
      complexity
    });
  }, [features]);

  const toggleFeature = (index: number) => {
    const newFeatures = [...features];
    newFeatures[index].selected = !newFeatures[index].selected;
    setFeatures(newFeatures);
  };

  const selectAll = () => {
    setFeatures(features.map(f => ({ ...f, selected: true })));
  };

  const selectNone = () => {
    setFeatures(features.map(f => ({ ...f, selected: false })));
  };

  const selectImportant = () => {
    setFeatures(features.map(f => ({ ...f, selected: f.importance >= 0.7 })));
  };

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const getImportanceColor = (importance: number) => {
    if (importance >= 0.8) return 'text-green-500';
    if (importance >= 0.6) return 'text-yellow-500';
    if (importance >= 0.4) return 'text-orange-500';
    return 'text-red-500';
  };

  const getImportanceLabel = (importance: number) => {
    if (importance >= 0.8) return 'High';
    if (importance >= 0.6) return 'Medium';
    if (importance >= 0.4) return 'Low';
    return 'Very Low';
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <Target className="h-5 w-5 mr-2 text-blue-500" />
          Feature Selector
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Learn which data properties matter most for predictions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>Feature Selection Challenge:</h4>
          <p className={`text-sm ${themeClasses.text}/80`}>
            You're building a loan approval model. Select which features to include. 
            More features aren't always better - choose wisely!
          </p>
        </div>

        {/* Quick Selection Buttons */}
        <div className="flex space-x-2">
          <Button
            onClick={selectImportant}
            variant="outline"
            size="sm"
            className={`${themeClasses.border}`}
          >
            Select Important
          </Button>
          <Button
            onClick={selectAll}
            variant="outline"
            size="sm"
            className={`${themeClasses.border}`}
          >
            Select All
          </Button>
          <Button
            onClick={selectNone}
            variant="outline"
            size="sm"
            className={`${themeClasses.border}`}
          >
            Select None
          </Button>
        </div>

        {/* Features List */}
        <div className="space-y-3">
          <h4 className={`font-semibold ${themeClasses.text}`}>Available Features</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div
                key={feature.name}
                className={`p-3 rounded-lg border ${
                  feature.selected 
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                    : themeClasses.border
                } ${themeClasses.card.replace('/10', '/5')}`}
              >
                <div className="flex items-start space-x-3">
                  <Checkbox
                    checked={feature.selected}
                    onCheckedChange={() => toggleFeature(index)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className={`font-medium ${themeClasses.text}`}>{feature.name}</h5>
                      <div className="flex items-center space-x-2">
                        <span className={`text-sm ${getImportanceColor(feature.importance)}`}>
                          {getImportanceLabel(feature.importance)}
                        </span>
                        <div className="w-16 h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div 
                            className={`h-2 rounded-full ${
                              feature.importance >= 0.8 ? 'bg-green-500' :
                              feature.importance >= 0.6 ? 'bg-yellow-500' :
                              feature.importance >= 0.4 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${feature.importance * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <p className={`text-sm ${themeClasses.text}/70`}>{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Model Performance</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{performance.accuracy}%</div>
              <div className={`text-sm ${themeClasses.text}/70`}>Predicted Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{performance.features}</div>
              <div className={`text-sm ${themeClasses.text}/70`}>Features Selected</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">{performance.complexity}%</div>
              <div className={`text-sm ${themeClasses.text}/70`}>Model Complexity</div>
            </div>
          </div>
        </div>

        {/* Performance Analysis */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Performance Analysis</h4>
          <div className="space-y-2 text-sm">
            {performance.features === 0 && (
              <div className="flex items-center space-x-2 text-red-500">
                <XCircle className="h-4 w-4" />
                <span>Select at least one feature to build a model</span>
              </div>
            )}
            {performance.features > 0 && performance.features < 3 && (
              <div className="flex items-center space-x-2 text-yellow-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Very few features selected - model may be too simple</span>
              </div>
            )}
            {performance.features >= 3 && performance.features <= 6 && (
              <div className="flex items-center space-x-2 text-green-500">
                <CheckCircle className="h-4 w-4" />
                <span>Good feature selection - balanced complexity</span>
              </div>
            )}
            {performance.features > 6 && (
              <div className="flex items-center space-x-2 text-orange-500">
                <AlertTriangle className="h-4 w-4" />
                <span>Many features selected - risk of overfitting</span>
              </div>
            )}
          </div>
        </div>

        {/* Key Insights */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Key Insights</h4>
          <div className="space-y-2 text-sm">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Relevance Matters:</strong> Features like "Credit Score" and "Income" are highly relevant for loan approval.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Quality over Quantity:</strong> 3-5 good features often beat 10+ mediocre ones.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Domain Knowledge:</strong> Understanding your problem helps choose the right features.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Irrelevant Features:</strong> "Favorite Color" has no impact on loan decisions - avoid them!
              </p>
            </div>
          </div>
        </div>

        {!completed && (
          <div className="text-center">
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              I Understand Feature Selection
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Perfect!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You now understand how to select the right features for machine learning models. 
              This skill is crucial for building effective AI systems!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
