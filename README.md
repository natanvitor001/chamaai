# Correção do Erro de Navegação

## Problema Resolvido

Foi corrigido o erro de navegação:
```
ERROR The action 'NAVIGATE' with payload {"name":"EditProfile"} was not handled by any navigator.
```

## Causa do Problema

O problema ocorreu porque havia dois sistemas de navegação conflitantes no aplicativo:

1. Um definido diretamente no arquivo `App.tsx`
2. Outro definido no arquivo `src/navigation/AppNavigator.tsx`

O arquivo `App.tsx` estava definindo seu próprio `NavigationContainer` e `Stack.Navigator`, mas não incluía a tela "EditProfile". Enquanto isso, o arquivo `AppNavigator.tsx` tinha a configuração completa com todas as telas, incluindo "EditProfile".

Como o aplicativo estava usando o `App.tsx` como ponto de entrada (através do `index.ts`), ele estava usando a navegação incompleta, o que causava o erro quando tentava navegar para a tela "EditProfile".

## Solução Implementada

A solução foi simplificar o arquivo `App.tsx` para usar o `AppNavigator` em vez de definir sua própria navegação:

```jsx
import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return <AppNavigator />;
}
```

Isso garante que o aplicativo use a configuração de navegação completa definida em `AppNavigator.tsx`, que inclui todas as telas necessárias, incluindo "EditProfile".

## Como Testar

1. Execute o aplicativo
2. Faça login para acessar a tela inicial do cliente
3. Clique na imagem de perfil no cabeçalho ou abra o menu e clique em "Editar Perfil"
4. A tela de edição de perfil deve ser exibida corretamente sem erros de navegação

## Observações

- Todas as rotas e navegações estão agora centralizadas no arquivo `AppNavigator.tsx`
- Qualquer nova tela deve ser adicionada ao `AppNavigator.tsx` e ao arquivo `types.ts`
- A estrutura de navegação está agora mais organizada e fácil de manter

