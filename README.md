# ML Onramp

A production-ready monorepo for learning machine learning through interactive lessons and hands-on practice.

## 🚀 Features

- **Interactive Learning**: Hands-on exercises and interactive playgrounds
- **Structured Curriculum**: 6 carefully designed lessons from beginner to advanced
- **Progress Tracking**: Monitor your learning journey with detailed progress tracking
- **Modern Tech Stack**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Authentication**: Secure user authentication with Supabase
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

This is a monorepo built with:

- **apps/web**: Next.js application with App Router
- **packages/ui**: Shared UI components library
- **Supabase**: Backend-as-a-Service for authentication and database
- **Turbo**: Monorepo build system

## 📁 Project Structure

```
ml-onramp/
├── apps/
│   └── web/                 # Next.js application
│       ├── src/
│       │   ├── app/         # App Router pages
│       │   │   ├── login/   # Authentication pages
│       │   │   ├── signup/
│       │   │   ├── app/     # Protected app pages
│       │   │   └── lesson/  # Lesson pages
│       │   ├── lib/         # Utilities and configurations
│       │   └── middleware.ts
│       └── tests/           # Playwright E2E tests
├── packages/
│   └── ui/                  # Shared UI components
│       ├── src/
│       │   ├── components/  # React components
│       │   └── lib/         # Utilities
├── seed/
│   └── lessons.json         # Lesson data
├── supabase/
│   └── schema.sql           # Database schema
└── .github/workflows/       # CI/CD workflows
```

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **Lucide React** for icons

### Backend
- **Supabase** for authentication and database
- **PostgreSQL** database
- **Row Level Security (RLS)** for data protection

### Development
- **Turbo** for monorepo management
- **ESLint** for code linting
- **Prettier** for code formatting
- **Playwright** for E2E testing
- **GitHub Actions** for CI/CD

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm 9+
- Supabase account

### 1. Clone the Repository

```bash
git clone <repository-url>
cd ml-onramp
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Run the database schema:

```sql
-- Copy and paste the contents of supabase/schema.sql into your Supabase SQL editor
```

### 4. Environment Variables

Create a `.env.local` file in the `apps/web` directory:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional: Supabase Service Role Key (for server-side operations)
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 5. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## 📚 Available Scripts

### Root Level
- `npm run dev` - Start all development servers
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run test` - Run all tests
- `npm run format` - Format code with Prettier

### Web App
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Lint TypeScript/React code
- `npm run test` - Run Playwright E2E tests

### UI Package
- `npm run build` - Build TypeScript components
- `npm run dev` - Watch mode for development
- `npm run lint` - Lint TypeScript code

## 🧪 Testing

### E2E Tests
Run the Playwright E2E tests:

```bash
cd apps/web
npm run test
```

### Linting
Lint all code:

```bash
npm run lint
```

### Formatting
Format all code:

```bash
npm run format
```

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set the following environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy!

### Manual Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm run start
   ```

## 📖 Lessons

The application includes 6 structured lessons:

1. **Introduction to Machine Learning** (30 min, Beginner)
2. **Linear Regression Fundamentals** (45 min, Beginner)
3. **Data Preprocessing Techniques** (40 min, Intermediate)
4. **Classification Algorithms** (50 min, Intermediate)
5. **Neural Networks and Deep Learning** (60 min, Advanced)
6. **Model Evaluation and Validation** (35 min, Intermediate)

Each lesson includes:
- Interactive content
- Hands-on exercises
- Progress tracking
- Interactive playgrounds (for specific lessons)

## 🔧 Development

### Adding New Components

1. Create components in `packages/ui/src/components/`
2. Export them from `packages/ui/src/index.ts`
3. Import and use in the web app

### Adding New Lessons

1. Add lesson data to `seed/lessons.json`
2. The lesson will automatically appear in the app

### Database Changes

1. Update `supabase/schema.sql`
2. Apply changes to your Supabase project
3. Update TypeScript types if needed

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](https://github.com/your-org/ml-onramp/issues) page
2. Create a new issue with detailed information
3. Check the [Supabase documentation](https://supabase.com/docs) for backend issues

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Playwright Documentation](https://playwright.dev/docs)
