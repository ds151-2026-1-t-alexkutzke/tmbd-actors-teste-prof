import { useLocalSearchParams, Link } from 'expo-router';
import { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, FlatList, Pressable } from 'react-native';
import { api } from '../../src/api/tmdb';

interface ActorDetails {
  name: string;
  biography: string;
  profile_path: string | null;
  birthday: string | null;
}

interface MovieCredit {
  id: number;
  title: string;
  poster_path: string | null;
}

export default function ActorDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [actor, setActor] = useState<ActorDetails | null>(null);
  const [movies, setMovies] = useState<MovieCredit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função auxiliar para calcular a idade do ator baseada na data de nascimento
  const calculateAge = (birthday: string | null) => {
    if (!birthday) return 'Idade desconhecida';
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return `${age} anos`;
  };

  useEffect(() => {
    const fetchActorData = async () => {
      try {
        // Uso de Promise.all para otimização das requisições paralelas
        const [personRes, creditsRes] = await Promise.all([
          api.get(`/person/${id}`),
          api.get(`/person/${id}/movie_credits`)
        ]);

        setActor(personRes.data);
        setMovies(creditsRes.data.cast);
      } catch (error) {
        console.error('Erro ao buscar detalhes do ator:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActorData();
  }, [id]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!actor) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Ator não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {actor.profile_path ? (
          <Image
            source={{ uri: `https://image.tmdb.org/t/p/w500${actor.profile_path}` }}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.profilePlaceholder}>
            <Text style={styles.placeholderText}>Sem Foto</Text>
          </View>
        )}
        <Text style={styles.name}>{actor.name}</Text>
        <Text style={styles.age}>{calculateAge(actor.birthday)}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Biografia</Text>
        <Text style={styles.biography}>
          {actor.biography || 'Biografia não disponível para este ator/atriz.'}
        </Text>

        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Filmografia</Text>
        <FlatList
          data={movies}
          horizontal
          keyExtractor={(item, index) => `${item.id}-${index}`} // Usando index como fallback para keys duplicadas caso a API retorne algo sujo
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Link href={`/movie/${item.id}`} asChild>
              <Pressable style={styles.movieCard}>
                {item.poster_path ? (
                  <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w200${item.poster_path}` }}
                    style={styles.moviePoster}
                  />
                ) : (
                  <View style={styles.moviePosterPlaceholder}>
                    <Text style={styles.placeholderTextSmall}>Sem Pôster</Text>
                  </View>
                )}
                <Text style={styles.movieTitle} numberOfLines={2}>
                  {item.title}
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
  header: { alignItems: 'center', padding: 20, backgroundColor: '#1F1F1F' },
  profileImage: { width: 150, height: 150, borderRadius: 75, marginBottom: 16 },
  profilePlaceholder: { width: 150, height: 150, borderRadius: 75, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  placeholderText: { color: '#9CA3AF', fontSize: 16 },
  placeholderTextSmall: { color: '#9CA3AF', fontSize: 12 },
  name: { color: '#FFFFFF', fontSize: 24, fontWeight: 'bold' },
  age: { color: '#E50914', fontSize: 16, marginTop: 4 },
  content: { padding: 20 },
  sectionTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  biography: { color: '#D1D5DB', fontSize: 16, lineHeight: 24 },
  errorText: { color: '#FFFFFF', fontSize: 18 },
  movieCard: { width: 100, marginRight: 16 },
  moviePoster: { width: 100, height: 150, borderRadius: 8, marginBottom: 8 },
  moviePosterPlaceholder: { width: 100, height: 150, borderRadius: 8, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  movieTitle: { color: '#D1D5DB', fontSize: 12, textAlign: 'center' },
});