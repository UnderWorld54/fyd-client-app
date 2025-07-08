import Button from '@/components/Button';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('Button Component', () => {
  it('renders correctly with primary variant', () => {
    const { getByText } = render(
      <Button title="bouton primaire" onPress={() => {}} />
    );
    
    const button = getByText('bouton primaire');
    expect(button).toBeTruthy();
  });

  it('renders correctly with secondary variant', () => {
    const { getByText } = render(
      <Button title="bouton secondaire" onPress={() => {}} variant="secondary" />
    );
    
    const button = getByText('bouton secondaire');
    expect(button).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button title="bouton cliquable" onPress={onPressMock} />
    );
    
    const button = getByText('bouton cliquable');
    fireEvent.press(button);
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
});