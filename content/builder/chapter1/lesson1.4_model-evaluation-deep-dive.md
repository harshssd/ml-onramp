---
id: ai-builder-ch1-lesson4
title: Model Evaluation Deep Dive
duration_min: 40
prereqs: ["ai-builder-ch1-lesson3"]
tags: ["intermediate","evaluation","metrics","classification","regression"]
video:
  platform: youtube
  id: 85dtiMz9tSo
  start: 0
  end: 1020
widgets:
  - type: "metrics_dashboard"
    data: ["Accuracy","Precision","Recall","F1","ROC","AUC","MSE","R²"]
goals:
  - Understand key metrics for evaluating ML models
  - Learn when accuracy is misleading
  - Compare evaluation metrics for classification vs regression
  - Use ROC curves and confusion matrices for deeper insights
quiz:
  - q: Which metric is best when data is highly imbalanced (e.g., fraud detection)?
    options: ["Accuracy","Precision & Recall","MSE","R²"]
    answer: 1
    explain: Accuracy can be misleading; Precision/Recall are better for imbalance.
  - q: Mean Squared Error (MSE) is used for…
    options: ["Classification","Regression","Clustering","Dimensionality Reduction"]
    answer: 1
    explain: MSE measures average squared difference between predicted and actual values in regression.
  - q: ROC Curve plots…
    options: ["Precision vs Recall","True Positive Rate vs False Positive Rate","MSE vs R²","Loss vs Epochs"]
    answer: 1
    explain: ROC shows trade-off between sensitivity (TPR) and fallout (FPR).
flashcards:
  - Accuracy: Percentage of correct predictions
  - Precision: % of predicted positives that are correct
  - Recall: % of actual positives that were found
  - F1 Score: Harmonic mean of precision and recall
  - ROC Curve: Plots TPR vs FPR
  - AUC: Area under ROC curve, overall model performance
  - MSE: Mean of squared errors in regression
  - R²: Variance explained by the model
reflection:
  - "Which metric would you use for medical diagnosis, and why?"
next: "ai-builder-ch2-lesson1"
---

## Hook
Imagine a model that predicts "not spam" for every email. It gets 95% accuracy if only 5% of emails are spam — but it's useless! That's why we need deeper metrics.

## Watch
Watch [StatQuest: Model Evaluation](https://www.youtube.com/watch?v=85dtiMz9tSo) (0–17 min). It covers the most important metrics for both classification and regression.

## Concept
- **Classification Metrics:**
  - Accuracy = (TP+TN)/(Total), but misleading with imbalance.
  - Precision = TP/(TP+FP) → of predicted positives, how many are correct.
  - Recall = TP/(TP+FN) → of actual positives, how many found.
  - F1 = balance of Precision & Recall.
  - Confusion Matrix = detailed breakdown of TP, FP, TN, FN.
  - ROC Curve & AUC = performance across thresholds.
- **Regression Metrics:**
  - MSE = mean squared error.
  - RMSE = square root of MSE, interpretable in original units.
  - MAE = mean absolute error, less sensitive to outliers.
  - R² = proportion of variance explained by the model.

## Do (Interactive)
Use the **Metrics Dashboard**:
1. Load a confusion matrix and toggle thresholds → watch Precision/Recall shift.  
2. Compare two classifiers on ROC curve → see which has higher AUC.  
3. Switch to regression dataset → view MSE, MAE, and R² side by side.

## Quiz
Test your knowledge with the quiz questions above.

## Reflection
Think about: Would you want a spam detector with high Recall (catch all spam, but maybe flag some normal emails) or high Precision (never flag normal emails, but miss some spam)? Why?

## References
- [StatQuest: Model Evaluation Metrics](https://www.youtube.com/watch?v=85dtiMz9tSo)  
- [Scikit-learn: Metrics and Scoring](https://scikit-learn.org/stable/modules/model_evaluation.html)  
- [ML Cheatsheet: Evaluation Metrics](https://ml-cheatsheet.readthedocs.io/en/latest/metrics.html)  
- [Hands-On ML (Aurélien Géron): Ch. 3 Evaluation Metrics]