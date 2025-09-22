---
id: ai-builder-ch1-lesson1
title: Deep Dive into Algorithms
duration_min: 30
prereqs: ["ai-awakening-ch4-lesson4"]
tags: ["intermediate","algorithms","supervised","unsupervised"]
video:
  platform: youtube
  id: Og847HVwRSI
  start: 0
  end: 600
widgets:
  - type: "algorithm_explorer"
    data: ["Decision Tree","Random Forest","SVM","KNN"]
goals:
  - Compare supervised and unsupervised algorithms
  - "Understand key ML algorithms: Decision Trees, Random Forests, SVMs, KNN"
  - Learn when to choose each algorithm
quiz:
  - q: Which of these is NOT a supervised learning task?
    options: ["Spam detection","Movie recommendation","Digit recognition","K-means clustering"]
    answer: 3
    explain: K-means clustering is unsupervised learning.
  - q: Decision Trees are useful because…
    options: ["They handle categorical and numerical data","They always outperform neural networks","They require no training data","They can't be interpreted"]
    answer: 0
    explain: Decision Trees work well with mixed data types and are interpretable.
flashcards:
  - Supervised Learning: Training with labeled data
  - Unsupervised Learning: Training without labels
  - Decision Tree: Tree structure used for decisions
  - Random Forest: Ensemble of decision trees
  - SVM: Algorithm that finds separating hyperplanes
reflection:
  - "Which algorithm do you think best matches a real-world problem you care about?"
next: "ai-builder-ch1-lesson2"
---

## Hook
Imagine you're trying to teach a computer to spot spam emails. Should you use a tree of rules, many trees, or a boundary line separating "spam" and "not spam"? Each ML algorithm approaches this differently.

## Watch
Watch [StatQuest: Machine Learning Algorithms Overview](https://www.youtube.com/watch?v=Og847HVwRSI) (0–10 min). This gives you an intuitive overview of the main families of algorithms.

## Concept
- **Supervised learning:** model trained with input/output pairs (e.g., spam detection).  
- **Unsupervised learning:** model trained with only inputs (e.g., grouping customers).  
- **Key algorithms:**
  - **Decision Trees:** Split data using features → interpretable rules.  
  - **Random Forests:** Combine many trees → reduce variance.  
  - **Support Vector Machines (SVMs):** Find the "best" separating boundary (hyperplane).  
  - **K-Nearest Neighbors (KNN):** Predict label based on nearby points.

## Do (Interactive)
Use the **Algorithm Explorer** to:
1. Select "Decision Tree" and visualize how data gets split.  
2. Switch to "Random Forest" and see how multiple trees vote.  
3. Try "SVM" — adjust margin width and see how the boundary shifts.  
4. Try "KNN" — add points and see predictions change.

## Quiz
Test yourself with the quiz questions above.

## Reflection
Which algorithm feels most intuitive to you? Which would you trust in a real application like healthcare or banking?

## References
- [StatQuest: ML Algorithms Overview](https://www.youtube.com/watch?v=Og847HVwRSI)  
- [Scikit-learn: Supervised vs Unsupervised](https://scikit-learn.org/stable/supervised_learning.html)  
- [ML Cheatsheet – Algorithms](https://ml-cheatsheet.readthedocs.io/en/latest/)
