# Sistema de Chat em Tempo Real - ChamaAI

## Visão Geral

Este documento descreve a implementação completa do sistema de chat em tempo real para o aplicativo ChamaAI, permitindo comunicação instantânea entre clientes e prestadores de serviços.

## Arquitetura do Sistema

### Backend (Firebase Firestore)

O sistema utiliza o Firebase Firestore como banco de dados em tempo real, com a seguinte estrutura:

#### Coleção `chats`
```
chats/
├── {chatId}/
│   ├── participants: [uid1, uid2]
│   ├── participantsData: {
│   │   uid1: { name, avatar, tipo },
│   │   uid2: { name, avatar, tipo }
│   │   }
│   ├── lastMessage: { text, createdAt, senderId }
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
│   └── messages/ (subcoleção)
│       ├── {messageId}/
│       │   ├── _id: string
│       │   ├── text: string
│       │   ├── createdAt: timestamp
│       │   ├── user: { _id, name, avatar }
│       │   ├── image?: string
│       │   └── audio?: string
```

#### Coleção `users`
```
users/
├── {uid}/
│   ├── nome: string
│   ├── email: string
│   ├── celular: string
│   ├── tipo: 'cliente' | 'prestador'
│   ├── avatar?: string
│   ├── createdAt: timestamp
│   └── updatedAt: timestamp
```

## Arquivos Implementados

### 1. Configuração do Firebase
**Arquivo:** `src/config/firebase.ts`
- Configuração do Firebase com Firestore e Storage
- Exportação das instâncias para uso em toda a aplicação

### 2. Serviço de Chat
**Arquivo:** `src/services/chatService.ts`
- `createOrGetChat()` - Criar ou obter chat entre dois usuários
- `sendMessage()` - Enviar mensagem para um chat
- `listenToMessages()` - Escutar mensagens em tempo real
- `listenToUserChats()` - Escutar lista de chats do usuário
- `getAllUsers()` - Obter todos os usuários disponíveis
- `searchUsers()` - Buscar usuários por nome
- `markMessagesAsRead()` - Marcar mensagens como lidas

### 3. Autenticação Corrigida
**Arquivo:** `src/storage/firebaseAuth.ts`
- Correção do sistema de login
- Remoção da obrigatoriedade de verificação de email
- Integração com Firestore para dados do usuário
- Fallback para dados do AsyncStorage

### 4. Tela de Chat
**Arquivo:** `src/screens/ChatScreen.tsx`
- Interface de chat usando react-native-gifted-chat
- Comunicação em tempo real com Firestore
- Suporte a mensagens de texto, imagem e áudio
- Header com informações do usuário e ações

### 5. Tela de Mensagens
**Arquivo:** `src/screens/MessagesScreen.tsx`
- Lista de conversas recentes
- Busca de usuários para iniciar novas conversas
- Interface moderna com avatars e preview de mensagens
- Atualização em tempo real da lista de chats

### 6. Tela de Testes
**Arquivo:** `src/screens/ChatTestScreen.tsx`
- Testes das funcionalidades do chat
- Verificação de criação de chats
- Teste de envio de mensagens
- Validação de busca de usuários

### 7. Tipos Atualizados
**Arquivo:** `src/screens/types.ts`
- Tipos TypeScript atualizados para navegação
- Parâmetros corretos para as telas de chat

## Funcionalidades Implementadas

### ✅ Chat em Tempo Real
- Mensagens aparecem instantaneamente para todos os participantes
- Sincronização automática entre dispositivos
- Suporte offline com sincronização quando conectado

### ✅ Comunicação Universal
- Todos os usuários podem conversar entre si
- Não há restrições entre clientes e prestadores
- Sistema de busca para encontrar qualquer usuário

### ✅ Tipos de Mensagem
- **Texto:** Mensagens de texto simples
- **Imagem:** Envio de fotos da galeria
- **Áudio:** Gravação e envio de mensagens de voz
- **Sistema:** Mensagens automáticas do sistema

### ✅ Interface Moderna
- Design responsivo e intuitivo
- Avatars automáticos baseados no nome do usuário
- Indicadores de status e tempo das mensagens
- Animações suaves e feedback visual

### ✅ Busca e Descoberta
- Busca de usuários por nome
- Lista de todos os usuários disponíveis
- Filtros por tipo (cliente/prestador)
- Histórico de conversas recentes

## Como Usar

### Para Desenvolvedores

1. **Instalação das Dependências:**
   ```bash
   cd chamaai_project/3
   npm install
   ```

2. **Configuração do Firebase:**
   - O Firebase já está configurado no arquivo `src/config/firebase.ts`
   - Certifique-se de que as regras do Firestore permitem leitura/escrita

3. **Execução do Projeto:**
   ```bash
   npm start
   ```

### Para Usuários

1. **Acessar Mensagens:**
   - Navegue até a aba "Mensagens" no aplicativo
   - Veja suas conversas recentes

2. **Iniciar Nova Conversa:**
   - Use a barra de busca para encontrar usuários
   - Toque em um usuário para iniciar uma conversa

3. **Enviar Mensagens:**
   - Digite texto e toque em enviar
   - Pressione e segure o microfone para gravar áudio
   - Toque no ícone de imagem para enviar fotos

## Regras de Segurança do Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Chats podem ser acessados pelos participantes
    match /chats/{chatId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in resource.data.participants;
    }
    
    // Mensagens podem ser acessadas pelos participantes do chat
    match /chats/{chatId}/messages/{messageId} {
      allow read, write: if request.auth != null && 
        request.auth.uid in get(/databases/$(database)/documents/chats/$(chatId)).data.participants;
    }
  }
}
```

## Dependências Adicionais

O sistema utiliza as seguintes dependências que já estão no projeto:

- `firebase` - SDK do Firebase
- `react-native-gifted-chat` - Interface de chat
- `@react-native-async-storage/async-storage` - Armazenamento local
- `expo-image-picker` - Seleção de imagens
- `expo-av` - Gravação e reprodução de áudio
- `expo-file-system` - Sistema de arquivos

## Troubleshooting

### Problemas Comuns

1. **Mensagens não aparecem em tempo real:**
   - Verifique a conexão com a internet
   - Confirme se as regras do Firestore estão corretas

2. **Erro de autenticação:**
   - Verifique se o usuário está logado
   - Confirme a configuração do Firebase Auth

3. **Imagens/áudios não carregam:**
   - Verifique as permissões do dispositivo
   - Confirme a configuração do Firebase Storage

### Logs de Debug

Para debug, verifique os logs no console:
```javascript
console.log('Chat ID:', chatId);
console.log('Mensagens:', messages);
console.log('Usuário atual:', getCurrentUser());
```

## Próximos Passos

### Melhorias Futuras
- [ ] Notificações push para novas mensagens
- [ ] Status de leitura das mensagens
- [ ] Compartilhamento de localização
- [ ] Chamadas de voz/vídeo
- [ ] Grupos de chat
- [ ] Mensagens temporárias
- [ ] Backup automático de conversas

### Otimizações
- [ ] Cache de mensagens para melhor performance
- [ ] Compressão de imagens antes do envio
- [ ] Paginação de mensagens antigas
- [ ] Indexação para busca mais rápida

## Suporte

Para dúvidas ou problemas:
1. Verifique este documento primeiro
2. Consulte os logs de erro no console
3. Teste as funcionalidades na tela de testes
4. Verifique a configuração do Firebase

---

**Desenvolvido para ChamaAI - Sistema de Chat em Tempo Real**
*Versão 1.0 - Dezembro 2024*

