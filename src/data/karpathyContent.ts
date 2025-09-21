export interface KarpathyVideoSegment {
  id: string;
  title: string;
  start: number; // seconds
  end: number; // seconds
  description: string;
  keyConcepts: string[];
  prerequisites: string[];
}

export interface KarpathyLesson {
  id: string;
  title: string;
  description: string;
  duration_min: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'interactive' | 'coding' | 'quiz' | 'prerequisite' | 'capstone';
  videoSegment?: KarpathyVideoSegment;
  prerequisites: string[];
  learningObjectives: string[];
  keyConcepts: string[];
  interactiveWidget?: {
    type: 'derivative_calculator' | 'gradient_visualizer' | 'backprop_simulator' | 'neural_network_builder';
    title: string;
    description: string;
  };
  quiz?: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation: string;
    difficulty: 'easy' | 'medium' | 'hard';
  }>;
  coding?: {
    starterCode: string;
    solution: string;
    hints: string[];
    expectedOutput?: string;
  };
  references?: Array<{
    title: string;
    url: string;
    type: 'paper' | 'blog' | 'code' | 'video';
  }>;
  glossary?: Array<{
    term: string;
    definition: string;
    example?: string;
  }>;
  reflection?: string[];
}

export interface KarpathyChapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  lessons: KarpathyLesson[];
  summary: string;
  nextChapterId?: string;
}

export interface KarpathyTrack {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  totalDuration: string;
  chapters: KarpathyChapter[];
  prerequisites: string[];
  outcomes: string[];
}

// Video Segments from Karpathy's "Neural Networks: Zero to Hero"
export const karpathyVideoSegments: KarpathyVideoSegment[] = [
  {
    id: 'micrograd-intro',
    title: 'Introduction to Neural Networks & Backprop',
    start: 0,
    end: 1800, // 30 minutes
    description: 'Karpathy introduces neural networks and the concept of backpropagation',
    keyConcepts: ['neural networks', 'backpropagation', 'gradients', 'loss functions'],
    prerequisites: ['basic python', 'basic calculus']
  },
  {
    id: 'micrograd-chain-rule',
    title: 'Chain Rule & Gradient Descent',
    start: 1800,
    end: 3600, // 30 minutes
    description: 'Deep dive into chain rule and how gradient descent works',
    keyConcepts: ['chain rule', 'gradient descent', 'optimization', 'learning rate'],
    prerequisites: ['derivatives', 'chain rule basics']
  },
  {
    id: 'micrograd-implementation',
    title: 'Building micrograd from Scratch',
    start: 3600,
    end: 7200, // 60 minutes
    description: 'Step-by-step implementation of micrograd autodiff library',
    keyConcepts: ['autodiff', 'computational graph', 'tensors', 'operations'],
    prerequisites: ['python classes', 'object-oriented programming']
  },
  {
    id: 'makemore-intro',
    title: 'Language Modeling with makemore',
    start: 0,
    end: 1800, // 30 minutes
    description: 'Introduction to character-level language modeling',
    keyConcepts: ['language modeling', 'bigrams', 'character-level', 'sampling'],
    prerequisites: ['probability basics', 'text processing']
  },
  {
    id: 'makemore-training',
    title: 'Training Neural Language Models',
    start: 1800,
    end: 5400, // 60 minutes
    description: 'Training dynamics and optimization for language models',
    keyConcepts: ['training', 'overfitting', 'validation', 'hyperparameters'],
    prerequisites: ['gradient descent', 'neural networks']
  },
  {
    id: 'gpt-tokenization',
    title: 'GPT Tokenization Deep Dive',
    start: 0,
    end: 2400, // 40 minutes
    description: 'Understanding tokenization in modern language models',
    keyConcepts: ['tokenization', 'BPE', 'vocabulary', 'encoding'],
    prerequisites: ['text processing', 'data structures']
  },
  {
    id: 'gpt-architecture',
    title: 'Transformer Architecture & Attention',
    start: 2400,
    end: 7200, // 80 minutes
    description: 'Building GPT from scratch with attention mechanisms',
    keyConcepts: ['transformer', 'attention', 'self-attention', 'positional encoding'],
    prerequisites: ['neural networks', 'matrix operations']
  }
];

// Track A: Karpathy Deep Track (Advanced)
export const karpathyAdvancedTrack: KarpathyTrack = {
  id: 'karpathy-advanced',
  title: 'Neural Networks: Zero to Hero (Advanced)',
  description: 'Follow Karpathy\'s original course with minimal supplementation for experienced learners',
  icon: '🧠',
  difficulty: 'advanced',
  totalDuration: '20-25 hours',
  prerequisites: ['Python proficiency', 'Calculus', 'Linear Algebra', 'Basic ML concepts'],
  outcomes: [
    'Build neural networks from scratch',
    'Understand backpropagation deeply',
    'Implement transformer architectures',
    'Train language models effectively'
  ],
  chapters: [
    {
      id: 'karpathy-ch1',
      title: 'Introduction & Foundations',
      description: 'Neural networks and backpropagation fundamentals',
      icon: '🔬',
      difficulty: 'advanced',
      estimatedTime: '4-5 hours',
      summary: 'Master the mathematical foundations of neural networks and automatic differentiation',
      nextChapterId: 'karpathy-ch2',
      lessons: [
        {
          id: 'karpathy-ch1-l1',
          title: 'Neural Networks & Backprop Introduction',
          description: 'Karpathy\'s introduction to neural networks and backpropagation',
          duration_min: 30,
          difficulty: 'advanced',
          type: 'video',
          videoSegment: karpathyVideoSegments[0],
          prerequisites: ['python', 'calculus'],
          learningObjectives: [
            'Understand what neural networks are',
            'Grasp the concept of backpropagation',
            'See how gradients flow through networks'
          ],
          keyConcepts: ['neural networks', 'backpropagation', 'gradients'],
          references: [
            {
              title: 'micrograd GitHub Repository',
              url: 'https://github.com/karpathy/micrograd',
              type: 'code'
            }
          ],
          reflection: [
            'How does backpropagation relate to the chain rule?',
            'Why is automatic differentiation important?'
          ]
        },
        {
          id: 'karpathy-ch1-l2',
          title: 'Chain Rule & Gradient Descent',
          description: 'Deep dive into the mathematical foundations',
          duration_min: 30,
          difficulty: 'advanced',
          type: 'video',
          videoSegment: karpathyVideoSegments[1],
          prerequisites: ['karpathy-ch1-l1'],
          learningObjectives: [
            'Master the chain rule for derivatives',
            'Understand gradient descent optimization',
            'See how learning rate affects training'
          ],
          keyConcepts: ['chain rule', 'gradient descent', 'optimization'],
          interactiveWidget: {
            type: 'derivative_calculator',
            title: 'Chain Rule Calculator',
            description: 'Practice computing derivatives using the chain rule'
          },
          reflection: [
            'Why does gradient descent work?',
            'How do you choose a good learning rate?'
          ]
        },
        {
          id: 'karpathy-ch1-l3',
          title: 'Building micrograd from Scratch',
          description: 'Implement automatic differentiation library',
          duration_min: 60,
          difficulty: 'advanced',
          type: 'coding',
          videoSegment: karpathyVideoSegments[2],
          prerequisites: ['karpathy-ch1-l2'],
          learningObjectives: [
            'Implement automatic differentiation',
            'Build a computational graph',
            'Create tensor operations'
          ],
          keyConcepts: ['autodiff', 'computational graph', 'tensors'],
          coding: {
            starterCode: `# Start building micrograd
class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op
    
    def __add__(self, other):
        # TODO: Implement addition
        pass`,
            solution: `class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op
    
    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        
        return out`,
            hints: [
              'Remember to track the computational graph',
              'Implement the backward pass for addition',
              'Don\'t forget to handle the gradient accumulation'
            ]
          },
          reflection: [
            'How does the computational graph help with backpropagation?',
            'What are the benefits of automatic differentiation?'
          ]
        }
      ]
    }
  ]
};

// Track B: Beginner + Supplemented Track
export const karpathyBeginnerTrack: KarpathyTrack = {
  id: 'karpathy-beginner',
  title: 'Neural Networks: Zero to Hero (Beginner)',
  description: 'Karpathy\'s course with extensive prerequisites and interactive supplements',
  icon: '🎓',
  difficulty: 'beginner',
  totalDuration: '30-35 hours',
  prerequisites: ['Basic programming concepts', 'High school math'],
  outcomes: [
    'Understand neural networks from first principles',
    'Build and train simple neural networks',
    'Implement backpropagation manually',
    'Create character-level language models',
    'Understand transformer architecture'
  ],
  chapters: [
    {
      id: 'karpathy-b0',
      title: 'Prerequisites',
      description: 'Essential math and programming foundations',
      icon: '📚',
      difficulty: 'beginner',
      estimatedTime: '6-8 hours',
      summary: 'Build the mathematical and programming foundations needed for neural networks',
      nextChapterId: 'karpathy-b1',
      lessons: [
        {
          id: 'karpathy-b0-l1',
          title: 'Python Basics for AI',
          description: 'Essential Python programming concepts for neural networks',
          duration_min: 90,
          difficulty: 'beginner',
          type: 'prerequisite',
          prerequisites: [],
          learningObjectives: [
            'Master Python data structures',
            'Understand functions and classes',
            'Learn NumPy basics for numerical computing'
          ],
          keyConcepts: ['python', 'data structures', 'functions', 'classes', 'numpy'],
          coding: {
            starterCode: `# Python Basics for AI
import numpy as np

# TODO: Create a simple neural network class
class SimpleNN:
    def __init__(self):
        # Initialize weights and biases
        pass
    
    def forward(self, x):
        # Implement forward pass
        pass`,
            solution: `import numpy as np

class SimpleNN:
    def __init__(self, input_size, hidden_size, output_size):
        self.W1 = np.random.randn(input_size, hidden_size) * 0.1
        self.b1 = np.zeros((1, hidden_size))
        self.W2 = np.random.randn(hidden_size, output_size) * 0.1
        self.b2 = np.zeros((1, output_size))
    
    def forward(self, x):
        self.z1 = np.dot(x, self.W1) + self.b1
        self.a1 = np.tanh(self.z1)
        self.z2 = np.dot(self.a1, self.W2) + self.b2
        return self.z2`,
            hints: [
              'Use NumPy for matrix operations',
              'Initialize weights with small random values',
              'Don\'t forget the bias terms'
            ]
          },
          reflection: [
            'How do classes help organize neural network code?',
            'Why is NumPy important for AI programming?'
          ]
        },
        {
          id: 'karpathy-b0-l2',
          title: 'Math Refresher: Derivatives & Linear Algebra',
          description: 'Essential mathematical concepts for understanding neural networks',
          duration_min: 120,
          difficulty: 'beginner',
          type: 'prerequisite',
          prerequisites: ['karpathy-b0-l1'],
          learningObjectives: [
            'Understand derivatives and the chain rule',
            'Master basic linear algebra operations',
            'Visualize mathematical concepts'
          ],
          keyConcepts: ['derivatives', 'chain rule', 'vectors', 'matrices', 'dot product'],
          interactiveWidget: {
            type: 'derivative_calculator',
            title: 'Derivative Calculator',
            description: 'Practice computing derivatives of simple functions'
          },
          quiz: [
            {
              question: 'What is the derivative of x²?',
              options: ['x', '2x', 'x²', '2x²'],
              correct: 1,
              explanation: 'Using the power rule: d/dx(x²) = 2x',
              difficulty: 'easy'
            },
            {
              question: 'What is the chain rule?',
              options: [
                'f(g(x))\' = f\'(g(x)) * g\'(x)',
                'f(g(x))\' = f\'(x) * g\'(x)',
                'f(g(x))\' = f(g\'(x))',
                'f(g(x))\' = f\'(x) + g\'(x)'
              ],
              correct: 0,
              explanation: 'The chain rule states that the derivative of a composite function is the product of the derivatives of the outer and inner functions.',
              difficulty: 'medium'
            }
          ],
          reflection: [
            'Why is the chain rule important for neural networks?',
            'How do matrix operations relate to neural network computations?'
          ]
        }
      ]
    },
    {
      id: 'karpathy-b1',
      title: 'Neural Network Intuition',
      description: 'Understanding what neural networks are and how they work',
      icon: '🧠',
      difficulty: 'beginner',
      estimatedTime: '4-5 hours',
      summary: 'Build intuitive understanding of neural networks before diving into implementation',
      nextChapterId: 'karpathy-b2',
      lessons: [
        {
          id: 'karpathy-b1-l1',
          title: 'What is a Neural Network?',
          description: 'Conceptual introduction to neural networks',
          duration_min: 45,
          difficulty: 'beginner',
          type: 'interactive',
          prerequisites: ['karpathy-b0-l2'],
          learningObjectives: [
            'Understand what neural networks are',
            'See how they relate to biological neurons',
            'Grasp the concept of learning from data'
          ],
          keyConcepts: ['neural networks', 'neurons', 'learning', 'data'],
          interactiveWidget: {
            type: 'neural_network_builder',
            title: 'Neural Network Builder',
            description: 'Build and visualize simple neural networks'
          },
          quiz: [
            {
              question: 'What is the basic building block of a neural network?',
              options: ['Algorithm', 'Neuron', 'Data', 'Function'],
              correct: 1,
              explanation: 'Neurons are the basic building blocks that process information.',
              difficulty: 'easy'
            }
          ],
          reflection: [
            'How do neural networks learn from data?',
            'What makes neural networks different from traditional programming?'
          ]
        },
        {
          id: 'karpathy-b1-l2',
          title: 'Perceptron & Simple Examples',
          description: 'Start with the simplest neural network: the perceptron',
          duration_min: 60,
          difficulty: 'beginner',
          type: 'coding',
          prerequisites: ['karpathy-b1-l1'],
          learningObjectives: [
            'Implement a perceptron from scratch',
            'Understand how weights and biases work',
            'See learning in action'
          ],
          keyConcepts: ['perceptron', 'weights', 'biases', 'activation function'],
          coding: {
            starterCode: `# Perceptron Implementation
import numpy as np

class Perceptron:
    def __init__(self, learning_rate=0.1):
        self.learning_rate = learning_rate
        # TODO: Initialize weights and bias
        pass
    
    def predict(self, x):
        # TODO: Implement prediction
        pass
    
    def train(self, X, y, epochs=100):
        # TODO: Implement training loop
        pass`,
            solution: `import numpy as np

class Perceptron:
    def __init__(self, learning_rate=0.1):
        self.learning_rate = learning_rate
        self.weights = None
        self.bias = 0
    
    def predict(self, x):
        # Linear combination
        z = np.dot(x, self.weights) + self.bias
        # Step function activation
        return 1 if z > 0 else 0
    
    def train(self, X, y, epochs=100):
        # Initialize weights
        self.weights = np.zeros(X.shape[1])
        
        for epoch in range(epochs):
            for i in range(len(X)):
                prediction = self.predict(X[i])
                error = y[i] - prediction
                
                # Update weights and bias
                self.weights += self.learning_rate * error * X[i]
                self.bias += self.learning_rate * error`,
            hints: [
              'Use a step function for activation',
              'Update weights based on prediction error',
              'Don\'t forget to update the bias term'
            ]
          },
          reflection: [
            'How does the perceptron learn?',
            'What are the limitations of a single perceptron?'
          ]
        }
      ]
    },
    {
      id: 'karpathy-b2',
      title: 'Micrograd & Backprop',
      description: 'Deep dive into Karpathy\'s micrograd with extensive supplementation',
      icon: '⚙️',
      difficulty: 'beginner',
      estimatedTime: '8-10 hours',
      summary: 'Master backpropagation through Karpathy\'s micrograd implementation with guided learning',
      nextChapterId: 'karpathy-b3',
      lessons: [
        {
          id: 'karpathy-b2-l1',
          title: 'Building micrograd – Intro & Foundational Concepts',
          description: 'First part of Karpathy\'s micrograd video with prerequisite explanations',
          duration_min: 30,
          difficulty: 'beginner',
          type: 'video',
          videoSegment: {
            id: 'micrograd-intro-beginner',
            title: 'Introduction to Neural Networks & Backprop (Beginner)',
            start: 0,
            end: 1800,
            description: 'Karpathy\'s introduction with beginner-friendly explanations',
            keyConcepts: ['neural networks', 'backpropagation', 'gradients'],
            prerequisites: ['python basics', 'basic math']
          },
          prerequisites: ['karpathy-b1-l2'],
          learningObjectives: [
            'Understand what backpropagation is',
            'See how gradients flow through networks',
            'Grasp the importance of automatic differentiation'
          ],
          keyConcepts: ['backpropagation', 'gradients', 'automatic differentiation'],
          interactiveWidget: {
            type: 'gradient_visualizer',
            title: 'Gradient Flow Visualizer',
            description: 'Visualize how gradients flow through a simple network'
          },
          reflection: [
            'Why is backpropagation important for training neural networks?',
            'How does automatic differentiation make our lives easier?'
          ]
        },
        {
          id: 'karpathy-b2-l2',
          title: 'Chain Rule, Loss, Gradient Descent',
          description: 'Mathematical foundations with interactive practice',
          duration_min: 45,
          difficulty: 'beginner',
          type: 'video',
          videoSegment: {
            id: 'micrograd-chain-rule-beginner',
            title: 'Chain Rule & Gradient Descent (Beginner)',
            start: 1800,
            end: 3600,
            description: 'Chain rule explanation with beginner-friendly examples',
            keyConcepts: ['chain rule', 'gradient descent', 'loss functions'],
            prerequisites: ['derivatives', 'basic calculus']
          },
          prerequisites: ['karpathy-b2-l1'],
          learningObjectives: [
            'Master the chain rule for derivatives',
            'Understand how gradient descent works',
            'See the relationship between loss and gradients'
          ],
          keyConcepts: ['chain rule', 'gradient descent', 'loss functions', 'optimization'],
          interactiveWidget: {
            type: 'derivative_calculator',
            title: 'Chain Rule Practice',
            description: 'Practice computing derivatives using the chain rule'
          },
          quiz: [
            {
              question: 'What is the chain rule formula?',
              options: [
                'f(g(x))\' = f\'(g(x)) * g\'(x)',
                'f(g(x))\' = f\'(x) * g\'(x)',
                'f(g(x))\' = f(g\'(x))',
                'f(g(x))\' = f\'(x) + g\'(x)'
              ],
              correct: 0,
              explanation: 'The chain rule states that the derivative of a composite function is the product of the derivatives of the outer and inner functions.',
              difficulty: 'medium'
            },
            {
              question: 'What does gradient descent do?',
              options: [
                'Finds the maximum of a function',
                'Finds the minimum of a function',
                'Finds the derivative of a function',
                'Finds the integral of a function'
              ],
              correct: 1,
              explanation: 'Gradient descent is an optimization algorithm that finds the minimum of a function by following the negative gradient.',
              difficulty: 'easy'
            }
          ],
          reflection: [
            'Why is the chain rule essential for neural networks?',
            'How does learning rate affect gradient descent?'
          ]
        },
        {
          id: 'karpathy-b2-l3',
          title: 'Manual Backprop Through Small Network',
          description: 'Step-by-step implementation with guided coding',
          duration_min: 90,
          difficulty: 'beginner',
          type: 'coding',
          videoSegment: {
            id: 'micrograd-implementation-beginner',
            title: 'Building micrograd from Scratch (Beginner)',
            start: 3600,
            end: 7200,
            description: 'Karpathy\'s implementation with detailed explanations',
            keyConcepts: ['autodiff', 'computational graph', 'tensors'],
            prerequisites: ['python classes', 'object-oriented programming']
          },
          prerequisites: ['karpathy-b2-l2'],
          learningObjectives: [
            'Implement automatic differentiation',
            'Build a computational graph',
            'Understand how backpropagation works in code'
          ],
          keyConcepts: ['automatic differentiation', 'computational graph', 'tensors', 'backpropagation'],
          coding: {
            starterCode: `# Building micrograd - Beginner Version
class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op
    
    def __add__(self, other):
        # TODO: Implement addition with backward pass
        pass
    
    def __mul__(self, other):
        # TODO: Implement multiplication with backward pass
        pass
    
    def backward(self):
        # TODO: Implement backward pass
        pass`,
            solution: `class Value:
    def __init__(self, data, _children=(), _op=''):
        self.data = data
        self.grad = 0.0
        self._backward = lambda: None
        self._prev = set(_children)
        self._op = _op
    
    def __add__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data + other.data, (self, other), '+')
        
        def _backward():
            self.grad += out.grad
            other.grad += out.grad
        out._backward = _backward
        
        return out
    
    def __mul__(self, other):
        other = other if isinstance(other, Value) else Value(other)
        out = Value(self.data * other.data, (self, other), '*')
        
        def _backward():
            self.grad += other.data * out.grad
            other.grad += self.data * out.grad
        out._backward = _backward
        
        return out
    
    def backward(self):
        topo = []
        visited = set()
        def build_topo(v):
            if v not in visited:
                visited.add(v)
                for child in v._prev:
                    build_topo(child)
                topo.append(v)
        build_topo(self)
        
        self.grad = 1.0
        for node in reversed(topo):
            node._backward()`,
            hints: [
              'Remember to track the computational graph in _prev',
              'Implement the backward pass for each operation',
              'Use topological sort for the backward pass'
            ]
          },
          reflection: [
            'How does the computational graph help with backpropagation?',
            'What are the benefits of automatic differentiation?'
          ]
        },
        {
          id: 'karpathy-b2-l4',
          title: 'Reflect & Exercises',
          description: 'Consolidate learning with practice problems and reflection',
          duration_min: 60,
          difficulty: 'beginner',
          type: 'quiz',
          prerequisites: ['karpathy-b2-l3'],
          learningObjectives: [
            'Consolidate understanding of backpropagation',
            'Practice implementing neural network components',
            'Reflect on key concepts'
          ],
          keyConcepts: ['backpropagation', 'gradients', 'neural networks', 'automatic differentiation'],
          quiz: [
            {
              question: 'What is the purpose of the computational graph?',
              options: [
                'To store data',
                'To track operations for backpropagation',
                'To visualize the network',
                'To optimize performance'
              ],
              correct: 1,
              explanation: 'The computational graph tracks operations so we can compute gradients during backpropagation.',
              difficulty: 'medium'
            },
            {
              question: 'In automatic differentiation, when do we compute gradients?',
              options: [
                'During the forward pass',
                'During the backward pass',
                'Before training',
                'After training'
              ],
              correct: 1,
              explanation: 'Gradients are computed during the backward pass using the chain rule.',
              difficulty: 'easy'
            }
          ],
          reflection: [
            'How would you explain backpropagation to someone who has never heard of it?',
            'What was the most challenging part of implementing micrograd?',
            'How does this relate to training real neural networks?'
          ]
        }
      ]
    }
  ]
};

// Export all tracks
export const karpathyTracks: KarpathyTrack[] = [
  karpathyBeginnerTrack,
  karpathyAdvancedTrack
];

// Helper function to get track by ID
export function getKarpathyTrackById(id: string): KarpathyTrack | undefined {
  return karpathyTracks.find(track => track.id === id);
}

// Helper function to get chapter by ID
export function getKarpathyChapterById(trackId: string, chapterId: string): KarpathyChapter | undefined {
  const track = getKarpathyTrackById(trackId);
  return track?.chapters.find(chapter => chapter.id === chapterId);
}

// Helper function to get lesson by ID
export function getKarpathyLessonById(trackId: string, chapterId: string, lessonId: string): KarpathyLesson | undefined {
  const chapter = getKarpathyChapterById(trackId, chapterId);
  return chapter?.lessons.find(lesson => lesson.id === lessonId);
}
