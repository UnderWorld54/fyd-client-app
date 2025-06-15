import React, { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BackButton from './BackButton';

type HeaderProps = {
  title: string;
  rightComponent?: ReactNode;
};

export default function Header({ title, rightComponent }: HeaderProps) {
  return (
    <View style={styles.header}>
      <BackButton />
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <View style={styles.rightContainer}>
        {rightComponent}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    marginTop: 32,
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'MontserratBold',
  },
  rightContainer: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 