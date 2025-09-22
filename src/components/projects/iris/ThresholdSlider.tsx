"use client";
import React from "react";
import { Slider } from "@/components/ui/slider";
import { useTheme } from "@/contexts/ThemeContext";

interface ThresholdSliderProps {
  value: number;
  onChange: (v: number) => void;
  disabled?: boolean;
}

export default function ThresholdSlider({ 
  value, 
  onChange, 
  disabled = false 
}: ThresholdSliderProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className={`text-sm font-medium ${themeClasses.text}`}>
          Classification Threshold: {value.toFixed(2)}
        </label>
        {disabled && (
          <span className={`text-xs ${themeClasses.text}/70`}>
            (Only applies to Softmax Regression)
          </span>
        )}
      </div>
      
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={0.05}
        max={0.95}
        step={0.05}
        disabled={disabled}
        className="w-full"
      />
      
      <p className={`text-xs ${themeClasses.text}/70`}>
        {disabled 
          ? "Threshold adjustment only works with Softmax Regression (probabilistic output)"
          : "Adjust the threshold to see how it affects classification decisions"
        }
      </p>
    </div>
  );
}
