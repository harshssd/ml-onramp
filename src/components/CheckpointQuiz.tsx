"use client";

import React, { useState } from "react";

export type QuizOption = { id: string; label: string };
export type QuizProps = {
  question: string;
  options: QuizOption[];
  correctId: string;
  explanation?: string;
  onPass?: () => void;
};

export default function CheckpointQuiz({ question, options, correctId, explanation, onPass }: QuizProps) {
  const [choice, setChoice] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  const isCorrect = checked && choice === correctId;

  return (
    <div className="rounded-xl border p-4 md:p-6 bg-background shadow-sm">
      <h3 className="font-semibold mb-3">{question}</h3>
      <fieldset className="space-y-2">
        {options.map((o) => (
          <label key={o.id} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="quiz"
              className="h-4 w-4"
              value={o.id}
              onChange={() => setChoice(o.id)}
              aria-checked={choice === o.id}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </fieldset>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={() => setChecked(true)}
          disabled={!choice}
          className="px-4 py-2 rounded-lg border hover:bg-accent"
          aria-label="Check answer"
        >
          Check
        </button>
        {checked && (
          <span
            className={`text-sm font-medium ${isCorrect ? "text-green-600" : "text-red-600"}`}
            role="status"
            aria-live="polite"
          >
            {isCorrect ? "Correct!" : "Not quite."}
          </span>
        )}
      </div>

      {checked && explanation && (
        <p className="mt-3 text-sm text-muted-foreground">{explanation}</p>
      )}

      {isCorrect && onPass && (
        <div className="mt-4">
          <button
            onClick={onPass}
            className="px-4 py-2 rounded-lg bg-black text-white hover:opacity-90"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
}
