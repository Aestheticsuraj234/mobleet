import { Stack } from 'expo-router';

export default function ProblemsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { flex: 1, backgroundColor: '#0a0a0c' },
      }}
    />
  );
}
