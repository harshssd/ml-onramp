"use client";
import React from "react";
import { useTheme } from "@/contexts/ThemeContext";

interface ConfusionMatrixVizProps {
  matrix: number[][];
  classNames: string[];
}

export default function ConfusionMatrixViz({ matrix, classNames }: ConfusionMatrixVizProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const max = Math.max(...matrix.flat());

  return (
    <div className="overflow-x-auto">
      <table className="border-collapse w-full">
        <thead>
          <tr>
            <th className={`p-2 text-xs ${themeClasses.text}/70`}></th>
            {classNames.map(c => (
              <th key={c} className={`p-2 text-xs ${themeClasses.text} text-center`}>
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              <th className={`p-2 text-xs ${themeClasses.text} text-right`}>
                {classNames[i]}
              </th>
              {row.map((v, j) => (
                <td 
                  key={j} 
                  className="w-12 h-12 text-center align-middle border"
                  style={{ 
                    background: `rgba(37, 99, 235, ${v/(max||1)})`, 
                    color: v/(max||1) > 0.5 ? "white" : "black" 
                  }}
                >
                  <span className="text-sm font-medium">{v}</span>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className={`mt-2 text-sm ${themeClasses.text}/70 text-center`}>
        Rows = True Labels, Columns = Predicted Labels
      </p>
    </div>
  );
}
