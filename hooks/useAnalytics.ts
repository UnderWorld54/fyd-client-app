import { AnalyticsEvents, analyticsService, type AnalyticsEvent } from '@/services/analytics.service';
import { useCallback, useEffect } from 'react';

export const useAnalytics = () => {
  // Tracker un événement
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    analyticsService.trackEvent(event);
  }, []);

  // Tracker un écran
  const trackScreen = useCallback((screenName: string, properties?: Record<string, any>) => {
    analyticsService.trackScreen(screenName, properties);
  }, []);

  // Tracker une erreur
  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    analyticsService.trackError(error, context);
  }, []);

  // Identifier un utilisateur
  const identifyUser = useCallback((userId: string, properties?: Record<string, any>) => {
    analyticsService.identifyUser({
      userId,
      ...properties,
    });
  }, []);

  // Tracker l'ouverture de l'app
  const trackAppOpen = useCallback(() => {
    trackEvent({
      name: AnalyticsEvents.APP_OPENED,
      properties: {
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  // Tracker la fermeture de l'app
  const trackAppBackground = useCallback(() => {
    trackEvent({
      name: AnalyticsEvents.APP_BACKGROUNDED,
      properties: {
        timestamp: new Date().toISOString(),
      },
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackScreen,
    trackError,
    identifyUser,
    trackAppOpen,
    trackAppBackground,
    AnalyticsEvents,
  };
};

// Hook pour tracker automatiquement les écrans
export const useScreenTracking = (screenName: string, properties?: Record<string, any>) => {
  const { trackScreen } = useAnalytics();

  useEffect(() => {
    trackScreen(screenName, properties);
  }, [screenName, trackScreen, properties]);
};

// Hook pour tracker les erreurs automatiquement
export const useErrorTracking = () => {
  const { trackError } = useAnalytics();

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      trackError(new Error(error.message), {
        source: 'global_error',
        filename: error.filename,
        lineno: error.lineno,
        colno: error.colno,
      });
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackError(new Error(event.reason), {
        source: 'unhandled_rejection',
      });
    };

    // Écouter les erreurs globales
    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [trackError]);
}; 