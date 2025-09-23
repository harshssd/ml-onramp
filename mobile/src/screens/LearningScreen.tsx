import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

type LearningUnit = {
  id: string;
  title: string;
  description: string;
  duration_min: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  type: 'video' | 'interactive' | 'coding' | 'quiz' | 'project';
  superpower?: { id: string; name: string; icon: string; color: string };
};

type Week = {
  id: string;
  title: string;
  description: string;
  icon: string;
  units: LearningUnit[];
};

const content: Week[] = [
  {
    id: 'week-1',
    title: 'Week 1: AI Foundations',
    description: 'Build your AI foundation and unlock your first superpowers',
    icon: '🔍',
    units: [
      {
        id: 'what-is-ai',
        title: 'What is AI?',
        description: 'Discover the fundamentals of AI and unlock Perception',
        duration_min: 20,
        difficulty: 'beginner',
        type: 'video',
        superpower: { id: 'perception', name: 'AI Perception', icon: '👁️', color: '#60a5fa' },
      },
      {
        id: 'ai-in-daily-life',
        title: 'AI in Daily Life',
        description: 'Identify AI touchpoints and patterns',
        duration_min: 25,
        difficulty: 'beginner',
        type: 'interactive',
        superpower: { id: 'pattern-recognition', name: 'Pattern Recognition', icon: '🔍', color: '#22c55e' },
      },
      {
        id: 'first-python-code',
        title: 'Your First Python Code',
        description: 'Write beginner code and unlock Programming',
        duration_min: 30,
        difficulty: 'beginner',
        type: 'coding',
        superpower: { id: 'programming', name: 'AI Programming', icon: '💻', color: '#a78bfa' },
      },
      {
        id: 'data-exploration',
        title: 'Exploring Data',
        description: 'Learn to explore and understand data patterns',
        duration_min: 35,
        difficulty: 'beginner',
        type: 'interactive',
        superpower: { id: 'data-sight', name: 'Data Sight', icon: '📊', color: '#fb923c' },
      },
    ],
  },
];

type Character = {
  id: string;
  name: string;
  background: string;
  motivation: string;
};

type CharacterProgression = {
  level: number;
  xp: number;
  achievements: string[];
  completedUnits: string[];
};

export default function LearningScreen() {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();

  const [character, setCharacter] = useState<Character | null>(null);
  const [name, setName] = useState('AI Explorer');
  const [background, setBackground] = useState('Curious Learner');
  const [motivation, setMotivation] = useState('Master AI fundamentals');
  const [progress, setProgress] = useState<CharacterProgression>({ level: 1, xp: 0, achievements: [], completedUnits: [] });

  const totalUnits = useMemo(() => content.reduce((sum, w) => sum + w.units.length, 0), []);
  const completedCount = progress.completedUnits.length;
  const percent = Math.round((completedCount / Math.max(totalUnits, 1)) * 100);

  const gainXP = (amount: number) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      return { ...prev, xp: newXP, level: newLevel };
    });
  };

  const completeUnit = (unit: LearningUnit) => {
    if (progress.completedUnits.includes(unit.id)) return;
    setProgress((prev) => ({ ...prev, completedUnits: [...prev.completedUnits, unit.id] }));
    gainXP(100);
  };

  if (!character) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>Create Your Character 🤖</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.label, { color: colors.text + 'CC' }]}>Name</Text>
            <TextInput value={name} onChangeText={setName} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} placeholderTextColor={colors.text + '80'} />
            <Text style={[styles.label, { color: colors.text + 'CC' }]}>Background</Text>
            <TextInput value={background} onChangeText={setBackground} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} placeholderTextColor={colors.text + '80'} />
            <Text style={[styles.label, { color: colors.text + 'CC' }]}>Motivation</Text>
            <TextInput value={motivation} onChangeText={setMotivation} style={[styles.input, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]} placeholderTextColor={colors.text + '80'} />
            <TouchableOpacity
              onPress={() => setCharacter({ id: name.toLowerCase().replace(/\s+/g, '-'), name, background, motivation })}
              style={[styles.primaryButton, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.primaryButtonText}>Start Learning</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.header, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <View style={{ flex: 1 }}>
            <Text style={[styles.headerName, { color: colors.text }]}>Welcome, {character.name}!</Text>
            <Text style={[styles.headerMeta, { color: colors.text + '99' }]}>{character.background} • {character.motivation}</Text>
          </View>
          <View style={styles.headerStats}> 
            <Text style={[styles.level, { color: colors.accent }]}>Lv {progress.level}</Text>
            <Text style={[styles.xp, { color: colors.text }]}>{progress.xp} XP</Text>
          </View>
        </View>

        <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <View style={styles.rowBetween}> 
            <Text style={[styles.progressLabel, { color: colors.text + '99' }]}>Progress</Text>
            <Text style={[styles.progressValue, { color: colors.text }]}>{percent}%</Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}> 
            <View style={[styles.progressFill, { width: `${percent}%`, backgroundColor: colors.accent }]} />
          </View>
        </View>

        {content.map((week) => (
          <View key={week.id} style={[styles.weekCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.weekTitle, { color: colors.text }]}>{week.icon} {week.title}</Text>
            <Text style={[styles.weekDesc, { color: colors.text + 'CC' }]}>{week.description}</Text>
            {week.units.map((unit, idx) => {
              const done = progress.completedUnits.includes(unit.id);
              return (
                <View key={unit.id} style={[styles.unitCard, { borderColor: colors.border }]}> 
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.unitTitle, { color: colors.text }]}>{unit.title}</Text>
                    <Text style={[styles.unitMeta, { color: colors.text + '99' }]}>
                      {unit.duration_min} min • {unit.type} • {unit.difficulty}
                    </Text>
                    {!!unit.superpower && (
                      <Text style={[styles.superpower, { color: unit.superpower.color }]}>
                        Unlocks: {unit.superpower.icon} {unit.superpower.name}
                      </Text>
                    )}
                  </View>
                  <TouchableOpacity
                    onPress={() => completeUnit(unit)}
                    disabled={done}
                    style={[styles.unitButton, { backgroundColor: done ? '#64748b' : colors.accent, opacity: done ? 0.7 : 1 }]}
                  >
                    <Text style={styles.unitButtonText}>{done ? 'Completed' : 'Start'}</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>
        ))}
        <View style={{ height: 16 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 8,
  },
  label: {
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  primaryButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  header: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerMeta: {
    fontSize: 12,
  },
  headerStats: {
    alignItems: 'flex-end',
  },
  level: {
    fontSize: 18,
    fontWeight: '800',
  },
  xp: {
    fontSize: 12,
  },
  progressCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  progressBar: {
    height: 8,
    borderRadius: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 8,
  },
  weekCard: {
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  weekTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  weekDesc: {
    fontSize: 12,
    marginBottom: 8,
  },
  unitCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  unitTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  unitMeta: {
    fontSize: 12,
    marginTop: 2,
  },
  superpower: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '700',
  },
  unitButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  unitButtonText: {
    color: '#000',
    fontWeight: '700',
  },
});

