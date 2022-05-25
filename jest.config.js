module.exports = { 
  // pastas que devem ser ignoradas porque não vão conter testes
  testPathIgnorePatterns: ["/node_modules/", "/.next/"], 
  // arquivos que devem ser executados pelo jest
  setupFilesAfterEnv: ['<rootDir>/src/tests/setupTests.ts'],
  // define como serão os arquivos em typescript convertidos
  // isso é necessário porque o jest não reconhece o typescript
  transform: { 
    // espressão regular - todos os arquivos com 1 ou mais caracteres no nome
    // que tenham ponto no nome e termina com (js, jsx, ts, tsx)
    // Apos os 2 pontos é informado o pacote que vai ser usado para a transformação
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  }, 
  moduleNameMapper: {
    // informa que todos os arquivos que terminam com .scss, .css ou .sass
    // dever ser traduzidos para o jest usando a biblioteca identity obj proxy
    "\\.(scss|css|sass)$": "identity-obj-proxy"
  }, 
  // informa que ambiente o jest está trabalhando
  // ele vai usar isso para saber como simular o ambiente durante os testes
  // o jsdom é uma forma nativa de fazer isso
  // ele entrega para o jest o que está sendo exibido em tela porem em javascript
  testEnvironment: "jsdom"
};