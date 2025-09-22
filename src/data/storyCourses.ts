export interface StoryCourse {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  duration: string;
  estimatedHours: number;
  story: {
    hook: string;
    journey: string;
    outcome: string;
  };
  chapters: StoryChapter[];
  prerequisites: string[];
  targetAudience: string[];
  skills: string[];
  color: string;
  gradient: string;
}

export interface StoryChapter {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  lessons: number;
  story: {
    setup: string;
    challenge: string;
    resolution: string;
  };
  path: string;
  locked: boolean;
  completed: boolean;
}

// The AI Awakening: Your Journey from Curious to Capable
export const aiAwakeningCourse: StoryCourse = {
  id: 'ai-awakening',
  title: 'The AI Awakening',
  subtitle: 'From Curious to Capable',
  description: 'Begin your transformation from AI curious to AI capable. Discover the magic behind intelligent machines and build your first AI-powered creations.',
  icon: '🌟',
  difficulty: 'beginner',
  duration: '4-6 weeks',
  estimatedHours: 20,
  story: {
    hook: 'You\'ve seen AI everywhere - in your phone, your apps, your daily life. But have you ever wondered: "How does it actually work?" This is your awakening.',
    journey: 'Follow the journey of a curious mind discovering the secrets of artificial intelligence. From simple concepts to building your first neural network, you\'ll experience the "aha!" moments that change everything.',
    outcome: 'You\'ll emerge not just understanding AI, but thinking like an AI builder. Ready to create, innovate, and shape the future.'
  },
  chapters: [
    {
      id: 'awakening-ch1',
      title: 'The Spark of Intelligence',
      description: 'Discover what makes machines "think" and why it matters',
      icon: '⚡',
      duration: '2-3 hours',
      lessons: 4,
      story: {
        setup: 'You\'re about to discover something that will change how you see the world forever.',
        challenge: 'Can you teach a machine to recognize patterns like a human?',
        resolution: 'You\'ll build your first intelligent system and understand the magic behind it.'
      },
      path: '/learning/awakening/chapter1',
      locked: false,
      completed: false
    },
    {
      id: 'awakening-ch2',
      title: 'The Learning Machine',
      description: 'Master the art of teaching machines through data',
      icon: '🧠',
      duration: '3-4 hours',
      lessons: 5,
      story: {
        setup: 'Now that you know machines can learn, let\'s discover HOW they learn.',
        challenge: 'How do you teach a machine to make decisions without programming every rule?',
        resolution: 'You\'ll master the fundamental learning algorithms that power modern AI.'
      },
      path: '/learning/awakening/chapter2',
      locked: true,
      completed: false
    },
    {
      id: 'awakening-ch3',
      title: 'The Pattern Seeker',
      description: 'Uncover hidden patterns in data and build predictive models',
      icon: '🔍',
      duration: '4-5 hours',
      lessons: 6,
      story: {
        setup: 'Data is everywhere, but the patterns are hidden. You\'re about to become a pattern detective.',
        challenge: 'Can you predict the future from the past?',
        resolution: 'You\'ll build models that can see patterns humans miss and make predictions that matter.'
      },
      path: '/learning/awakening/chapter3',
      locked: true,
      completed: false
    },
    {
      id: 'awakening-ch4',
      title: 'The AI Creator',
      description: 'Build your first complete AI application',
      icon: '🚀',
      duration: '3-4 hours',
      lessons: 4,
      story: {
        setup: 'It\'s time to put everything together and create something amazing.',
        challenge: 'Can you build an AI that solves a real problem?',
        resolution: 'You\'ll launch your first AI application and join the community of AI creators.'
      },
      path: '/learning/awakening/chapter4',
      locked: true,
      completed: false
    }
  ],
  prerequisites: ['Basic curiosity about technology', 'Willingness to learn'],
  targetAudience: ['Complete beginners', 'Curious minds', 'Career changers', 'Anyone who wants to understand AI'],
  skills: ['AI fundamentals', 'Machine learning basics', 'Data analysis', 'Python programming', 'Problem solving'],
  color: 'blue',
  gradient: 'from-blue-500 to-purple-600'
};

// The Neural Mastery: Deep Dive with Karpathy
export const neuralMasteryCourse: StoryCourse = {
  id: 'neural-mastery',
  title: 'Neural Mastery',
  subtitle: 'The Deep Dive with Karpathy',
  description: 'Master neural networks from the ground up with Andrej Karpathy\'s legendary course. Build, understand, and create with the power of deep learning.',
  icon: '🧠',
  difficulty: 'intermediate',
  duration: '6-8 weeks',
  estimatedHours: 40,
  story: {
    hook: 'You\'ve seen what AI can do. Now it\'s time to understand HOW it does it. This is where the magic happens.',
    journey: 'Dive deep into the mathematical foundations of neural networks. Build them from scratch, understand every component, and emerge with the knowledge to create anything.',
    outcome: 'You\'ll have the deep understanding needed to build, debug, and innovate with neural networks. Ready to tackle any AI challenge.'
  },
  chapters: [
    {
      id: 'mastery-ch1',
      title: 'The Foundation',
      description: 'Build neural networks from first principles with micrograd',
      icon: '⚙️',
      duration: '8-10 hours',
      lessons: 6,
      story: {
        setup: 'Every master starts with the fundamentals. You\'re about to build neural networks from scratch.',
        challenge: 'Can you understand and implement every component of a neural network?',
        resolution: 'You\'ll have built a complete neural network library and understand every line of code.'
      },
      path: '/learning/karpathy/chapter1',
      locked: false,
      completed: false
    },
    {
      id: 'mastery-ch2',
      title: 'The Language of Intelligence',
      description: 'Master language models and transformer architecture',
      icon: '📝',
      duration: '10-12 hours',
      lessons: 8,
      story: {
        setup: 'Language is the ultimate test of intelligence. You\'re about to teach machines to speak.',
        challenge: 'Can you build a system that understands and generates human language?',
        resolution: 'You\'ll create language models that can write, understand, and communicate like humans.'
      },
      path: '/learning/karpathy/chapter2',
      locked: true,
      completed: false
    },
    {
      id: 'mastery-ch3',
      title: 'The Vision Seer',
      description: 'Master computer vision and image understanding',
      icon: '👁️',
      duration: '8-10 hours',
      lessons: 6,
      story: {
        setup: 'Vision is how we understand the world. Now machines will see like we do.',
        challenge: 'Can you teach a machine to see and understand images?',
        resolution: 'You\'ll build systems that can recognize, classify, and understand visual information.'
      },
      path: '/learning/karpathy/chapter3',
      locked: true,
      completed: false
    },
    {
      id: 'mastery-ch4',
      title: 'The Creative Mind',
      description: 'Explore generative AI and creative applications',
      icon: '🎨',
      duration: '6-8 hours',
      lessons: 5,
      story: {
        setup: 'AI isn\'t just analytical - it can be creative too. You\'re about to unleash its artistic side.',
        challenge: 'Can you build AI that creates art, music, and stories?',
        resolution: 'You\'ll create AI systems that generate original content and push creative boundaries.'
      },
      path: '/learning/karpathy/chapter4',
      locked: true,
      completed: false
    }
  ],
  prerequisites: ['Python programming', 'Basic calculus', 'Linear algebra', 'AI Awakening course'],
  targetAudience: ['Developers', 'Data scientists', 'AI enthusiasts', 'Technical professionals'],
  skills: ['Neural networks', 'Deep learning', 'PyTorch', 'Transformers', 'Computer vision', 'Generative AI'],
  color: 'purple',
  gradient: 'from-purple-500 to-pink-600'
};

// The AI Builder: Hands-On Implementation
export const aiBuilderCourse: StoryCourse = {
  id: 'ai-builder',
  title: 'The AI Builder',
  subtitle: 'From Theory to Production',
  description: 'Transform your AI knowledge into real-world applications. Build, deploy, and scale AI systems that solve actual problems.',
  icon: '🔨',
  difficulty: 'intermediate',
  duration: '8-10 weeks',
  estimatedHours: 50,
  story: {
    hook: 'Knowledge without application is just theory. You\'re about to become a builder.',
    journey: 'Take your AI knowledge and turn it into real applications. Learn the tools, techniques, and mindset of professional AI developers.',
    outcome: 'You\'ll have a portfolio of AI applications and the skills to build AI products that matter.'
  },
  chapters: [
    {
      id: 'builder-ch1',
      title: 'The Workshop',
      description: 'Master the tools and environment of AI development',
      icon: '🛠️',
      duration: '4-5 hours',
      lessons: 4,
      story: {
        setup: 'Every builder needs the right tools. You\'re about to set up your AI workshop.',
        challenge: 'Can you create a professional development environment for AI?',
        resolution: 'You\'ll have a complete AI development setup ready for any project.'
      },
      path: '/learning/builder/chapter1',
      locked: false,
      completed: false
    },
    {
      id: 'builder-ch2',
      title: 'The Data Engineer',
      description: 'Master data pipelines and preprocessing for AI',
      icon: '📊',
      duration: '6-8 hours',
      lessons: 5,
      story: {
        setup: 'Data is the fuel of AI. You\'re about to become a data engineer.',
        challenge: 'Can you build robust data pipelines that feed your AI systems?',
        resolution: 'You\'ll master the art of data engineering and create pipelines that scale.'
      },
      path: '/learning/builder/chapter2',
      locked: true,
      completed: false
    },
    {
      id: 'builder-ch3',
      title: 'The Model Architect',
      description: 'Design and optimize AI models for production',
      icon: '🏗️',
      duration: '8-10 hours',
      lessons: 6,
      story: {
        setup: 'Building models is one thing. Building models that work in production is another.',
        challenge: 'Can you design AI systems that are fast, reliable, and scalable?',
        resolution: 'You\'ll master model architecture and optimization for real-world deployment.'
      },
      path: '/learning/builder/chapter3',
      locked: true,
      completed: false
    },
    {
      id: 'builder-ch4',
      title: 'The Deployer',
      description: 'Deploy AI models to production and monitor performance',
      icon: '🚀',
      duration: '6-8 hours',
      lessons: 5,
      story: {
        setup: 'The final step: getting your AI into the hands of users.',
        challenge: 'Can you deploy AI systems that users can actually use?',
        resolution: 'You\'ll master deployment, monitoring, and maintenance of AI systems.'
      },
      path: '/learning/builder/chapter4',
      locked: true,
      completed: false
    }
  ],
  prerequisites: ['Neural Mastery course', 'Python programming', 'Basic DevOps knowledge'],
  targetAudience: ['AI practitioners', 'Software developers', 'ML engineers', 'Product builders'],
  skills: ['MLOps', 'Model deployment', 'Data engineering', 'System design', 'Cloud platforms', 'Monitoring'],
  color: 'green',
  gradient: 'from-green-500 to-teal-600'
};

// The AI Visionary: Advanced Concepts and Future
export const aiVisionaryCourse: StoryCourse = {
  id: 'ai-visionary',
  title: 'The AI Visionary',
  subtitle: 'Shaping the Future of Intelligence',
  description: 'Explore the cutting edge of AI research and prepare for the future. Understand emerging technologies and their implications for society.',
  icon: '🔮',
  difficulty: 'advanced',
  duration: '10-12 weeks',
  estimatedHours: 60,
  story: {
    hook: 'You\'ve mastered the present. Now it\'s time to shape the future.',
    journey: 'Explore the frontiers of AI research, understand emerging technologies, and develop the vision to lead in an AI-powered world.',
    outcome: 'You\'ll be equipped to lead AI initiatives, make strategic decisions, and shape the future of artificial intelligence.'
  },
  chapters: [
    {
      id: 'visionary-ch1',
      title: 'The Research Frontier',
      description: 'Explore cutting-edge AI research and emerging technologies',
      icon: '🔬',
      duration: '10-12 hours',
      lessons: 8,
      story: {
        setup: 'The frontier of AI research is where the future is being written.',
        challenge: 'Can you understand and contribute to the latest AI breakthroughs?',
        resolution: 'You\'ll be at the forefront of AI research and innovation.'
      },
      path: '/learning/visionary/chapter1',
      locked: false,
      completed: false
    },
    {
      id: 'visionary-ch2',
      title: 'The Ethical Compass',
      description: 'Navigate the ethical implications of AI and responsible development',
      icon: '⚖️',
      duration: '8-10 hours',
      lessons: 6,
      story: {
        setup: 'With great power comes great responsibility. You\'re about to explore AI ethics.',
        challenge: 'Can you build AI systems that are fair, transparent, and beneficial?',
        resolution: 'You\'ll develop the ethical framework to guide AI development responsibly.'
      },
      path: '/learning/visionary/chapter2',
      locked: true,
      completed: false
    },
    {
      id: 'visionary-ch3',
      title: 'The Strategic Mind',
      description: 'Develop AI strategy and leadership skills',
      icon: '🎯',
      duration: '8-10 hours',
      lessons: 6,
      story: {
        setup: 'Technical skills are just the beginning. You need strategic thinking too.',
        challenge: 'Can you lead AI initiatives and make strategic decisions?',
        resolution: 'You\'ll develop the leadership skills to guide AI transformation.'
      },
      path: '/learning/visionary/chapter3',
      locked: true,
      completed: false
    },
    {
      id: 'visionary-ch4',
      title: 'The Future Shaper',
      description: 'Create your vision for the future of AI',
      icon: '🌟',
      duration: '6-8 hours',
      lessons: 4,
      story: {
        setup: 'The future of AI is in your hands. What will you create?',
        challenge: 'Can you envision and build the future of artificial intelligence?',
        resolution: 'You\'ll emerge as a leader ready to shape the future of AI.'
      },
      path: '/learning/visionary/chapter4',
      locked: true,
      completed: false
    }
  ],
  prerequisites: ['Neural Mastery course', 'AI Builder course', 'Leadership experience'],
  targetAudience: ['AI leaders', 'Researchers', 'Entrepreneurs', 'Policy makers', 'Senior professionals'],
  skills: ['AI strategy', 'Research methods', 'Ethics', 'Leadership', 'Innovation', 'Future thinking'],
  color: 'orange',
  gradient: 'from-orange-500 to-red-600'
};

export const storyCourses: StoryCourse[] = [
  aiAwakeningCourse,
  neuralMasteryCourse,
  aiBuilderCourse,
  aiVisionaryCourse
];

export function getCourseById(id: string): StoryCourse | undefined {
  return storyCourses.find(course => course.id === id);
}

export function getCourseByDifficulty(difficulty: string): StoryCourse[] {
  return storyCourses.filter(course => course.difficulty === difficulty);
}

export function getNextCourse(currentCourseId: string): StoryCourse | undefined {
  const currentIndex = storyCourses.findIndex(course => course.id === currentCourseId);
  return currentIndex < storyCourses.length - 1 ? storyCourses[currentIndex + 1] : undefined;
}
