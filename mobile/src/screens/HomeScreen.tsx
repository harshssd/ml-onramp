import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { supabase } from '../lib/supabase';

const { width, height } = Dimensions.get('window');

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        navigation.replace('Main');
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
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
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      
      <LinearGradient
        colors={[colors.background, colors.primary + '20']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.badge}>
              <Text style={[styles.badgeText, { color: colors.accent }]}>
                🚀 Level Up Your ML Skills
              </Text>
            </View>
            
            <Text style={[styles.title, { color: colors.text }]}>
              ML{' '}
              <Text style={{ color: colors.accent }}>Onramp</Text>
            </Text>
            
            <Text style={[styles.subtitle, { color: colors.text + 'CC' }]}>
              Transform into a{' '}
              <Text style={{ color: colors.accent, fontWeight: 'bold' }}>
                Machine Learning Wizard
              </Text>{' '}
              through interactive quests, hands-on challenges, and epic achievements!
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: colors.accent }]}
              onPress={() => navigation.navigate('Signup')}
            >
              <Text style={styles.primaryButtonText}>🎮 Start Your Quest</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.secondaryButton, { borderColor: colors.border }]}
              onPress={() => navigation.navigate('Login')}
            >
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                ⚡ Continue Journey
              </Text>
            </TouchableOpacity>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Text style={styles.featureIcon}>🎯</Text>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Interactive Quests
              </Text>
              <Text style={[styles.featureDescription, { color: colors.text + 'CC' }]}>
                Complete hands-on challenges and interactive playgrounds that make learning feel like gaming!
              </Text>
            </View>
            
            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Text style={styles.featureIcon}>🏆</Text>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Achievements & XP
              </Text>
              <Text style={[styles.featureDescription, { color: colors.text + 'CC' }]}>
                Earn badges, level up, and unlock new content as you master machine learning concepts!
              </Text>
            </View>
            
            <View style={[styles.featureCard, { backgroundColor: colors.card }]}>
              <Text style={styles.featureIcon}>📈</Text>
              <Text style={[styles.featureTitle, { color: colors.text }]}>
                Progress Tracking
              </Text>
              <Text style={[styles.featureDescription, { color: colors.text + 'CC' }]}>
                Visualize your learning journey with detailed stats, streaks, and progress indicators!
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  heroSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  badge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 24,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    marginBottom: 40,
  },
  primaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
  },
  secondaryButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  featuresContainer: {
    flex: 1,
  },
  featureCard: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 12,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
  },
});
