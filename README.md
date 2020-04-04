# Projeto DropBox Clone

Desenvolvi esse projeto no curso da Udemy com os instrutores da HCode.

O projeto tem o objeto de .......

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

### Backend - Express

O express pode ser feito na "mão" ou usar um "boilerplate" que é aquele que configura os arquivos principais, e o `express generator` faz isso pra gente.

(2) Para configrar o "express generator" para esse projeto, tendo em vista que já temos o "express generator" instalado, basta executar o comando `express --ejs app` (ejs: nossas view / app: nome do projeto).

(3) Depois, devemos acessar a pasta do projeto "app" `cd app` executamos o comando `npm install` para baixar as dependências.

(5) Para subir o `express`, basta executar o comando `npm start` no diretório `app`

(6) Acessar o navegador, na pasta `localhost:3000`

## Ensinamentos

Descrever.....

### Layout do Frontend
![DropBox Clone](https://firebasestorage.googleapis.com/v0/b/hcode-com-br.appspot.com/o/DropBoxClone.jpg?alt=media&token=d59cad0c-440d-4516-88f2-da904b9bb443)
