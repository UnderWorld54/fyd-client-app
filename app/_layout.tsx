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

import { useColorScheme } from "@/hooks/useColorScheme";
import { authService } from "@/services/auth.service";
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://b8c2dd17a6b3623ce04cc8f94c9b839e@o4509513032663040.ingest.de.sentry.io/4509513048719440',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

export default Sentry.wrap(function RootLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [loaded] = useFonts({
    Montserrat: require("../assets/fonts/Montserrat/Montserrat-Regular.ttf"),
    MontserratBold: require("../assets/fonts/Montserrat/Montserrat-Bold.ttf"),
    MontserratSemiBold: require("../assets/fonts/Montserrat/Montserrat-SemiBold.ttf"),
    MontserratItalic: require("../assets/fonts/Montserrat/Montserrat-Italic.ttf"),
  });

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (isMounted) {
          setIsAuthenticated(!!user);
        }
      } catch (error) {
        console.error(
          "Erreur lors de la vérification de l'authentification:",
          error
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    checkAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (!loaded || isLoading) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          {isAuthenticated ? (
            <Stack.Screen name="home/index" />
          ) : (
            <Stack.Screen name="main/index" />
          )}
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
});