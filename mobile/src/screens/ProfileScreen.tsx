import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';
import { API_CONFIG } from '../config/api';

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
  const [superpowers, setSuperpowers] = useState<Array<{ name: string; level: number; icon?: string }>>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.email) setUserEmail(user.email);
        // Fetch aggregated progression from web API (same Supabase backend)
        const { data: session } = await supabase.auth.getSession();
        const token = session.session?.access_token;
        const res = await fetch(`${API_CONFIG.baseUrl}/api/progression`, {
          headers: {
            'Accept': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (res.ok) {
          const json = await res.json();
          const ch = json.character;
          const sp = json.superpowers as Array<any>;
          if (ch) {
            setLevel(ch.level || 1);
            setXp(ch.xp || 0);
            setCompleted((json.activity || []).filter((e: any) => e.event_type === 'unit_complete').length);
          }
          setSuperpowers(sp.map(p => ({ name: p.name, level: p.level, icon: p.icon })));
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
        {superpowers.length > 0 && (
          <View style={{ marginTop: 16 }}> 
            <Text style={[styles.label, { color: colors.text + '99' }]}>Superpowers</Text>
            {superpowers.map((p, idx) => (
              <Text key={idx} style={[styles.value, { color: colors.text }]}>
                {p.icon ? `${p.icon} ` : ''}{p.name} • Lv {p.level}
              </Text>
            ))}
          </View>
        )}
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

