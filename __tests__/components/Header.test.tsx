import Header from '@/components/Header';
import { render } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity } from 'react-native';

describe('Header Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Header title="Header au hasard" />);
    
    expect(getByText('Header au hasard')).toBeTruthy();
  });

  it('renders with right component', () => {
    const rightComponent = <TouchableOpacity testID="right-component" />;
    const { getByTestId } = render(
      <Header title="Header with Right" rightComponent={rightComponent} />
    );
    
    expect(getByTestId('right-component')).toBeTruthy();
  });

  it('truncates long titles', () => {
    const longTitle = 'titre très très très très très très très très long qui devrait être tronqué';
    const { getByText } = render(<Header title={longTitle} />);
    
    const titleElement = getByText(longTitle);
    expect(titleElement.props.numberOfLines).toBe(1);
    expect(titleElement.props.ellipsizeMode).toBe('tail');
  });
});