"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useTheme } from "@/contexts/ThemeContext";

interface MetricsSummaryProps {
  metrics: {
    precision_macro: number;
    recall_macro: number;
    f1_macro: number;
  };
}

export default function MetricsSummary({ metrics }: MetricsSummaryProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const getScoreColor = (score: number) => {
    if (score >= 0.9) return "text-green-500";
    if (score >= 0.8) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <Card className={`${themeClasses.card} backdrop-blur-sm`}>
      <CardContent className="p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="space-y-1">
            <div className={`text-xs font-medium ${themeClasses.text}/70`}>
              Precision (Macro)
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.precision_macro)}`}>
              {metrics.precision_macro.toFixed(3)}
            </div>
            <div className={`text-xs ${themeClasses.text}/60`}>
              True Positives / (True Positives + False Positives)
            </div>
          </div>
          
          <div className="space-y-1">
            <div className={`text-xs font-medium ${themeClasses.text}/70`}>
              Recall (Macro)
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.recall_macro)}`}>
              {metrics.recall_macro.toFixed(3)}
            </div>
            <div className={`text-xs ${themeClasses.text}/60`}>
              True Positives / (True Positives + False Negatives)
            </div>
          </div>
          
          <div className="space-y-1">
            <div className={`text-xs font-medium ${themeClasses.text}/70`}>
              F1 Score (Macro)
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.f1_macro)}`}>
              {metrics.f1_macro.toFixed(3)}
            </div>
            <div className={`text-xs ${themeClasses.text}/60`}>
              Harmonic Mean of Precision and Recall
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
