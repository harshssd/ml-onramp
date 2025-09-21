import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

const { width } = Dimensions.get('window');

interface Lesson {
  id: string;
  title: string;
  description: string;
  slug: string;
  duration: number;
  difficulty: string;
}

interface DashboardScreenProps {
  navigation: any;
}

export default function DashboardScreen({ navigation }: DashboardScreenProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [user, setUser] = useState<any>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigation.replace('Home');
        return;
      }
      setUser(user);
      await loadLessons();
      await loadUserProgress(user.id);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadLessons = async () => {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .select('*')
        .order('id');
      
      if (error) throw error;
      setLessons(data || []);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  };

  const loadUserProgress = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('user_progress')
        .select('lesson_id, progress_percentage, completed')
        .eq('user_id', userId);

      const progressMap: Record<string, number> = {};
      data?.forEach((item) => {
        progressMap[item.lesson_id] = item.progress_percentage;
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const calculateOverallProgress = () => {
    if (lessons.length === 0) return 0;
    const totalProgress = Object.values(userProgress).reduce((sum, progress) => sum + progress, 0);
    return totalProgress / lessons.length;
  };

  const calculateXP = () => {
    return Math.floor(calculateOverallProgress() * 1000);
  };

  const calculateLevel = () => {
    return Math.floor(calculateXP() / 100) + 1;
  };

  const getCompletedLessons = () => {
    return Object.values(userProgress).filter(progress => progress === 100).length;
  };

  const getQuestIcon = (title: string) => {
    if (title.includes('Regression')) return '📊';
    if (title.includes('Classification')) return '🎯';
    if (title.includes('Clustering')) return '🔍';
    if (title.includes('Neural')) return '🧠';
    return '📚';
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading your quest...
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.card }]}>
          <View style={styles.headerLeft}>
            <Text style={styles.wizardEmoji}>🧙‍♂️</Text>
            <View>
              <Text style={[styles.headerTitle, { color: colors.text }]}>
                ML Quest
              </Text>
              <Text style={[styles.headerSubtitle, { color: colors.text + 'CC' }]}>
                Level {calculateLevel()} • {calculateXP()} XP
              </Text>
            </View>
          </View>
        </View>

        {/* Hero Stats */}
        <View style={[styles.heroCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.heroTitle, { color: colors.text }]}>
            Welcome back, Wizard! 🧙‍♂️
          </Text>
          <Text style={[styles.heroSubtitle, { color: colors.text + 'CC' }]}>
            Ready to continue your machine learning journey?
          </Text>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.accent }]}>
                {calculateLevel()}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text + 'CC' }]}>
                Level
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#22c55e' }]}>
                {getCompletedLessons()}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text + 'CC' }]}>
                Quests Completed
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: '#3b82f6' }]}>
                {Math.floor(Math.random() * 7) + 1}
              </Text>
              <Text style={[styles.statLabel, { color: colors.text + 'CC' }]}>
                Day Streak
              </Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {Math.round(calculateOverallProgress())}%
              </Text>
              <Text style={[styles.statLabel, { color: colors.text + 'CC' }]}>
                Overall Progress
              </Text>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🏆 Recent Achievements
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={[styles.achievementCard, { backgroundColor: colors.card }]}>
              <Text style={styles.achievementIcon}>🎯</Text>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>
                First Quest
              </Text>
              <Text style={[styles.achievementDesc, { color: colors.text + 'CC' }]}>
                Complete your first lesson
              </Text>
            </View>
            <View style={[styles.achievementCard, { backgroundColor: colors.card }]}>
              <Text style={styles.achievementIcon}>⚡</Text>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>
                Streak Master
              </Text>
              <Text style={[styles.achievementDesc, { color: colors.text + 'CC' }]}>
                3 day learning streak
              </Text>
            </View>
            <View style={[styles.achievementCard, { backgroundColor: colors.card }]}>
              <Text style={styles.achievementIcon}>🏆</Text>
              <Text style={[styles.achievementTitle, { color: colors.text }]}>
                Progress Champion
              </Text>
              <Text style={[styles.achievementDesc, { color: colors.text + 'CC' }]}>
                50% overall progress
              </Text>
            </View>
          </ScrollView>
        </View>

        {/* Quests */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🎯 Available Quests
          </Text>
          {lessons.map((lesson, index) => (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.questCard, { backgroundColor: colors.card }]}
              onPress={() => navigation.navigate('Lesson', { lesson })}
            >
              <View style={styles.questHeader}>
                <Text style={styles.questIcon}>{getQuestIcon(lesson.title)}</Text>
                <View style={styles.questInfo}>
                  <Text style={[styles.questTitle, { color: colors.text }]}>
                    {lesson.title}
                  </Text>
                  <Text style={[styles.questDescription, { color: colors.text + 'CC' }]}>
                    {lesson.description}
                  </Text>
                </View>
                {userProgress[lesson.id] === 100 && (
                  <Text style={styles.completedIcon}>✅</Text>
                )}
              </View>
              
              <View style={styles.questProgress}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressLabel, { color: colors.text + 'CC' }]}>
                    Progress
                  </Text>
                  <Text style={[styles.progressValue, { color: colors.text }]}>
                    {userProgress[lesson.id] || 0}%
                  </Text>
                </View>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${userProgress[lesson.id] || 0}%`,
                        backgroundColor: colors.accent,
                      },
                    ]}
                  />
                </View>
              </View>
              
              <View style={styles.questFooter}>
                <Text style={[styles.questDifficulty, { color: colors.accent }]}>
                  {lesson.difficulty}
                </Text>
                <Text style={[styles.questDuration, { color: colors.text + 'CC' }]}>
                  {lesson.duration} min
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    marginBottom: 20,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wizardEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  heroCard: {
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginBottom: 12,
  },
  achievementCard: {
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  achievementDesc: {
    fontSize: 12,
    textAlign: 'center',
  },
  questCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  questHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  questInfo: {
    flex: 1,
  },
  questTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  questDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  completedIcon: {
    fontSize: 20,
  },
  questProgress: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    borderRadius: 2,
  },
  questFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  questDifficulty: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  questDuration: {
    fontSize: 12,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
