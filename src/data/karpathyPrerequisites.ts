export interface PrerequisiteLesson {
  id: string;
  title: string;
  description: string;
  duration_min: number;
  area: string;
  skills: string[];
  content: {
    introduction: string;
    concepts: string[];
    examples: string[];
    practice: string[];
  };
  interactive: {
    type: 'python_playground' | 'math_visualizer' | 'concept_explorer' | 'quiz';
    title: string;
    description: string;
    config?: Record<string, unknown>;
  };
  quiz: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }>;
  nextLessonId?: string;
}

export const prerequisiteLessons: PrerequisiteLesson[] = [
  {
    id: 'prereq-python-basics',
    title: 'Python Basics for Neural Networks',
    description: 'Essential Python programming concepts needed for understanding neural network implementations',
    duration_min: 45,
    area: 'Python basics',
    skills: ['Variables and data types', 'Lists and loops', 'Functions', 'Basic OOP concepts'],
    content: {
      introduction: 'Before diving into neural networks, you need to understand the Python programming concepts that make neural network implementations possible. This lesson covers the essential Python skills you\'ll use throughout the course.',
      concepts: [
        'Variables and data types (int, float, bool, string)',
        'Lists and list operations',
        'For loops and while loops',
        'Functions and function parameters',
        'Basic object-oriented programming (classes, methods)',
        'Importing modules and using libraries'
      ],
      examples: [
        'Creating variables to store neural network parameters',
        'Using lists to store multiple values (like weights)',
        'Writing functions to compute forward pass',
        'Creating classes to represent neural network components'
      ],
      practice: [
        'Create a simple calculator class',
        'Write a function that computes the sum of a list',
        'Implement a basic linear function: y = mx + b'
      ]
    },
    interactive: {
      type: 'python_playground',
      title: 'Python Playground',
      description: 'Practice Python basics with hands-on coding exercises'
    },
    quiz: [
      {
        question: 'What is the correct way to create a list in Python?',
        options: ['list = []', 'list = {}', 'list = ()', 'list = []'],
        correct: 0,
        explanation: 'Lists in Python are created using square brackets [].'
      },
      {
        question: 'How do you define a function in Python?',
        options: ['function name():', 'def name():', 'function name():', 'def name():'],
        correct: 1,
        explanation: 'Functions in Python are defined using the def keyword followed by the function name and parentheses.'
      }
    ],
    nextLessonId: 'prereq-algebra-basics'
  },
  {
    id: 'prereq-algebra-basics',
    title: 'Algebra Fundamentals',
    description: 'Essential algebra concepts for understanding neural network mathematics',
    duration_min: 30,
    area: 'Algebra',
    skills: ['Linear functions', 'Slope and intercept', 'Graphing lines', 'Function notation'],
    content: {
      introduction: 'Neural networks are built on mathematical foundations. Understanding basic algebra will help you grasp how neural networks process information and learn from data.',
      concepts: [
        'Linear functions: y = mx + b',
        'Slope (m) and y-intercept (b)',
        'Graphing linear functions',
        'Function notation and evaluation',
        'Basic operations with functions'
      ],
      examples: [
        'A simple neuron: output = weight * input + bias',
        'Graphing the relationship between input and output',
        'Understanding how changing weight affects the slope',
        'Seeing how bias shifts the line up or down'
      ],
      practice: [
        'Graph the function y = 2x + 3',
        'Find the slope and y-intercept of y = -0.5x + 4',
        'Evaluate f(x) = 3x - 1 for x = 2'
      ]
    },
    interactive: {
      type: 'math_visualizer',
      title: 'Linear Function Visualizer',
      description: 'Graph linear functions and see how slope and intercept affect the line'
    },
    quiz: [
      {
        question: 'In the equation y = 3x + 2, what is the slope?',
        options: ['2', '3', 'x', 'y'],
        correct: 1,
        explanation: 'In the equation y = mx + b, m is the slope. So in y = 3x + 2, the slope is 3.'
      },
      {
        question: 'What does the y-intercept represent?',
        options: ['The slope of the line', 'Where the line crosses the y-axis', 'The steepness of the line', 'The rate of change'],
        correct: 1,
        explanation: 'The y-intercept (b in y = mx + b) is where the line crosses the y-axis when x = 0.'
      }
    ],
    nextLessonId: 'prereq-calculus-intuition'
  },
  {
    id: 'prereq-calculus-intuition',
    title: 'Calculus Intuition',
    description: 'Understanding derivatives and the chain rule for neural network learning',
    duration_min: 35,
    area: 'Calculus intuition',
    skills: ['Derivatives as rate of change', 'Chain rule basics', 'Gradient concept'],
    content: {
      introduction: 'Neural networks learn by adjusting their parameters to minimize error. This process relies on calculus concepts, particularly derivatives and the chain rule. Don\'t worry - we\'ll focus on intuition rather than rigorous proofs.',
      concepts: [
        'Derivatives as rate of change',
        'The chain rule for composite functions',
        'Gradients (partial derivatives)',
        'Why derivatives help us find minimums',
        'The connection between derivatives and learning'
      ],
      examples: [
        'How the slope of a function tells us which direction to go',
        'Using the chain rule to compute derivatives of complex functions',
        'Understanding how gradients guide weight updates',
        'Seeing derivatives as "how much does this change when that changes"'
      ],
      practice: [
        'Find the derivative of x²',
        'Use the chain rule to find the derivative of (2x + 1)²',
        'Explain what a gradient represents in your own words'
      ]
    },
    interactive: {
      type: 'math_visualizer',
      title: 'Derivative Visualizer',
      description: 'See how derivatives represent rate of change and practice the chain rule'
    },
    quiz: [
      {
        question: 'What does a derivative represent?',
        options: ['The value of a function', 'The rate of change of a function', 'The area under a curve', 'The maximum of a function'],
        correct: 1,
        explanation: 'A derivative represents the rate of change of a function - how fast the function is changing at a particular point.'
      },
      {
        question: 'What is the chain rule used for?',
        options: ['Adding functions', 'Finding derivatives of composite functions', 'Multiplying functions', 'Dividing functions'],
        correct: 1,
        explanation: 'The chain rule is used to find derivatives of composite functions (functions inside other functions).'
      }
    ],
    nextLessonId: 'prereq-rule-based-vs-learning'
  },
  {
    id: 'prereq-rule-based-vs-learning',
    title: 'Rule-Based vs Learning Systems',
    description: 'Understanding the difference between programmed and learning systems',
    duration_min: 25,
    area: 'What is a model vs rule-based system',
    skills: ['Rule-based systems', 'Learning systems', 'Data-driven approaches'],
    content: {
      introduction: 'Before understanding neural networks, it\'s important to grasp the fundamental difference between systems that follow hard-coded rules and systems that learn from data. This distinction is at the heart of machine learning.',
      concepts: [
        'Rule-based systems: explicit programming',
        'Learning systems: adaptation from data',
        'When to use each approach',
        'The power and limitations of both',
        'How neural networks fit into this picture'
      ],
      examples: [
        'A calculator (rule-based) vs a spam filter (learning)',
        'Chess program with hard-coded rules vs one that learns from games',
        'Weather prediction using physics equations vs machine learning',
        'Image recognition: traditional computer vision vs deep learning'
      ],
      practice: [
        'Identify whether common systems are rule-based or learning-based',
        'Think of problems where learning might be better than rules',
        'Consider the trade-offs between the two approaches'
      ]
    },
    interactive: {
      type: 'concept_explorer',
      title: 'System Classifier',
      description: 'Classify different systems as rule-based or learning-based'
    },
    quiz: [
      {
        question: 'Which is an example of a rule-based system?',
        options: ['Email spam filter', 'Calculator', 'Facial recognition', 'Recommendation system'],
        correct: 1,
        explanation: 'A calculator follows hard-coded mathematical rules, making it a rule-based system.'
      },
      {
        question: 'What is the main advantage of learning systems?',
        options: ['They are faster', 'They can adapt to new situations', 'They use less memory', 'They are easier to program'],
        correct: 1,
        explanation: 'Learning systems can adapt to new situations and patterns that weren\'t explicitly programmed.'
      }
    ],
    nextLessonId: 'zerotohero-ch1-lesson1'
  }
];

export function getPrerequisiteLessonById(id: string): PrerequisiteLesson | undefined {
  return prerequisiteLessons.find(lesson => lesson.id === id);
}

export function getPrerequisitesByArea(area: string): PrerequisiteLesson[] {
  return prerequisiteLessons.filter(lesson => lesson.area === area);
}
