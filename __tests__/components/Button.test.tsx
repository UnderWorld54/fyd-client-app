import Button from '@/components/Button';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('Button Component', () => {
  it('renders correctly with primary variant', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={() => {}} />
    );
    
    const button = getByText('Test Button');
    expect(button).toBeTruthy();
  });

  it('renders correctly with secondary variant', () => {
    const { getByText } = render(
      <Button title="Secondary Button" onPress={() => {}} variant="secondary" />
    );
    
    const button = getByText('Secondary Button');
    expect(button).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="Clickable Button" onPress={onPressMock} />
    );
    
    const button = getByText('Clickable Button');
    fireEvent.press(button);
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});