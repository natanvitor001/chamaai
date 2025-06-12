# Implementação Firebase Auth - NPM e Script Tag

## Opção 1: Usando NPM (Recomendado para React Native/Expo)

### 1. Instalação
```bash
npm install firebase
```

### 2. Configuração (src/config/firebase.ts)
```typescript
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBcKBFN0x02Fop1JeIlhEaL-ElvPCac9is",
  authDomain: "aplicativo-getninjas.firebaseapp.com",
  projectId: "aplicativo-getninjas",
  storageBucket: "aplicativo-getninjas.firebasestorage.app",
  messagingSenderId: "731573591876",
  appId: "1:731573591876:web:a91c6b8f3ea18d2d710111"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;
```

### 3. Uso nas Telas
```typescript
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendEmailVerification 
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Cadastro
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
await sendEmailVerification(userCredential.user);

// Login
const userCredential = await signInWithEmailAndPassword(auth, email, password);
if (!userCredential.user.emailVerified) {
  throw new Error('E-mail não verificado');
}
```

## Opção 2: Usando Tag Script (Para Web/HTML)

### 1. HTML Base
```html
<!DOCTYPE html>
<html>
<head>
    <title>SkillLink - Autenticação</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body>
    <!-- Firebase SDK -->
    <script src="https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js"></script>
    
    <!-- Sua aplicação -->
    <div id="app">
        <div id="login-form">
            <h2>Login</h2>
            <input type="email" id="email" placeholder="E-mail">
            <input type="password" id="password" placeholder="Senha">
            <button onclick="login()">Entrar</button>
            <button onclick="showRegister()">Cadastrar</button>
        </div>
        
        <div id="register-form" style="display:none;">
            <h2>Cadastro</h2>
            <input type="text" id="nome" placeholder="Nome">
            <input type="email" id="reg-email" placeholder="E-mail">
            <input type="password" id="reg-password" placeholder="Senha">
            <button onclick="register()">Cadastrar</button>
            <button onclick="showLogin()">Voltar ao Login</button>
        </div>
        
        <div id="verification-message" style="display:none;">
            <h2>Verifique seu E-mail</h2>
            <p>Um e-mail de verificação foi enviado. Verifique sua caixa de entrada.</p>
            <button onclick="resendVerification()">Reenviar E-mail</button>
            <button onclick="showLogin()">Voltar ao Login</button>
        </div>
    </div>

    <script>
        // Configuração Firebase
        const firebaseConfig = {
            apiKey: "AIzaSyBcKBFN0x02Fop1JeIlhEaL-ElvPCac9is",
            authDomain: "aplicativo-getninjas.firebaseapp.com",
            projectId: "aplicativo-getninjas",
            storageBucket: "aplicativo-getninjas.firebasestorage.app",
            messagingSenderId: "731573591876",
            appId: "1:731573591876:web:a91c6b8f3ea18d2d710111"
        };

        // Inicializar Firebase
        firebase.initializeApp(firebaseConfig);
        const auth = firebase.auth();

        // Variável para armazenar usuário atual
        let currentUser = null;

        // Função de cadastro
        async function register() {
            const nome = document.getElementById('nome').value;
            const email = document.getElementById('reg-email').value;
            const password = document.getElementById('reg-password').value;

            if (!nome || !email || !password) {
                alert('Preencha todos os campos');
                return;
            }

            if (password.length < 6) {
                alert('A senha deve ter pelo menos 6 caracteres');
                return;
            }

            try {
                // Criar usuário
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Atualizar perfil com nome
                await user.updateProfile({
                    displayName: nome
                });

                // Enviar e-mail de verificação
                await user.sendEmailVerification();

                // Mostrar mensagem de verificação
                document.getElementById('register-form').style.display = 'none';
                document.getElementById('verification-message').style.display = 'block';

                alert('Cadastro realizado! Verifique seu e-mail antes de fazer login.');

            } catch (error) {
                console.error('Erro no cadastro:', error);
                
                switch (error.code) {
                    case 'auth/email-already-in-use':
                        alert('Este e-mail já está sendo usado por outra conta.');
                        break;
                    case 'auth/invalid-email':
                        alert('E-mail inválido.');
                        break;
                    case 'auth/weak-password':
                        alert('A senha deve ter pelo menos 6 caracteres.');
                        break;
                    default:
                        alert('Erro ao criar conta. Tente novamente.');
                }
            }
        }

        // Função de login
        async function login() {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                alert('Preencha todos os campos');
                return;
            }

            try {
                const userCredential = await auth.signInWithEmailAndPassword(email, password);
                const user = userCredential.user;

                // Verificar se e-mail foi verificado
                if (!user.emailVerified) {
                    alert('Por favor, verifique seu e-mail antes de fazer login. Verifique sua caixa de entrada e spam.');
                    
                    // Oferecer reenvio
                    if (confirm('Deseja reenviar o e-mail de verificação?')) {
                        await user.sendEmailVerification();
                        alert('E-mail de verificação reenviado.');
                    }
                    return;
                }

                // Login bem-sucedido
                currentUser = user;
                alert(`Login realizado com sucesso! Bem-vindo, ${user.displayName || user.email}!`);
                
                // Aqui você redirecionaria para a página principal
                console.log('Usuário logado:', user);

            } catch (error) {
                console.error('Erro no login:', error);
                
                switch (error.code) {
                    case 'auth/user-not-found':
                    case 'auth/wrong-password':
                    case 'auth/invalid-credential':
                        alert('E-mail ou senha incorretos.');
                        break;
                    case 'auth/user-disabled':
                        alert('Esta conta foi desabilitada.');
                        break;
                    case 'auth/too-many-requests':
                        alert('Muitas tentativas de login. Tente novamente mais tarde.');
                        break;
                    default:
                        alert('Erro no login. Tente novamente.');
                }
            }
        }

        // Função para reenviar verificação
        async function resendVerification() {
            if (auth.currentUser) {
                try {
                    await auth.currentUser.sendEmailVerification();
                    alert('E-mail de verificação reenviado.');
                } catch (error) {
                    alert('Erro ao reenviar e-mail de verificação.');
                }
            }
        }

        // Funções de navegação
        function showRegister() {
            document.getElementById('login-form').style.display = 'none';
            document.getElementById('register-form').style.display = 'block';
            document.getElementById('verification-message').style.display = 'none';
        }

        function showLogin() {
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('register-form').style.display = 'none';
            document.getElementById('verification-message').style.display = 'none';
        }

        // Monitorar estado de autenticação
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log('Usuário logado:', user);
                currentUser = user;
            } else {
                console.log('Usuário deslogado');
                currentUser = null;
            }
        });
    </script>

    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 400px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }

        #app > div {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        h2 {
            color: #064635;
            text-align: center;
            margin-bottom: 20px;
        }

        input {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            border: 1px solid #ddd;
            border-radius: 5px;
            box-sizing: border-box;
        }

        button {
            width: 100%;
            padding: 12px;
            margin: 10px 0;
            background-color: #0A8754;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }

        button:hover {
            background-color: #064635;
        }

        #verification-message {
            text-align: center;
        }

        #verification-message p {
            color: #666;
            margin-bottom: 20px;
        }
    </style>
</body>
</html>
```

## Comparação das Abordagens

### NPM (React Native/Expo)
**Vantagens:**
- Melhor integração com React Native
- TypeScript support nativo
- Bundling otimizado
- Melhor para desenvolvimento mobile

**Uso:**
- Projetos React Native/Expo
- Aplicações TypeScript
- Desenvolvimento mobile

### Script Tag (Web)
**Vantagens:**
- Implementação mais simples
- Não requer build process
- Funciona diretamente no navegador
- Ideal para prototipagem rápida

**Uso:**
- Aplicações web simples
- Prototipagem
- Projetos sem bundler

## Configuração no Firebase Console

Para ambas as abordagens, configure no Firebase Console:

1. **Authentication > Sign-in method**
   - Ative "Email/Password"

2. **Authentication > Templates**
   - Personalize o e-mail de verificação
   - Configure o remetente

3. **Authentication > Settings**
   - Configure domínios autorizados
   - Defina configurações de segurança

## Próximos Passos

1. Escolha a abordagem adequada ao seu projeto
2. Implemente o código fornecido
3. Configure o Firebase Console
4. Teste o fluxo completo de autenticação
5. Personalize a interface conforme necessário

Ambas as implementações oferecem o mesmo nível de segurança e funcionalidade, diferindo apenas na forma de integração com seu projeto.

