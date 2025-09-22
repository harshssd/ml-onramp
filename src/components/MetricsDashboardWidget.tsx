'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useTheme } from '@/contexts/ThemeContext';
import { BarChart3, Target, CheckCircle, RotateCcw, TrendingUp, Activity, Zap, Brain } from 'lucide-react';

interface MetricsDashboardWidgetProps {
  onComplete?: () => void;
  data?: string[];
}

type TaskType = 'classification' | 'regression';
type MetricType = 'accuracy' | 'precision' | 'recall' | 'f1' | 'roc' | 'auc' | 'mse' | 'mae' | 'r2';

interface ModelPerformance {
  accuracy: number;
  precision: number;
  recall: number;
  f1: number;
  auc: number;
  mse: number;
  mae: number;
  r2: number;
}

export default function MetricsDashboardWidget({ onComplete, data = ["Accuracy","Precision","Recall","F1","ROC","AUC","MSE","R²"] }: MetricsDashboardWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [taskType, setTaskType] = useState<TaskType>('classification');
  const [threshold, setThreshold] = useState([0.5]);
  const [modelPerformance, setModelPerformance] = useState<ModelPerformance>({
    accuracy: 0.85,
    precision: 0.78,
    recall: 0.82,
    f1: 0.80,
    auc: 0.88,
    mse: 0.12,
    mae: 0.25,
    r2: 0.76
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [selectedMetrics, setSelectedMetrics] = useState<MetricType[]>(['accuracy', 'precision', 'recall', 'f1']);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate ROC curve data
  const generateROCCurve = () => {
    const points = [];
    for (let i = 0; i <= 100; i++) {
      const fpr = i / 100;
      const tpr = Math.pow(fpr, 0.7) + 0.1 * Math.sin(fpr * Math.PI * 2);
      points.push({ fpr, tpr: Math.min(tpr, 1) });
    }
    return points;
  };

  const rocData = generateROCCurve();

  // Update metrics based on threshold
  useEffect(() => {
    const newThreshold = threshold[0];
    const basePerformance = {
      accuracy: 0.85,
      precision: 0.78,
      recall: 0.82,
      f1: 0.80,
      auc: 0.88,
      mse: 0.12,
      mae: 0.25,
      r2: 0.76
    };

    // Simulate threshold effect on classification metrics
    const thresholdEffect = Math.sin(newThreshold * Math.PI) * 0.1;
    const newPerformance = {
      ...basePerformance,
      precision: Math.max(0.1, Math.min(0.95, basePerformance.precision + thresholdEffect)),
      recall: Math.max(0.1, Math.min(0.95, basePerformance.recall - thresholdEffect * 0.5)),
      f1: 0,
      accuracy: Math.max(0.1, Math.min(0.95, basePerformance.accuracy + thresholdEffect * 0.3))
    };

    // Recalculate F1
    newPerformance.f1 = 2 * (newPerformance.precision * newPerformance.recall) / 
                       (newPerformance.precision + newPerformance.recall);

    setModelPerformance(newPerformance);
  }, [threshold]);

  // Draw ROC curve
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = themeClasses.background;
    ctx.fillRect(0, 0, width, height);
    
    // Draw axes
    ctx.strokeStyle = themeClasses.text;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(width - 50, height - 50);
    ctx.moveTo(50, 50);
    ctx.lineTo(50, height - 50);
    ctx.stroke();
    
    // Draw diagonal line (random classifier)
    ctx.strokeStyle = '#6b7280';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    ctx.lineTo(width - 50, 50);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw ROC curve
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    
    rocData.forEach((point, index) => {
      const x = 50 + (point.fpr * (width - 100));
      const y = height - 50 - (point.tpr * (height - 100));
      if (index === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();
    
    // Fill area under curve
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    ctx.moveTo(50, height - 50);
    rocData.forEach(point => {
      const x = 50 + (point.fpr * (width - 100));
      const y = height - 50 - (point.tpr * (height - 100));
      ctx.lineTo(x, y);
    });
    ctx.lineTo(width - 50, height - 50);
    ctx.closePath();
    ctx.fill();
    
    // Draw current threshold point
    const currentPoint = rocData[Math.floor(threshold[0] * 100)];
    const pointX = 50 + (currentPoint.fpr * (width - 100));
    const pointY = height - 50 - (currentPoint.tpr * (height - 100));
    
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(pointX, pointY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Labels
    ctx.fillStyle = themeClasses.text;
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('False Positive Rate', width / 2, height - 20);
    
    ctx.save();
    ctx.translate(20, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('True Positive Rate', 0, 0);
    ctx.restore();
    
    // AUC value
    ctx.fillStyle = themeClasses.text;
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`AUC: ${modelPerformance.auc.toFixed(3)}`, 60, 80);
    
  }, [threshold, modelPerformance.auc, themeClasses.background, themeClasses.text]);

  const getMetricColor = (metric: string, value: number) => {
    if (value >= 0.8) return 'text-green-500';
    if (value >= 0.6) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case 'accuracy': return <Target className="h-4 w-4" />;
      case 'precision': return <Zap className="h-4 w-4" />;
      case 'recall': return <Activity className="h-4 w-4" />;
      case 'f1': return <TrendingUp className="h-4 w-4" />;
      case 'auc': return <BarChart3 className="h-4 w-4" />;
      case 'mse': return <Target className="h-4 w-4" />;
      case 'mae': return <Target className="h-4 w-4" />;
      case 'r2': return <Brain className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const classificationMetrics = [
    { key: 'accuracy', label: 'Accuracy', value: modelPerformance.accuracy, description: 'Overall correctness' },
    { key: 'precision', label: 'Precision', value: modelPerformance.precision, description: 'Of predicted positives, how many are correct' },
    { key: 'recall', label: 'Recall', value: modelPerformance.recall, description: 'Of actual positives, how many were found' },
    { key: 'f1', label: 'F1 Score', value: modelPerformance.f1, description: 'Harmonic mean of precision and recall' },
    { key: 'auc', label: 'AUC', value: modelPerformance.auc, description: 'Area under ROC curve' }
  ];

  const regressionMetrics = [
    { key: 'mse', label: 'MSE', value: modelPerformance.mse, description: 'Mean squared error' },
    { key: 'mae', label: 'MAE', value: modelPerformance.mae, description: 'Mean absolute error' },
    { key: 'r2', label: 'R²', value: modelPerformance.r2, description: 'Variance explained by model' }
  ];

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardHeader>
        <CardTitle className={`${themeClasses.text} flex items-center`}>
          <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
          Metrics Dashboard
        </CardTitle>
        <CardDescription className={`${themeClasses.text}/70`}>
          Explore and compare different evaluation metrics for machine learning models
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Task Type Selection */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>Task Type</h4>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant={taskType === 'classification' ? "default" : "outline"}
              onClick={() => setTaskType('classification')}
              className={`${
                taskType === 'classification' 
                  ? 'bg-blue-500 text-white' 
                  : themeClasses.border
              }`}
            >
              Classification
            </Button>
            <Button
              variant={taskType === 'regression' ? "default" : "outline"}
              onClick={() => setTaskType('regression')}
              className={`${
                taskType === 'regression' 
                  ? 'bg-blue-500 text-white' 
                  : themeClasses.border
              }`}
            >
              Regression
            </Button>
          </div>
        </div>

        {/* Metrics Display */}
        <div className="space-y-4">
          <h4 className={`font-semibold ${themeClasses.text}`}>
            {taskType === 'classification' ? 'Classification Metrics' : 'Regression Metrics'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(taskType === 'classification' ? classificationMetrics : regressionMetrics).map(metric => (
              <div
                key={metric.key}
                className={`p-4 rounded-lg border ${themeClasses.border} ${themeClasses.card.replace('/10', '/5')}`}
              >
                <div className="flex items-center space-x-2 mb-2">
                  {getMetricIcon(metric.key)}
                  <span className={`font-medium ${themeClasses.text}`}>{metric.label}</span>
                </div>
                <div className={`text-2xl font-bold ${getMetricColor(metric.key, metric.value)}`}>
                  {metric.value.toFixed(3)}
                </div>
                <p className={`text-sm ${themeClasses.text}/70 mt-1`}>
                  {metric.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ROC Curve for Classification */}
        {taskType === 'classification' && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>ROC Curve</h4>
            <div className="relative">
              <canvas
                ref={canvasRef}
                width={500}
                height={300}
                className="border rounded-lg bg-white dark:bg-gray-900"
              />
            </div>
            
            {/* Threshold Control */}
            <div className="space-y-2">
              <label className={`block text-sm font-medium ${themeClasses.text}`}>
                Classification Threshold: {threshold[0].toFixed(2)}
              </label>
              <Slider
                value={threshold}
                onValueChange={setThreshold}
                max={1}
                min={0}
                step={0.01}
                className="w-full"
              />
              <p className={`text-xs ${themeClasses.text}/70`}>
                Adjust the threshold to see how it affects precision and recall
              </p>
            </div>
          </div>
        )}

        {/* Confusion Matrix for Classification */}
        {taskType === 'classification' && (
          <div className="space-y-4">
            <h4 className={`font-semibold ${themeClasses.text}`}>Confusion Matrix</h4>
            <div className="flex justify-center">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div></div>
                <div className={`font-medium ${themeClasses.text}`}>Predicted</div>
                <div></div>
                
                <div className={`font-medium ${themeClasses.text}`}>Actual</div>
                <div className={`p-2 rounded ${themeClasses.card.replace('/10', '/20')} border ${themeClasses.border}`}>
                  <div className="text-green-500 font-bold">TP: {Math.round(modelPerformance.recall * 100)}</div>
                </div>
                <div className={`p-2 rounded ${themeClasses.card.replace('/10', '/20')} border ${themeClasses.border}`}>
                  <div className="text-red-500 font-bold">FP: {Math.round((1 - modelPerformance.precision) * 100)}</div>
                </div>
                
                <div></div>
                <div className={`p-2 rounded ${themeClasses.card.replace('/10', '/20')} border ${themeClasses.border}`}>
                  <div className="text-red-500 font-bold">FN: {Math.round((1 - modelPerformance.recall) * 100)}</div>
                </div>
                <div className={`p-2 rounded ${themeClasses.card.replace('/10', '/20')} border ${themeClasses.border}`}>
                  <div className="text-green-500 font-bold">TN: {Math.round(modelPerformance.accuracy * 100)}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Insights */}
        <div className={`p-4 rounded-lg ${themeClasses.card.replace('/10', '/5')} border ${themeClasses.border}`}>
          <h4 className={`font-semibold ${themeClasses.text} mb-3`}>Key Insights</h4>
          <div className="space-y-2 text-sm">
            {taskType === 'classification' ? (
              <>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className={`${themeClasses.text}/80`}>
                    <strong>Accuracy can be misleading</strong> with imbalanced data. A model that always predicts "not spam" 
                    might have 95% accuracy if only 5% of emails are spam.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className={`${themeClasses.text}/80`}>
                    <strong>Precision vs Recall trade-off:</strong> Higher threshold = higher precision, lower recall. 
                    Lower threshold = higher recall, lower precision.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className={`${themeClasses.text}/80`}>
                    <strong>F1 Score</strong> balances precision and recall, making it useful for imbalanced datasets.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                  <p className={`${themeClasses.text}/80`}>
                    <strong>ROC Curve</strong> shows the trade-off between sensitivity (TPR) and specificity (1-FPR) 
                    across all possible thresholds.
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <p className={`${themeClasses.text}/80`}>
                    <strong>MSE</strong> penalizes large errors more heavily due to squaring, making it sensitive to outliers.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <p className={`${themeClasses.text}/80`}>
                    <strong>MAE</strong> is more robust to outliers and gives equal weight to all errors.
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <p className={`${themeClasses.text}/80`}>
                    <strong>R²</strong> tells you what proportion of variance in the target variable is explained by the model.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {!completed && (
          <div className="text-center">
            <Button 
              onClick={handleComplete}
              className="bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              I Understand Model Evaluation
            </Button>
          </div>
        )}

        {completed && (
          <div className={`p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800`}>
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h4 className={`font-semibold ${themeClasses.text}`}>
                Excellent Work!
              </h4>
            </div>
            <p className={`text-sm ${themeClasses.text}/80`}>
              You now understand how to properly evaluate machine learning models using the right metrics 
              for different types of problems. This knowledge is crucial for building reliable AI systems!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
