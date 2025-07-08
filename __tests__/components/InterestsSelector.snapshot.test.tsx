import InterestsSelector from '@/components/InterestsSelector';
import { render } from '@testing-library/react-native';
import React from 'react';

describe('InterestsSelector Component Snapshots', () => {
  it('matches snapshot with no interests selected', () => {
    const tree = render(
      <InterestsSelector 
        selectedInterests={[]} 
        onInterestsChange={() => {}} 
      />
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with some interests selected', () => {
    const tree = render(
      <InterestsSelector 
        selectedInterests={['sport', 'musique', 'art']} 
        onInterestsChange={() => {}} 
      />
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });

  it('matches snapshot with all interests selected', () => {
    const allInterests = [
      'sport', 
      'musique', 
      'cinema', 
      'lecture', 
      'voyage', 
      'cuisine', 
      'art', 
      'technologie', 
      'nature', 
      'photographie'
    ];
    
    const tree = render(
      <InterestsSelector 
        selectedInterests={allInterests} 
        onInterestsChange={() => {}} 
      />
    ).toJSON();
    
    expect(tree).toMatchSnapshot();
  });
});