import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ClienteHome from './ClienteHome';
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "./types";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen({ navigation }: Props) {
  return <ClienteHome navigation={navigation} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});

