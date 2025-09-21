const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: './apps/web/.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Make sure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in apps/web/.env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Read lessons data
    const lessonsPath = path.join(__dirname, 'lessons.json');
    const lessonsData = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));

    console.log(`📚 Found ${lessonsData.length} lessons to seed`);

    // Clear existing lessons (optional)
    console.log('🗑️  Clearing existing lessons...');
    const { error: deleteError } = await supabase
      .from('lessons')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (deleteError) {
      console.warn('⚠️  Warning: Could not clear existing lessons:', deleteError.message);
    }

    // Convert string IDs to UUIDs
    const lessonsWithUUIDs = lessonsData.map((lesson, index) => ({
      ...lesson,
      id: `550e8400-e29b-41d4-a716-44665544000${index + 1}`
    }));

    // Insert lessons
    console.log('📝 Inserting lessons...');
    const { data, error } = await supabase
      .from('lessons')
      .insert(lessonsWithUUIDs)
      .select();

    if (error) {
      console.error('❌ Error inserting lessons:', error);
      process.exit(1);
    }

    console.log('✅ Successfully seeded database!');
    console.log(`📊 Inserted ${data.length} lessons:`);
    data.forEach(lesson => {
      console.log(`   - ${lesson.title} (${lesson.difficulty})`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
