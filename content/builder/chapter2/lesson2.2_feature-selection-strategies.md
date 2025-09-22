---
id: ai-builder-ch2-lesson2
title: Feature Selection Strategies
duration_min: 35
prereqs: ["ai-builder-ch2-lesson1"]
tags: ["intermediate","feature-selection","mutual-information","regularization"]
video:
  platform: youtube
  id: 9rG3WIS5x9I
  start: 0
  end: 600
widgets:
  - type: "feature_selector"
    data: "/widgets/feature_selector.titanic.json"
goals:
  - Compare filter (corr/MI), wrapper, and embedded methods
  - Use cross-validation to validate selection
  - Recognize when fewer features beats more
quiz:
  - q: Mutual information works with…
    options: ["Only numeric","Only categorical","Both numeric & categorical","Only text"]
    answer: 2
    explain: MI measures dependency for various variable types.
  - q: Embedded selection example:
    options: ["Pearson correlation","RFE wrapper","L1/L2-regularized models","Random selection"]
    answer: 2
    explain: Regularized models inherently down-weight/unselect features.
flashcards:
  - Filter Methods: Score features individually (corr/MI)
  - Wrapper Methods: Search subsets with a model (RFE)
  - Embedded Methods: Selection during training (L1/L2, tree importances)
  - Cross-Validation: Estimate generalization across folds
reflection:
  - "Pick a dataset. Which 5 features would you keep and why?"
next: "ai-builder-ch2-lesson3"
---

## Hook
More features ≠ better model. Irrelevant or redundant inputs add noise and overfitting.

## Watch
Watch [Feature Selection Overview](https://www.youtube.com/watch?v=9rG3WIS5x9I) (0–10 min) to understand different selection strategies.

## Concept
- **Filters:** Pearson correlation (numeric), mutual information (flexible).
- **Wrappers:** RFE; expensive but thorough.
- **Embedded:** L1 (sparse), L2 (shrinkage), tree importances, permutation importance.
- **Guardrails:** always re-score via CV; track performance vs #features.

## Do (Interactive)
Use the **Feature Selector** and **CV Compare** widgets:
1. **Feature Selector**: Rank features using corr/MI/importances.  
2. **CV Compare**: Evaluate 5, 10, and "all" features across two models.

## Quiz
Test your understanding with the quiz questions above.

## Reflection
Pick a dataset you know. Which 5 features would you keep and why? Consider both statistical significance and domain knowledge.

## References
- [Scikit-learn: Feature Selection](https://scikit-learn.org/stable/modules/feature_selection.html)  
- [Mutual Information for Feature Selection](https://scikit-learn.org/stable/modules/generated/sklearn.feature_selection.mutual_info_regression.html)  
- [Permutation Importance](https://scikit-learn.org/stable/modules/permutation_importance.html)
