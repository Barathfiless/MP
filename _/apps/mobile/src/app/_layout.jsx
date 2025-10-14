
import { useAuth } from '@/utils/auth/useAuth';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { Pressable, Text, View } from 'react-native';
import * as SystemUI from 'expo-system-ui';
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { initiate, isReady } = useAuth();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem('mobile-theme') : null;
    if (stored) setIsDark(stored === 'dark');
  }, []);

  useEffect(() => {
    if (isDark) {
      SystemUI.setBackgroundColorAsync('#000000').catch(() => {});
      if (typeof window !== 'undefined') window.localStorage.setItem('mobile-theme', 'dark');
    } else {
      SystemUI.setBackgroundColorAsync('#ffffff').catch(() => {});
      if (typeof window !== 'undefined') window.localStorage.setItem('mobile-theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    initiate();
  }, [initiate]);

  useEffect(() => {
    if (isReady) {
      SplashScreen.hideAsync();
    }
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style={isDark ? 'light' : 'dark'} />
        <View style={{ position: 'absolute', right: 12, top: 12, zIndex: 9999 }}>
          <Pressable
            onPress={() => setIsDark((v) => !v)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 8,
              backgroundColor: isDark ? '#111213' : '#f1f1f1',
              borderWidth: 1,
              borderColor: isDark ? '#2a2b2c' : '#e3e3e3',
            }}
          >
            <Text style={{ color: isDark ? '#fff' : '#111' }}>{isDark ? 'Light' : 'Dark'}</Text>
          </Pressable>
        </View>
        <Stack screenOptions={{ headerShown: false }} initialRouteName="index">
          <Stack.Screen name="index" />
        </Stack>
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
