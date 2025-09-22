---
id: ai-builder-ch1-lesson3
title: Neural Networks Fundamentals
duration_min: 40
prereqs: ["ai-builder-ch1-lesson2"]
tags: ["intermediate","neural-networks","deep-learning"]
video:
  platform: youtube
  id: aircAruvnKk
  start: 0
  end: 900
widgets:
  - type: "nn_visualizer"
    data: ["input-layer","hidden-layer","output-layer","weights","activation"]
goals:
  - Understand the structure of a neural network
  - Learn what weights, biases, and activation functions are
  - See how forward propagation works
  - Get intuition for why neural networks can approximate complex functions
quiz:
  - q: A neural network is made up of…
    options: ["Only input data","Layers of nodes connected by weights","Decision trees stacked","One big formula"]
    answer: 1
    explain: Neural nets consist of input, hidden, and output layers connected with weights and biases.
  - q: The role of the activation function is…
    options: ["To pass inputs unchanged","To introduce non-linearity","To normalize the output","To remove biases"]
    answer: 1
    explain: Without non-linear activation, neural nets collapse into a single linear function.
  - q: Forward propagation means…
    options: ["Adjusting weights backwards","Sending inputs through the network to get outputs","Deleting neurons","Adding more layers"]
    answer: 1
    explain: Forward pass = compute outputs from inputs layer by layer.
flashcards:
  - Neuron: Basic unit that applies weights and activation to inputs
  - Activation Function: Introduces non-linearity (ReLU, Sigmoid, Tanh)
  - Forward Propagation: Passing data through the network to compute outputs
  - Weights & Biases: Parameters adjusted during training to minimize error
reflection:
  - "Which activation function (Sigmoid, ReLU, Tanh) seems most intuitive to you, and why?"
next: "ai-builder-ch1-lesson4"
---

## Hook
Your brain is made of billions of neurons. Each one takes signals, processes them, and fires (or not). Neural networks mimic this idea with math. Let's see how.

## Watch
Watch [3Blue1Brown Neural Networks](https://www.youtube.com/watch?v=aircAruvnKk) (0–15 min). This gives the most intuitive visual explanation of how neural networks process data.

## Concept
- **Neurons:** Small functions that take inputs → apply weights → add bias → apply activation → output a value.  
- **Layers:** 
  - Input layer (raw data like pixels or words).  
  - Hidden layers (feature transformations).  
  - Output layer (predictions).  
- **Activation Functions:** Introduce non-linearity so networks can learn complex patterns. Common ones:  
  - **Sigmoid** (squashes values 0–1, good for probabilities)  
  - **ReLU** (fast, avoids vanishing gradient in deep nets)  
  - **Tanh** (centered, but can still saturate)  
- **Forward Propagation:** Flow of data from input → hidden layers → output.  
- **Why Neural Nets Work:** Layers of simple neurons can approximate any function with enough depth and training.

## Do (Interactive)
Use the **Neural Network Visualizer**:
1. Start with 2 inputs → 1 hidden layer → 1 output. Adjust weights.  
2. Add more hidden neurons, observe how output fits nonlinear curves.  
3. Switch activation functions and watch how the network response changes.  

## Quiz
Try the 3 quiz questions above to check your understanding.

## Reflection
Think about a problem in your daily life (e.g., predicting house prices, recognizing handwriting). How would inputs → hidden layers → output map onto this?

## References
- [3Blue1Brown: Neural Networks](https://www.youtube.com/watch?v=aircAruvnKk)  
- [CS231n: Neural Networks Basics](https://cs231n.github.io/neural-networks-1/)  
- [Scikit-learn: Neural Network Models](https://scikit-learn.org/stable/modules/neural_networks_supervised.html)  
- [DeepLearning.AI: Neural Networks and Deep Learning](https://www.deeplearning.ai/courses/neural-networks-and-deep-learning/)
