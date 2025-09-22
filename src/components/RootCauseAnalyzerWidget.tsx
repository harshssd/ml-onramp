'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Database,
  Server,
  Code,
  Users
} from 'lucide-react';

interface RootCauseAnalyzerWidgetProps {
  onComplete: () => void;
  config: any;
}

export default function RootCauseAnalyzerWidget({ onComplete, config }: RootCauseAnalyzerWidgetProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCause, setSelectedCause] = useState<string | null>(null);
  const [analysisComplete, setAnalysisComplete] = useState(false);

  const failureCategories = [
    {
      id: 'data',
      name: 'Data Issues',
      icon: Database,
      color: 'blue',
      causes: [
        'Data schema mismatch',
        'Missing required fields',
        'Data corruption',
        'Insufficient training data'
      ]
    },
    {
      id: 'infrastructure',
      name: 'Infrastructure',
      icon: Server,
      color: 'green',
      causes: [
        'Server overload',
        'Network connectivity issues',
        'Resource exhaustion',
        'Service unavailability'
      ]
    },
    {
      id: 'model',
      name: 'Model Issues',
      icon: Code,
      color: 'purple',
      causes: [
        'Model drift',
        'Poor model performance',
        'Incorrect model version',
        'Model corruption'
      ]
    },
    {
      id: 'human',
      name: 'Human Error',
      icon: Users,
      color: 'orange',
      causes: [
        'Configuration errors',
        'Deployment mistakes',
        'Incorrect parameters',
        'Missing dependencies'
      ]
    }
  ];

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedCause(null);
    setAnalysisComplete(false);
  };

  const handleCauseSelect = (cause: string) => {
    setSelectedCause(cause);
  };

  const handleAnalyze = () => {
    if (selectedCategory && selectedCause) {
      setAnalysisComplete(true);
    }
  };

  const handleReset = () => {
    setSelectedCategory(null);
    setSelectedCause(null);
    setAnalysisComplete(false);
  };

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'text-blue-500 bg-blue-50 border-blue-200',
      green: 'text-green-500 bg-green-50 border-green-200',
      purple: 'text-purple-500 bg-purple-50 border-purple-200',
      orange: 'text-orange-500 bg-orange-50 border-orange-200'
    };
    return colorMap[color] || colorMap.blue;
  };

  const selectedCategoryData = failureCategories.find(cat => cat.id === selectedCategory);

  return (
    <div className={`${themeClasses.background} p-6 rounded-lg`}>
      <div className="mb-6">
        <h3 className={`text-2xl font-bold ${themeClasses.text} mb-2`}>
          Root Cause Analyzer
        </h3>
        <p className={`${themeClasses.text}/70`}>
          Analyze production incidents and identify the root cause using systematic investigation.
        </p>
      </div>

      {/* Failure Categories */}
      <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
        <CardHeader>
          <CardTitle className={`${themeClasses.text} flex items-center`}>
            <Search className="h-5 w-5 mr-2 text-blue-500" />
            Failure Categories
          </CardTitle>
          <CardDescription className={`${themeClasses.text}/70`}>
            Select the category that best describes the incident
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {failureCategories.map((category) => {
              const IconComponent = category.icon;
              const isSelected = selectedCategory === category.id;
              
              return (
                <div
                  key={category.id}
                  className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 ${
                    isSelected 
                      ? `${getColorClasses(category.color)} border-2` 
                      : `${themeClasses.card.replace('/10', '/5')} ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')}`
                  }`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="text-center">
                    <IconComponent className="h-8 w-8 mx-auto mb-2" />
                    <h4 className={`font-semibold ${themeClasses.text}`}>
                      {category.name}
                    </h4>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Potential Causes */}
      {selectedCategory && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Potential Causes
            </CardTitle>
            <CardDescription className={`${themeClasses.text}/70`}>
              Select the most likely cause within {selectedCategoryData?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {selectedCategoryData?.causes.map((cause, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border cursor-pointer transition-all duration-300 ${
                    selectedCause === cause 
                      ? `${getColorClasses(selectedCategoryData.color)} border-2` 
                      : `${themeClasses.card.replace('/10', '/5')} ${themeClasses.border} hover:${themeClasses.card.replace('/10', '/20')}`
                  }`}
                  onClick={() => handleCauseSelect(cause)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <span className={`${themeClasses.text}`}>{cause}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Actions */}
      {selectedCategory && selectedCause && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text}`}>
              Analysis Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button
                  onClick={handleAnalyze}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Analyze Root Cause
                </Button>
                <Button
                  onClick={handleReset}
                  variant="outline"
                >
                  Reset Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Analysis Results */}
      {analysisComplete && (
        <Card className={`${themeClasses.card} backdrop-blur-sm mb-6`}>
          <CardHeader>
            <CardTitle className={`${themeClasses.text} flex items-center`}>
              <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${getColorClasses(selectedCategoryData?.color || 'blue')} border`}>
                <h4 className={`font-semibold ${themeClasses.text} mb-2`}>
                  Root Cause Identified
                </h4>
                <p className={`${themeClasses.text}/80 mb-3`}>
                  <strong>Category:</strong> {selectedCategoryData?.name}
                </p>
                <p className={`${themeClasses.text}/80 mb-3`}>
                  <strong>Cause:</strong> {selectedCause}
                </p>
                
                <div className="mt-4">
                  <h5 className={`font-semibold ${themeClasses.text} mb-2`}>
                    Recommended Actions:
                  </h5>
                  <ul className={`space-y-1 ${themeClasses.text}/80`}>
                    <li>• Implement immediate mitigation</li>
                    <li>• Update monitoring and alerting</li>
                    <li>• Review and improve processes</li>
                    <li>• Document lessons learned</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

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
