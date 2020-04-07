# Projeto DropBox Clone

Desenvolvi esse projeto no curso da Udemy com os instrutores da HCode.

O projeto tem o objeto de .......

## Ensinamentos

 - <b>Seleção de elemento HTML</b>: document.querySelector('#id')
 - <b>Adicionar eventos de click</b>: addEventListener('click', event => {})
 - <b>Adicionar eventos de mudança de arquivos</b>: addEventListener('change', event => {})
 - <b>Exibição de modal</b>: (elementoHMTL).<b>style.display = 'block'</b>
 - <b>Promises</b>: new Promise((resolve, reject ) => {}) / Promise.all(promise)
 - <b>Uso do Ajax para requisições</b>: XMLHttpRequest() /  ajax.open('param', 'param') / ajax.onload / ajax.onerror / ajax.send
 - <b>formData</b>: Para ler os aquivos da API FormData / formData.append('elementoHMTL', variável)
 - <b>formidable</b>: usado para .... 
 - <b>ajax.upload.onprogress</b>: Para calcular a progresso de envio de um arquivo
 - <b></b>:


## Instalação e Configuração 

Abaixo estou listando os comando para instalar e configurar as dependências do front e backend.

### Frontend - Bower

Para não subir arquivos desnecessários, a configuração do layout do frontend está no arquivo "bower.json". 

(1) E para baixar essas dependências, basta excutar a linha de comando "`bower install`", dentro do diretório do projeto por um terminal (eu uso dentro do próprio VSC - Visual Studio Code)

(4) Depois de instalar baixar as dependêcias do backend (express generator), temos:

  - Acessar a pasta `app/public` e apagar tudo que está dentro dela;
  - que copiar os nossos arquivos (pasta assets, bower_components, .gitignore, bower.json) para a pastas `app/public`;
  - que copiar o nosso arquivo (index.html) para a pastas `app/views`;
  - apagar o arquivo "index.ejs" do diretório `app/views`;
  - renomear o arquivo `index.html` para `index.ejs`
  
 (5) Instalando o formidable: `npm install formidable --save`

### Backend - Express

O express pode ser feito na "mão" ou usar um "boilerplate" que é aquele que configura os arquivos principais, e o `express generator` faz isso pra gente.

(2) Para configrar o "express generator" para esse projeto, tendo em vista que já temos o "express generator" instalado, basta executar o comando `express --ejs app` (ejs: nossas view / app: nome do projeto).

(3) Depois, devemos acessar a pasta do projeto "app" `cd app` executamos o comando `npm install` para baixar as dependências.

(5) Para subir o `express`, basta executar o comando `npm start` no diretório `app`

(6) Acessar o navegador, na pasta `localhost:3000`

### Firebase

A URL para instalação do FireBase é  `https://firebase.google.com/`
 
1. Ir para o console;
2. Criar um projeto;
3. Acesse o menu de desenvolvedor;
4. Acesse a opção de DataBase;
5. Escolher a opção "Realtime Database"
6. Iniciar no modo de teste;
8. Copiar os dados gerados dentro do arquivo `index.ejs` 
 
 ```
 <!-- ********* Configuração para usar o firebase ************************ -->
    <!-- The core Firebase JS SDK is always required and must be listed first -->
    <script src="https://www.gstatic.com/firebasejs/7.13.2/firebase-app.js"></script>

    <!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#available-libraries -->
    <script src="https://www.gstatic.com/firebasejs/7.13.2/firebase-analytics.js"></script>
    <!-- ********************************************************************* -->
 ```
8. Copiar os dados gerados dentro do arquivo `DropBoxController.ejs` 
 
 (Dentro do construtor da classe)
 ```
  // Criando um método para conectar ao firebase
        this.connectFirebase();
 ```
 
(Fora do construtor da classe)
```
// Criando o método de conexão com o Firebase
    connectFirebase() {

        var firebaseConfig = {
            apiKey: "AIzaSyDyI83ylcB3MsDl3o56TrMqkf3ISRGNews",
            authDomain: "dropbox-clone-fylipeaguilar.firebaseapp.com",
            databaseURL: "https://dropbox-clone-fylipeaguilar.firebaseio.com",
            projectId: "dropbox-clone-fylipeaguilar",
            storageBucket: "dropbox-clone-fylipeaguilar.appspot.com",
            messagingSenderId: "105866072795",
            appId: "1:105866072795:web:0aa6d2eb1f0f9b959a32fe",
            measurementId: "G-S08L9PV1Z5"
        };

        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);
        firebase.analytics();
    }
```

 
## Rodando a aplicação

### Frontend && Backend
 
1. Acesse a pasta ~/Projeto_Gerenciamento_Usuario_Restful/management-user-restful
2. Execute o comando `npm start`
3. Abre o browser com a URL `http://localhost:3000/`
 
<b>(2) - Resposta esperada</b>: 
```
~/Projeto_DropBox/app (master)
$ npm start

> app@0.0.0 start D:\Cursos_Aprendizados\Udemy\JavaScript_HCode\Projeto_DropBox\app
> node ./bin/www
```
- Acesse o browser com a `URL: http://localhost:3000/`

### Layout do Frontend
![DropBox Clone](https://firebasestorage.googleapis.com/v0/b/hcode-com-br.appspot.com/o/DropBoxClone.jpg?alt=media&token=d59cad0c-440d-4516-88f2-da904b9bb443)
