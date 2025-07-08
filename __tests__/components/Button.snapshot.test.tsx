import Button from '@/components/Button';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('Button Component Snapshots', () => {
  it('matches snapshot with primary variant', () => {
    const tree = render(
      <Button title="Primary Button" onPress={() => {}} />
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with secondary variant', () => {
    const tree = render(
      <Button title="Secondary Button" onPress={() => {}} variant="secondary" />
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with custom style', () => {
    const tree = render(
      <Button 
        title="Custom Button" 
        onPress={() => {}} 
        style={{ width: 200, marginTop: 20 }}
      />
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });
});