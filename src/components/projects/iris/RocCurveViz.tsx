"use client";
import React, { useEffect, useRef } from "react";
import { useTheme } from "@/contexts/ThemeContext";

type Roc = { class: string; fpr: number[]; tpr: number[]; auc: number };

interface RocCurveVizProps {
  rocs: Roc[];
}

export default function RocCurveViz({ rocs }: RocCurveVizProps) {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const c = ref.current; 
    if (!c) return;
    
    const ctx = c.getContext("2d")!;
    const w = c.width, h = c.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, w, h);
    
    // Set background
    ctx.fillStyle = themeClasses.background;
    ctx.fillRect(0, 0, w, h);
    
    // Draw axes
    ctx.strokeStyle = themeClasses.text;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(40, 10);
    ctx.lineTo(40, h - 30);
    ctx.lineTo(w - 10, h - 30);
    ctx.stroke();
    
    // Draw axis labels
    ctx.fillStyle = themeClasses.text;
    ctx.font = "12px Arial";
    ctx.textAlign = "center";
    ctx.fillText("True Positive Rate", w / 2, h - 5);
    
    ctx.save();
    ctx.translate(15, h / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("False Positive Rate", 0, 0);
    ctx.restore();

    function xy(fpr: number, tpr: number) { 
      return [40 + fpr * (w - 60), (h - 30) - tpr * (h - 40)]; 
    }

    // Draw random baseline (diagonal line)
    ctx.strokeStyle = "#999";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(...xy(0, 0));
    ctx.lineTo(...xy(1, 1));
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw ROC curves
    const colors = ["#2563eb", "#10b981", "#f59e0b"];
    rocs.forEach((r, idx) => {
      ctx.strokeStyle = colors[idx % colors.length];
      ctx.lineWidth = 3;
      ctx.beginPath();
      
      r.fpr.forEach((f, i) => {
        const [x, y] = xy(f, r.tpr[i]);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      
      // Draw AUC label
      ctx.fillStyle = ctx.strokeStyle;
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.fillText(`${r.class} AUC=${r.auc.toFixed(3)}`, 50, 20 + idx * 16);
    });
  }, [rocs, themeClasses.background, themeClasses.text]);

  return (
    <div className="space-y-2">
      <canvas 
        ref={ref} 
        width={560} 
        height={360} 
        className="w-full border rounded-md bg-white dark:bg-gray-900"
      />
      <p className={`text-xs ${themeClasses.text}/70 text-center`}>
        ROC curves show the trade-off between True Positive Rate and False Positive Rate
      </p>
    </div>
  );
}
