import { useLocalSearchParams, Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, Pressable } from 'react-native';
import { api } from '../../src/api/tmdb';

interface MovieDetails {
  title: string;
  overview: string;
  poster_path: string | null;
  vote_average: number;
  runtime: number;
}

interface Actor {
  id: number;
  name: string;
  profile_path: string | null;
}

export default function MovieDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [cast, setCast] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        // Busca os detalhes e os créditos (elenco) simultaneamente
        const [movieRes, creditsRes] = await Promise.all([
          api.get(`/movie/${id}`),
          api.get(`/movie/${id}/credits`)
        ]);
        
        setMovie(movieRes.data);
        // Limita a lista de atores para os 5 primeiros
        setCast(creditsRes.data.cast.slice(0, 5));
      } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Filme não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {movie.poster_path && (
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }}
          style={styles.poster}
          resizeMode="cover"
        />
      )}
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>

        <View style={styles.statsContainer}>
          <Text style={styles.statText}>⭐ {movie.vote_average.toFixed(1)}/10</Text>
          <Text style={styles.statText}>⏱️ {movie.runtime} min</Text>
        </View>

        <Text style={styles.sectionTitle}>Sinopse</Text>
        <Text style={styles.overview}>
          {movie.overview || 'Sinopse não disponível para este filme.'}
        </Text>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Elenco Principal</Text>
        <FlatList
          data={cast}
          horizontal
          keyExtractor={(item) => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            // Adicionamos o "as any" para o TypeScript aceitar a nova rota dinâmica
            <Link href={`/actor/${item.id}` as any} asChild>
              <Pressable style={styles.actorCard}>
                {item.profile_path ? (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${item.profile_path}` }}
                    style={styles.actorImage}
                  />
                ) : (
                  <View style={styles.actorImagePlaceholder}>
                    <Text style={styles.placeholderText}>?</Text>
                  </View>
                )}
                {/* Removemos o textAlign daqui, pois agora ele está no styles.actorName */}
                <Text style={styles.actorName} numberOfLines={2}>
                  {item.name}
                </Text>
              </Pressable>
            </Link>
          )}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  poster: { width: '100%', height: 400 },
  content: { padding: 20 },
  title: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  statsContainer: { flexDirection: 'row', gap: 16, marginBottom: 24 },
  statText: { color: '#E50914', fontSize: 16, fontWeight: '600' },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  overview: { color: '#D1D5DB', fontSize: 16, lineHeight: 24 },
  errorText: { color: '#FFFFFF', fontSize: 18 },
  actorCard: { width: 90, marginRight: 16, alignItems: 'center' },
  actorImage: { width: 70, height: 70, borderRadius: 35, marginBottom: 8 },
  actorImagePlaceholder: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  placeholderText: { color: '#9CA3AF', fontSize: 24 },
  actorName: { color: '#D1D5DB', fontSize: 12, textAlign: 'center' },
});