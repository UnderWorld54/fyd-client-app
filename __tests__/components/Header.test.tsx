import React from 'react';
import { render } from '@testing-library/react-native';
import { TouchableOpacity } from 'react-native';
import Header from '@/components/Header';

describe('Header Component', () => {
  it('renders correctly with title', () => {
    const { getByText } = render(<Header title="Test Header" />);
    
    expect(getByText('Test Header')).toBeTruthy();
  });

  it('renders with right component', () => {
    const rightComponent = <TouchableOpacity testID="right-component" />;
    const { getByTestId } = render(
      <Header title="Header with Right" rightComponent={rightComponent} />
    );
    
    expect(getByTestId('right-component')).toBeTruthy();
  });

  it('truncates long titles', () => {
    const longTitle = 'This is a very long title that should be truncated';
    const { getByText } = render(<Header title={longTitle} />);
    
    const titleElement = getByText(longTitle);
    expect(titleElement.props.numberOfLines).toBe(1);
    expect(titleElement.props.ellipsizeMode).toBe('tail');
  });
});