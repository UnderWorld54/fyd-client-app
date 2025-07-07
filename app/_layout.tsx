import {
    DarkTheme,
    DefaultTheme,
    ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "react-native-reanimated";

import { getAnalyticsConfig } from "@/config/analytics.config";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useColorScheme } from "@/hooks/useColorScheme";
import { analyticsService } from "@/services/analytics.service";
import { authService } from "@/services/auth.service";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { trackAppOpen, trackAppBackground } = useAnalytics();

  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    MontserratSemiBold: require("../assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    MontserratItalic: require("../assets/fonts/Montserrat/Montserrat-Italic.ttf"),
  });

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        // Initialiser les analytics
        const analyticsConfig = getAnalyticsConfig();
        await analyticsService.initialize(analyticsConfig);

        // Tracker l'ouverture de l'app
        trackAppOpen();

        // Vérifier l'authentification
        const user = await authService.getCurrentUser();
        if (isMounted) {
          setIsAuthenticated(!!user);
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'initialisation de l'application:",
          error
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, [trackAppOpen]);

  // Tracker quand l'app passe en arrière-plan
  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background') {
        trackAppBackground();
      }
    };

    // Note: Pour une implémentation complète, vous devriez utiliser AppState de React Native
    // import { AppState } from 'react-native';
    // AppState.addEventListener('change', handleAppStateChange);

    return () => {
      // AppState.removeEventListener('change', handleAppStateChange);
    };
  }, [trackAppBackground]);

  if (!loaded || isLoading) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="home/personnalIndex" />
          ) : (
            <Stack.Screen name="main/index" />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
