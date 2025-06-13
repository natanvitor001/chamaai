import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Modal,
  ActivityIndicator,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
  RefreshControl,
  Alert,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";
import { getUser, UserData } from "../storage/UserStorage";
import { useFocusEffect } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const COLORS = {
  primary: "#1A237E",
  primaryDark: "#000051",
  secondary: "#424242",
  accent: "#448AFF",
  success: "#4CAF50",
  danger: "#D32F2F",
  warning: "#FBC02D",
  info: "#2196F3",
  light: "#F5F5F5",
  dark: "#212121",
  gray: "#757575",
  grayLight: "#E0E0E0",
  white: "#FFFFFF",
  black: "#000000",
  inputBg: "#E8EAF6",
  inputBorder: "#9FA8DA",
  shadow: "rgba(0, 0, 0, 0.2)",
};

type Props = NativeStackScreenProps<RootStackParamList, "ClienteHome">;

type Service = {
  id: string;
  name: string;
  icon: string;
  description: string;
};

const services: Service[] = [
  {
    id: "1",
    name: "Pedreiro",
    icon: "construct",
    description: "Construção e reparos estruturais",
  },
  {
    id: "2",
    name: "Eletricista",
    icon: "flash",
    description: "Instalações e reparos elétricos",
  },
  {
    id: "3",
    name: "Encanador",
    icon: "water",
    description: "Reparos hidráulicos e instalações",
  },
  {
    id: "4",
    name: "Diarista",
    icon: "home",
    description: "Limpeza e organização residencial",
  },
  {
    id: "5",
    name: "Pintor",
    icon: "color-palette",
    description: "Pintura residencial e comercial",
  },
  {
    id: "6",
    name: "Jardineiro",
    icon: "leaf",
    description: "Manutenção de jardins e áreas verdes",
  },
];

export default function ClienteHome({ navigation }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName] = useState("Cliente");
  const [profileImage, setProfileImage] = useState("https://i.pravatar.cc/100");
  const [showCompletionNotification, setShowCompletionNotification] = useState(true);

  const loadUserData = async () => {
    setLoading(true);
    try {
      const userData = await getUser();
      if (userData) {
        setUserName(userData.nome || "Cliente");
        setProfileImage(userData.profileImage || "https://i.pravatar.cc/100");
        const isProfileComplete = userData.nome && userData.telefone && userData.endereco && userData.endereco.cep;
        setShowCompletionNotification(!isProfileComplete);
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
      Alert.alert("Erro", "Não foi possível carregar seus dados.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadUserData().then(() => setRefreshing(false));
  }, []);

  const handleServiceSelect = (service: Service) => {
    navigation.navigate("NewServiceRequest");
  };

  const handleLogout = () => {
    Alert.alert(
      "Sair da conta",
      "Tem certeza que deseja sair?",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Sim, sair",
          onPress: () => navigation.replace("Login"),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.light }}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: COLORS.danger,
            padding: 10,
            borderRadius: 8,
            margin: 10,
            alignSelf: 'flex-end',
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 8, fontWeight: 'bold' }}>Sair</Text>
        </TouchableOpacity>

        {/* Seu conteúdo continua aqui normalmente */}
      </ScrollView>
    </SafeAreaView>
  );
}

  const renderServiceItem = ({ item }: { item: Service }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleServiceSelect(item)}
      activeOpacity={0.7}
      accessible={true}
      accessibilityLabel={`Serviço de ${item.name}`}
      accessibilityHint={`Toque para solicitar serviço de ${item.name}`}
    >
      <View style={styles.cardIconContainer}>
        <Ionicons name={item.icon as any} size={32} color={COLORS.primary} />
      </View>
      <Text style={styles.cardText}>{item.name}</Text>
      <Text style={styles.cardDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("EditProfile")}>
              {loading ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.welcomeText}>Olá, {userName}!</Text>
              )}
              <Text style={styles.subtitleText}>Bem-vindo(a) de volta</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={() => Alert.alert("Notificações", "Você não tem novas notificações.")}
              accessible={true}
              accessibilityLabel="Ver notificações"
              style={styles.notificationIcon}
            >
              <Ionicons name="notifications-outline" size={24} color={COLORS.dark} />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              accessible={true}
              accessibilityLabel="Menu de opções"
            >
              <Ionicons name="menu" size={28} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
        </View>

        {showCompletionNotification && (
          <TouchableOpacity
            style={styles.notificationBanner}
            onPress={() => {
              setShowCompletionNotification(false);
              navigation.navigate("EditProfile");
            }}
          >
            <Ionicons name="information-circle-outline" size={20} color={COLORS.white} />
            <Text style={styles.notificationText}>Complete seu cadastro para aproveitar todos os recursos!</Text>
            <Ionicons name="chevron-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Título principal */}
          <Text style={styles.title}>Qual serviço você precisa hoje?</Text>

          {/* Botão Central: Solicitar Serviço */}
          <TouchableOpacity
            style={styles.requestButton}
            onPress={() => navigation.navigate("NewServiceRequest")}
            activeOpacity={0.8}
            accessible={true}
            accessibilityLabel="Solicitar serviço"
          >
            <Text style={styles.requestButtonText}>Solicitar Serviço</Text>
            <Ionicons name="arrow-forward" size={20} color={COLORS.white} />
          </TouchableOpacity>

          {/* Serviços populares */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Serviços Populares</Text>
            <FlatList
              data={services}
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.serviceColumns}
              renderItem={renderServiceItem}
              scrollEnabled={false}
            />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.light,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.light,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
    backgroundColor: COLORS.white, // Cabeçalho branco
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    borderColor: COLORS.primary, // Cor da borda da imagem de perfil
    borderWidth: 2,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.dark, // Cor do texto de boas-vindas
  },
  subtitleText: {
    fontSize: 14,
    color: COLORS.gray, // Cor do subtítulo
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  chatButton: {
    marginRight: 10,
    display: 'none', // Esconder o botão de chat
  },
  notificationIcon: {
    marginRight: 10,
  },
  chatIconContainer: {
    position: "relative",
    display: 'none', // Esconder o container do ícone de chat
  },
  badgeContainer: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: COLORS.danger,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
    display: 'none', // Esconder o badge
  },
  badgeText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.dark,
    marginTop: 20,
    marginBottom: 16,
  },
  requestButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  requestButtonText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 8,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.dark,
  },
  seeAllText: {
    fontSize: 14,
    color: COLORS.primary,
    fontWeight: "600",
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    width: "48%",
    marginVertical: 8,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceColumns: {
    justifyContent: "space-between",
  },
  cardIconContainer: {
    backgroundColor: COLORS.light,
    borderRadius: 30,
    padding: 10,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.dark,
    textAlign: "center",
    marginBottom: 5,
  },
  cardDescription: {
    fontSize: 12,
    color: COLORS.gray,
    textAlign: "center",
  },
  notificationBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.accent,
    padding: 10,
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
  },
  notificationText: {
    flex: 1,
    color: COLORS.white,
    fontSize: 14,
    marginLeft: 10,
    marginRight: 10,
  },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    width: "70%",
    height: "100%",
    alignSelf: "flex-end",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  menu: {
    padding: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.grayLight,
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 15,
    color: COLORS.dark,
  },
  menuItemTextLogout: {
    fontSize: 16,
    marginLeft: 15,
    color: COLORS.danger,
  },
  menuDivider: {
    height: 1,
    backgroundColor: COLORS.grayLight,
    marginVertical: 10,
  },
});

