---
id: ai-builder-ch1-lesson2
title: Ensemble Methods
duration_min: 30
prereqs: ["ai-builder-ch1-lesson1"]
tags: ["intermediate","algorithms","ensemble","boosting","bagging"]
video:
  platform: youtube
  id: 3kYujfDgmNk
  start: 0
  end: 720
widgets:
  - type: "ensemble_visualizer"
    data: ["Weak Learners","Bagging","Boosting"]
goals:
  - Understand the idea of combining weak learners into strong models
  - Learn the difference between bagging, boosting, and stacking
  - See why ensembles often outperform single models
quiz:
  - q: What's the main idea behind ensemble learning?
    options: ["One big tree is always better","Combine multiple models to improve performance","Always use deep learning","Avoid using training data"]
    answer: 1
    explain: Ensembles aggregate predictions of multiple models to reduce error.
  - q: Bagging works by…
    options: ["Training models on different subsets of data","Training models sequentially, correcting errors","Ignoring weak models","Stacking layers of neurons"]
    answer: 0
    explain: Bagging = bootstrap aggregating, trains on data subsets.
  - q: Boosting differs because…
    options: ["It trains models in parallel","It trains sequentially, focusing on mistakes","It ignores outliers","It's only used in vision tasks"]
    answer: 1
    explain: Boosting builds models one after another, correcting mistakes.
flashcards:
  - Ensemble Learning: Combining multiple models to improve predictions
  - Bagging: Training models on different samples of data and averaging results
  - Boosting: Training models sequentially, each fixing the errors of the last
  - Stacking: Combining predictions of multiple diverse models
reflection:
  - "Think of a real-world situation where multiple opinions (ensemble) work better than one. How does that apply to ML?"
next: "ai-builder-ch1-lesson3"
---

## Hook
If one person makes a decision, it can be biased. But if 100 people vote, the result is usually more reliable. ML ensembles work the same way: many weak models → one strong model.

## Watch
Watch [StatQuest: Ensembles](https://www.youtube.com/watch?v=3kYujfDgmNk) (0–12 min). It breaks down bagging, boosting, and stacking with simple analogies.

## Concept
- **Why Ensembles?** Reduce variance, bias, and overfitting.  
- **Bagging (Bootstrap Aggregating):** Train multiple models on random subsets → average results (e.g., Random Forest).  
- **Boosting:** Train models sequentially, focusing on errors of previous models (e.g., AdaBoost, Gradient Boosting, XGBoost).  
- **Stacking:** Train diverse models, combine their predictions with a meta-model.  

## Do (Interactive)
Use the **Ensemble Visualizer**:
1. Run multiple weak learners (e.g., shallow trees) → see poor accuracy.  
2. Apply bagging → accuracy improves.  
3. Apply boosting → errors shrink further.  
4. Compare final stacked model results.

## Quiz
Reinforce your understanding with the quiz questions above.

## Reflection
Think about voting, committees, or teamwork in your life. How does the "wisdom of the crowd" apply to data science?

## References
- [StatQuest: Ensemble Methods](https://www.youtube.com/watch?v=3kYujfDgmNk)  
- [Scikit-learn: Ensemble Methods](https://scikit-learn.org/stable/modules/ensemble.html)  
- [XGBoost Official Guide](https://xgboost.readthedocs.io/en/stable/)  
- [Kaggle: Ensemble Learning](https://www.kaggle.com/learn/ensemble-models)
