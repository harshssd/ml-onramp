import React, { useCallback, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import YoutubePlayer, { YoutubeIframeRef } from 'react-native-youtube-iframe';
import { useTheme } from '../contexts/ThemeContext';

interface YouTubeSegmentProps {
  videoId: string;
  start?: number;
  end?: number;
  title?: string;
}

export default function YouTubeSegment({ videoId, start = 0, end, title }: YouTubeSegmentProps) {
  const { getThemeColors } = useTheme();
  const colors = getThemeColors();
  const playerRef = useRef<YoutubeIframeRef>(null);

  const onChangeState = useCallback((state: string) => {
    // If end time is specified, stop playback once reached
    if (state === 'playing' && end && playerRef.current) {
      // There is no precise onProgress; rely on endSeconds param
    }
  }, [end]);

  return (
    <View style={styles.container}>
      {title ? (
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      ) : null}
      <YoutubePlayer
        ref={playerRef}
        height={220}
        play={false}
        videoId={videoId}
        onChangeState={onChangeState}
        initialPlayerParams={{
          start: Math.max(0, Math.floor(start)),
          end: end ? Math.floor(end) : undefined,
          controls: true,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});

