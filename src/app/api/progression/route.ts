import { NextRequest, NextResponse } from 'next/server';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

type PostBody = {
  eventType: 'quiz_pass' | 'project_complete' | 'unit_complete' | 'streak_update';
  unitId?: string;
  xpDelta?: number;
  minutesDelta?: number;
  superpower?: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
    levelDelta?: number;
    unlockedAt?: string;
  };
};

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    let supabase;
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.split(' ')[1];
      supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } }
      );
    } else {
      supabase = await createServerClient();
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [{ data: character }, { data: powers }, { data: activity }] = await Promise.all([
      supabase.from('user_characters').select('*').eq('user_id', user.id).maybeSingle(),
      supabase.from('user_superpowers').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
      supabase.from('user_activity').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(50),
    ]);

    return NextResponse.json({ character: character || null, superpowers: powers || [], activity: activity || [] });
  } catch (error) {
    console.error('GET /api/progression error', error);
    return NextResponse.json({ error: 'Failed to load progression' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
    let supabase;
    if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
      const token = authHeader.split(' ')[1];
      supabase = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { global: { headers: { Authorization: `Bearer ${token}` } }, auth: { persistSession: false, autoRefreshToken: false } }
      );
    } else {
      supabase = await createServerClient();
    }
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as PostBody;
    const xpDelta = Number(body.xpDelta || 0);
    const minutesDelta = Number(body.minutesDelta || 0);

    // Upsert activity record
    await supabase.from('user_activity').insert({
      user_id: user.id,
      event_type: body.eventType,
      unit_id: body.unitId || null,
      xp_delta: xpDelta,
      metadata: body.superpower ? { superpower: body.superpower } : null,
    });

    // Ensure character row exists
    const { data: existingCharacter } = await supabase
      .from('user_characters')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!existingCharacter) {
      await supabase.from('user_characters').insert({
        user_id: user.id,
        name: 'AI Explorer',
        avatar_emoji: '🤖',
        level: 1,
        xp: 0,
        current_streak: 0,
        total_learning_minutes: 0,
      });
    }

    // Update character progression
    const { data: character } = await supabase
      .from('user_characters')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    const newXP = Math.max(0, (character?.xp || 0) + xpDelta);
    const newMinutes = Math.max(0, (character?.total_learning_minutes || 0) + minutesDelta);
    const newLevel = Math.floor(newXP / 100) + 1;

    await supabase
      .from('user_characters')
      .update({ xp: newXP, level: newLevel, total_learning_minutes: newMinutes })
      .eq('user_id', user.id);

    // Upsert superpower if provided
    if (body.superpower) {
      const { id, name, icon, color, levelDelta = 1, unlockedAt } = body.superpower;
      // Try to update existing, otherwise insert
      const { data: existing } = await supabase
        .from('user_superpowers')
        .select('*')
        .eq('user_id', user.id)
        .eq('superpower_id', id)
        .maybeSingle();

      if (existing) {
        const nextLevel = Math.max(1, (existing.level || 1) + levelDelta);
        await supabase
          .from('user_superpowers')
          .update({ level: nextLevel })
          .eq('id', existing.id);
      } else {
        await supabase.from('user_superpowers').insert({
          user_id: user.id,
          superpower_id: id,
          name,
          icon: icon || null,
          color: color || null,
          level: Math.max(1, levelDelta),
          unlocked_at: unlockedAt || body.unitId || null,
        });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('POST /api/progression error', error);
    return NextResponse.json({ error: 'Failed to update progression' }, { status: 500 });
  }
}

