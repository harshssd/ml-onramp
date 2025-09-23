import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { API_CONFIG } from '../config/api';
import YouTubeSegment from '../components/YouTubeSegment';

interface LessonScreenProps {
  navigation: any;
  route: any;
}

type LessonContent = {
  frontmatter: {
    id: string;
    title: string;
    duration_min: number;
    prereqs: string[];
    tags: string[];
    video?: {
      platform: string;
      id: string;
      start: number;
      end: number;
    };
    widgets: any[];
    goals: string[];
    quiz: Array<{ q: string; options: string[]; answer: number; explain: string }>;
    tasks: string[];
    reflection: string[];
    next: string;
  };
  content: string;
};

export default function LessonScreen({ navigation, route }: LessonScreenProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const routeLesson = route.params?.lesson;
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const slugOrId: string | undefined = routeLesson?.slug || routeLesson?.id;

  useEffect(() => {
    let isMounted = true;
    const fetchLesson = async () => {
      if (!slugOrId) {
        setLesson(null);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const url = `${API_CONFIG.baseUrl}/api/content/lessons/${slugOrId}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Failed to fetch lesson: ${res.status}`);
        const data = await res.json();
        if (isMounted) setLesson(data);
      } catch (e: any) {
        if (isMounted) {
          setError(e?.message || 'Failed to load lesson');
          Alert.alert('Network Error', 'Could not load lesson from server.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchLesson();
    return () => { isMounted = false; };
  }, [slugOrId]);

  const sections: string[] = useMemo(() => {
    const raw = lesson?.content || '';
    const parts = raw.split('\n## ').map((s, i) => (i === 0 ? s : '## ' + s));
    return parts.filter(Boolean);
  }, [lesson?.content]);

  if (loading) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={colors.accent} />
          <Text style={[styles.loadingText, { color: colors.text + 'CC' }]}>Loading your quest...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error || !lesson) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>Lesson Not Found</Text>
          <Text style={[styles.description, { color: colors.text + 'CC' }]}>{error || 'The lesson could not be loaded.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  const fm = lesson.frontmatter;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.headerCard, { backgroundColor: colors.card }]}> 
          <Text style={[styles.title, { color: colors.text }]}>{fm.title}</Text>
          <Text style={[styles.meta, { color: colors.text + 'CC' }]}>{fm.duration_min} min • {fm.tags?.[0] || 'lesson'}</Text>
        </View>

        {fm.video?.platform === 'youtube' && (
          <View style={[styles.sectionCard, { backgroundColor: colors.card }]}>
            <YouTubeSegment
              videoId={fm.video.id}
              start={fm.video.start}
              end={fm.video.end}
              title={`${fm.title} - Video Segment`}
            />
          </View>
        )}

        {sections.map((section, i) => (
          <View key={i} style={[styles.sectionCard, { backgroundColor: colors.card }]}> 
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{section.match(/^## (.+)$/m)?.[1] || 'Section'}</Text>
            <Text style={[styles.sectionBody, { color: colors.text + 'CC' }]}>
              {section.replace(/^## .+$/m, '').trim()}
            </Text>
          </View>
        ))}

        {/* Quiz, widgets, tasks, reflection will be added in subsequent tasks */}
        <View style={{ height: 16 }} />
      </ScrollView>
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
  scroll: {
    padding: 16,
  },
  headerCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  meta: {
    textAlign: 'center',
    fontSize: 12,
  },
  comingSoon: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sectionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionBody: {
    fontSize: 14,
    lineHeight: 22,
  },
  loadingBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
});

