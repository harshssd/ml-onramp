---
id: ai-builder-ch2-lesson4
title: Feature Scaling & Normalization
duration_min: 35
prereqs: ["ai-builder-ch2-lesson3"]
tags: ["intermediate","scaling","normalization","robust-scaling"]
video:
  platform: youtube
  id: 0oC_JC5qE6k
  start: 0
  end: 600
widgets:
  - type: "scaling_playground"
    data: "/widgets/scaling_playground.titanic.json"
goals:
  - Understand when scaling matters (distance-based & margin models)
  - Compare Standard vs Min-Max vs Robust scales
  - Apply log transforms for skewed features
quiz:
  - q: Which models are most sensitive to scaling?
    options: ["Decision Trees","Random Forests","KNN & SVM","Naive Bayes"]
    answer: 2
    explain: Distance/margin methods depend on feature scales.
  - q: Robust scaling helps when…
    options: ["Data is perfectly normal","Outliers exist","All features are binary","You don't split data"]
    answer: 1
    explain: Robust scaling uses median/IQR, less sensitive to outliers.
flashcards:
  - Standardization: (x-μ)/σ
  - Min-Max: (x-min)/(max-min)
  - Robust Scaling: (x-median)/IQR (outlier-resistant)
  - Log Transform: Reduces skew; beware zeros/negatives
reflection:
  - "Identify two features that would clearly benefit from scaling. Why?"
next: "ai-builder-ch3-lesson1"
---

## Hook
If one feature ranges 0–1 and another 0–10,000, distance-based models will "listen" to the large-range feature unless you scale.

## Watch
Watch [Scaling & Normalization Tutorial](https://www.youtube.com/watch?v=0oC_JC5qE6k) (0–10 min) to understand different scaling methods.

## Concept
- **Standard vs Min-Max vs Robust** use-cases.
- **Skew & logs**: long-tailed data benefits from log( x + ε ).
- **Model sensitivity**: KNN/SVM/logistic benefit; trees usually don't.

## Do (Interactive)
Use the **Scaling Playground** and **Model Sensitivity** widgets:
1. **Scaling Playground**: Switch scalers; plot distributions before/after.  
2. **Model Sensitivity**: Train KNN/SVM/LogReg with and without scaling; compare metrics.

## Quiz
Test your understanding with the quiz questions above.

## Reflection
Identify two features that would clearly benefit from scaling. Why? Consider the feature ranges and the models you plan to use.

## References
- [Scikit-learn: Preprocessing](https://scikit-learn.org/stable/modules/preprocessing.html)  
- [Feature Scaling Best Practices](https://www.kaggle.com/learn/feature-engineering)  
- [Robust Scaling for Outliers](https://scikit-learn.org/stable/modules/generated/sklearn.preprocessing.RobustScaler.html)
