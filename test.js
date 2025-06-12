// Script para verificar a configuração de navegação
const fs = require('fs');
const path = require('path');

console.log('Iniciando verificação da configuração de navegação...');

// Função para verificar a existência de um arquivo
function checkFileExists(filePath) {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    console.log(`✅ Arquivo ${filePath} existe`);
    return true;
  } catch (err) {
    console.error(`❌ Erro: Arquivo ${filePath} não encontrado`);
    return false;
  }
}

// Função para verificar o conteúdo de um arquivo
function checkFileContent(filePath, searchString) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    if (content.includes(searchString)) {
      console.log(`✅ Arquivo ${filePath} contém "${searchString}"`);
      return true;
    } else {
      console.error(`❌ Erro: Arquivo ${filePath} não contém "${searchString}"`);
      return false;
    }
  } catch (err) {
    console.error(`❌ Erro ao ler arquivo ${filePath}: ${err.message}`);
    return false;
  }
}

// Verificar arquivos principais
const appFile = path.join(__dirname, 'App.tsx');
const appNavigatorFile = path.join(__dirname, 'src/navigation/AppNavigator.tsx');
const typesFile = path.join(__dirname, 'src/screens/types.ts');
const clienteHomeFile = path.join(__dirname, 'src/screens/ClienteHome.tsx');
const editProfileFile = path.join(__dirname, 'src/screens/EditProfileScreen.tsx');

let allPassed = true;

// Verificar App.tsx
if (checkFileExists(appFile)) {
  if (!checkFileContent(appFile, 'import AppNavigator from')) {
    console.error('❌ App.tsx não está importando o AppNavigator');
    allPassed = false;
  }
  if (!checkFileContent(appFile, 'return <AppNavigator />')) {
    console.error('❌ App.tsx não está retornando o componente AppNavigator');
    allPassed = false;
  }
} else {
  allPassed = false;
}

// Verificar AppNavigator.tsx
if (checkFileExists(appNavigatorFile)) {
  if (!checkFileContent(appNavigatorFile, '<Stack.Screen name="EditProfile"')) {
    console.error('❌ AppNavigator.tsx não tem a tela EditProfile definida');
    allPassed = false;
  }
} else {
  allPassed = false;
}

// Verificar types.ts
if (checkFileExists(typesFile)) {
  if (!checkFileContent(typesFile, 'EditProfile: undefined')) {
    console.error('❌ types.ts não tem o tipo EditProfile definido');
    allPassed = false;
  }
} else {
  allPassed = false;
}

// Verificar ClienteHome.tsx
if (checkFileExists(clienteHomeFile)) {
  if (!checkFileContent(clienteHomeFile, 'navigation.navigate("EditProfile")')) {
    console.error('❌ ClienteHome.tsx não tem navegação para EditProfile');
    allPassed = false;
  }
} else {
  allPassed = false;
}

// Verificar EditProfileScreen.tsx
if (!checkFileExists(editProfileFile)) {
  console.error('❌ EditProfileScreen.tsx não existe');
  allPassed = false;
}

// Resultado final
if (allPassed) {
  console.log('\n✅ Todas as verificações foram concluídas com sucesso!');
  console.log('A configuração de navegação está correta e deve resolver o problema de navegação para a tela de edição de perfil.');
} else {
  console.log('\n❌ Algumas verificações falharam. Revise os erros acima.');
}

