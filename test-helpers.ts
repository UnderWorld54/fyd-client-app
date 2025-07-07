import { RenderOptions, render as rtlRender } from '@testing-library/react-native';
import React from 'react';

// Mock user data for tests
export const mockUser = {
  _id: '123',
  name: 'Test User',
  email: 'test@example.com',
  age: 25,
  role: 'user',
  isActive: true,
  refreshToken: 'mock_refresh_token',
  interests: ['sport', 'musique'],
  city: 'Paris',
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  id: '123'
};

export const mockAuthResponse = {
  success: true,
  data: {
    user: mockUser,
    token: 'mock_access_token',
    refreshToken: 'mock_refresh_token'
  },
  message: 'Success'
};

// Custom render function that includes providers
export function render(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return rtlRender(ui, { ...options });
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0));

// Mock navigation
export const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  push: jest.fn(),
  replace: jest.fn(),
};

// Mock route
export const mockRoute = {
  params: {},
  name: 'TestRoute'
};

export * from '@testing-library/react-native';

