import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsScreenProps {
  navigation: any;
}

const themeOptions = [
  { id: 'dark', name: 'Dark Quest', icon: '🌙' },
  { id: 'light', name: 'Light Mode', icon: '☀️' },
  { id: 'neon', name: 'Neon Cyber', icon: '⚡' },
  { id: 'ocean', name: 'Ocean Depths', icon: '🌊' },
  { id: 'forest', name: 'Forest Quest', icon: '🌲' },
  { id: 'sunset', name: 'Sunset Magic', icon: '🌅' },
];

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { theme, setTheme, getThemeColors } = useTheme();
  const colors = getThemeColors();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={[styles.title, { color: colors.text }]}>
            Quest Settings ⚙️
          </Text>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Choose Your Quest Theme
            </Text>
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.themeOption,
                  { backgroundColor: colors.card },
                  theme === option.id && { borderColor: colors.accent, borderWidth: 2 }
                ]}
                onPress={() => setTheme(option.id as any)}
              >
                <Text style={styles.themeIcon}>{option.icon}</Text>
                <Text style={[styles.themeName, { color: colors.text }]}>
                  {option.name}
                </Text>
                {theme === option.id && (
                  <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={[styles.comingSoon, { color: colors.accent }]}>
              🚧 More settings coming soon!
            </Text>
          </View>
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
  content: {
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  themeIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  themeName: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  comingSoon: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
