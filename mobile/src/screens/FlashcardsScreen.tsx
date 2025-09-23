import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { API_CONFIG } from '../config/api';

type Flashcard = {
  track: string;
  card_front: string;
  card_back: string;
};

interface FlashcardsScreenProps {
  navigation: any;
  route: any;
}

const DEFAULT_TRACK = 'fundamentals';

export default function FlashcardsScreen({ route }: FlashcardsScreenProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const initialTrack = route?.params?.track || DEFAULT_TRACK;

  const [track, setTrack] = useState<string>(initialTrack);
  const tracks = ['fundamentals'];
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [reviewed, setReviewed] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlashcards(track);
  }, [track]);

  const progressPercent = useMemo(() => {
    if (cards.length === 0) return 0;
    return Math.round(((currentIndex + 1) / cards.length) * 100);
  }, [currentIndex, cards.length]);

  const loadFlashcards = async (selectedTrack: string) => {
    setLoading(true);
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setReviewed(new Set());

    try {
      const url = `${API_CONFIG.baseUrl}/api/content/flashcards/${selectedTrack}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);
      const data = await response.json();
      setCards(data);
    } catch (error: any) {
      console.error('Error loading flashcards:', error?.message || error);
      Alert.alert('Network Error', 'Could not load flashcards from server. Using sample deck.');
      setCards([
        { track: 'fundamentals', card_front: "What is 'loss'?", card_back: 'A scalar measuring prediction error used to tune parameters.' },
        { track: 'fundamentals', card_front: 'Train/Val/Test—why split?', card_back: 'To estimate generalization and avoid overfitting/leakage.' },
        { track: 'fundamentals', card_front: "What is a 'feature'?", card_back: 'An input variable used to make predictions.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFlip = () => setIsFlipped(!isFlipped);

  const markAnswer = (isCorrect: boolean) => {
    if (isCorrect) setCorrectCount((prev: number) => prev + 1);
    else setIncorrectCount((prev: number) => prev + 1);
    setReviewed((prev: Set<number>) => new Set([...prev, currentIndex]));
    goNext();
  };

  const goNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsFlipped(false);
    }
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setReviewed(new Set());
  };

  const currentCard = cards[currentIndex];
  const isComplete = cards.length > 0 && currentIndex >= cards.length - 1 && reviewed.has(currentIndex);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}> 
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <Text style={[styles.headerTitle, { color: colors.text }]}>Memory Training Arena 🧠</Text>
          <Text style={[styles.headerSubtitle, { color: colors.text + 'CC' }]}>Track: {track}</Text>
          <View style={styles.trackRow}>
            {tracks.map((t) => (
              <TouchableOpacity
                key={t}
                onPress={() => setTrack(t)}
                style={[styles.trackPill, { borderColor: colors.border, backgroundColor: t === track ? colors.accent : 'transparent' }]}
              >
                <Text style={[styles.trackPillText, { color: t === track ? '#000' : colors.text }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <View style={styles.rowBetween}> 
            <Text style={[styles.progressLabel, { color: colors.text + 'CC' }]}>Card {Math.min(currentIndex + 1, Math.max(cards.length, 1))} of {Math.max(cards.length, 1)}</Text>
            <Text style={[styles.progressValue, { color: colors.text }]}>{progressPercent}%</Text>
          </View>
          <View style={[styles.progressBar, { backgroundColor: colors.border }]}> 
            <View style={[styles.progressFill, { width: `${progressPercent}%`, backgroundColor: colors.accent }]} />
          </View>
        </View>

        <View style={[styles.statsRow]}> 
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.statValue, { color: '#22c55e' }]}>{correctCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text + 'CC' }]}>Correct</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.statValue, { color: '#ef4444' }]}>{incorrectCount}</Text>
            <Text style={[styles.statLabel, { color: colors.text + 'CC' }]}>Incorrect</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.statValue, { color: '#3b82f6' }]}>{reviewed.size}</Text>
            <Text style={[styles.statLabel, { color: colors.text + 'CC' }]}>Reviewed</Text>
          </View>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          {loading ? (
            <ActivityIndicator size="large" color={colors.accent} />
          ) : cards.length === 0 ? (
            <Text style={[styles.emptyText, { color: colors.text + 'CC' }]}>No flashcards available.</Text>
          ) : (
            <>
              <Text style={[styles.cardEmoji]}>💭</Text>
              <Text style={[styles.cardText, { color: colors.text }]}>{isFlipped ? currentCard.card_back : currentCard.card_front}</Text>
              <TouchableOpacity onPress={handleFlip} style={[styles.primaryButton, { backgroundColor: colors.accent }]}>
                <Text style={styles.primaryButtonText}>{isFlipped ? '🔄 Show Question' : '💡 Show Answer'}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={[styles.navRow, { backgroundColor: colors.card, borderColor: colors.border }]}> 
          <TouchableOpacity onPress={goPrev} disabled={currentIndex === 0 || loading} style={[styles.navButton, currentIndex === 0 || loading ? styles.buttonDisabled : { borderColor: colors.border }]}> 
            <Text style={[styles.navButtonText, { color: colors.text }]}>Previous</Text>
          </TouchableOpacity>

          {isFlipped && !loading && cards.length > 0 && (
            <View style={styles.answerRow}>
              <TouchableOpacity onPress={() => markAnswer(false)} style={[styles.answerButton, { backgroundColor: '#ef4444' }]}> 
                <Text style={styles.answerButtonText}>❌ Incorrect</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => markAnswer(true)} style={[styles.answerButton, { backgroundColor: '#22c55e' }]}> 
                <Text style={styles.answerButtonText}>✅ Correct</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity onPress={goNext} disabled={currentIndex >= cards.length - 1 || loading} style={[styles.navButton, currentIndex >= cards.length - 1 || loading ? styles.buttonDisabled : { borderColor: colors.border }]}> 
            <Text style={[styles.navButtonText, { color: colors.text }]}>Next</Text>
          </TouchableOpacity>
        </View>

        {isComplete && (
          <View style={[styles.section, { backgroundColor: colors.card, borderColor: colors.border }]}> 
            <Text style={[styles.completeEmoji]}>🎉</Text>
            <Text style={[styles.completeTitle, { color: colors.text }]}>Quest Complete!</Text>
            <Text style={[styles.completeSubtitle, { color: colors.text + 'CC' }]}>You reviewed all {cards.length} cards.</Text>
            <TouchableOpacity onPress={resetSession} style={[styles.primaryButton, { backgroundColor: colors.accent, marginTop: 12 }]}> 
              <Text style={styles.primaryButtonText}>Practice Again</Text>
            </TouchableOpacity>
          </View>
        )}

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
  section: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  trackRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  trackPill: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
  trackPillText: {
    fontSize: 12,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
  },
  progressValue: {
    fontSize: 12,
    fontWeight: 'bold',
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  card: {
    minHeight: 220,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 12,
  },
  cardEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 26,
  },
  primaryButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
  },
  navButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    borderWidth: 1,
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  answerButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  answerButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  emptyText: {
    fontSize: 14,
  },
  completeEmoji: {
    fontSize: 40,
    textAlign: 'center',
    marginBottom: 6,
  },
  completeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  completeSubtitle: {
    fontSize: 14,
    textAlign: 'center',
  },
});

