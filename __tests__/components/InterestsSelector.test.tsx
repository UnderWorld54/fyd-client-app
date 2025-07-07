import InterestsSelector from '@/components/InterestsSelector';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';

describe('InterestsSelector Component', () => {
  const mockOnInterestsChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all available interests', () => {
    const { getByText } = render(
      <InterestsSelector 
        selectedInterests={[]} 
        onInterestsChange={mockOnInterestsChange} 
      />
    );

    expect(getByText('Sport')).toBeTruthy();
    expect(getByText('Musique')).toBeTruthy();
    expect(getByText('Cinéma')).toBeTruthy();
    expect(getByText('Lecture')).toBeTruthy();
    expect(getByText('Voyage')).toBeTruthy();
    expect(getByText('Cuisine')).toBeTruthy();
    expect(getByText('Art')).toBeTruthy();
    expect(getByText('Technologie')).toBeTruthy();
    expect(getByText('Nature')).toBeTruthy();
    expect(getByText('Photographie')).toBeTruthy();
  });

  it('shows selected interests correctly', () => {
    const { getByTestId } = render(
      <InterestsSelector 
        selectedInterests={['sport', 'musique']} 
        onInterestsChange={mockOnInterestsChange} 
      />
    );

    const sportChip = getByTestId('interest-chip-sport');
    const musiqueChip = getByTestId('interest-chip-musique');
    
    // Les chips sélectionnés devraient avoir un style différent
    expect(sportChip.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#007AFF' })
    );
    expect(musiqueChip.props.style).toContainEqual(
      expect.objectContaining({ backgroundColor: '#007AFF' })
    );
  });

  it('toggles edit mode when clicking the edit button', () => {
    const { getByText, getByTestId } = render(
      <InterestsSelector 
        selectedInterests={[]} 
        onInterestsChange={mockOnInterestsChange} 
      />
    );

    // Find the edit button by testID
    const editButton = getByTestId('edit-button');
    
    // Initially in non-edit mode
    const sportChip = getByText('Sport');
    fireEvent.press(sportChip);
    expect(mockOnInterestsChange).not.toHaveBeenCalled();

    // Enter edit mode
    fireEvent.press(editButton);

    // Now clicking should work
    fireEvent.press(sportChip);
    expect(mockOnInterestsChange).toHaveBeenCalledWith(['sport']);
  });

  it('adds interest when clicked in edit mode', () => {
    const { getByText, getByTestId } = render(
      <InterestsSelector 
        selectedInterests={[]} 
        onInterestsChange={mockOnInterestsChange} 
      />
    );

    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton); // Enter edit mode

    const sportChip = getByText('Sport');
    fireEvent.press(sportChip);

    expect(mockOnInterestsChange).toHaveBeenCalledWith(['sport']);
  });

  it('removes interest when already selected and clicked in edit mode', () => {
    const { getByText, getByTestId } = render(
      <InterestsSelector 
        selectedInterests={['sport', 'musique']} 
        onInterestsChange={mockOnInterestsChange} 
      />
    );

    const editButton = getByTestId('edit-button');
    fireEvent.press(editButton); // Enter edit mode

    const sportChip = getByText('Sport');
    fireEvent.press(sportChip);

    expect(mockOnInterestsChange).toHaveBeenCalledWith(['musique']);
  });

  it('disables interest selection when not in edit mode', () => {
    const { getByText } = render(
      <InterestsSelector 
        selectedInterests={[]} 
        onInterestsChange={mockOnInterestsChange} 
      />
    );

    const sportChip = getByText('Sport');
    fireEvent.press(sportChip);

    expect(mockOnInterestsChange).not.toHaveBeenCalled();
  });
});