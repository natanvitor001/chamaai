// EditProfileScreen.styles.js
// Arquivo de estilos isolado para a tela de edição de perfil

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
  inputBorder: '#E0E0E0', // Borda de input (Cinza claro)
  shadow: 'rgba(0, 0, 0, 0.2)', // Sombra
};

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.light,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: COLORS.gray,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 15,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    paddingTop: Platform.OS === 'android' ? 40 : 50, // Ajuste para status bar
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  backButton: {
    padding: 5,
  },
  notificationButton: {
    padding: 5,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  profileImageWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: COLORS.primary,
    overflow: 'hidden',
    backgroundColor: COLORS.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  editImageButton: {
    position: 'absolute',
    bottom: 0,
    right: '35%',
    backgroundColor: COLORS.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.white,
    zIndex: 10, // Garantir que o botão fique acima de outros elementos
  },
  profileVerifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginTop: 10,
    position: 'absolute',
    top: 120, // Posicionado abaixo da imagem de perfil e do botão de edição
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },
  verifiedBadgeText: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 12,
    marginLeft: 5,
  },
  form: {
    paddingHorizontal: 20,
  },
  formSection: {
    marginBottom: 25,
    backgroundColor: COLORS.white,
    borderRadius: 10,
    padding: 15,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 5,
    fontWeight: '500',
  },
  requiredMark: {
    color: COLORS.danger,
    fontWeight: 'bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: COLORS.dark,
    fontSize: 16,
  },
  errorText: {
    color: COLORS.danger,
    fontSize: 12,
    marginTop: 5,
  },
  rowInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cepContainer: {
    justifyContent: 'space-between',
  },
  cepInput: {
    flex: 1,
  },
  cepButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cepButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 15,
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  saveButtonDisabled: {
    backgroundColor: COLORS.grayLight,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  saveButtonIcon: {
    marginRight: 10,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  footerText: {
    color: COLORS.gray,
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingBottom: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  countryList: {
    maxHeight: 400,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 15,
  },
  countryName: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
  },
  countryCode: {
    fontSize: 16,
    color: COLORS.gray,
    fontWeight: 'bold',
  },
});

export default styles;

