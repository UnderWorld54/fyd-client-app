import Header from '@/components/Header';
import { render } from '@testing-library/react-native';
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

describe('Header Component Snapshots', () => {
  it('matches snapshot with title only', () => {
    const tree = render(<Header title="Test Header" />).toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with right component', () => {
    const rightComponent = (
      <TouchableOpacity>
        <Text>Action</Text>
      </TouchableOpacity>
    );
    
    const tree = render(
      <Header title="Header with Action" rightComponent={rightComponent} />
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with very long title', () => {
    const longTitle = 'This is a very long title that should be truncated with ellipsis at the end';
    const tree = render(<Header title={longTitle} />).toJSON();
    
    expect(tree).toMatchSnapshot();
  });
});