'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { TreePine, Target, CheckCircle, RotateCcw, Brain, Zap } from 'lucide-react';

interface DecisionTreeBuilderWidgetProps {
  onComplete?: () => void;
}

interface DataPoint {
  id: number;
  features: number[];
  label: string;
  predicted?: string;
}

interface TreeNode {
  id: string;
  feature?: number;
  threshold?: number;
  left?: TreeNode;
  right?: TreeNode;
  prediction?: string;
  samples: number;
  impurity: number;
}

export default function DecisionTreeBuilderWidget({ onComplete }: DecisionTreeBuilderWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [dataPoints, setDataPoints] = useState<DataPoint[]>([]);
  const [maxDepth, setMaxDepth] = useState([3]);
  const [minSamples, setMinSamples] = useState([2]);
  const [isTraining, setIsTraining] = useState(false);
  const [tree, setTree] = useState<TreeNode | null>(null);
  const [accuracy, setAccuracy] = useState(0);
  const [completed, setCompleted] = useState(false);

  // Generate sample data
  const generateData = () => {
    const points: DataPoint[] = [];
    
    // Generate 2D data with clear decision boundaries
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      
      // Create a simple decision boundary
      let label = 'Class A';
      if (x > 50 && y > 50) {
        label = 'Class B';
      } else if (x < 30 && y < 30) {
        label = 'Class C';
      } else if (x > 70 && y < 30) {
        label = 'Class D';
      }
      
      points.push({
        id: i + 1,
        features: [x, y],
        label
      });
    }
    
    setDataPoints(points);
  };

  useEffect(() => {
    generateData();
  }, []);

  // Simple decision tree implementation
  const buildDecisionTree = (data: DataPoint[], depth: number = 0): TreeNode => {
    if (depth >= maxDepth[0] || data.length < minSamples[0]) {
      // Leaf node - return most common class
      const classCounts: { [key: string]: number } = {};
      data.forEach(point => {
        classCounts[point.label] = (classCounts[point.label] || 0) + 1;
      });
      
      const prediction = Object.keys(classCounts).reduce((a, b) => 
        classCounts[a] > classCounts[b] ? a : b
      );
      
      return {
        id: `leaf-${Math.random()}`,
        prediction,
        samples: data.length,
        impurity: 1 - (classCounts[prediction] / data.length)
      };
    }

    // Find best split
    let bestFeature = 0;
    let bestThreshold = 0;
    let bestGini = 1;

    for (let feature = 0; feature < 2; feature++) {
      const values = data.map(point => point.features[feature]).sort((a, b) => a - b);
      
      for (let i = 0; i < values.length - 1; i++) {
        const threshold = (values[i] + values[i + 1]) / 2;
        const left = data.filter(point => point.features[feature] <= threshold);
        const right = data.filter(point => point.features[feature] > threshold);
        
        if (left.length === 0 || right.length === 0) continue;
        
        const gini = calculateGini(left) * (left.length / data.length) + 
                    calculateGini(right) * (right.length / data.length);
        
        if (gini < bestGini) {
          bestGini = gini;
          bestFeature = feature;
          bestThreshold = threshold;
        }
      }
    }

    // Split data
    const left = data.filter(point => point.features[bestFeature] <= bestThreshold);
    const right = data.filter(point => point.features[bestFeature] > bestThreshold);

    return {
      id: `node-${Math.random()}`,
      feature: bestFeature,
      threshold: bestThreshold,
      left: buildDecisionTree(left, depth + 1),
      right: buildDecisionTree(right, depth + 1),
      samples: data.length,
      impurity: bestGini
    };
  };

  const calculateGini = (data: DataPoint[]): number => {
    const classCounts: { [key: string]: number } = {};
    data.forEach(point => {
      classCounts[point.label] = (classCounts[point.label] || 0) + 1;
    });
    
    let gini = 1;
    Object.values(classCounts).forEach(count => {
      const p = count / data.length;
      gini -= p * p;
    });
    
    return gini;
  };

  const trainModel = async () => {
    setIsTraining(true);
    
    // Simulate training
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const trainedTree = buildDecisionTree(dataPoints);
    setTree(trainedTree);
    
    // Calculate accuracy
    const correct = dataPoints.filter(point => {
      const prediction = predict(trainedTree, point.features);
      return prediction === point.label;
    }).length;
    
    setAccuracy(Math.round((correct / dataPoints.length) * 100));
    setIsTraining(false);
  };

  const predict = (node: TreeNode, features: number[]): string => {
    if (node.prediction) {
      return node.prediction;
    }
    
    if (node.feature !== undefined && node.threshold !== undefined) {
      if (features[node.feature] <= node.threshold) {
        return predict(node.left!, features);
      } else {
        return predict(node.right!, features);
      }
    }
    
    return 'Unknown';
  };

  const renderTree = (node: TreeNode, depth: number = 0): JSX.Element => {
    if (node.prediction) {
      return (
        <div className="text-center">
          <div className={`p-2 rounded ${themeClasses.card.replace('/10', '/20')} border ${themeClasses.border}`}>
            <div className="font-semibold">{node.prediction}</div>
            <div className="text-xs text-gray-500">{node.samples} samples</div>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center">
        <div className={`p-3 rounded ${themeClasses.card.replace('/10', '/20')} border ${themeClasses.border}`}>
          <div className="font-semibold">
            Feature {node.feature!} ≤ {node.threshold!.toFixed(1)}
          </div>
          <div className="text-xs text-gray-500">{node.samples} samples, Gini: {node.impurity.toFixed(3)}</div>
        </div>
        <div className="flex justify-center space-x-8 mt-4">
          <div>
            <div className="text-xs text-gray-500 mb-2">Yes</div>
            {renderTree(node.left!, depth + 1)}
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-2">No</div>
            {renderTree(node.right!, depth + 1)}
          </div>
        </div>
      </div>
    );
  };

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const getClassColor = (label: string) => {
    const colors = {
      'Class A': 'bg-blue-500',
      'Class B': 'bg-green-500',
      'Class C': 'bg-red-500',
      'Class D': 'bg-purple-500'
    };
    return colors[label as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <TreePine className="h-5 w-5 mr-2 text-blue-500" />
          Decision Tree Builder
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Build decision trees step-by-step and understand how they make decisions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Instructions */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-2`}>How Decision Trees Work:</h4>
          <ul className={`text-sm ${themeClasses.text}/70 space-y-1`}>
            <li>• <strong>Split:</strong> Find the best feature and threshold to separate data</li>
            <li>• <strong>Gini Impurity:</strong> Measure of how "mixed" the classes are at each node</li>
            <li>• <strong>Recursion:</strong> Continue splitting until stopping criteria are met</li>
            <li>• <strong>Prediction:</strong> Follow the tree path to make predictions</li>
          </ul>
        </div>

        {/* Controls */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Max Depth: {maxDepth[0]}
              </label>
              <Slider
                value={maxDepth}
                onValueChange={setMaxDepth}
                max={5}
                min={1}
                step={1}
                className="w-full"
                disabled={isTraining}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${themeClasses.text} mb-2`}>
                Min Samples: {minSamples[0]}
              </label>
              <Slider
                value={minSamples}
                onValueChange={setMinSamples}
                max={10}
                min={1}
                step={1}
                className="w-full"
                disabled={isTraining}
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <Button
              onClick={trainModel}
              disabled={isTraining}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isTraining ? (
                <>
                  <Brain className="h-4 w-4 mr-2 animate-spin" />
                  Building Tree...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Build Tree
                </>
              )}
            </Button>
            <Button
              onClick={generateData}
              variant="outline"
              className={`${themeClasses.border}`}
              disabled={isTraining}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              New Data
            </Button>
          </div>
        </div>

        {/* Data Visualization */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Training Data</h4>
          <div className="grid grid-cols-5 gap-2">
            {dataPoints.slice(0, 20).map(point => (
              <div
                key={point.id}
                className={`p-2 rounded text-white text-xs text-center ${getClassColor(point.label)}`}
                title={`Feature 1: ${point.features[0].toFixed(1)}, Feature 2: ${point.features[1].toFixed(1)}`}
              >
                {point.label}
              </div>
            ))}
          </div>
        </div>

        {/* Tree Visualization */}
        {tree && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Decision Tree</h4>
            <div className="overflow-x-auto">
              {renderTree(tree)}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {tree && (
          <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
            <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Model Performance</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{accuracy}%</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{maxDepth[0]}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Max Depth</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-500">{dataPoints.length}</div>
                <div className={`text-sm ${themeClasses.text}/70`}>Training Samples</div>
              </div>
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
                <strong>Interpretability:</strong> Decision trees are easy to understand and visualize.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Feature Importance:</strong> Features used in top splits are most important.
              </p>
            </div>
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <p className={`${themeClasses.text}/80`}>
                <strong>Overfitting:</strong> Deeper trees can memorize training data but generalize poorly.
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
              I Understand Decision Trees
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Excellent!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You now understand how decision trees work! This foundational algorithm 
              is the building block for many advanced techniques like Random Forest.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
