import '@testing-library/jest-native/extend-expect';

// Mock expo modules
jest.mock('expo-font', () => ({
  useFonts: () => [true],
  isLoaded: () => true,
}));

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    canGoBack: jest.fn(() => true),
  },
  Stack: {
    Screen: 'Stack.Screen',
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

jest.mock('expo-calendar', () => ({
  requestCalendarPermissionsAsync: jest.fn(),
  getCalendarsAsync: jest.fn(),
  createEventAsync: jest.fn(),
  EntityTypes: {
    EVENT: 'EVENT',
  },
}));

// Mock alert
global.alert = jest.fn();

// Mock Alert specifically
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  const Text = require('react-native/Libraries/Text/Text');
  const TextInput = require('react-native/Libraries/Components/TextInput/TextInput');
  const TouchableOpacity = require('react-native/Libraries/Components/Touchable/TouchableOpacity');
  
  return {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView: require('react-native/Libraries/Components/ScrollView/ScrollView'),
    GestureHandlerRootView: View,
  };
});