import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#121212' },
        headerTintColor: '#FFFFFF',
        headerTitleStyle: { fontWeight: 'bold' },
        contentStyle: { backgroundColor: '#121212' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'TMDB Filmes' }} />
      <Stack.Screen name="movie/[id]" options={{ title: 'Detalhes do Filme' }} />
      <Stack.Screen name="actor/[id]" options={{ title: 'Perfil do Ator' }} />
    </Stack>
  );
}