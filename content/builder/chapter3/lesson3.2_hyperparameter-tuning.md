---
id: ai-builder-ch3-lesson2
title: Hyperparameter Tuning
duration_min: 45
prereqs: ["ai-builder-ch3-lesson1"]
tags: ["intermediate","hyperparameter-tuning","optimization","cross-validation"]
video:
  platform: youtube
  id: HdlDYng8g9s
  start: 0
  end: 720
widgets:
  - type: "hyperparam_tuning_playground"
    data: "/widgets/hyperparam_tuning.titanic.json"
  - type: "cv_visualizer"
    data: "/widgets/cv_visualizer.titanic.json"
goals:
  - Understand the role of hyperparameters in ML models
  - Differentiate grid search, random search, and Bayesian optimization
  - Use cross-validation for reliable tuning
  - Visualize tuning results and interpret trade-offs
quiz:
  - q: Which hyperparameter search method is most efficient in very large spaces?
    options: ["Grid Search","Random Search","Manual Guessing","Bayesian Optimization"]
    answer: 1
    explain: Random search is more efficient than grid search in large hyperparameter spaces because it doesn't waste time on systematically exploring every combination.
  - q: Why should hyperparameter tuning use cross-validation?
    options: ["To get a reliable estimate of generalization performance","To make training faster","To prevent scaling issues","To reduce memory usage"]
    answer: 0
    explain: Cross-validation provides a more reliable estimate of how well the model will generalize to unseen data, which is crucial for hyperparameter tuning.
  - q: Bayesian optimization improves over random search by:
    options: ["Testing every possible combination","Using past trials to guide future searches","Ignoring results and guessing","Being faster than random search"]
    answer: 1
    explain: Bayesian optimization uses the results from previous trials to intelligently choose the next set of hyperparameters to test, making it more efficient than random search.
  - q: What is the main risk of overfitting to cross-validation folds during hyperparameter tuning?
    options: ["The model will be too simple","The hyperparameters may not generalize to new data","Training will be slower","The model will use too much memory"]
    answer: 1
    explain: Overfitting to CV folds means the hyperparameters are optimized for the specific CV splits rather than generalizing well to truly unseen data.
flashcards:
  - Hyperparameters: Settings outside the training process that control how a model learns
  - Grid Search: Exhaustive search through all combinations of hyperparameters
  - Random Search: Random sampling of hyperparameter combinations, more efficient than grid search
  - Bayesian Optimization: Intelligent search method that uses past results to guide future trials
  - Cross-Validation: Technique to get reliable performance estimates by splitting data into folds
  - Overfitting to CV: When hyperparameters are optimized too specifically for CV splits
reflection:
  - "How would you balance the trade-off between search thoroughness and computational cost?"
  - "What hyperparameters would you prioritize tuning for different model types?"
next: "ai-builder-ch3-lesson3"
---

## Introduction
Hyperparameters are the **settings outside the training process** that influence how a model learns (e.g., learning rate, tree depth, number of layers).

- **Parameters** → learned during training (weights, biases)
- **Hyperparameters** → set before training, control learning behavior

Getting them right can mean the difference between **underfitting** and **state-of-the-art results**.

## Search Methods

### Grid Search
- **How it works**: Try all combinations from a fixed set of hyperparameters
- **Pros**: Exhaustive, simple to understand, reproducible
- **Cons**: Expensive, inefficient for large spaces, can miss optimal regions
- **Best for**: Small hyperparameter spaces, when you need exhaustive coverage

### Random Search
- **How it works**: Sample random combinations from the hyperparameter space
- **Pros**: More efficient, often finds good results faster, scales better
- **Cons**: Not guaranteed to explore entire space, less systematic
- **Best for**: Large hyperparameter spaces, when you want good results quickly

### Bayesian Optimization
- **How it works**: Uses past results to choose the next promising set of hyperparameters
- **Pros**: Smarter search, fewer trials needed, balances exploration vs exploitation
- **Cons**: More complex, slower per iteration, requires good surrogate models
- **Best for**: Expensive evaluations, when you want optimal results with limited trials

## Best Practices

### 1. Use Cross-Validation
- Always tune on the **training set with CV**, not the test set
- Use stratified CV for classification problems
- Consider time series CV for temporal data

### 2. Start Simple, Then Refine
- Begin with coarse search over wide ranges
- Focus on the most important hyperparameters first
- Refine promising regions with finer search

### 3. Monitor Multiple Metrics
- Track both accuracy and training time
- Consider model complexity and interpretability
- Watch for signs of overfitting

### 4. Avoid Overfitting to CV
- Use nested CV if you need unbiased performance estimates
- Be cautious with very small datasets
- Validate final model on completely held-out test set

## Interactive Exploration
Use the **Hyperparameter Tuning Playground** and **CV Visualizer** to:

1. **Compare Search Methods**: Try grid, random, and Bayesian optimization
2. **Tune Different Models**: Logistic Regression, Random Forest, Neural Networks
3. **Visualize Results**: See how different hyperparameters affect performance
4. **Understand Trade-offs**: Balance accuracy vs training time vs complexity

## Common Hyperparameters by Model Type

### Linear Models
- **C (Regularization)**: Controls overfitting vs underfitting
- **Penalty**: L1 (sparse) vs L2 (smooth) regularization
- **Solver**: Algorithm for optimization

### Tree-Based Models
- **max_depth**: Maximum depth of trees
- **n_estimators**: Number of trees in ensemble
- **min_samples_split**: Minimum samples to split a node
- **learning_rate**: Step size for boosting algorithms

### Neural Networks
- **hidden_layer_sizes**: Architecture of the network
- **learning_rate**: Step size for weight updates
- **alpha**: L2 regularization strength
- **batch_size**: Number of samples per gradient update

## Quiz
Test your understanding with the quiz questions above.

## Reflection
Think about a model you've worked with. How would you balance the trade-off between search thoroughness and computational cost? What hyperparameters would you prioritize tuning?

## References
- [Scikit-learn: Hyperparameter Tuning](https://scikit-learn.org/stable/modules/grid_search.html)
- [Random Search vs Grid Search (Paper by Bergstra & Bengio)](https://www.jmlr.org/papers/volume13/bergstra12a/bergstra12a.pdf)
- [YouTube: Hyperparameter Tuning Explained](https://www.youtube.com/watch?v=HdlDYng8g9s)