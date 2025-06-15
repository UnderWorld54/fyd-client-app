import { StyleSheet, Text, View } from 'react-native';
import BackButton from './BackButton';

type HeaderProps = {
  title: string;
};

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.header}>
      <BackButton />
      <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">{title}</Text>
      <View style={{ width: 40 }} />
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
}); 