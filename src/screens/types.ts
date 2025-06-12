// src/screens/types.ts
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Cadastro: undefined;
  ForgotPassword: undefined;
  EmailVerification: undefined;
  ClienteHome: undefined;
  PrestadorHome: undefined;
  RequestForm: { serviceName?: string; serviceId?: string };
  Chat: { 
    otherUser?: {
      uid: string;
      name: string;
      avatar?: string;
      tipo: 'cliente' | 'prestador';
    };
    proposta?: {
      id: string;
      categoria: string;
      descricao: string;
      cliente: string;
      clienteId?: string;
      bairro: string;
      status: string;
      valor: string;
      telefone?: string;
      endereco?: string;
    };
  };
  ChatTest: undefined;
  EditProfile: undefined;
  Settings: undefined;
  Orders: undefined;
  OrderDetails: { orderId: string };
  ServiceCategories: undefined;
  Favorites: undefined;
  Help: undefined;
  Messages: undefined;
  Home: undefined;
  Profile: undefined;
  MainTabs: undefined;
  MainApp: undefined;
  PrestadorApp: undefined;
  NewServiceRequest: undefined;
  Loja: undefined;
  MinhasPropostas: undefined;
  Carteira: undefined;
  InicioTab: undefined;
  PropostasTab: undefined;
  CarteiraTab: undefined;
  ChatTab: undefined;
  PerfilTab: undefined;
};

// Props para as telas
export type LoginScreenProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type CadastroScreenProps = NativeStackScreenProps<RootStackParamList, 'Cadastro'>;
export type ForgotPasswordScreenProps = NativeStackScreenProps<RootStackParamList, 'ForgotPassword'>;
export type EmailVerificationScreenProps = NativeStackScreenProps<RootStackParamList, 'EmailVerification'>;
export type ClienteHomeProps = NativeStackScreenProps<RootStackParamList, 'ClienteHome'>;
export type PrestadorHomeProps = NativeStackScreenProps<RootStackParamList, 'PrestadorHome'>;
export type OrdersProps = NativeStackScreenProps<RootStackParamList, 'Orders'>;
export type OrderDetailsProps = NativeStackScreenProps<RootStackParamList, 'OrderDetails'>;
export type HomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Home'>;
export type MessagesScreenProps = NativeStackScreenProps<RootStackParamList, 'Messages'>;
export type FavoritesScreenProps = NativeStackScreenProps<RootStackParamList, 'Favorites'>;
export type ProfileScreenProps = NativeStackScreenProps<RootStackParamList, 'Profile'>;
export type ChatScreenProps = NativeStackScreenProps<RootStackParamList, 'Chat'>;
export type NewServiceRequestScreenProps = NativeStackScreenProps<RootStackParamList, 'NewServiceRequest'>;
export type LojaScreenProps = NativeStackScreenProps<RootStackParamList, 'Loja'>;
export type MinhasPropostasScreenProps = NativeStackScreenProps<RootStackParamList, 'MinhasPropostas'>;
export type CarteiraScreenProps = NativeStackScreenProps<RootStackParamList, 'Carteira'>;

