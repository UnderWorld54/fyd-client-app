import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Les écrans enfants hériteront de cette option */}
    </Stack>
  );
} 