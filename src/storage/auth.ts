import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  nome: string;
  email: string;
  senha: string;
  celular: string;
  endereco: string;
  tipo: 'cliente' | 'prestador';
}

const STORAGE_KEY = '@meu-app-users';

// Função para registrar usuário no armazenamento local
export async function registerUser(user: User): Promise<void> {
  try {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // Verifica se já existe email cadastrado
    const emailExists = users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
    if (emailExists) {
      throw new Error('E-mail já cadastrado');
    }

    users.push(user);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    throw error;
  }
}

// Função para login - verifica se usuário existe e senha bate
export async function loginUser(email: string, senha: string): Promise<User> {
  try {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.senha === senha
    );

    if (!user) {
      throw new Error('Usuário ou senha inválidos');
    }

    return user;
  } catch (error) {
    throw error;
  }
}


// Função para criar usuários de teste se não existirem
export async function createTestUsers(): Promise<void> {
  try {
    const usersJson = await AsyncStorage.getItem(STORAGE_KEY);
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    // Usuário cliente de teste
    const testCliente: User = {
      nome: 'Cliente Teste',
      email: 'cliente@teste.com',
      senha: '123456',
      celular: '(11) 99999-9999',
      endereco: 'Rua Teste, 123 - São Paulo, SP',
      tipo: 'cliente'
    };

    // Usuário prestador de teste
    const testPrestador: User = {
      nome: 'Prestador Teste',
      email: 'prestador@teste.com',
      senha: '123456',
      celular: '(11) 88888-8888',
      endereco: 'Av. Teste, 456 - São Paulo, SP',
      tipo: 'prestador'
    };

    // Verifica se os usuários de teste já existem
    const clienteExists = users.some(u => u.email === testCliente.email);
    const prestadorExists = users.some(u => u.email === testPrestador.email);

    if (!clienteExists) {
      users.push(testCliente);
    }

    if (!prestadorExists) {
      users.push(testPrestador);
    }

    // Salva os usuários atualizados
    if (!clienteExists || !prestadorExists) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    }
  } catch (error) {
    console.error('Erro ao criar usuários de teste:', error);
  }
}

