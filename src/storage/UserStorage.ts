import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_KEY = '@meuApp:user';

export type UserData = {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
  profileImage?: string;
  profileVerified?: boolean;
  endereco?: {
    cep: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
  };
};

export async function saveUser(user: UserData): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (e) {
    throw new Error('Erro ao salvar usuário');
  }
}

export async function getUser(): Promise<UserData | null> {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    throw new Error('Erro ao recuperar usuário');
  }
}

export async function updateUser(userData: Partial<UserData>): Promise<void> {
  try {
    const currentUser = await getUser();
    if (!currentUser) {
      // Se o usuário não for encontrado, salve os dados como um novo usuário
      await saveUser(userData as UserData);
      return;
    }
    
    const updatedUser = { ...currentUser, ...userData };
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
  } catch (e) {
    console.error("Erro detalhado ao atualizar usuário:", e);
    throw new Error("Erro ao atualizar usuário");
  }
}

export async function clearUser(): Promise<void> {
  try {
    await AsyncStorage.removeItem(USER_KEY);
  } catch (e) {
    throw new Error('Erro ao limpar usuário');
  }
}

