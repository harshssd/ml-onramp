export interface Prerequisite {
  area: string;
  description: string;
  skills: string[];
}

export interface VideoSegment {
  id: string;
  title: string;
  start: number; // seconds
  end: number; // seconds
  description: string;
  keyConcepts: string[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  type: 'conceptual' | 'recall' | 'application';
}

export interface Flashcard {
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InteractiveWidget {
  type: 'regression_playground' | 'derivative_calculator' | 'gradient_visualizer' | 'micrograd_builder' | 'training_simulator';
  title: string;
  description: string;
  config?: Record<string, unknown>;
}

export interface Lesson {
  id: string;
  title: string;
  duration_min: number;
  prereqs: string[];
  tags: string[];
  video: VideoSegment;
  widgets: InteractiveWidget[];
  goals: string[];
  quiz: QuizQuestion[];
  tasks: string[];
  reflection: string[];
  flashcards: Flashcard[];
  references: Array<{
    title: string;
    url: string;
    type: 'video' | 'article' | 'code' | 'paper';
  }>;
  nextLessonId: string;
  hook: string;
  concept: string;
  handsOn: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  baseVideo: {
    id: string;
    title: string;
    duration: string;
    url: string;
  };
  referenceRepo: {
    name: string;
    url: string;
    description: string;
  };
  supplementaryWalkthrough: {
    title: string;
    url: string;
    author: string;
  };
  prerequisites: Prerequisite[];
  lessons: Lesson[];
  totalDuration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

// Prerequisites for Chapter 1
export const chapter1Prerequisites: Prerequisite[] = [
  {
    area: 'Python basics',
    description: 'variables, lists, loops, functions, basic object/class syntax',
    skills: ['Variables and data types', 'Lists and loops', 'Functions', 'Basic OOP concepts']
  },
  {
    area: 'Algebra',
    description: 'simple functions, linear functions, "slope" and "intercept", what is a line',
    skills: ['Linear functions', 'Slope and intercept', 'Graphing lines', 'Function notation']
  },
  {
    area: 'Calculus intuition',
    description: 'meaning of derivative (rate of change), chain rule in a non-rigorous sense',
    skills: ['Derivatives as rate of change', 'Chain rule basics', 'Gradient concept']
  },
  {
    area: 'What is a model vs rule-based system',
    description: 'intuitive understanding that some systems are programmed by rules and others "learn" from data',
    skills: ['Rule-based systems', 'Learning systems', 'Data-driven approaches']
  }
];

// Chapter 1: What is a Neural Network?
export const karpathyChapter1: Chapter = {
  id: 'karpathy-chapter-1',
  title: 'What is a Neural Network?',
  description: 'Master the fundamentals of neural networks through Karpathy\'s micrograd implementation',
  baseVideo: {
    id: 'VMj-3S1tku0',
    title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
    duration: '~2h25m',
    url: 'https://www.youtube.com/watch?v=VMj-3S1tku0'
  },
  referenceRepo: {
    name: 'karpathy/micrograd',
    url: 'https://github.com/karpathy/micrograd',
    description: 'tiny scalar autograd engine'
  },
  supplementaryWalkthrough: {
    title: 'Micrograd: The Spelled Out Intro to Neural Networks and BackProp — Written Walkthrough',
    url: 'https://medium.com/@nico_X/micrograd-the-spelled-out-intro-to-neural-networks-and-backprop-written-walkthrough-a7a6532ff3a4',
    author: 'Nicola Croce'
  },
  prerequisites: chapter1Prerequisites,
  totalDuration: '2h 30m',
  difficulty: 'beginner',
  lessons: [
    {
      id: 'zerotohero-ch1-lesson1',
      title: 'Introduction & What is AI / Neural Network',
      duration_min: 20,
      prereqs: [],
      tags: ['beginner', 'introduction', 'concept'],
      video: {
        id: 'micrograd-intro',
        title: 'Introduction & What is AI / Neural Network',
        start: 0,
        end: 720, // 0 to 12min
        description: 'What is learning, motivation, what are neural networks / overview; building micrograd setup',
        keyConcepts: ['learning', 'neural networks', 'rule-based vs learned systems', 'Value class']
      },
      widgets: [
        {
          type: 'regression_playground',
          title: 'Regression Playground',
          description: 'Pull the line up/down, change slope/intercept, see how your prediction error changes'
        }
      ],
      goals: [
        'Understand what learning means in ML',
        'Differentiate rules-based vs learning-based systems',
        'Grasp the basic concept of neural networks'
      ],
      quiz: [
        {
          id: 'q1',
          question: 'Which of the following is an example of a learning-based system?',
          options: ['If/else program', 'Spam filter trained from data', 'Hard-coded calculator', 'Manual rules for every case'],
          correct: 1,
          explanation: 'A spam filter trained from data adjusts its behavior based on examples.',
          difficulty: 'easy',
          type: 'conceptual'
        },
        {
          id: 'q2',
          question: 'What is a neuron in a neural network?',
          options: ['A function combining inputs and weights', 'A decision tree node', 'An if-else statement', 'A hard-coded threshold'],
          correct: 0,
          explanation: 'A neuron is a parameterized function combining inputs via weights and applying activation.',
          difficulty: 'medium',
          type: 'conceptual'
        }
      ],
      tasks: [
        'List 2 systems you use daily. Identify whether they are rules-based or learning-based.',
        'Think of a problem where a learning system might be better than a rule-based one.'
      ],
      reflection: [
        'What motivated you most about this lesson?',
        'What questions do you have about how "learning from data" might fail?'
      ],
      flashcards: [
        {
          front: 'Learning vs Rule-based',
          back: 'Learning systems adapt from data; rule-based systems follow hard-coded logic',
          category: 'concepts',
          difficulty: 'easy'
        },
        {
          front: 'Neuron',
          back: 'A parameterized function that combines inputs via weights and applies activation',
          category: 'architecture',
          difficulty: 'medium'
        },
        {
          front: 'Model',
          back: 'A mathematical representation that maps inputs to outputs',
          category: 'concepts',
          difficulty: 'easy'
        }
      ],
      references: [
        {
          title: 'Neural Networks: Zero to Hero — "Building micrograd" video',
          url: 'https://www.youtube.com/watch?v=VMj-3S1tku0',
          type: 'video'
        },
        {
          title: 'micrograd GitHub repo by Karpathy',
          url: 'https://github.com/karpathy/micrograd',
          type: 'code'
        },
        {
          title: 'Written walkthrough by Nicola Croce',
          url: 'https://medium.com/@nico_X/micrograd-the-spelled-out-intro-to-neural-networks-and-backprop-written-walkthrough-a7a6532ff3a4',
          type: 'article'
        },
        {
          title: '3Blue1Brown Neural Networks series',
          url: 'https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi',
          type: 'video'
        }
      ],
      nextLessonId: 'zerotohero-ch1-lesson2',
      hook: 'Learning doesn\'t mean writing every rule yourself. Think of how your phone autocorrects or suggests words—those systems learn from examples, not explicit rules. In this chapter, you\'ll see what it means to build a system that learns.',
      concept: 'When we say "neural network," we mean a model that, given inputs, computes outputs using many small units (neurons), each controlled by parameters (weights). These weights are adjusted using data so that the output approximates some desired behavior.',
      handsOn: 'Use the regression sandbox widget: pull the line up/down, change slope/intercept, see how your prediction error changes. This helps you build intuition for how parameters affect output.'
    },
    {
      id: 'zerotohero-ch1-lesson2',
      title: 'Functions, Loss, Forward Pass',
      duration_min: 18,
      prereqs: ['zerotohero-ch1-lesson1'],
      tags: ['beginner', 'forward-pass', 'loss'],
      video: {
        id: 'micrograd-functions-loss',
        title: 'Functions, Loss, Forward Pass',
        start: 720, // 12:00
        end: 1800, // 30:00
        description: 'Defining Value class, forward pass (computations), loss function, scalar network, data flow',
        keyConcepts: ['Value class', 'forward pass', 'loss function', 'scalar network', 'data flow']
      },
      widgets: [
        {
          type: 'micrograd_builder',
          title: 'Micrograd Builder',
          description: 'Build simple Value objects and see how forward pass works'
        }
      ],
      goals: [
        'Understand the Value class and its role in computation',
        'Grasp how forward pass works in neural networks',
        'Learn what loss functions measure'
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What does the forward pass do in a neural network?',
          options: ['Computes gradients', 'Updates weights', 'Computes outputs from inputs', 'Checks for errors'],
          correct: 2,
          explanation: 'The forward pass computes outputs from inputs by flowing data through the network.',
          difficulty: 'easy',
          type: 'conceptual'
        },
        {
          id: 'q2',
          question: 'What is the purpose of a loss function?',
          options: ['To measure how wrong our predictions are', 'To update weights', 'To compute gradients', 'To initialize parameters'],
          correct: 0,
          explanation: 'A loss function measures how wrong our predictions are compared to the true values.',
          difficulty: 'medium',
          type: 'conceptual'
        }
      ],
      tasks: [
        'Create a simple Value object and compute a basic forward pass',
        'Explain in your own words what happens during the forward pass'
      ],
      reflection: [
        'How does the forward pass relate to how you might solve a math problem step by step?',
        'Why do you think we need to measure how wrong our predictions are?'
      ],
      flashcards: [
        {
          front: 'Forward pass',
          back: 'The process of computing outputs from inputs by flowing data through the network',
          category: 'computation',
          difficulty: 'easy'
        },
        {
          front: 'Loss function',
          back: 'A function that measures how wrong our predictions are compared to true values',
          category: 'optimization',
          difficulty: 'medium'
        },
        {
          front: 'Value class',
          back: 'A class that represents a scalar value and tracks its computational history',
          category: 'implementation',
          difficulty: 'medium'
        }
      ],
      references: [
        {
          title: 'micrograd Value class implementation',
          url: 'https://github.com/karpathy/micrograd/blob/master/micrograd/engine.py',
          type: 'code'
        },
        {
          title: 'Loss Functions in Machine Learning',
          url: 'https://towardsdatascience.com/common-loss-functions-in-machine-learning-46af0ffc4d23',
          type: 'article'
        }
      ],
      nextLessonId: 'zerotohero-ch1-lesson3',
      hook: 'Now that you understand what neural networks are, let\'s see how they actually compute things. Every neural network is just a fancy way of combining numbers using simple operations.',
      concept: 'The forward pass is how neural networks compute outputs. Each neuron takes inputs, multiplies them by weights, adds a bias, and applies an activation function. The loss function tells us how far off our predictions are.',
      handsOn: 'Use the micrograd builder to create simple Value objects and see how the forward pass works step by step.'
    },
    {
      id: 'zerotohero-ch1-lesson3',
      title: 'Backpropagation & the Chain Rule',
      duration_min: 20,
      prereqs: ['zerotohero-ch1-lesson2'],
      tags: ['beginner', 'backpropagation', 'chain-rule'],
      video: {
        id: 'micrograd-backprop',
        title: 'Backpropagation & the Chain Rule',
        start: 1800, // 30:00
        end: 3000, // 50:00
        description: 'How gradients flow backward, chain rule, computing partial derivatives; how gradient descent works in code',
        keyConcepts: ['backpropagation', 'chain rule', 'gradients', 'gradient descent']
      },
      widgets: [
        {
          type: 'derivative_calculator',
          title: 'Chain Rule Calculator',
          description: 'Practice computing derivatives using the chain rule'
        },
        {
          type: 'gradient_visualizer',
          title: 'Gradient Flow Visualizer',
          description: 'Watch how gradients flow backward through a simple network'
        }
      ],
      goals: [
        'Understand how backpropagation works',
        'Master the chain rule for computing derivatives',
        'See how gradients flow backward through networks'
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is the chain rule used for in neural networks?',
          options: ['Computing forward pass', 'Computing gradients', 'Updating weights', 'Initializing parameters'],
          correct: 1,
          explanation: 'The chain rule is used to compute gradients during backpropagation.',
          difficulty: 'medium',
          type: 'conceptual'
        },
        {
          id: 'q2',
          question: 'In backpropagation, gradients flow in which direction?',
          options: ['Forward through the network', 'Backward through the network', 'Both directions', 'Random direction'],
          correct: 1,
          explanation: 'Gradients flow backward through the network, from output to input.',
          difficulty: 'easy',
          type: 'conceptual'
        }
      ],
      tasks: [
        'Use the chain rule calculator to compute derivatives of composite functions',
        'Watch the gradient flow visualizer and explain what you see'
      ],
      reflection: [
        'Why do you think gradients need to flow backward?',
        'How does the chain rule help us compute gradients efficiently?'
      ],
      flashcards: [
        {
          front: 'Backpropagation',
          back: 'The process of computing gradients by flowing them backward through the network',
          category: 'optimization',
          difficulty: 'medium'
        },
        {
          front: 'Chain rule',
          back: 'A rule for computing the derivative of composite functions',
          category: 'mathematics',
          difficulty: 'medium'
        },
        {
          front: 'Gradient',
          back: 'The derivative of a function with respect to its parameters',
          category: 'mathematics',
          difficulty: 'medium'
        }
      ],
      references: [
        {
          title: '3Blue1Brown: Backpropagation',
          url: 'https://www.youtube.com/watch?v=Ilg3gGewQ5U',
          type: 'video'
        },
        {
          title: 'Chain Rule in Calculus',
          url: 'https://www.khanacademy.org/math/ap-calculus-ab/ab-differentiation-2-new/ab-3-1a/a/chain-rule-review',
          type: 'article'
        }
      ],
      nextLessonId: 'zerotohero-ch1-lesson4',
      hook: 'Now comes the magic: how do neural networks actually learn? The answer lies in a mathematical trick called backpropagation, which lets us efficiently compute how to adjust every parameter.',
      concept: 'Backpropagation uses the chain rule to compute gradients efficiently. Gradients tell us how much each parameter should change to reduce the loss. This is how neural networks learn.',
      handsOn: 'Use the derivative calculator to practice the chain rule, then watch gradients flow backward in the visualizer.'
    },
    {
      id: 'zerotohero-ch1-lesson4',
      title: 'Building the Network: Layers, Neurons, Patterns',
      duration_min: 30,
      prereqs: ['zerotohero-ch1-lesson3'],
      tags: ['beginner', 'architecture', 'layers'],
      video: {
        id: 'micrograd-layers',
        title: 'Building the Network: Layers, Neurons, Patterns',
        start: 3000, // 50:00
        end: 4800, // 1:20:00
        description: 'Assembling neurons into layers, activation functions, MLP architecture basics; how structure builds from simple units',
        keyConcepts: ['layers', 'neurons', 'activation functions', 'MLP', 'architecture']
      },
      widgets: [
        {
          type: 'neural_network_builder',
          title: 'Neural Network Builder',
          description: 'Build and visualize simple neural networks with different architectures'
        }
      ],
      goals: [
        'Understand how neurons are organized into layers',
        'Learn about different activation functions',
        'Grasp the concept of network architecture'
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is the purpose of activation functions?',
          options: ['To compute gradients', 'To add non-linearity', 'To update weights', 'To measure loss'],
          correct: 1,
          explanation: 'Activation functions add non-linearity to neural networks, enabling them to learn complex patterns.',
          difficulty: 'medium',
          type: 'conceptual'
        },
        {
          id: 'q2',
          question: 'What does MLP stand for?',
          options: ['Multi-Layer Perceptron', 'Machine Learning Pipeline', 'Maximum Likelihood Prediction', 'Multi-Linear Processing'],
          correct: 0,
          explanation: 'MLP stands for Multi-Layer Perceptron, a basic type of neural network architecture.',
          difficulty: 'easy',
          type: 'recall'
        }
      ],
      tasks: [
        'Build a simple 2-layer neural network using the builder',
        'Experiment with different activation functions and see how they affect the network'
      ],
      reflection: [
        'Why do you think we need multiple layers in neural networks?',
        'How do activation functions help networks learn complex patterns?'
      ],
      flashcards: [
        {
          front: 'Activation function',
          back: 'A function that adds non-linearity to neural networks',
          category: 'architecture',
          difficulty: 'medium'
        },
        {
          front: 'MLP',
          back: 'Multi-Layer Perceptron - a basic neural network architecture',
          category: 'architecture',
          difficulty: 'easy'
        },
        {
          front: 'Layer',
          back: 'A collection of neurons that process inputs in parallel',
          category: 'architecture',
          difficulty: 'easy'
        }
      ],
      references: [
        {
          title: 'Activation Functions in Neural Networks',
          url: 'https://towardsdatascience.com/activation-functions-neural-networks-1cbd9f8d91d6',
          type: 'article'
        },
        {
          title: 'Multi-Layer Perceptron Explained',
          url: 'https://en.wikipedia.org/wiki/Multilayer_perceptron',
          type: 'article'
        }
      ],
      nextLessonId: 'zerotohero-ch1-lesson5',
      hook: 'Individual neurons are powerful, but the real magic happens when we organize them into layers. This is where neural networks become capable of learning complex patterns.',
      concept: 'Neural networks organize neurons into layers. Each layer processes information and passes it to the next. Activation functions add non-linearity, enabling networks to learn complex patterns.',
      handsOn: 'Use the neural network builder to create different architectures and see how they work.'
    },
    {
      id: 'zerotohero-ch1-lesson5',
      title: 'Putting It Together & Training Loop',
      duration_min: 30,
      prereqs: ['zerotohero-ch1-lesson4'],
      tags: ['beginner', 'training', 'optimization'],
      video: {
        id: 'micrograd-training',
        title: 'Putting It Together & Training Loop',
        start: 4800, // 1:20:00
        end: 5400, // 1:50:00
        description: 'Training loop: forward, backward, update, iterate; effect of learning rate; stability issues',
        keyConcepts: ['training loop', 'learning rate', 'optimization', 'stability']
      },
      widgets: [
        {
          type: 'training_simulator',
          title: 'Training Simulator',
          description: 'Modify learning rate, see over-/underfitting, experiment with training dynamics'
        }
      ],
      goals: [
        'Understand the complete training loop',
        'Learn about learning rate and its effects',
        'Recognize common training problems'
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What are the main steps in a training loop?',
          options: ['Forward pass, backward pass, weight update', 'Initialize, forward pass, compute loss', 'Backward pass, update weights, check accuracy', 'Forward pass, compute loss, backward pass, update weights'],
          correct: 3,
          explanation: 'The training loop consists of forward pass, compute loss, backward pass, and update weights.',
          difficulty: 'medium',
          type: 'conceptual'
        },
        {
          id: 'q2',
          question: 'What happens if the learning rate is too high?',
          options: ['Training is too slow', 'Training becomes unstable', 'Training stops working', 'Training is perfect'],
          correct: 1,
          explanation: 'A learning rate that is too high can cause training to become unstable and oscillate.',
          difficulty: 'medium',
          type: 'conceptual'
        }
      ],
      tasks: [
        'Use the training simulator to experiment with different learning rates',
        'Try to find the optimal learning rate for a simple problem'
      ],
      reflection: [
        'Why do you think the learning rate is so important?',
        'What signs would you look for to know if training is going well?'
      ],
      flashcards: [
        {
          front: 'Training loop',
          back: 'The iterative process of forward pass, loss computation, backward pass, and weight updates',
          category: 'optimization',
          difficulty: 'medium'
        },
        {
          front: 'Learning rate',
          back: 'A hyperparameter that controls how much weights are updated during training',
          category: 'optimization',
          difficulty: 'medium'
        },
        {
          front: 'Overfitting',
          back: 'When a model learns the training data too well and fails to generalize',
          category: 'problems',
          difficulty: 'medium'
        }
      ],
      references: [
        {
          title: 'Learning Rate in Deep Learning',
          url: 'https://towardsdatascience.com/understanding-learning-rates-and-how-it-improves-performance-in-deep-learning-d0d4059c1c10',
          type: 'article'
        },
        {
          title: 'Training Neural Networks: Best Practices',
          url: 'https://karpathy.github.io/2019/04/25/recipe/',
          type: 'article'
        }
      ],
      nextLessonId: 'zerotohero-ch1-lesson6',
      hook: 'Now let\'s put everything together! You\'ll see how all the pieces work in harmony to train a neural network that actually learns.',
      concept: 'Training is the process of iteratively improving a neural network. We repeat: forward pass, compute loss, backward pass, update weights. The learning rate controls how much we change the weights each time.',
      handsOn: 'Use the training simulator to see how different learning rates affect training dynamics.'
    },
    {
      id: 'zerotohero-ch1-lesson6',
      title: 'Reflection, Diagnostics, Intuition',
      duration_min: 25,
      prereqs: ['zerotohero-ch1-lesson5'],
      tags: ['beginner', 'reflection', 'diagnostics'],
      video: {
        id: 'micrograd-reflection',
        title: 'Reflection, Diagnostics, Intuition',
        start: 5400, // 1:50:00
        end: 6000, // end
        description: 'Problems & pitfalls; checking gradient flow; what happens when you change hyperparameters; moral/intuition',
        keyConcepts: ['diagnostics', 'gradient flow', 'hyperparameters', 'intuition']
      },
      widgets: [
        {
          type: 'gradient_visualizer',
          title: 'Advanced Gradient Visualizer',
          description: 'Check gradient magnitudes and flow patterns'
        }
      ],
      goals: [
        'Learn to diagnose common training problems',
        'Understand the importance of gradient flow',
        'Develop intuition about hyperparameters'
      ],
      quiz: [
        {
          id: 'q1',
          question: 'What is a sign of vanishing gradients?',
          options: ['Gradients are too large', 'Gradients are too small', 'Gradients are zero', 'Gradients are negative'],
          correct: 1,
          explanation: 'Vanishing gradients occur when gradients become too small to effectively update weights.',
          difficulty: 'hard',
          type: 'conceptual'
        },
        {
          id: 'q2',
          question: 'Why is it important to check gradient flow?',
          options: ['To make training faster', 'To debug training problems', 'To reduce memory usage', 'To improve accuracy'],
          correct: 1,
          explanation: 'Checking gradient flow helps debug training problems and understand why learning might not be working.',
          difficulty: 'medium',
          type: 'conceptual'
        }
      ],
      tasks: [
        'Use the gradient visualizer to check for common problems',
        'Reflect on what you\'ve learned and write down your key insights'
      ],
      reflection: [
        'What was the most surprising thing you learned about neural networks?',
        'What questions do you still have about how neural networks work?',
        'How would you explain neural networks to someone who has never heard of them?'
      ],
      flashcards: [
        {
          front: 'Vanishing gradients',
          back: 'A problem where gradients become too small to effectively update weights',
          category: 'problems',
          difficulty: 'hard'
        },
        {
          front: 'Exploding gradients',
          back: 'A problem where gradients become too large and cause unstable training',
          category: 'problems',
          difficulty: 'hard'
        },
        {
          front: 'Hyperparameters',
          back: 'Parameters that control the learning process but are not learned from data',
          category: 'concepts',
          difficulty: 'medium'
        }
      ],
      references: [
        {
          title: 'The Vanishing Gradient Problem',
          url: 'https://towardsdatascience.com/the-vanishing-gradient-problem-69bf08b15484',
          type: 'article'
        },
        {
          title: 'Neural Network Debugging',
          url: 'https://karpathy.github.io/2019/04/25/recipe/',
          type: 'article'
        }
      ],
      nextLessonId: 'zerotohero-ch2-lesson1',
      hook: 'You\'ve built your first neural network! Now let\'s step back and think about what we\'ve learned, what can go wrong, and how to develop intuition about these systems.',
      concept: 'Neural networks are powerful but can be tricky to train. Understanding common problems like vanishing/exploding gradients and how to diagnose them is crucial for success.',
      handsOn: 'Use the advanced gradient visualizer to check for common training problems and develop your diagnostic skills.'
    }
  ]
};

// Helper functions
export function getLessonById(lessonId: string): Lesson | undefined {
  return karpathyChapter1.lessons.find(lesson => lesson.id === lessonId);
}

export function getNextLesson(currentLessonId: string): Lesson | undefined {
  const currentLesson = getLessonById(currentLessonId);
  if (!currentLesson) return undefined;
  return getLessonById(currentLesson.nextLessonId);
}

export function getAllFlashcards(): Flashcard[] {
  return karpathyChapter1.lessons.flatMap(lesson => lesson.flashcards);
}

export function getFlashcardsByCategory(category: string): Flashcard[] {
  return getAllFlashcards().filter(card => card.category === category);
}
