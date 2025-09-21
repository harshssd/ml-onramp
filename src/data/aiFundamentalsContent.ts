// AI Fundamentals for Everyone - Comprehensive Content
// Chapter 1: Welcome to the World of AI

export interface LessonContent {
  id: string;
  title: string;
  type: 'theory' | 'interactive' | 'coding' | 'project' | 'quiz';
  description: string;
  estimatedTime: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  
  // Video content
  video?: {
    id: string;
    start: number;
    end: number;
    title: string;
    description: string;
  };
  
  // Interactive elements
  quiz?: {
    question: string;
    options: Array<{ id: string; label: string }>;
    correctId: string;
    explanation: string;
  };
  
  // Coding exercises
  coding?: {
    instructions: string;
    starterCode: string;
    solution: string;
    hints: string[];
  };
  
  // Interactive widgets
  widget?: {
    type: 'regression' | 'classification' | 'data-exploration' | 'neural-network';
    title: string;
    description: string;
  };
  
  // Content sections
  sections: Array<{
    title: string;
    content: string;
    type: 'text' | 'code' | 'image' | 'interactive';
  }>;
  
  // Resources
  resources: Array<{
    title: string;
    url: string;
    type: 'article' | 'video' | 'tutorial' | 'dataset' | 'interactive';
    description: string;
  }>;
  
  // Reflection questions
  reflection: string[];
  
  // Next lesson preview
  nextPreview: string;
}

export const aiFundamentalsChapter1: LessonContent[] = [
  {
    id: 'lesson-1-1',
    title: 'What is Artificial Intelligence?',
    type: 'theory',
    description: 'A practical, non-mathy introduction: what AI is, where it shows up, and how we\'ll learn it by doing.',
    estimatedTime: '15-20 minutes',
    difficulty: 'beginner',
    
    video: {
      id: 'VIDEO_ID', // Replace with actual Karpathy video ID
      start: 60,
      end: 420,
      title: 'Karpathy on intuition behind learning systems (excerpt)',
      description: 'A focused 6-minute segment explaining the core concepts of machine learning'
    },
    
    quiz: {
      question: 'Which statement best captures the core of "learning" in ML?',
      options: [
        { id: 'a', label: 'Writing explicit rules for every scenario' },
        { id: 'b', label: 'Fitting parameters from data to reduce error' },
        { id: 'c', label: 'Memorizing training examples exactly' },
        { id: 'd', label: 'Randomly trying actions until something works' }
      ],
      correctId: 'b',
      explanation: 'We pick a model family, then adjust parameters so predictions minimize a loss on data.'
    },
    
    widget: {
      type: 'regression',
      title: 'Linear Regression Sandbox',
      description: 'Drag the sliders and watch the fit and MSE update. This builds intuition before training.'
    },
    
    sections: [
      {
        title: 'Why this matters',
        content: 'AI systems learn patterns from data to make predictions or generate outputs. In this lesson, you\'ll build a mental model you can reuse across the course—then try a tiny interactive to lock it in.',
        type: 'text'
      },
      {
        title: 'The Big Picture',
        content: 'Think of AI as a very sophisticated pattern recognition system. Just like how you learned to recognize faces, AI learns to recognize patterns in data. The key difference? AI can process millions of examples in seconds.',
        type: 'text'
      },
      {
        title: 'Where You\'ll See AI',
        content: 'AI is already everywhere: your phone\'s camera recognizes faces, Google suggests search terms, Netflix recommends movies, and your bank detects fraud. These aren\'t magic—they\'re AI systems learning from data.',
        type: 'text'
      }
    ],
    
    resources: [
      {
        title: 'AI in Daily Life - Interactive Examples',
        url: 'https://example.com/ai-daily-life',
        type: 'interactive',
        description: 'Explore 20 real-world AI applications you use every day'
      },
      {
        title: 'The AI Revolution - Brief History',
        url: 'https://example.com/ai-history',
        type: 'article',
        description: 'How we got from simple calculators to ChatGPT'
      }
    ],
    
    reflection: [
      'What changes more: the line or the error when you nudge slope vs. intercept?',
      'How might noisy data affect the best-fit line?',
      'Can you think of 3 AI applications you used today?'
    ],
    
    nextPreview: 'We\'ll explore data quality: splitting train/validation/test sets and why leakage ruins evaluations.'
  },
  
  {
    id: 'lesson-1-2',
    title: 'AI in Your Daily Life',
    type: 'interactive',
    description: 'Discover 6 real-world AI applications through interactive scenarios and micro-quizzes.',
    estimatedTime: '20-25 minutes',
    difficulty: 'beginner',
    
    sections: [
      {
        title: 'Search Ranking',
        content: 'When you search "best pizza near me," Google uses AI to rank results based on relevance, distance, and your preferences. It learns from millions of searches to give you better results.',
        type: 'text'
      },
      {
        title: 'Spam Filter',
        content: 'Your email\'s spam filter uses AI to learn what spam looks like. It analyzes millions of emails to identify patterns and protect your inbox.',
        type: 'text'
      },
      {
        title: 'Autocomplete',
        content: 'When you type on your phone, AI predicts what you\'ll type next based on your writing patterns and common phrases.',
        type: 'text'
      },
      {
        title: 'Maps ETA',
        content: 'Google Maps uses AI to predict travel times by analyzing traffic patterns, road conditions, and historical data.',
        type: 'text'
      },
      {
        title: 'Image Tagging',
        content: 'Social media platforms use AI to automatically tag people in photos by learning facial features and patterns.',
        type: 'text'
      },
      {
        title: 'Fraud Detection',
        content: 'Banks use AI to detect unusual spending patterns and prevent fraudulent transactions in real-time.',
        type: 'text'
      }
    ],
    
    quiz: {
      question: 'Which AI application learns from your personal behavior patterns?',
      options: [
        { id: 'a', label: 'Search ranking (same for everyone)' },
        { id: 'b', label: 'Spam filter (learns from all users)' },
        { id: 'c', label: 'Autocomplete (learns from your typing)' },
        { id: 'd', label: 'Fraud detection (learns from all transactions)' }
      ],
      correctId: 'c',
      explanation: 'Autocomplete personalizes suggestions based on your individual typing patterns and writing style.'
    },
    
    resources: [
      {
        title: 'AI Applications Explorer',
        url: 'https://example.com/ai-applications',
        type: 'interactive',
        description: 'Interactive tool to explore different AI applications'
      }
    ],
    
    reflection: [
      'Which AI application surprised you the most?',
      'Can you identify the data each AI system needs to work?',
      'What new AI application would you like to see?'
    ],
    
    nextPreview: 'Now let\'s write your first Python code and see AI concepts in action!'
  },
  
  {
    id: 'lesson-1-3',
    title: 'Your First Python Code',
    type: 'coding',
    description: 'Write your first Python program that demonstrates basic AI concepts using a safe, in-browser environment.',
    estimatedTime: '25-30 minutes',
    difficulty: 'beginner',
    
    coding: {
      instructions: 'Complete the Python code below to load a dataset and print basic information about it. This is your first step into AI programming!',
      starterCode: `# Your first AI program
import pandas as pd

# Load a sample dataset
data = pd.read_csv('sample_data.csv')

# TODO: Print the shape of the dataset
print("Dataset shape:", ___)

# TODO: Print the first 5 rows
print("\\nFirst few rows:")
print(data.___())

# TODO: Print basic statistics
print("\\nBasic statistics:")
print(data.___())`,
      solution: `# Your first AI program
import pandas as pd

# Load a sample dataset
data = pd.read_csv('sample_data.csv')

# Print the shape of the dataset
print("Dataset shape:", data.shape)

# Print the first 5 rows
print("\\nFirst few rows:")
print(data.head())

# Print basic statistics
print("\\nBasic statistics:")
print(data.describe())`,
      hints: [
        'Use .shape to get the dimensions of the dataset',
        'Use .head() to see the first few rows',
        'Use .describe() to get statistical summary'
      ]
    },
    
    sections: [
      {
        title: 'Why Python for AI?',
        content: 'Python is the most popular language for AI because it\'s easy to learn, has powerful libraries, and a huge community. We\'ll use it throughout this course.',
        type: 'text'
      },
      {
        title: 'Understanding the Code',
        content: 'This simple program demonstrates the first step in any AI project: loading and exploring data. Every AI system starts with data!',
        type: 'text'
      }
    ],
    
    resources: [
      {
        title: 'Python Basics for AI',
        url: 'https://example.com/python-ai-basics',
        type: 'tutorial',
        description: 'Essential Python concepts for AI development'
      },
      {
        title: 'Pandas Documentation',
        url: 'https://pandas.pydata.org/docs/',
        type: 'article',
        description: 'Official pandas library documentation'
      }
    ],
    
    reflection: [
      'What did you learn about the dataset from the output?',
      'How might this data exploration help in building an AI model?',
      'What other information would you want to know about the data?'
    ],
    
    nextPreview: 'Now let\'s dive deeper into understanding data and its role in AI!'
  },
  
  {
    id: 'lesson-1-4',
    title: 'Understanding Data',
    type: 'interactive',
    description: 'Explore a real dataset interactively: toggle columns, sort data, calculate statistics, and spot potential issues.',
    estimatedTime: '30-35 minutes',
    difficulty: 'beginner',
    
    widget: {
      type: 'data-exploration',
      title: 'Interactive Data Explorer',
      description: 'Explore a real dataset with 10 rows of sample data. Toggle columns, sort, and calculate basic statistics.'
    },
    
    sections: [
      {
        title: 'Data is the Fuel of AI',
        content: 'Just like a car needs fuel, AI needs data. The quality and quantity of data directly affects how well your AI system will work.',
        type: 'text'
      },
      {
        title: 'Types of Data',
        content: 'Data comes in many forms: numbers (prices, temperatures), categories (colors, types), text (reviews, descriptions), and images. AI can learn from all of them!',
        type: 'text'
      },
      {
        title: 'Data Quality Matters',
        content: 'Bad data leads to bad AI. Missing values, errors, and biases in data can cause AI systems to make wrong decisions. Always check your data first!',
        type: 'text'
      }
    ],
    
    quiz: {
      question: 'What is the most important step before building an AI model?',
      options: [
        { id: 'a', label: 'Choosing the right algorithm' },
        { id: 'b', label: 'Understanding and cleaning your data' },
        { id: 'c', label: 'Writing efficient code' },
        { id: 'd', label: 'Getting more data' }
      ],
      correctId: 'b',
      explanation: 'Understanding and cleaning your data is crucial. Even the best algorithm will fail with poor quality data.'
    },
    
    resources: [
      {
        title: 'Data Quality Checklist',
        url: 'https://example.com/data-quality',
        type: 'article',
        description: 'Essential checklist for data quality assessment'
      },
      {
        title: 'Common Data Problems',
        url: 'https://example.com/data-problems',
        type: 'tutorial',
        description: 'Learn to identify and fix common data issues'
      }
    ],
    
    reflection: [
      'What patterns did you notice in the data?',
      'Are there any missing values or unusual entries?',
      'How might this data be used to make predictions?'
    ],
    
    nextPreview: 'Ready for your first AI project? Let\'s build something that predicts your mood based on weather!'
  },
  
  {
    id: 'lesson-1-5',
    title: 'Your First AI Project',
    type: 'project',
    description: 'Build a simple "AI" that predicts your mood based on weather data. This is your first complete AI project!',
    estimatedTime: '40-45 minutes',
    difficulty: 'beginner',
    
    sections: [
      {
        title: 'Project Overview',
        content: 'We\'ll build a simple system that predicts if you\'ll be in a good mood based on weather conditions. This demonstrates the complete AI workflow!',
        type: 'text'
      },
      {
        title: 'The AI Workflow',
        content: '1. Collect data 2. Explore and clean it 3. Choose a simple model 4. Train it 5. Test it 6. Use it to make predictions',
        type: 'text'
      }
    ],
    
    coding: {
      instructions: 'Complete this simple AI project step by step. Don\'t worry if it seems basic - every expert started here!',
      starterCode: `# Your First AI Project: Mood Predictor
import pandas as pd

# Step 1: Load the weather and mood data
weather_data = {
    'temperature': [22, 25, 18, 30, 15, 28, 20, 24, 26, 19],
    'sunny': [1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    'rainy': [0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    'good_mood': [1, 1, 0, 1, 0, 1, 0, 1, 1, 0]  # 1 = good mood, 0 = not good mood
}

df = pd.DataFrame(weather_data)
print("Weather and mood data:")
print(df)

# Step 2: Create a simple rule-based "AI"
def predict_mood(temperature, sunny, rainy):
    # TODO: Write your prediction logic here
    # Hint: Good weather usually means good mood!
    if ___ and ___:
        return 1  # Good mood
    else:
        return 0  # Not good mood

# Step 3: Test your AI
print("\\nTesting your AI:")
for i, row in df.iterrows():
    prediction = predict_mood(row['temperature'], row['sunny'], row['rainy'])
    actual = row['good_mood']
    print(f"Day {i+1}: Predicted {prediction}, Actual {actual}, {'✓' if prediction == actual else '✗'}")`,
      solution: `# Your First AI Project: Mood Predictor
import pandas as pd

# Step 1: Load the weather and mood data
weather_data = {
    'temperature': [22, 25, 18, 30, 15, 28, 20, 24, 26, 19],
    'sunny': [1, 1, 0, 1, 0, 1, 0, 1, 1, 0],
    'rainy': [0, 0, 1, 0, 1, 0, 1, 0, 0, 1],
    'good_mood': [1, 1, 0, 1, 0, 1, 0, 1, 1, 0]  # 1 = good mood, 0 = not good mood
}

df = pd.DataFrame(weather_data)
print("Weather and mood data:")
print(df)

# Step 2: Create a simple rule-based "AI"
def predict_mood(temperature, sunny, rainy):
    # Simple rule: Good weather (sunny and warm) usually means good mood!
    if sunny == 1 and temperature > 20:
        return 1  # Good mood
    else:
        return 0  # Not good mood

# Step 3: Test your AI
print("\\nTesting your AI:")
correct = 0
for i, row in df.iterrows():
    prediction = predict_mood(row['temperature'], row['sunny'], row['rainy'])
    actual = row['good_mood']
    if prediction == actual:
        correct += 1
    print(f"Day {i+1}: Predicted {prediction}, Actual {actual}, {'✓' if prediction == actual else '✗'}")

print(f"\\nAccuracy: {correct}/{len(df)} = {correct/len(df)*100:.1f}%")`,
      hints: [
        'Think about what weather conditions make you happy',
        'Use the sunny and temperature columns for your logic',
        'Try: if sunny == 1 and temperature > 20'
      ]
    },
    
    resources: [
      {
        title: 'AI Project Templates',
        url: 'https://example.com/ai-templates',
        type: 'tutorial',
        description: 'Ready-to-use templates for common AI projects'
      }
    ],
    
    reflection: [
      'How accurate was your simple AI?',
      'What other factors might affect mood?',
      'How could you improve the prediction accuracy?'
    ],
    
    nextPreview: 'Congratulations! You\'ve built your first AI system. Next, we\'ll explore more advanced concepts and real-world applications.'
  }
];

// Export helper functions
export function getLessonById(lessonId: string): LessonContent | undefined {
  return aiFundamentalsChapter1.find(lesson => lesson.id === lessonId);
}

export function getAllLessons(): LessonContent[] {
  return aiFundamentalsChapter1;
}

export function getLessonsByType(type: LessonContent['type']): LessonContent[] {
  return aiFundamentalsChapter1.filter(lesson => lesson.type === type);
}
