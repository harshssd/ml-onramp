'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push('/app');
      }
    };

    checkUser();
  }, [router, supabase.auth]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
            ML Onramp
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Learn machine learning through interactive lessons and hands-on practice
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Master the fundamentals of machine learning with our structured curriculum, 
            interactive playgrounds, and real-world examples.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Sign In
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Interactive Learning
            </h3>
            <p className="text-gray-600">
              Hands-on exercises and interactive playgrounds to reinforce your learning.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Structured Curriculum
            </h3>
            <p className="text-gray-600">
              Progress through carefully designed lessons from beginner to advanced.
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-600">
              Monitor your learning journey with detailed progress tracking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}