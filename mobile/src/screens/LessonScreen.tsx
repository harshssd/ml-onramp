import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface LessonScreenProps {
  navigation: any;
  route: any;
}

export default function LessonScreen({ navigation, route }: LessonScreenProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const { lesson } = route.params;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          {lesson?.title || 'Quest Details'}
        </Text>
        <Text style={[styles.description, { color: colors.text + 'CC' }]}>
          {lesson?.description || 'Quest content will be displayed here'}
        </Text>
        <Text style={[styles.comingSoon, { color: colors.accent }]}>
          🚧 Interactive lesson content coming soon!
        </Text>
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
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  comingSoon: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

