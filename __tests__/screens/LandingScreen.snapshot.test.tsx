import LandingScreen from '@/app/main/index';
import { render } from '@testing-library/react-native';
import React from 'react';

// Mock de l'image
jest.mock('../../assets/images/icon.png', () => 'icon.png');

describe('LandingScreen Snapshots', () => {
  it('matches snapshot', () => {
    const tree = render(<LandingScreen />).toJSON();
    
    expect(tree).toMatchSnapshot();
  });
});