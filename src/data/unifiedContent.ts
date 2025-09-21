// Unified content structure for both 4-week quest and story mode
export interface Superpower {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  unlockedAt: string; // lesson ID when unlocked
  level: number;
  maxLevel: number;
}

export interface CharacterProgression {
  characterId: string;
  name: string;
  level: number;
  xp: number;
  superpowers: Superpower[];
  achievements: string[];
  completedLessons: string[];
  currentStreak: number;
  totalLearningTime: number; // in minutes
}

export interface LearningUnit {
  id: string;
  title: string;
  description: string;
  duration_min: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'interactive' | 'coding' | 'quiz' | 'project';
  
  // Video content
  video?: {
    id: string;
    title: string;
    start: number;
    end: number;
    description: string;
    transcript?: string;
  };
  
  // Interactive elements
  quiz?: {
    questions: Array<{
      id: string;
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }>;
  };
  
  // Coding challenges
  coding?: {
    starterCode: string;
    solution: string;
    testCases: Array<{
      input: string;
      expectedOutput: string;
    }>;
  };
  
  // Flashcards
  flashcards: Array<{
    front: string;
    back: string;
    category: string;
  }>;
  
  // Superpower unlocked
  superpower?: {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
  };
  
  // Prerequisites
  prerequisites: string[];
  
  // Next unit
  next: string | null;
}

export interface Week {
  id: string;
  title: string;
  description: string;
  theme: string;
  color: string;
  icon: string;
  units: LearningUnit[];
  superpowerTheme: string;
}

// 4-Week AI Fundamentals Content
export const aiFundamentalsContent: Week[] = [
  {
    id: 'week-1',
    title: 'Week 1: AI Foundations',
    description: 'Build your AI knowledge foundation and unlock your first superpowers',
    theme: 'Discovery',
    color: 'from-blue-500 to-cyan-600',
    icon: '🔍',
    superpowerTheme: 'Perception Powers',
    units: [
      {
        id: 'what-is-ai',
        title: 'What is Artificial Intelligence?',
        description: 'Discover the fundamentals of AI and unlock your Perception superpower',
        duration_min: 20,
        difficulty: 'beginner',
        type: 'video',
        video: {
          id: 'VMj-3S1tku0',
          title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
          start: 60,
          end: 420,
          description: 'Andrej Karpathy explains the fundamentals of neural networks and how they learn',
          transcript: 'In this video, we explore what artificial intelligence really means through the lens of neural networks and backpropagation...'
        },
        quiz: {
          questions: [
            {
              id: 'q1',
              question: 'What best describes learning in ML?',
              options: ['Write rules', 'Fit parameters to reduce loss', 'Memorize examples', 'Try random actions'],
              correct: 1,
              explanation: 'Models adjust parameters to minimize loss on data.'
            }
          ]
        },
        flashcards: [
          { front: 'What is AI?', back: 'Artificial Intelligence - systems that can perform tasks requiring human intelligence', category: 'basics' },
          { front: 'What is Machine Learning?', back: 'A subset of AI that learns patterns from data', category: 'basics' }
        ],
        superpower: {
          id: 'perception',
          name: 'AI Perception',
          description: 'You can now see AI systems in everyday life',
          icon: '👁️',
          color: 'text-blue-500'
        },
        prerequisites: [],
        next: 'ai-in-daily-life'
      },
      {
        id: 'ai-in-daily-life',
        title: 'AI in Your Daily Life',
        description: 'Identify AI touchpoints and enhance your Perception power',
        duration_min: 25,
        difficulty: 'beginner',
        type: 'interactive',
        video: {
          id: 'VMj-3S1tku0',
          title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
          start: 30,
          end: 390,
          description: 'Andrej Karpathy shows how neural networks power everyday AI applications'
        },
        quiz: {
          questions: [
            {
              id: 'q1',
              question: 'Which is a reasonable objective for a spam filter?',
              options: ['Max clicks', 'Minimize false positives', 'Max time on site', 'Random delivery'],
              correct: 1,
              explanation: 'False positives harm user trust; precision/recall trade-offs apply.'
            }
          ]
        },
        flashcards: [
          { front: 'Spam filter goal', back: 'Minimize false positives while catching spam', category: 'applications' },
          { front: 'Recommendation system', back: 'Predicts user preferences based on history', category: 'applications' }
        ],
        superpower: {
          id: 'pattern-recognition',
          name: 'Pattern Recognition',
          description: 'You can identify AI patterns in any system',
          icon: '🔍',
          color: 'text-green-500'
        },
        prerequisites: ['what-is-ai'],
        next: 'first-python-code'
      },
      {
        id: 'first-python-code',
        title: 'Your First Python Code',
        description: 'Write your first AI code and unlock Programming powers',
        duration_min: 30,
        difficulty: 'beginner',
        type: 'coding',
        video: {
          id: 'VMj-3S1tku0',
          title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
          start: 10,
          end: 210,
          description: 'Andrej Karpathy demonstrates Python coding for AI with micrograd implementation'
        },
        coding: {
          starterCode: `# Your first AI code
nums = [3, 1, 4, 1, 5, 9]
mean = sum(nums) / len(nums)

# TODO: compute the median
print("Count:", len(nums))
print("Mean:", round(mean, 3))`,
          solution: `# Your first AI code
nums = [3, 1, 4, 1, 5, 9]
mean = sum(nums) / len(nums)

# Compute median
sorted_nums = sorted(nums)
n = len(sorted_nums)
if n % 2 == 0:
    median = (sorted_nums[n//2-1] + sorted_nums[n//2]) / 2
else:
    median = sorted_nums[n//2]

print("Count:", len(nums))
print("Mean:", round(mean, 3))
print("Median:", median)`,
          testCases: [
            { input: '[1, 2, 3, 4, 5]', expectedOutput: 'Mean: 3.0, Median: 3' },
            { input: '[1, 2, 3, 4]', expectedOutput: 'Mean: 2.5, Median: 2.5' }
          ]
        },
        flashcards: [
          { front: 'Python len() function', back: 'Returns the number of elements in a list', category: 'python' },
          { front: 'Mean calculation', back: 'Sum of values divided by count', category: 'statistics' }
        ],
        superpower: {
          id: 'programming',
          name: 'AI Programming',
          description: 'You can write code to work with data and AI',
          icon: '💻',
          color: 'text-purple-500'
        },
        prerequisites: ['ai-in-daily-life'],
        next: 'data-exploration'
      },
      {
        id: 'data-exploration',
        title: 'Exploring Data',
        description: 'Learn to explore and understand data patterns',
        duration_min: 35,
        difficulty: 'beginner',
        type: 'interactive',
        video: {
          id: 'VMj-3S1tku0',
          title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
          start: 45,
          end: 480,
          description: 'Andrej Karpathy shows data exploration through neural network training examples'
        },
        quiz: {
          questions: [
            {
              id: 'q1',
              question: 'What is the first step in data exploration?',
              options: ['Build a model', 'Clean the data', 'Visualize the data', 'Understand the data'],
              correct: 3,
              explanation: 'Always start by understanding what data you have and what it represents.'
            }
          ]
        },
        flashcards: [
          { front: 'Data exploration', back: 'Understanding data before building models', category: 'data' },
          { front: 'Data visualization', back: 'Using charts and graphs to understand data', category: 'data' }
        ],
        superpower: {
          id: 'data-sight',
          name: 'Data Sight',
          description: 'You can see patterns and insights in any dataset',
          icon: '📊',
          color: 'text-orange-500'
        },
        prerequisites: ['first-python-code'],
        next: null
      }
    ]
  },
  {
    id: 'week-2',
    title: 'Week 2: Machine Learning Basics',
    description: 'Master the fundamentals of machine learning',
    theme: 'Learning',
    color: 'from-green-500 to-emerald-600',
    icon: '🧠',
    superpowerTheme: 'Learning Powers',
    units: [
      {
        id: 'supervised-learning',
        title: 'Supervised Learning',
        description: 'Learn how machines learn from examples',
        duration_min: 30,
        difficulty: 'beginner',
        type: 'video',
        video: {
          id: 'kCc8FmEb1nY',
          title: 'Let\'s build GPT: from scratch, in code, spelled out.',
          start: 0,
          end: 600,
          description: 'Andrej Karpathy explains supervised learning through building GPT from scratch'
        },
        quiz: {
          questions: [
            {
              id: 'q1',
              question: 'What is supervised learning?',
              options: ['Learning without examples', 'Learning with labeled examples', 'Learning through trial and error', 'Learning from rewards'],
              correct: 1,
              explanation: 'Supervised learning uses labeled training data to learn patterns.'
            }
          ]
        },
        flashcards: [
          { front: 'Supervised learning', back: 'Learning with labeled training data', category: 'ml' },
          { front: 'Training data', back: 'Labeled examples used to train a model', category: 'ml' }
        ],
        superpower: {
          id: 'pattern-learning',
          name: 'Pattern Learning',
          description: 'You can learn patterns from examples like a machine',
          icon: '🎯',
          color: 'text-green-500'
        },
        prerequisites: ['data-exploration'],
        next: 'regression-basics'
      }
      // More units for week 2...
    ]
  }
  // Weeks 3 and 4...
];

// Character progression system
export const superpowers: Superpower[] = [
  {
    id: 'perception',
    name: 'AI Perception',
    description: 'See AI systems in everyday life',
    icon: '👁️',
    color: 'text-blue-500',
    unlockedAt: 'what-is-ai',
    level: 1,
    maxLevel: 5
  },
  {
    id: 'pattern-recognition',
    name: 'Pattern Recognition',
    description: 'Identify patterns in any system',
    icon: '🔍',
    color: 'text-green-500',
    unlockedAt: 'ai-in-daily-life',
    level: 1,
    maxLevel: 5
  },
  {
    id: 'programming',
    name: 'AI Programming',
    description: 'Write code for AI applications',
    icon: '💻',
    color: 'text-purple-500',
    unlockedAt: 'first-python-code',
    level: 1,
    maxLevel: 5
  },
  {
    id: 'data-sight',
    name: 'Data Sight',
    description: 'See insights in any dataset',
    icon: '📊',
    color: 'text-orange-500',
    unlockedAt: 'data-exploration',
    level: 1,
    maxLevel: 5
  }
];

// Helper functions
export function getUnitById(unitId: string): LearningUnit | null {
  for (const week of aiFundamentalsContent) {
    const unit = week.units.find(u => u.id === unitId);
    if (unit) return unit;
  }
  return null;
}

export function getWeekByUnitId(unitId: string): Week | null {
  for (const week of aiFundamentalsContent) {
    if (week.units.some(u => u.id === unitId)) {
      return week;
    }
  }
  return null;
}

export function getSuperpowerById(superpowerId: string): Superpower | null {
  return superpowers.find(sp => sp.id === superpowerId) || null;
}

export function calculateCharacterLevel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

export function getNextLevelXP(currentLevel: number): number {
  return currentLevel * 100;
}
