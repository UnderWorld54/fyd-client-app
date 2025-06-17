export default {
  expo: {
    name: 'Fill Your Day',
    slug: 'fyd',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'fydapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#FEC180'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#FEC180'
      },
    },
    web: {
      bundler: 'metro',
      favicon: './assets/images/favicon.png'
    },
    extra: {
      env: process.env.APP_ENV || 'dev'
    },
    plugins: [
      'expo-secure-store'
    ]
  }
}; 