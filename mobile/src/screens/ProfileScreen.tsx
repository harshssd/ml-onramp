import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

interface ProfileScreenProps {
  navigation: any;
}

export default function ProfileScreen({ navigation }: ProfileScreenProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [userEmail, setUserEmail] = useState<string>('');
  const [level, setLevel] = useState<number>(1);
  const [xp, setXp] = useState<number>(0);
  const [completed, setCompleted] = useState<number>(0);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) setUserEmail(user.email);
        if (user?.id) {
          const { data } = await supabase
            .from('user_progress')
            .select('progress_percentage, completed')
            .eq('user_id', user.id);
          const values = (data as any[]) || [];
          const totalProgress = values.reduce((sum: number, row: any) => sum + (row.progress_percentage || 0), 0);
          const done = values.filter((row: any) => row.completed).length;
          setCompleted(done);
          const avg = values.length > 0 ? totalProgress / values.length : 0;
          const computedXP = Math.floor(avg * 10);
          setXp(computedXP);
          setLevel(Math.floor(computedXP / 100) + 1);
        }
      } catch {}
    };
    load();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}> 
          Wizard Profile 🧙‍♂️
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.label, { color: colors.text + '99' }]}>Email</Text>
          <Text style={[styles.value, { color: colors.text }]}>{userEmail || 'Guest'}</Text>
          <View style={styles.row}> 
            <View style={styles.stat}> 
              <Text style={[styles.statValue, { color: colors.accent }]}>{level}</Text>
              <Text style={[styles.statLabel, { color: colors.text + '99' }]}>Level</Text>
            </View>
            <View style={styles.stat}> 
              <Text style={[styles.statValue, { color: '#3b82f6' }]}>{xp}</Text>
              <Text style={[styles.statLabel, { color: colors.text + '99' }]}>XP</Text>
            </View>
            <View style={styles.stat}> 
              <Text style={[styles.statValue, { color: '#22c55e' }]}>{completed}</Text>
              <Text style={[styles.statLabel, { color: colors.text + '99' }]}>Quests</Text>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 12,
  },
});

