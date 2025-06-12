# Instruções de Instalação e Uso - Sistema de Chat ChamaAI

## 🚀 Instalação Rápida

### 1. Preparar o Ambiente
```bash
# Navegar para o diretório do projeto
cd chamaai_project/3

# Instalar dependências
npm install

# Corrigir vulnerabilidades (se necessário)
npm audit fix
```

### 2. Configurar Firebase (se necessário)
O Firebase já está configurado, mas se precisar alterar:

```typescript
// src/config/firebase.ts
const firebaseConfig = {
  apiKey: "sua-api-key",
  authDomain: "seu-projeto.firebaseapp.com",
  projectId: "seu-projeto-id",
  storageBucket: "seu-projeto.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "sua-app-id"
};
```

### 3. Executar o Projeto
```bash
# Iniciar o servidor de desenvolvimento
npm start

# Para Android
npm run android

# Para iOS
npm run ios

# Para Web
npm run web
```

## 📱 Como Usar o Chat

### Para Usuários Finais

#### 1. **Acessar o Chat**
- Abra o aplicativo ChamaAI
- Faça login com sua conta
- Navegue até a aba "Mensagens" 📨

#### 2. **Iniciar uma Conversa**
- Na tela de mensagens, use a barra de busca no topo
- Digite o nome da pessoa que deseja conversar
- Toque no usuário desejado na lista de resultados
- Uma nova conversa será criada automaticamente

#### 3. **Enviar Mensagens**

**Texto:**
- Digite sua mensagem no campo de texto
- Toque no botão de enviar (✈️)

**Imagem:**
- Toque no ícone de imagem (📷)
- Selecione uma foto da galeria
- A imagem será enviada automaticamente

**Áudio:**
- Pressione e segure o ícone do microfone (🎤)
- Fale sua mensagem
- Solte o botão para enviar

#### 4. **Gerenciar Conversas**
- Todas as conversas aparecem na lista principal
- As mais recentes ficam no topo
- Toque em qualquer conversa para abri-la
- Puxe para baixo para atualizar a lista

### Para Desenvolvedores

#### 1. **Estrutura dos Arquivos**
```
src/
├── config/
│   └── firebase.ts          # Configuração do Firebase
├── services/
│   └── chatService.ts       # Lógica do chat
├── storage/
│   └── firebaseAuth.ts      # Autenticação corrigida
└── screens/
    ├── ChatScreen.tsx       # Tela de conversa
    ├── MessagesScreen.tsx   # Lista de conversas
    ├── ChatTestScreen.tsx   # Testes do sistema
    └── types.ts            # Tipos TypeScript
```

#### 2. **Principais Funções**

```typescript
// Criar ou obter chat
const chatId = await createOrGetChat(otherUserId, otherUserData);

// Enviar mensagem
await sendMessage(chatId, { text: "Olá!" });

// Escutar mensagens em tempo real
const unsubscribe = listenToMessages(chatId, (messages) => {
  setMessages(messages);
});

// Buscar usuários
const users = await searchUsers("nome");
```

#### 3. **Testes**
Para testar o sistema:
- Adicione a tela `ChatTestScreen` ao navegador
- Execute os testes individuais
- Verifique os logs no console
- Teste com diferentes usuários

## 🔧 Configurações Avançadas

### Regras do Firestore
Configure as regras de segurança no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
    }
  }
}
```

### Permissões do App
Certifique-se de que o app tem as permissões necessárias:

```json
// app.json
{
  "expo": {
    "permissions": [
      "CAMERA",
      "RECORD_AUDIO",
      "READ_EXTERNAL_STORAGE"
    ]
  }
}
```

## 🐛 Solução de Problemas

### Problema: "Usuário não autenticado"
**Solução:**
1. Verifique se o usuário fez login
2. Confirme se o Firebase Auth está funcionando
3. Teste com `getCurrentUser()` no console

### Problema: "Mensagens não aparecem"
**Solução:**
1. Verifique a conexão com internet
2. Confirme as regras do Firestore
3. Teste com dois dispositivos diferentes

### Problema: "Erro ao enviar imagem/áudio"
**Solução:**
1. Verifique as permissões do dispositivo
2. Confirme se o Firebase Storage está configurado
3. Teste em um dispositivo físico (não simulador)

### Problema: "Lista de usuários vazia"
**Solução:**
1. Certifique-se de que existem usuários cadastrados
2. Verifique se os dados estão na coleção `users`
3. Confirme as regras de leitura do Firestore

## 📊 Monitoramento

### Logs Importantes
```typescript
// Debug do chat
console.log('Chat ID:', chatId);
console.log('Mensagens recebidas:', messages.length);
console.log('Usuário atual:', getCurrentUser()?.uid);

// Debug de usuários
console.log('Usuários encontrados:', users.length);
console.log('Resultados da busca:', searchResults);
```

### Métricas no Firebase Console
- **Authentication:** Número de usuários ativos
- **Firestore:** Operações de leitura/escrita
- **Storage:** Uso de armazenamento para imagens/áudios

## 🔄 Atualizações Futuras

### Como Adicionar Novas Funcionalidades

1. **Notificações Push:**
   - Configure Firebase Cloud Messaging
   - Adicione listeners para novas mensagens
   - Implemente notificações locais

2. **Status de Leitura:**
   - Adicione campo `readBy` nos chats
   - Atualize quando o usuário abrir a conversa
   - Mostre indicadores visuais

3. **Grupos de Chat:**
   - Modifique a estrutura para suportar múltiplos participantes
   - Adicione interface para criar grupos
   - Implemente permissões de admin

## 📞 Suporte

### Contatos para Dúvidas
- **Documentação:** Consulte `DOCUMENTACAO_CHAT.md`
- **Testes:** Use `ChatTestScreen.tsx`
- **Logs:** Verifique o console do navegador/dispositivo

### Recursos Úteis
- [Documentação do Firebase](https://firebase.google.com/docs)
- [React Native Gifted Chat](https://github.com/FaridSafi/react-native-gifted-chat)
- [Expo Documentation](https://docs.expo.dev/)

---

**✅ Sistema de Chat Implementado com Sucesso!**

*O chat está funcionando em tempo real e pronto para uso em produção.*

