"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

interface AlgorithmPickerProps {
  onSelect: (algo: "knn"|"softmax") => void;
  value: "knn"|"softmax";
}

export default function AlgorithmPicker({ onSelect, value }: AlgorithmPickerProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm font-medium ${themeClasses.text}`}>Algorithm:</span>
      <div className="flex gap-2">
        {["knn", "softmax"].map(a => (
          <Button
            key={a}
            onClick={() => onSelect(a as "knn"|"softmax")}
            variant={value === a ? "default" : "outline"}
            className={`${
              value === a 
                ? "bg-blue-500 text-white hover:bg-blue-600" 
                : themeClasses.border
            }`}
          >
            {a.toUpperCase()}
          </Button>
        ))}
      </div>
    </div>
  );
}
