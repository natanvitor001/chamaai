// ChatScreen.styles.js
// Arquivo de estilos isolado para a tela de chat

import { StyleSheet, Platform } from 'react-native';

// Cores do tema (Paleta de azul escuro) - Isolado para esta tela
export const COLORS = {
  primary: '#1A237E', // Azul escuro principal (Deep Purple 900)
  primaryDark: '#000051', // Azul escuro mais profundo
  secondary: '#424242', // Cinza escuro para acentos
  accent: '#448AFF', // Azul vibrante para destaque (Blue A200)
  success: '#4CAF50', // Verde para sucesso
  danger: '#D32F2F', // Vermelho para erro
  warning: '#FBC02D', // Amarelo para aviso
  info: '#2196F3', // Azul para informação
  light: '#F5F5F5', // Fundo claro
  dark: '#212121', // Texto escuro
  gray: '#757575', // Cinza para texto secundário
  grayLight: '#E0E0E0', // Cinza claro para bordas
  white: '#FFFFFF', // Branco
  black: '#000000', // Preto
  inputBg: '#FFFFFF', // Fundo de input (Branco puro)
  inputBorder: '#9FA8DA', // Borda de input (Indigo 200)
  shadow: 'rgba(0, 0, 0, 0.2)', // Sombra
};

export const styles = StyleSheet.create({
  fullScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: COLORS.white, // Cabeçalho branco
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    paddingTop: Platform.OS === 'android' ? 40 : 50, // Ajuste para status bar
  },
  backButton: {
    padding: 5,
  },
  headerProfile: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  headerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerInfo: {
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  headerSubtitle: {
    fontSize: 12,
    color: COLORS.success,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerActionButton: {
    padding: 8,
    marginLeft: 4,
  },
  messagesContainer: {
    backgroundColor: COLORS.light,
  },
  inputToolbarContainer: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.grayLight,
    borderTopWidth: 1,
    paddingVertical: 5,
  },
  inputToolbarPrimary: {
    alignItems: 'center',
  },
  composerTextInput: {
    color: COLORS.dark,
    backgroundColor: COLORS.inputBg,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 10 : 8,
    paddingBottom: Platform.OS === 'ios' ? 10 : 8,
    marginLeft: 0,
    marginRight: 0,
    flex: 1,
  },
  sendContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
    marginRight: 5,
  },
  actionsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  recordingButton: {
    backgroundColor: 'rgba(211, 47, 47, 0.1)', // Fundo vermelho transparente
  },
  recordingIndicator: {
    position: 'absolute',
    bottom: -20,
    left: -30,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  recordingText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionsContainer: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 0,
    marginRight: 0,
    marginBottom: 0,
  },
  audioMessageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 15,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  audioMessageText: {
    marginLeft: 10,
    color: COLORS.dark,
    fontSize: 14,
  },
  backToChatsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    position: 'absolute',
    top: Platform.OS === 'android' ? 100 : 110,
    left: 15,
    zIndex: 10,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  backToChatsText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  propostaInfo: {
    backgroundColor: COLORS.white,
    margin: 12,
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  propostaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  propostaTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 6,
  },
  propostaDescricao: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 12,
    lineHeight: 20,
  },
  propostaDetalhes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  propostaDetalhe: {
    fontSize: 12,
    color: COLORS.gray,
  },
});

export default styles;

