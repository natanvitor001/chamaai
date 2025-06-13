import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { createTestUsers } from './src/storage/auth';

export default function App() {
  useEffect(() => {
    // Cria usuários de teste quando o app inicializar
    createTestUsers();
  }, []);

  return <AppNavigator />;
}

