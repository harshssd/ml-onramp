---
id: ai-builder-ch2-lesson3
title: Handling Missing Data
duration_min: 30
prereqs: ["ai-builder-ch2-lesson2"]
tags: ["intermediate","missing-data","imputation","mar-mcar-mnar"]
video:
  platform: youtube
  id: 2H4N9uO3W2Q
  start: 0
  end: 540
widgets:
  - type: "impute_lab"
    data: "/widgets/impute_lab.titanic.json"
goals:
  - Understand MCAR/MAR/MNAR patterns
  - Choose appropriate imputation (and add missingness indicators)
  - Avoid leakage when imputing
quiz:
  - q: Adding a "was_missing" indicator is helpful because…
    options: ["Adds noise","Signals pattern of missingness","Is required by all models","Replaces imputation"]
    answer: 1
    explain: Missingness can be informative; indicator preserves that signal.
  - q: Which step avoids leakage?
    options: ["Impute on full dataset","Fit imputer on training only","Impute targets","Ignore missing"]
    answer: 1
    explain: Fit on train; transform val/test with fitted params only.
flashcards:
  - MCAR/MAR/MNAR: Missing completely at random / at random / not at random
  - Imputation Strategy: Rule for filling missing
  - Missingness Indicator: Binary flag a value was missing
reflection:
  - "Which column in your data is most often missing? Why might that be?"
next: "ai-builder-ch2-lesson4"
---

## Hook
Missing values carry meaning. Treat them carefully and your model improves.

## Watch
Watch [Missing Data Primer](https://www.youtube.com/watch?v=2H4N9uO3W2Q) (0–9 min) to understand different types of missingness.

## Concept
- **Types of missingness:** MCAR (benign), MAR (dependence on observed vars), MNAR (most dangerous).
- **Impute choices:** mean/median for numeric; most frequent for categorical; never impute labels.
- **Indicators:** preserve signal that a value was missing.
- **Pipelines & leakage:** fit imputer on train only.

## Do (Interactive)
Use the **Impute Lab** and **Leakage Checker** widgets:
1. **Impute Lab**: Try different strategies; check metric deltas.  
2. **Leakage Checker**: Simulate a wrong pipeline; see inflated validation.

## Quiz
Test your understanding with the quiz questions above.

## Reflection
Which column in your data is most often missing? Why might that be? Consider the business context and data collection process.

## References
- [Missing Data Patterns](https://www.stata.com/meeting/uk18/slides/uk18_white.pdf)  
- [Scikit-learn: Imputation](https://scikit-learn.org/stable/modules/impute.html)  
- [Data Leakage Prevention](https://machinelearningmastery.com/data-leakage-machine-learning/)
