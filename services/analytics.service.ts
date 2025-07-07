import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Application from 'expo-application';
import * as Device from 'expo-device';

// Types pour les analytics
export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
  userId?: string;
}

export interface UserProperties {
  userId: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

export interface AnalyticsConfig {
  mixpanelToken?: string;
  posthogApiKey?: string;
  googleAnalyticsId?: string;
  enabled: boolean;
}

class AnalyticsService {
  private config: AnalyticsConfig = {
    enabled: true,
  };
  private userId: string | null = null;
  private userProperties: UserProperties | null = null;
  private isInitialized = false;

  // Configuration des services d'analytics
  async initialize(config: Partial<AnalyticsConfig> = {}) {
    if (this.isInitialized) return;

    this.config = { ...this.config, ...config };
    
    // Récupérer l'ID utilisateur stocké
    this.userId = await AsyncStorage.getItem('analytics_user_id');
    
    // Générer un ID utilisateur unique si nécessaire
    if (!this.userId) {
      this.userId = this.generateUserId();
      await AsyncStorage.setItem('analytics_user_id', this.userId);
    }

    this.isInitialized = true;
    console.log('Analytics service initialized');
  }

  // Générer un ID utilisateur unique
  private generateUserId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `user_${timestamp}_${random}`;
  }

  // Identifier un utilisateur
  async identifyUser(properties: UserProperties) {
    this.userProperties = properties;
    this.userId = properties.userId;
    
    await AsyncStorage.setItem('analytics_user_id', this.userId);
    await AsyncStorage.setItem('analytics_user_properties', JSON.stringify(properties));

    // Envoyer l'identification à tous les services
    this.trackUserIdentification(properties);
  }

  // Tracker un événement
  async trackEvent(event: AnalyticsEvent) {
    if (!this.config.enabled || !this.isInitialized) return;

    const enrichedEvent: AnalyticsEvent = {
      ...event,
      userId: event.userId || this.userId || undefined,
      properties: {
        ...event.properties,
        timestamp: new Date().toISOString(),
        deviceInfo: {
          platform: Device.osName,
          version: Device.osVersion,
          model: Device.modelName,
          appVersion: Application.nativeApplicationVersion,
          buildVersion: Application.nativeBuildVersion,
        },
      },
    };

    try {
      // Mixpanel (via API REST)
      if (this.config.mixpanelToken) {
        await this.sendToMixpanel(enrichedEvent);
      }

      // PostHog (via API REST)
      if (this.config.posthogApiKey) {
        await this.sendToPostHog(enrichedEvent);
      }

      console.log('Event tracked:', enrichedEvent);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }

  // Envoyer à Mixpanel
  private async sendToMixpanel(event: AnalyticsEvent) {
    const mixpanelEvent = {
      event: event.name,
      properties: {
        ...event.properties,
        distinct_id: event.userId,
        token: this.config.mixpanelToken,
        time: Date.now(),
      },
    };

    await fetch('https://api.mixpanel.com/track', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mixpanelEvent),
    });
  }

  // Envoyer à PostHog
  private async sendToPostHog(event: AnalyticsEvent) {
    const posthogEvent = {
      event: event.name,
      properties: {
        ...event.properties,
        distinct_id: event.userId,
        $set: this.userProperties,
      },
      timestamp: new Date().toISOString(),
    };

    await fetch(`https://app.posthog.com/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: this.config.posthogApiKey,
        ...posthogEvent,
      }),
    });
  }

  // Tracker l'identification utilisateur
  private trackUserIdentification(properties: UserProperties) {
    // Mixpanel - Set user properties
    if (this.config.mixpanelToken) {
      this.sendToMixpanelSet(properties);
    }

    // PostHog - Set user properties
    if (this.config.posthogApiKey) {
      this.sendToPostHogSet(properties);
    }
  }

  private async sendToMixpanelSet(properties: UserProperties) {
    const setEvent = {
      $set: properties,
      $token: this.config.mixpanelToken,
      $distinct_id: properties.userId,
    };

    await fetch('https://api.mixpanel.com/engage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(setEvent),
    });
  }

  private async sendToPostHogSet(properties: UserProperties) {
    const setEvent = {
      api_key: this.config.posthogApiKey,
      event: '$identify',
      properties: {
        distinct_id: properties.userId,
        $set: properties,
      },
    };

    await fetch('https://app.posthog.com/capture/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(setEvent),
    });
  }

  // Tracker les écrans
  async trackScreen(screenName: string, properties?: Record<string, any>) {
    await this.trackEvent({
      name: 'Screen View',
      properties: {
        screen_name: screenName,
        ...properties,
      },
    });
  }

  // Tracker les erreurs
  async trackError(error: Error, context?: Record<string, any>) {
    await this.trackEvent({
      name: 'Error',
      properties: {
        error_message: error.message,
        error_stack: error.stack,
        ...context,
      },
    });
  }

  // Activer/Désactiver les analytics
  setEnabled(enabled: boolean) {
    this.config.enabled = enabled;
  }

  // Obtenir les informations utilisateur
  getUserInfo() {
    return {
      userId: this.userId,
      properties: this.userProperties,
    };
  }

  // Réinitialiser les analytics
  async reset() {
    this.userId = null;
    this.userProperties = null;
    await AsyncStorage.removeItem('analytics_user_id');
    await AsyncStorage.removeItem('analytics_user_properties');
  }
}

// Instance singleton
export const analyticsService = new AnalyticsService();

// Événements prédéfinis pour l'application
export const AnalyticsEvents = {
  // Authentification
  USER_SIGNED_UP: 'User Signed Up',
  USER_SIGNED_IN: 'User Signed In',
  USER_SIGNED_OUT: 'User Signed Out',
  
  // Navigation
  SCREEN_VIEW: 'Screen View',
  
  // Fonctionnalités
  INTEREST_SELECTED: 'Interest Selected',
  EVENT_CREATED: 'Event Created',
  EVENT_JOINED: 'Event Joined',
  
  // Erreurs
  ERROR_OCCURRED: 'Error Occurred',
  
  // Performance
  APP_OPENED: 'App Opened',
  APP_BACKGROUNDED: 'App Backgrounded',
} as const; 