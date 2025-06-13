import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
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
  gradient1: '#1A237E',
  gradient2: '#3F51B5',
};

interface Transacao {
  id: string;
  tipo: 'compra' | 'gasto';
  descricao: string;
  quantidade: number;
  data: string;
  valor?: string;
}

export default function CarteiraScreen({ navigation }: any) {
  const [saldoMoedas] = useState(15);
  const [transacoes] = useState<Transacao[]>([
    {
      id: '1',
      tipo: 'gasto',
      descricao: 'Abertura de solicitação - Encanador',
      quantidade: -3,
      data: 'Hoje, 15:45',
    },
    {
      id: '2',
      tipo: 'gasto',
      descricao: 'Abertura de solicitação - Eletricista',
      quantidade: -2,
      data: 'Ontem, 16:20',
    },
    {
      id: '3',
      tipo: 'compra',
      descricao: 'Pacote Básico - 20 moedas',
      quantidade: 20,
      data: '2 dias atrás',
      valor: 'R$ 10,00',
    },
    {
      id: '4',
      tipo: 'gasto',
      descricao: 'Abertura de solicitação - Pintor',
      quantidade: -2,
      data: '2 dias atrás',
    },
    {
      id: '5',
      tipo: 'gasto',
      descricao: 'Abertura de solicitação - Marceneiro',
      quantidade: -3,
      data: '3 dias atrás',
    },
  ]);

  const abrirLoja = () => {
    navigation.navigate('Loja');
  };

  const renderTransacao = (item: Transacao) => (
    <View key={item.id} style={styles.transacaoCard}>
      <View style={styles.transacaoIcon}>
        <Ionicons 
          name={item.tipo === 'compra' ? 'add-circle' : 'remove-circle'} 
          size={24} 
          color={item.tipo === 'compra' ? COLORS.success : COLORS.danger} 
        />
      </View>
      
      <View style={styles.transacaoInfo}>
        <Text style={styles.transacaoDescricao}>{item.descricao}</Text>
        <Text style={styles.transacaoData}>{item.data}</Text>
        {item.valor && (
          <Text style={styles.transacaoValor}>{item.valor}</Text>
        )}
      </View>
      
      <View style={styles.transacaoQuantidade}>
        <Text style={[
          styles.quantidadeText,
          { color: item.tipo === 'compra' ? COLORS.success : COLORS.danger }
        ]}>
          {item.quantidade > 0 ? '+' : ''}{item.quantidade}
        </Text>
        <Ionicons name="diamond" size={16} color={COLORS.gold} />
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Carteira</Text>
        <Text style={styles.headerSubtitle}>Gerencie suas moedas</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Card do Saldo */}
        <View style={styles.saldoCard}>
          <View style={styles.saldoHeader}>
            <Ionicons name="diamond" size={32} color={COLORS.gold} />
            <Text style={styles.saldoLabel}>Saldo Atual</Text>
          </View>
          
          <Text style={styles.saldoValor}>{saldoMoedas}</Text>
          <Text style={styles.saldoUnidade}>moedas</Text>
          
          <TouchableOpacity style={styles.comprarButton} onPress={abrirLoja}>
            <Ionicons name="add" size={20} color={COLORS.white} />
            <Text style={styles.comprarButtonText}>Comprar Moedas</Text>
          </TouchableOpacity>
        </View>

        {/* Informações sobre Moedas */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Como funcionam as moedas?</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="eye" size={20} color={COLORS.primary} />
            <View style={styles.infoTexto}>
              <Text style={styles.infoItemTitle}>Ver detalhes completos</Text>
              <Text style={styles.infoItemDesc}>
                Use moedas para abrir solicitações e ver informações completas como telefone e endereço
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="cash" size={20} color={COLORS.success} />
            <View style={styles.infoTexto}>
              <Text style={styles.infoItemTitle}>Custo por abertura</Text>
              <Text style={styles.infoItemDesc}>
                Cada solicitação custa entre 2-3 moedas dependendo da categoria
              </Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="chatbubble" size={20} color={COLORS.info} />
            <View style={styles.infoTexto}>
              <Text style={styles.infoItemTitle}>Chat liberado</Text>
              <Text style={styles.infoItemDesc}>
                Após abrir uma solicitação, você pode conversar diretamente com o cliente
              </Text>
            </View>
          </View>
        </View>

        {/* Histórico de Transações */}
        <View style={styles.historicoCard}>
          <View style={styles.historicoHeader}>
            <Text style={styles.historicoTitle}>Histórico de Transações</Text>
            <Ionicons name="time" size={20} color={COLORS.gray} />
          </View>
          
          <View style={styles.transacoesList}>
            {transacoes.map(renderTransacao)}
          </View>
        </View>

        {/* Estatísticas */}
        <View style={styles.estatisticasCard}>
          <Text style={styles.estatisticasTitle}>Estatísticas do Mês</Text>
          
          <View style={styles.estatisticasGrid}>
            <View style={styles.estatItem}>
              <Text style={styles.estatValor}>8</Text>
              <Text style={styles.estatLabel}>Solicitações Abertas</Text>
            </View>
            
            <View style={styles.estatItem}>
              <Text style={styles.estatValor}>20</Text>
              <Text style={styles.estatLabel}>Moedas Gastas</Text>
            </View>
            
            <View style={styles.estatItem}>
              <Text style={styles.estatValor}>5</Text>
              <Text style={styles.estatLabel}>Trabalhos Aceitos</Text>
            </View>
            
            <View style={styles.estatItem}>
              <Text style={styles.estatValor}>R$ 850</Text>
              <Text style={styles.estatLabel}>Faturamento</Text>
            </View>
          </View>
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
  scrollView: {
    flex: 1,
  },
  saldoCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  saldoHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  saldoLabel: {
    fontSize: 16,
    color: COLORS.gray,
    marginTop: 8,
  },
  saldoValor: {
    fontSize: 48,
    fontWeight: 'bold',
    color: COLORS.primary,
  },
  saldoUnidade: {
    fontSize: 16,
    color: COLORS.gray,
    marginBottom: 24,
  },
  comprarButton: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  comprarButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: 8,
  },
  infoCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  infoTexto: {
    flex: 1,
    marginLeft: 12,
  },
  infoItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  infoItemDesc: {
    fontSize: 12,
    color: COLORS.gray,
    lineHeight: 18,
  },
  historicoCard: {
    backgroundColor: COLORS.white,
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 12,
    elevation: 2,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  historicoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historicoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
  },
  transacoesList: {
    gap: 12,
  },
  transacaoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  transacaoIcon: {
    marginRight: 12,
  },
  transacaoInfo: {
    flex: 1,
  },
  transacaoDescricao: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.dark,
    marginBottom: 2,
  },
  transacaoData: {
    fontSize: 12,
    color: COLORS.gray,
  },
  transacaoValor: {
    fontSize: 12,
    color: COLORS.success,
    fontWeight: '500',
  },
  transacaoQuantidade: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantidadeText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 4,
  },
  estatisticasCard: {
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
  estatisticasTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.dark,
    marginBottom: 16,
  },
  estatisticasGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  estatItem: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    backgroundColor: COLORS.light,
    borderRadius: 8,
    marginBottom: 12,
  },
  estatValor: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 4,
  },
  estatLabel: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: 'center',
  },
});

