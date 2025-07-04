import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Home, ArrowLeft } from 'lucide-react-native';

const COLORS = {
  primary: '#1A237E',
  light: '#F8FAFC',
  white: '#FFFFFF',
  gray: '#64748B',
  dark: '#1E293B',
};

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.emoji}>🤔</Text>
          <Text style={styles.title}>Página não encontrada</Text>
          <Text style={styles.subtitle}>
            A página que você está procurando não existe ou foi movida.
          </Text>
          
          <Link href="/" asChild>
            <TouchableOpacity style={styles.button}>
              <Home size={20} color={COLORS.white} />
              <Text style={styles.buttonText}>Voltar ao Início</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.dark,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.white,
  },
});