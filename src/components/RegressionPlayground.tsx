"use client";

import React, { useMemo, useRef, useEffect, useState } from "react";

type Pt = { x: number; y: number };

function genData(n = 50, trueM = 1.6, trueB = 2, noise = 1.1): Pt[] {
  const pts: Pt[] = [];
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 10; // [0,10]
    const y = trueM * x + trueB + (Math.random() * 2 - 1) * noise;
    pts.push({ x, y });
  }
  return pts;
}

function mse(pts: Pt[], m: number, b: number) {
  return (
    pts.reduce((acc, p) => acc + Math.pow(p.y - (m * p.x + b), 2), 0) / pts.length
  );
}

export default function RegressionPlayground() {
  const [m, setM] = useState(1.0);
  const [b, setB] = useState(0.0);
  const [pts] = useState(() => genData());

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const error = useMemo(() => mse(pts, m, b), [pts, m, b]);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    const w = c.width, h = c.height;

    // scale helpers
    const xMax = 10;
    const yMax = Math.max(...pts.map(p => p.y), m * xMax + b) + 2;
    const yMin = Math.min(...pts.map(p => p.y), m * 0 + b) - 2;
    const xToPx = (x: number) => (x / xMax) * (w - 40) + 30;
    const yToPx = (y: number) => h - ((y - yMin) / (yMax - yMin)) * (h - 40) - 20;

    // clear
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);

    // axes
    ctx.strokeStyle = "#ccc";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(30, 10);
    ctx.lineTo(30, h - 20);
    ctx.lineTo(w - 10, h - 20);
    ctx.stroke();

    // points
    ctx.fillStyle = "#111";
    for (const p of pts) {
      ctx.beginPath();
      ctx.arc(xToPx(p.x), yToPx(p.y), 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // line
    ctx.strokeStyle = "#2563eb";
    ctx.lineWidth = 2;
    ctx.beginPath();
    const y0 = m * 0 + b;
    const y1 = m * xMax + b;
    ctx.moveTo(xToPx(0), yToPx(y0));
    ctx.lineTo(xToPx(xMax), yToPx(y1));
    ctx.stroke();

    // label
    ctx.fillStyle = "#444";
    ctx.font = "12px system-ui, -apple-system, Segoe UI, Roboto, sans-serif";
    ctx.fillText(`y = ${m.toFixed(2)}x + ${b.toFixed(2)}  |  MSE: ${error.toFixed(3)}`, 30, 18);
  }, [pts, m, b, error]);

  return (
    <div className="rounded-xl border p-4 md:p-6 space-y-4">
      <h3 className="font-semibold">Linear Regression Sandbox</h3>
      <canvas ref={canvasRef} width={640} height={360} className="w-full rounded-md border" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="block">
          <div className="text-sm mb-1">Slope (m): {m.toFixed(2)}</div>
          <input
            aria-label="Slope"
            type="range"
            min={-3}
            max={3}
            step={0.05}
            value={m}
            onChange={(e) => setM(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
        <label className="block">
          <div className="text-sm mb-1">Intercept (b): {b.toFixed(2)}</div>
          <input
            aria-label="Intercept"
            type="range"
            min={-5}
            max={5}
            step={0.05}
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value))}
            className="w-full"
          />
        </label>
      </div>
      <p className="text-sm text-muted-foreground">
        Drag the sliders and watch the fit and MSE update. This builds intuition before training.
      </p>
    </div>
  );
}