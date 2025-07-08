import BackButton from '@/components/BackButton';
import { render } from '@testing-library/react-native';
import { router } from 'expo-router';
import React from 'react';

describe('BackButton Component Snapshots', () => {
  it('matches snapshot when canGoBack is true', () => {
    // Mock canGoBack to return true
    (router.canGoBack as jest.Mock).mockReturnValue(true);
    
    const tree = render(<BackButton />).toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot when canGoBack is false', () => {
    // Mock canGoBack to return false
    (router.canGoBack as jest.Mock).mockReturnValue(false);
    
    const tree = render(<BackButton />).toJSON();
    
    expect(tree).toMatchSnapshot();
  });
});