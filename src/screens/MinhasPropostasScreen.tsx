import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
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

interface Proposta {
  id: string;
  categoria: string;
  descricao: string;
  cliente: string;
  bairro: string;
  status: 'aguardando' | 'aceita' | 'rejeitada' | 'concluida';
  valor: string;
  dataAbertura: string;
  dataResposta?: string;
  telefone: string;
  endereco: string;
  observacoes?: string;
}

export default function MinhasPropostasScreen({ navigation }: any) {
  const [propostas, setPropostas] = useState<Proposta[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>('todos');

  // Dados mockados de propostas
  const propostasMock: Proposta[] = [
    {
      id: '1',
      categoria: 'Encanador',
      descricao: 'Vazamento na cozinha, urgente. Precisa trocar o registro e verificar a tubulação.',
      cliente: 'Maria Silva',
      bairro: 'Centro',
      status: 'aceita',
      valor: 'R$ 150,00',
      dataAbertura: 'Hoje, 14:30',
      dataResposta: 'Hoje, 15:45',
      telefone: '(11) 99999-1234',
      endereco: 'Rua das Flores, 123 - Centro',
      observacoes: 'Portão azul, casa com jardim na frente',
    },
    {
      id: '2',
      categoria: 'Eletricista',
      descricao: 'Instalação de ventilador de teto no quarto principal.',
      cliente: 'João Santos',
      bairro: 'Jardim América',
      status: 'aguardando',
      valor: 'R$ 80,00',
      dataAbertura: 'Ontem, 16:20',
      telefone: '(11) 98888-5678',
      endereco: 'Av. Brasil, 456 - Jardim América',
    },
    {
      id: '3',
      categoria: 'Pintor',
      descricao: 'Pintura completa de sala e dois quartos. Tinta já comprada.',
      cliente: 'Ana Costa',
      bairro: 'Vila Nova',
      status: 'concluida',
      valor: 'R$ 400,00',
      dataAbertura: '2 dias atrás',
      dataResposta: '2 dias atrás',
      telefone: '(11) 97777-9012',
      endereco: 'Rua São Paulo, 789 - Vila Nova',
    },
    {
      id: '4',
      categoria: 'Marceneiro',
      descricao: 'Reparo em porta de armário da cozinha que está saindo do trilho.',
      cliente: 'Carlos Oliveira',
      bairro: 'Centro',
      status: 'rejeitada',
      valor: 'R$ 60,00',
      dataAbertura: '3 dias atrás',
      dataResposta: '3 dias atrás',
      telefone: '(11) 96666-3456',
      endereco: 'Rua Central, 321 - Centro',
    },
  ];

  useEffect(() => {
    carregarPropostas();
  }, []);

  const carregarPropostas = () => {
    setRefreshing(true);
    setTimeout(() => {
      setPropostas(propostasMock);
      setRefreshing(false);
    }, 1000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'aguardando': return COLORS.warning;
      case 'aceita': return COLORS.success;
      case 'rejeitada': return COLORS.danger;
      case 'concluida': return COLORS.info;
      default: return COLORS.gray;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'aguardando': return 'Aguardando';
      case 'aceita': return 'Aceita';
      case 'rejeitada': return 'Rejeitada';
      case 'concluida': return 'Concluída';
      default: return '';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'aguardando': return 'time';
      case 'aceita': return 'checkmark-circle';
      case 'rejeitada': return 'close-circle';
      case 'concluida': return 'trophy';
      default: return 'help-circle';
    }
  };

  const filtrarPropostas = () => {
    if (filtroStatus === 'todos') {
      return propostas;
    }
    return propostas.filter(proposta => proposta.status === filtroStatus);
  };

  const abrirChat = (proposta: Proposta) => {
    navigation.navigate('ChatTab', { proposta });
  };

  const renderFiltro = (status: string, label: string) => (
    <TouchableOpacity
      key={status}
      style={[
        styles.filtroButton,
        filtroStatus === status && styles.filtroButtonActive
      ]}
      onPress={() => setFiltroStatus(status)}
    >
      <Text style={[
        styles.filtroText,
        filtroStatus === status && styles.filtroTextActive
      ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderProposta = (item: Proposta) => (
    <TouchableOpacity
      key={item.id}
      style={styles.propostaCard}
      onPress={() => abrirChat(item)}
    >
      <View style={styles.propostaHeader}>
        <View style={styles.categoriaContainer}>
          <Ionicons name="construct" size={16} color={COLORS.primary} />
          <Text style={styles.categoria}>{item.categoria}</Text>
        </View>
        <View style={[styles.statusTag, { backgroundColor: getStatusColor(item.status) }]}>
          <Ionicons 
            name={getStatusIcon(item.status)} 
            size={12} 
            color={COLORS.white} 
          />
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      <Text style={styles.cliente}>Cliente: {item.cliente}</Text>
      <Text style={styles.descricao}>{item.descricao}</Text>

      <View style={styles.propostaInfo}>
        <View style={styles.infoItem}>
          <Ionicons name="location" size={14} color={COLORS.gray} />
          <Text style={styles.infoText}>{item.bairro}</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="cash" size={14} color={COLORS.success} />
          <Text style={styles.valorText}>{item.valor}</Text>
        </View>
      </View>

      {item.status === 'aceita' && (
        <View style={styles.contatoInfo}>
          <View style={styles.contatoItem}>
            <Ionicons name="call" size={14} color={COLORS.primary} />
            <Text style={styles.contatoText}>{item.telefone}</Text>
          </View>
          <View style={styles.contatoItem}>
            <Ionicons name="location" size={14} color={COLORS.primary} />
            <Text style={styles.contatoText}>{item.endereco}</Text>
          </View>
          {item.observacoes && (
            <View style={styles.contatoItem}>
              <Ionicons name="information-circle" size={14} color={COLORS.primary} />
              <Text style={styles.contatoText}>{item.observacoes}</Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.propostaFooter}>
        <Text style={styles.dataText}>Aberta: {item.dataAbertura}</Text>
        {item.dataResposta && (
          <Text style={styles.dataText}>Respondida: {item.dataResposta}</Text>
        )}
        {item.status === 'aceita' && (
          <TouchableOpacity style={styles.chatButton}>
            <Ionicons name="chatbubble" size={16} color={COLORS.white} />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );

  const propostasFiltradas = filtrarPropostas();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Minhas Propostas</Text>
        <Text style={styles.headerSubtitle}>Acompanhe seus trabalhos</Text>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {renderFiltro('todos', 'Todos')}
          {renderFiltro('aguardando', 'Aguardando')}
          {renderFiltro('aceita', 'Aceitas')}
          {renderFiltro('concluida', 'Concluídas')}
          {renderFiltro('rejeitada', 'Rejeitadas')}
        </ScrollView>
      </View>

      {/* Lista de Propostas */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={carregarPropostas}
            colors={[COLORS.primary]}
          />
        }
      >
        <View style={styles.propostasList}>
          {propostasFiltradas.length > 0 ? (
            propostasFiltradas.map(renderProposta)
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="briefcase-outline" size={64} color={COLORS.gray} />
              <Text style={styles.emptyTitle}>Nenhuma proposta encontrada</Text>
              <Text style={styles.emptyText}>
                {filtroStatus === 'todos' 
                  ? 'Você ainda não abriu nenhuma solicitação.'
                  : `Não há propostas com status "${getStatusText(filtroStatus)}".`
                }
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
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
  filtrosContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  filtroButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.light,
    marginRight: 8,
  },
  filtroButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filtroText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.gray,
  },
  filtroTextActive: {
    color: COLORS.white,
  },
  scrollView: {
    flex: 1,
  },
  propostasList: {
    padding: 16,
  },
  propostaCard: {
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
  propostaHeader: {
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
  statusTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 4,
  },
  cliente: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  descricao: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 12,
    lineHeight: 20,
  },
  propostaInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: COLORS.gray,
    marginLeft: 4,
  },
  valorText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: COLORS.success,
    marginLeft: 4,
  },
  contatoInfo: {
    backgroundColor: COLORS.light,
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  contatoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  contatoText: {
    fontSize: 12,
    color: COLORS.dark,
    marginLeft: 6,
    flex: 1,
  },
  propostaFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataText: {
    fontSize: 10,
    color: COLORS.gray,
  },
  chatButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  chatButtonText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.gray,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.gray,
    textAlign: 'center',
    paddingHorizontal: 40,
    lineHeight: 20,
  },
});

