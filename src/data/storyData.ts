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
  type: 'theory' | 'interactive' | 'coding' | 'project' | 'quiz';
  content: string;
  instructions: string;
  hints?: string[];
  code?: string;
  solution?: string;
  expectedOutput?: string;
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