import Constants from 'expo-constants';

const ENV = {
  dev: {
    API_URL: 'http://10.41.102.139:3000/api',
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