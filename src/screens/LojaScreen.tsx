import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Cores do tema
const COLORS = {
  primary: '#1A237E',
  primaryDark: '#000051',
  secondary: '#424242',
  accent: '#448AFF',
  success: '#4CAF50',
  danger: '#D32F2F',
  warning: '#FBC02D',
  info: '#2196F3',
  light: '#F5F5F5',
  dark: '#212121',
  gray: '#757575',
  grayLight: '#E0E0E0',
  white: '#FFFFFF',
  black: '#000000',
  inputBg: '#E8EAF6',
  inputBorder: '#9FA8DA',
  shadow: 'rgba(0, 0, 0, 0.2)',
  gold: '#FFD700',
  premium: '#9C27B0',
};

interface PacoteMoedas {
  id: string;
  nome: string;
  quantidade: number;
  preco: number;
  precoOriginal?: number;
  desconto?: number;
  popular?: boolean;
  bonus?: number;
  descricao: string;
}

export default function LojaScreen({ navigation }: any) {
  const [modalVisible, setModalVisible] = useState(false);
  const [pacoteSelecionado, setPacoteSelecionado] = useState<PacoteMoedas | null>(null);

  const pacotes: PacoteMoedas[] = [
    {
      id: '1',
      nome: 'Pacote Básico',
      quantidade: 10,
      preco: 5.00,
      descricao: 'Ideal para começar',
    },
    {
      id: '2',
      nome: 'Pacote Padrão',
      quantidade: 25,
      preco: 10.00,
      precoOriginal: 12.50,
      desconto: 20,
      popular: true,
      descricao: 'Mais vendido',
    },
    {
      id: '3',
      nome: 'Pacote Premium',
      quantidade: 50,
      preco: 18.00,
      precoOriginal: 25.00,
      desconto: 28,
      bonus: 5,
      descricao: 'Melhor custo-benefício',
    },
    {
      id: '4',
      nome: 'Pacote Profissional',
      quantidade: 100,
      preco: 30.00,
      precoOriginal: 50.00,
      desconto: 40,
      bonus: 15,
      descricao: 'Para profissionais ativos',
    },
    {
      id: '5',
      nome: 'Pacote Empresarial',
      quantidade: 250,
      preco: 65.00,
      precoOriginal: 125.00,
      desconto: 48,
      bonus: 50,
      descricao: 'Máximo desconto',
    },
  ];

  const abrirModalCompra = (pacote: PacoteMoedas) => {
    setPacoteSelecionado(pacote);
    setModalVisible(true);
  };

  const confirmarCompra = () => {
    if (!pacoteSelecionado) return;

    setModalVisible(false);
    
    // Simular processamento de pagamento
    Alert.alert(
      'Compra Realizada!',
      `Você adquiriu ${pacoteSelecionado.quantidade}${pacoteSelecionado.bonus ? ` + ${pacoteSelecionado.bonus} bônus` : ''} moedas por R$ ${pacoteSelecionado.preco.toFixed(2).replace('.', ',')}`,
      [
        { 
          text: 'OK', 
          onPress: () => navigation.goBack()
        }
      ]
    );
  };

  const renderPacote = (pacote: PacoteMoedas) => {
    const quantidadeTotal = pacote.quantidade + (pacote.bonus || 0);
    
    return (
      <TouchableOpacity
        key={pacote.id}
        style={[
          styles.pacoteCard,
          pacote.popular && styles.pacotePopular
        ]}
        onPress={() => abrirModalCompra(pacote)}
      >
        {pacote.popular && (
          <View style={styles.popularBadge}>
            <Text style={styles.popularText}>MAIS VENDIDO</Text>
          </View>
        )}

        {pacote.desconto && (
          <View style={styles.descontoBadge}>
            <Text style={styles.descontoText}>-{pacote.desconto}%</Text>
          </View>
        )}

        <View style={styles.pacoteHeader}>
          <Ionicons name="diamond" size={32} color={COLORS.gold} />
          <Text style={styles.pacoteNome}>{pacote.nome}</Text>
        </View>

        <View style={styles.pacoteQuantidade}>
          <Text style={styles.quantidadeNumero}>{pacote.quantidade}</Text>
          {pacote.bonus && (
            <Text style={styles.bonusText}>+ {pacote.bonus} bônus</Text>
          )}
          <Text style={styles.quantidadeLabel}>moedas</Text>
        </View>

        <Text style={styles.pacoteDescricao}>{pacote.descricao}</Text>

        <View style={styles.pacotePreco}>
          {pacote.precoOriginal && (
            <Text style={styles.precoOriginal}>
              R$ {pacote.precoOriginal.toFixed(2).replace('.', ',')}
            </Text>
          )}
          <Text style={styles.precoAtual}>
            R$ {pacote.preco.toFixed(2).replace('.', ',')}
          </Text>
        </View>

        <View style={styles.custoPorMoeda}>
          <Text style={styles.custoPorMoedaText}>
            R$ {(pacote.preco / quantidadeTotal).toFixed(2).replace('.', ',')} por moeda
          </Text>
        </View>

        <TouchableOpacity style={styles.comprarButton}>
          <Text style={styles.comprarButtonText}>Comprar Agora</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Loja de Moedas</Text>
          <Text style={styles.headerSubtitle}>Escolha o melhor pacote para você</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Informações sobre Pagamento */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Ionicons name="shield-checkmark" size={24} color={COLORS.success} />
            <Text style={styles.infoTitle}>Pagamento Seguro</Text>
          </View>
          
          <View style={styles.infoItems}>
            <View style={styles.infoItem}>
              <Ionicons name="card" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>Cartão de crédito e débito</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="phone-portrait" size={16} color={COLORS.primary} />
              <Text style={styles.infoText}>PIX instantâneo</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="checkmark-circle" size={16} color={COLORS.success} />
              <Text style={styles.infoText}>Moedas creditadas imediatamente</Text>
            </View>
          </View>
        </View>

        {/* Lista de Pacotes */}
        <View style={styles.pacotesList}>
          {pacotes.map(renderPacote)}
        </View>

        {/* FAQ */}
        <View style={styles.faqCard}>
          <Text style={styles.faqTitle}>Perguntas Frequentes</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Para que servem as moedas?</Text>
            <Text style={styles.faqAnswer}>
              As moedas são usadas para abrir solicitações de serviços e ver informações completas dos clientes, como telefone e endereço.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>As moedas expiram?</Text>
            <Text style={styles.faqAnswer}>
              Não! Suas moedas não têm prazo de validade e ficam disponíveis em sua conta indefinidamente.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>Posso reembolsar moedas não utilizadas?</Text>
            <Text style={styles.faqAnswer}>
              As moedas não são reembolsáveis, mas você pode usá-las a qualquer momento para acessar novas oportunidades de trabalho.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Confirmação */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="diamond" size={32} color={COLORS.gold} />
              <Text style={styles.modalTitle}>Confirmar Compra</Text>
            </View>

            {pacoteSelecionado && (
              <>
                <View style={styles.modalPacoteInfo}>
                  <Text style={styles.modalPacoteNome}>{pacoteSelecionado.nome}</Text>
                  <Text style={styles.modalPacoteQuantidade}>
                    {pacoteSelecionado.quantidade}
                    {pacoteSelecionado.bonus && ` + ${pacoteSelecionado.bonus} bônus`} moedas
                  </Text>
                </View>

                <View style={styles.modalPreco}>
                  <Text style={styles.modalPrecoLabel}>Total a pagar:</Text>
                  <Text style={styles.modalPrecoValor}>
                    R$ {pacoteSelecionado.preco.toFixed(2).replace('.', ',')}
                  </Text>
                </View>

                <View style={styles.modalMetodosPagamento}>
                  <Text style={styles.modalMetodosTitle}>Métodos de pagamento:</Text>
                  <View style={styles.metodosLista}>
                    <View style={styles.metodoItem}>
                      <Ionicons name="card" size={20} color={COLORS.primary} />
                      <Text style={styles.metodoText}>Cartão de Crédito/Débito</Text>
                    </View>
                    <View style={styles.metodoItem}>
                      <Ionicons name="phone-portrait" size={20} color={COLORS.primary} />
                      <Text style={styles.metodoText}>PIX</Text>
                    </View>
                  </View>
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={confirmarCompra}
              >
                <Text style={styles.confirmButtonText}>Pagar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: 14,
    color: COLORS.white,
    opacity: 0.8,
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 8,
  },
  infoItems: {
    gap: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  pacotesList: {
    padding: 16,
    paddingTop: 0,
  },
  pacoteCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
  },
  pacotePopular: {
    borderWidth: 2,
    borderColor: COLORS.premium,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    backgroundColor: COLORS.premium,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  descontoBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: COLORS.danger,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  descontoText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  pacoteHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  pacoteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 8,
  },
  pacoteQuantidade: {
    alignItems: 'center',
    marginBottom: 12,
  },
  quantidadeNumero: {
    fontSize: 36,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  bonusText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
    marginTop: -4,
  },
  quantidadeLabel: {
    fontSize: 16,
    color: COLORS.gray,
  },
  pacoteDescricao: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    marginBottom: 16,
  },
  pacotePreco: {
    alignItems: 'center',
    marginBottom: 8,
  },
  precoOriginal: {
    fontSize: 14,
    color: COLORS.gray,
    textDecorationLine: 'line-through',
  },
  precoAtual: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  custoPorMoeda: {
    alignItems: 'center',
    marginBottom: 20,
  },
  custoPorMoedaText: {
    fontSize: 12,
    color: COLORS.gray,
  },
  comprarButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
  },
  comprarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: 8,
  },
  faqCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
    marginBottom: 32,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 18,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginTop: 8,
  },
  modalPacoteInfo: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalPacoteNome: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  modalPacoteQuantidade: {
    fontSize: 16,
    color: COLORS.gray,
  },
  modalPreco: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalPrecoLabel: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 4,
  },
  modalPrecoValor: {
    fontSize: 28,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  modalMetodosPagamento: {
    marginBottom: 24,
  },
  modalMetodosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 12,
  },
  metodosLista: {
    gap: 8,
  },
  metodoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metodoText: {
    fontSize: 14,
    color: COLORS.gray,
    marginLeft: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: COLORS.grayLight,
    marginRight: 8,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    marginLeft: 8,
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.gray,
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

