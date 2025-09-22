---
id: ai-builder-ch2-lesson1
title: Advanced Data Preprocessing
duration_min: 40
prereqs: ["ai-builder-ch1-lesson4"]
tags: ["intermediate","feature-engineering","preprocessing"]
video:
  platform: youtube
  id: 5sZ8oZDG7nA
  start: 0
  end: 720
widgets:
  - type: "dataset_explorer"
    data: "/widgets/dataset_explorer.titanic.json"
  - type: "transform_preview"
    data: "/widgets/transform_preview.titanic.json"
goals:
  - Identify data types and appropriate preprocessing for each (numeric, categorical, text, dates)
  - Apply imputation, encoding, scaling, and simple text prep
  - Understand data leakage and safe pipelines
quiz:
  - q: Which is the safest order?
    options: ["Scale→Split→Impute","Split→Impute→Encode→Scale","Impute→Encode→Split","Split→Scale→Encode→Impute"]
    answer: 1
    explain: Always split first; fit transforms on train only to avoid leakage.
  - q: One-hot encoding is typically used for…
    options: ["Numeric features","Categorical features","Dates only","Targets only"]
    answer: 1
    explain: One-hot turns categories into indicator columns.
flashcards:
  - Data Leakage: Using test info during training/transform fitting
  - Imputation: Filling missing values (median/most frequent)
  - One-Hot Encoding: Convert categories to binary columns
  - Standardization: Shift to mean 0, std 1
reflection:
  - "Name two columns in your dataset and list the exact transforms they need. Why?"
next: "ai-builder-ch2-lesson2"
---

## Hook
Great models start with great inputs. Most "ML wins" come from disciplined preprocessing, not just fancy models.

## Watch
Watch [Data Preprocessing Overview](https://www.youtube.com/watch?v=5sZ8oZDG7nA) (0–12 min) to understand the fundamentals of data preparation.

## Concept
- **Identify types:** numeric, categorical (low/high cardinality), text, dates, IDs.
- **Impute:** numeric→median, categorical→most frequent; document missingness.
- **Encode:** one-hot (low cardinality), target/ordinal encoders (with care).
- **Scale:** standardize or min-max; never fit on test.
- **Text basics:** lowercase, strip punctuation, simple token counts (TF/IDF later).
- **Pipelines:** fit transforms on **train only**; apply to val/test.

## Do (Interactive)
Use the **Dataset Explorer** and **Transform Preview** widgets:
1. **Dataset Explorer**: Inspect columns; mark type & missing %.  
2. **Transform Preview**: Toggle impute/encode/scale and see schema changes live.

## Quiz
Test your understanding with the quiz questions above.

## Reflection
Think about a dataset you've worked with. Name two columns and list the exact transforms they need. Why did you choose those specific transformations?

## References
- [Scikit-learn: Preprocessing & Pipelines](https://scikit-learn.org/stable/modules/preprocessing.html)  
- [Data Leakage in Machine Learning](https://machinelearningmastery.com/data-leakage-machine-learning/)  
- [Feature Engineering Best Practices](https://www.kaggle.com/learn/feature-engineering)
