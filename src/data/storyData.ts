export interface Character {
  name: string;
  background: string;
  motivation: string;
  experience: string;
}

export interface Chapter {
  id: string;
  title: string;
  storyText: string;
  objectives: string[];
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  type: 'theory' | 'interactive' | 'coding' | 'project' | 'quiz' | 'video';
  content: string;
  instructions: string;
  hints?: string[];
  code?: string;
  solution?: string;
  expectedOutput?: string;
  video?: {
    id: string;
    title: string;
    start: number;
    end: number;
    description: string;
  };
  resources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  story: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  skills: string[];
  prerequisites: string[];
  rewards: {
    xp: number;
    badges: string[];
    unlocks: string[];
  };
  icon: string;
  color: string;
  status: 'available' | 'locked' | 'completed';
  chapters: Chapter[];
}

export const learningPaths: LearningPath[] = [
  {
    id: 'data-explorer',
    title: 'AI Fundamentals for Everyone',
    description: 'Start your AI journey from scratch! Learn the basics of Artificial Intelligence and Machine Learning with no prior experience needed.',
    story: 'Welcome to the world of AI! You are about to embark on an exciting journey into Artificial Intelligence and Machine Learning. No prior experience needed - we\'ll guide you every step of the way.',
    difficulty: 'beginner',
    estimatedTime: '8-12 weeks',
    skills: ['Python Basics', 'Data Analysis', 'Visualization', 'ML Fundamentals', 'First Model'],
    prerequisites: [],
    rewards: {
      xp: 1000,
      badges: ['Data Explorer', 'Python Initiate', 'Visualization Artist', 'Model Builder'],
      unlocks: ['ML Practitioner Track', 'Advanced Algorithms', 'Community Access']
    },
    icon: '🌟',
    color: 'bg-gradient-to-r from-blue-500 to-purple-600',
    status: 'available',
    chapters: [
      {
        id: 'chapter-1',
        title: 'The First Steps',
        storyText: 'Professor Data welcomes you to the Academy. "Every journey begins with a single step," he says. "Today, you\'ll learn the fundamentals that will guide you through the world of Machine Learning."',
        objectives: [
          'Understand what Machine Learning is',
          'Learn basic Python concepts',
          'Write your first ML program',
          'Explore a real dataset'
        ],
        lessons: [
          {
            id: 'lesson-1-1',
            title: 'What is Machine Learning?',
            type: 'theory',
            content: 'Machine Learning is a subset of artificial intelligence that enables computers to learn and make decisions from data without being explicitly programmed for every task.',
            instructions: 'Read through the concept and answer the interactive questions.',
            hints: ['Think about how humans learn from experience', 'Consider how computers can do the same'],
            resources: [
              {
                title: 'Introduction to Machine Learning',
                url: 'https://example.com/ml-intro',
                type: 'article'
              }
            ]
          },
          {
            id: 'lesson-1-2',
            title: 'Your First Python Code',
            type: 'coding',
            content: 'Let\'s write your first Python program that demonstrates basic ML concepts.',
            instructions: 'Write a simple Python program that loads a dataset and prints basic information about it.',
            code: `# Your first ML program
import pandas as pd

# Load a sample dataset
data = pd.read_csv('sample_data.csv')

# Print basic information
print("Dataset shape:", data.shape)
print("\\nFirst few rows:")
print(data.head())`,
            solution: `import pandas as pd

# Load a sample dataset
data = pd.read_csv('sample_data.csv')

# Print basic information
print("Dataset shape:", data.shape)
print("\\nFirst few rows:")
print(data.head())

# Print data types
print("\\nData types:")
print(data.dtypes)`,
            expectedOutput: 'Dataset shape: (100, 4)\\n\\nFirst few rows:\\n   feature1  feature2  feature3  target\\n0      1.2      3.4      5.6       1\\n1      2.1      4.3      6.5       0',
            hints: ['Make sure to import pandas', 'Use the head() method to see the first few rows'],
            resources: [
              {
                title: 'Python for Data Science',
                url: 'https://example.com/python-ds',
                type: 'tutorial'
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'ml-practitioner',
    title: 'AI Applications & Projects',
    description: 'Build real AI projects and applications! Learn advanced machine learning techniques through hands-on projects.',
    story: 'You\'ve learned the fundamentals! Now it\'s time to build real AI applications and solve practical problems with machine learning.',
    difficulty: 'intermediate',
    estimatedTime: '12-16 weeks',
    skills: ['Advanced Algorithms', 'Model Evaluation', 'Feature Engineering', 'Hyperparameter Tuning'],
    prerequisites: [],
    rewards: {
      xp: 2000,
      badges: ['Algorithm Master', 'Model Evaluator', 'Feature Engineer', 'ML Practitioner'],
      unlocks: ['ML Engineer Track', 'Deep Learning Path', 'MLOps Specialization']
    },
    icon: '⚡',
    color: 'bg-gradient-to-r from-green-500 to-blue-600',
    status: 'available',
    chapters: []
  },
  {
    id: 'ml-engineer',
    title: 'AI Systems & Deployment',
    description: 'Master AI system design and deployment! Learn to build, deploy, and maintain AI systems in production.',
    story: 'You\'re ready for the big leagues! Learn to design, build, and deploy AI systems that work in the real world.',
    difficulty: 'advanced',
    estimatedTime: '16-20 weeks',
    skills: ['MLOps', 'Model Deployment', 'Monitoring', 'Scalability', 'Docker', 'Kubernetes'],
    prerequisites: [],
    rewards: {
      xp: 3000,
      badges: ['ML Engineer', 'DevOps Master', 'System Architect', 'Production Expert'],
      unlocks: ['Senior ML Engineer', 'ML Team Lead', 'Consulting Opportunities']
    },
    icon: '🔧',
    color: 'bg-gradient-to-r from-purple-500 to-pink-600',
    status: 'available',
    chapters: []
  },
  {
    id: 'video-mastery',
    title: 'AI Video Mastery Journey',
    description: 'Learn AI through immersive video experiences and interactive storytelling',
    story: 'Welcome to the Video Mastery Journey! You\'ll explore AI concepts through carefully curated video content, interactive experiences, and hands-on projects. Each video is designed to build your understanding step by step.',
    difficulty: 'beginner',
    estimatedTime: '6-8 weeks',
    skills: ['Video Learning', 'Interactive Content', 'Visual Learning', 'Storytelling', 'AI Concepts'],
    prerequisites: [],
    rewards: {
      xp: 1500,
      badges: ['Video Learner', 'Visual Thinker', 'Story Master', 'AI Explorer'],
      unlocks: ['Advanced Video Content', 'Interactive Projects', 'Community Access']
    },
    icon: '🎬',
    color: 'bg-gradient-to-r from-red-500 to-orange-600',
    status: 'available',
    chapters: [
      {
        id: 'video-intro',
        title: 'Chapter 1: The Video Learning Experience',
        storyText: 'In this chapter, you\'ll discover how video learning can accelerate your AI understanding. We\'ll explore different types of video content and how to make the most of each format.',
        objectives: [
          'Understand the power of video learning',
          'Learn to navigate video content effectively',
          'Practice with interactive video elements'
        ],
        lessons: [
          {
            id: 'video-intro-1',
            title: 'Welcome to Video Learning',
            type: 'video',
            content: 'Discover how video learning can transform your AI education journey.',
            instructions: 'Watch the introduction video and complete the interactive elements.',
            video: {
              id: 'VMj-3S1tku0',
              title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
              start: 0,
              end: 300,
              description: 'Andrej Karpathy introduces AI learning through neural networks'
            },
            resources: [
              {
                title: 'Video Learning Best Practices',
                url: 'https://example.com/video-learning',
                type: 'article'
              }
            ]
          },
          {
            id: 'video-intro-2',
            title: 'Interactive Video Elements',
            type: 'interactive',
            content: 'Learn how to use interactive video features to enhance your learning.',
            instructions: 'Complete the interactive video tutorial and practice with the controls.',
            video: {
              id: 'VMj-3S1tku0',
              title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
              start: 30,
              end: 450,
              description: 'Andrej Karpathy demonstrates interactive AI learning with hands-on coding'
            }
          }
        ]
      },
      {
        id: 'video-ai-concepts',
        title: 'Chapter 2: AI Concepts Through Video',
        storyText: 'Now we\'ll dive into core AI concepts using video explanations, visual demonstrations, and interactive examples.',
        objectives: [
          'Learn AI fundamentals through video',
          'Practice with visual AI demonstrations',
          'Complete interactive AI exercises'
        ],
        lessons: [
          {
            id: 'video-ai-1',
            title: 'What is Artificial Intelligence?',
            type: 'video',
            content: 'A comprehensive video explanation of AI concepts with visual examples.',
            instructions: 'Watch the video and take notes on key concepts.',
            video: {
              id: 'VMj-3S1tku0',
              title: 'The spelled-out intro to neural networks and backpropagation: building micrograd',
              start: 60,
              end: 600,
              description: 'Andrej Karpathy explains core AI concepts through neural networks'
            }
          },
          {
            id: 'video-ai-2',
            title: 'Machine Learning in Action',
            type: 'video',
            content: 'See machine learning algorithms in action with real-world examples.',
            instructions: 'Watch the demonstrations and try the interactive exercises.',
            video: {
              id: 'kCc8FmEb1nY',
              title: 'Let\'s build GPT: from scratch, in code, spelled out.',
              start: 120,
              end: 720,
              description: 'Andrej Karpathy demonstrates ML algorithms in practice with GPT'
            }
          }
        ]
      }
    ]
  }
];

export function getLearningPathById(id: string): LearningPath | undefined {
  return learningPaths.find(path => path.id === id);
}

export function getChapterById(pathId: string, chapterId: string): Chapter | undefined {
  const path = getLearningPathById(pathId);
  return path?.chapters.find(chapter => chapter.id === chapterId);
}

export function getLessonById(pathId: string, chapterId: string, lessonId: string): Lesson | undefined {
  const chapter = getChapterById(pathId, chapterId);
  return chapter?.lessons.find(lesson => lesson.id === lessonId);
}