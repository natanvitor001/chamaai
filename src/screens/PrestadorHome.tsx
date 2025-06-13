import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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
};

interface Solicitacao {
  id: string;
  categoria: string;
  descricaoBreve: string;
  bairro: string;
  distancia: string;
  custoMoedas: number;
  urgencia: 'baixa' | 'media' | 'alta';
  dataPublicacao: string;
}

export default function PrestadorHome({ navigation }: any) {
  const [saldoMoedas, setSaldoMoedas] = useState(15);
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [solicitacaoSelecionada, setSolicitacaoSelecionada] = useState<Solicitacao | null>(null);

  // Dados mockados de solicitações
  const solicitacoesMock: Solicitacao[] = [
    {
      id: '1',
      categoria: 'Encanador',
      descricaoBreve: 'Vazamento na cozinha, urgente',
      bairro: 'Centro',
      distancia: '2.3 km',
      custoMoedas: 3,
      urgencia: 'alta',
      dataPublicacao: '2 min atrás',
    },
    {
      id: '2',
      categoria: 'Eletricista',
      descricaoBreve: 'Instalação de ventilador de teto',
      bairro: 'Jardim América',
      distancia: '4.1 km',
      custoMoedas: 2,
      urgencia: 'media',
      dataPublicacao: '15 min atrás',
    },
    {
      id: '3',
      categoria: 'Pintor',
      descricaoBreve: 'Pintura de sala e quarto',
      bairro: 'Vila Nova',
      distancia: '1.8 km',
      custoMoedas: 2,
      urgencia: 'baixa',
      dataPublicacao: '1h atrás',
    },
    {
      id: '4',
      categoria: 'Marceneiro',
      descricaoBreve: 'Reparo em porta de armário',
      bairro: 'Centro',
      distancia: '3.2 km',
      custoMoedas: 3,
      urgencia: 'media',
      dataPublicacao: '2h atrás',
    },
    {
      id: '5',
      categoria: 'Jardineiro',
      descricaoBreve: 'Poda de árvores no quintal',
      bairro: 'Bela Vista',
      distancia: '5.7 km',
      custoMoedas: 2,
      urgencia: 'baixa',
      dataPublicacao: '3h atrás',
    },
  ];

  useEffect(() => {
    carregarSolicitacoes();
  }, []);

  const carregarSolicitacoes = () => {
    setRefreshing(true);
    // Simular carregamento
    setTimeout(() => {
      setSolicitacoes(solicitacoesMock);
      setRefreshing(false);
    }, 1000);
  };

  const abrirModalConfirmacao = (solicitacao: Solicitacao) => {
    setSolicitacaoSelecionada(solicitacao);
    setModalVisible(true);
  };

  const confirmarAbertura = () => {
    if (!solicitacaoSelecionada) return;

    if (saldoMoedas < solicitacaoSelecionada.custoMoedas) {
      setModalVisible(false);
      Alert.alert(
        'Saldo Insuficiente',
        'Você não tem moedas suficientes para abrir esta solicitação.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { 
            text: 'Comprar Moedas', 
            onPress: () => navigation.navigate('CarteiraTab')
          }
        ]
      );
      return;
    }

    setSaldoMoedas(prev => prev - solicitacaoSelecionada.custoMoedas);
    setModalVisible(false);
    
    Alert.alert(
      'Sucesso!',
      'Solicitação aberta com sucesso! Agora você pode ver os detalhes completos e entrar em contato com o cliente.',
      [
        { text: 'Ver Detalhes', onPress: () => navigation.navigate('ChatTab') },
        { text: 'OK' }
      ]
    );
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return COLORS.danger;
      case 'media': return COLORS.warning;
      case 'baixa': return COLORS.success;
      default: return COLORS.gray;
    }
  };

  const getUrgenciaText = (urgencia: string) => {
    switch (urgencia) {
      case 'alta': return 'Urgente';
      case 'media': return 'Moderada';
      case 'baixa': return 'Baixa';
      default: return '';
    }
  };

  const renderSolicitacao = (item: Solicitacao) => (
    <TouchableOpacity
      key={item.id}
      style={styles.solicitacaoCard}
      onPress={() => abrirModalConfirmacao(item)}
    >
      <View style={styles.solicitacaoHeader}>
        <View style={styles.categoriaContainer}>
          <Ionicons name="construct" size={16} color={COLORS.primary} />
          <Text style={styles.categoria}>{item.categoria}</Text>
        </View>
        <View style={[styles.urgenciaTag, { backgroundColor: getUrgenciaColor(item.urgencia) }]}>
          <Text style={styles.urgenciaText}>{getUrgenciaText(item.urgencia)}</Text>
        </View>
      </View>

      <Text style={styles.descricao}>{item.descricaoBreve}</Text>

      <View style={styles.solicitacaoInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="location" size={14} color={COLORS.gray} />
          <Text style={styles.infoText}>{item.bairro}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="car" size={14} color={COLORS.gray} />
          <Text style={styles.infoText}>{item.distancia}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="time" size={14} color={COLORS.gray} />
          <Text style={styles.infoText}>{item.dataPublicacao}</Text>
        </View>
      </View>

      <View style={styles.solicitacaoFooter}>
        <View style={styles.custoContainer}>
          <Ionicons name="diamond" size={16} color={COLORS.gold} />
          <Text style={styles.custoText}>{item.custoMoedas} moedas</Text>
        </View>
        <TouchableOpacity style={styles.abrirButton}>
          <Text style={styles.abrirButtonText}>Abrir Detalhes</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.white} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Solicitações Disponíveis</Text>
          <Text style={styles.headerSubtitle}>Encontre trabalhos próximos a você</Text>
        </View>
        <TouchableOpacity 
          style={styles.saldoContainer}
          onPress={() => navigation.navigate('CarteiraTab')}
        >
          <Ionicons name="diamond" size={20} color={COLORS.gold} />
          <Text style={styles.saldoText}>{saldoMoedas}</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Solicitações */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={carregarSolicitacoes}
            colors={[COLORS.primary]}
          />
        }
      >
        <View style={styles.solicitacoesList}>
          {solicitacoes.map(renderSolicitacao)}
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
              <Ionicons name="diamond" size={24} color={COLORS.gold} />
              <Text style={styles.modalTitle}>Confirmar Abertura</Text>
            </View>

            {solicitacaoSelecionada && (
              <>
                <Text style={styles.modalText}>
                  Deseja abrir os detalhes completos desta solicitação?
                </Text>
                
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoTitle}>{solicitacaoSelecionada.categoria}</Text>
                  <Text style={styles.modalInfoDesc}>{solicitacaoSelecionada.descricaoBreve}</Text>
                  <Text style={styles.modalInfoLocal}>{solicitacaoSelecionada.bairro} • {solicitacaoSelecionada.distancia}</Text>
                </View>

                <View style={styles.modalCusto}>
                  <Text style={styles.modalCustoText}>
                    Custo: {solicitacaoSelecionada.custoMoedas} moedas
                  </Text>
                  <Text style={styles.modalSaldoText}>
                    Seu saldo: {saldoMoedas} moedas
                  </Text>
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
                onPress={confirmarAbertura}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
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
  saldoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saldoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 5,
  },
  scrollView: {
    flex: 1,
  },
  solicitacoesList: {
    padding: 16,
  },
  solicitacaoCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  solicitacaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoriaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoria: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginLeft: 6,
  },
  urgenciaTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  urgenciaText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  descricao: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 12,
    lineHeight: 20,
  },
  solicitacaoInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  infoText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  solicitacaoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  custoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  custoText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 4,
  },
  abrirButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  abrirButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
    marginRight: 4,
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
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginLeft: 8,
  },
  modalText: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInfo: {
    backgroundColor: COLORS.light,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalInfoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  modalInfoDesc: {
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 8,
  },
  modalInfoLocal: {
    fontSize: 12,
    color: COLORS.gray,
  },
  modalCusto: {
    alignItems: 'center',
    marginBottom: 24,
  },
  modalCustoText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 4,
  },
  modalSaldoText: {
    fontSize: 14,
    color: COLORS.gray,
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

