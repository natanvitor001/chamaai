import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  sendEmailVerification,
  sendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export interface User {
  nome: string;
  email: string;
  celular: string;
  tipo: 'cliente' | 'prestador';
  emailVerified?: boolean;
  uid?: string;
}

const USER_DATA_KEY = '@user-data';

// Função para salvar dados adicionais do usuário no AsyncStorage
async function saveUserData(userData: User): Promise<void> {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    console.error('Erro ao salvar dados do usuário:', error);
    throw error;
  }
}

// Função para recuperar dados adicionais do usuário
async function getUserDataFromStorage(): Promise<User | null> {
  try {
    const userData = await AsyncStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Erro ao recuperar dados do usuário do storage:', error);
    return null;
  }
}

// Função para adicionar campos telefone e nome ao documento do usuário
async function addUserFieldsToFirestore(uid: string, userData: User): Promise<void> {
  try {
    await setDoc(doc(db, 'Usuarios', uid), {
      ...userData,
      uid,
      nome: userData.nome,
      telefone: userData.celular, // Mapeando celular para telefone
      tipo: userData.tipo,
      email: userData.email,
      createdAt: new Date(),
      updatedAt: new Date()
    }, { merge: true }); // merge: true para não sobrescrever campos existentes
  } catch (error) {
    console.error('Erro ao salvar usuário no Firestore:', error);
    throw error;
  }
}

// Função para recuperar dados do usuário do Firestore
async function getUserFromFirestore(uid: string): Promise<User | null> {
  try {
    const userDoc = await getDoc(doc(db, 'Usuarios', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  } catch (error) {
    console.error('Erro ao recuperar usuário do Firestore:', error);
    return null;
  }
}

export const authService = {
  // Registrar usuário com Firebase Auth
  async registerUser(userData: User, senha: string): Promise<User> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, senha);
      const firebaseUser = userCredential.user;

      await updateProfile(firebaseUser, {
        displayName: userData.nome
      });

      const userDataWithUid = { ...userData, uid: firebaseUser.uid };
      await addUserFieldsToFirestore(firebaseUser.uid, userDataWithUid);

      try {
        await sendEmailVerification(firebaseUser);
      } catch (emailError) {
        console.warn('Erro ao enviar e-mail de verificação:', emailError);
      }

      const userDataToSave: User = {
        ...userDataWithUid,
        emailVerified: firebaseUser.emailVerified
      };
      await saveUserData(userDataToSave);

      console.log('Usuário registrado com sucesso.');
      return userDataToSave;
    } catch (error: any) {
      console.error('Erro ao registrar usuário:', error);
      throw this.translateError(error);
    }
  },

  // Fazer login
  async loginUser(email: string, senha: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, senha);
      const firebaseUser = userCredential.user;

      let userData = await getUserFromFirestore(firebaseUser.uid);
      
      if (!userData) {
        userData = {
          nome: firebaseUser.displayName || 'Usuário',
          email: firebaseUser.email || email,
          celular: '',
          tipo: 'cliente', 
          emailVerified: firebaseUser.emailVerified,
          uid: firebaseUser.uid
        };
        await addUserFieldsToFirestore(firebaseUser.uid, userData);
      }

      const updatedUserData: User = {
        ...userData,
        emailVerified: firebaseUser.emailVerified,
        uid: firebaseUser.uid
      };
      
      await saveUserData(updatedUserData);
      
      return updatedUserData;
    } catch (error: any) {
      console.error('Erro ao fazer login:', error);
      throw this.translateError(error);
    }
  },

  // Fazer logout
  async logoutUser(): Promise<void> {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      console.log('Logout realizado com sucesso.');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw new Error('Erro ao sair da conta.');
    }
  },

  // Reenviar e-mail de verificação
  async resendVerificationEmail(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (user && !user.emailVerified) {
        await sendEmailVerification(user);
        console.log('E-mail de verificação reenviado.');
      } else {
        throw new Error('Usuário não encontrado ou e-mail já verificado.');
      }
    } catch (error) {
      console.error('Erro ao reenviar e-mail de verificação:', error);
      throw new Error('Erro ao reenviar e-mail de verificação.');
    }
  },

  // Obter usuário atual do Firebase Auth
  getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  },

  // Observar mudanças de autenticação
  onAuthStateChanged(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, callback);
  },

  // Verificar se o e-mail foi verificado
  async checkEmailVerification(): Promise<boolean> {
    const user = auth.currentUser;
    if (user) {
      await user.reload(); 
      return user.emailVerified;
    }
    return false;
  },

  // Redefinir senha
  async resetPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(auth, email);
      console.log('E-mail de redefinição de senha enviado.');
    } catch (error: any) {
      console.error('Erro ao enviar e-mail de redefinição:', error);
      throw this.translateError(error);
    }
  },

  // Atualizar dados do usuário
  async updateUserData(userData: Partial<User>): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('Usuário não autenticado.');
      }

      const currentData = await getUserFromFirestore(currentUser.uid) || await getUserDataFromStorage();
      if (!currentData) {
        throw new Error('Dados do usuário não encontrados.');
      }

      const updatedData = { ...currentData, ...userData, uid: currentUser.uid };

      await addUserFieldsToFirestore(currentUser.uid, updatedData);
      await saveUserData(updatedData);

      console.log('Dados do usuário atualizados com sucesso.');
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  },

  // Obter dados do usuário do Firestore (público)
  async getUserFromFirestorePublic(uid: string): Promise<User | null> {
    return getUserFromFirestore(uid);
  },

  // Traduzir erros do Firebase
  translateError(error: any): Error {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return new Error('Este e-mail já está sendo usado por outra conta.');
      case 'auth/invalid-email':
        return new Error('E-mail inválido.');
      case 'auth/weak-password':
        return new Error('A senha deve ter pelo menos 6 caracteres.');
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return new Error('E-mail ou senha incorretos.');
      case 'auth/user-disabled':
        return new Error('Esta conta foi desabilitada.');
      case 'auth/too-many-requests':
        return new Error('Muitas tentativas de login. Tente novamente mais tarde.');
      case 'auth/network-request-failed':
        return new Error('Erro de conexão. Verifique sua internet.');
      default:
        return error;
    }
  }
};

