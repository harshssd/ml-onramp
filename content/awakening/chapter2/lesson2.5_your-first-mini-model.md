---
id: ai-awakening-ch2-lesson5
title: Your First Mini Model
duration_min: 30
prereqs: ["ai-awakening-ch2-lesson4"]
tags: ["beginner","ML","hands-on"]
video:
  platform: youtube
  id: Jw9Do8wq3U4
  start: 0
  end: 420
widgets:
  - type: "pyodide_runner"
    starter_code: |
      import numpy as np
      from sklearn.linear_model import LinearRegression
      
      X = np.array([[1],[2],[3],[4]])
      y = np.array([2,4,6,8])
      
      model = LinearRegression()
      model.fit(X,y)
      
      print("Prediction for 5:", model.predict([[5]]))
goals:
  - Train a simple linear regression
  - Make first prediction
quiz:
  - q: If X=[1,2,3], y=[2,4,6], the model predicts for X=4…
    options: ["7","8","10","16"]
    answer: 1
    explain: The model learns y=2x, so 4→8.
flashcards:
  - Linear Regression: Model that learns straight-line relationships
  - Prediction: Output from trained model
reflection:
  - "What real-world problems could you solve with a simple regression?"
next: "ai-awakening-ch3-lesson1"
---

## Watch
Watch [Intro ML Hands-On](https://www.youtube.com/watch?v=Jw9Do8wq3U4) (0–7 min).

## Do
Build your first linear model to predict house price from size. Share predictions with peers.
