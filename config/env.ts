import Constants from 'expo-constants';

const ENV = {
  dev: {
    API_URL: 'http://192.168.1.46:3000/api',
  },
  prod: {
    API_URL: 'https://api.fyd-app.com', // À remplacer par votre URL de production
  },
};

const getEnvVars = () => {
  const env = Constants.expoConfig?.extra?.env || 'dev';
  return ENV[env as keyof typeof ENV];
};

export default getEnvVars(); 