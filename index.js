// ************ Criando e Configurando o Servidor NodeJS **************//

// - Instalação de pacotes uteis

// ************************* Nodemon **********************************
// O nodemon é um pacote para restart o serviço (servidor) do node,
// toda vez que um arquivo é alterado.
// ("-g" é para a instalação do nodem ser global)
// Comando para instalar: npm install nodemon -g 
// ********************************************************************//

// // Carregando o módulo HTTP
// const http = require('http');

// Subindo o servidor com o "express"
// Obs.: O "express" já sobe o HTTP junto.
const express = require('express')
// instalamos o "consign" para facilitar a implementação de rotas
const consign = require('consign')
// instalamos o "bodyParse" para facilitar a implementação de rotas
const bodyParse = require('body-parser')
// Instatamos a extensão "validator"
const expressValidator = require('express-validator')



// Como estamos usando o express,
// podemos chamar o export como a linha de comando abaixo
// ******** SEM O CONSIGN  **************
// const routsIndex = require('./routes/index')
// const routsUsers = require('./routes/users')

// Temos que usar o método use() para "chamar" os meus "exports"
// app.use(routsIndex);
// app.use('/users', routsUsers);

// Invocando o express. O Express é um função
const app = express()

// Usando o body-parse
app.use(bodyParse.urlencoded( { extended : false, limit: '50mb' }));
app.use(bodyParse.json( { limit: '50mb' } ));

// Usando o expressValidator
app.use(expressValidator())


// ******** Utilizando rotas com o consign  **************
// Consign: inclui para a aplicacao todos os arquivos da pasta "routes"
// dentro de "app"
consign().include('routes').include('utils').into(app);


// ************ USANDO O EXPRESS *****************//
app.listen(4000, '127.0.0.1', () => {

    console.log('O servidor está rodando...')
    
})



// ******* Testando *********//

// (1)
// No terminal escrevermos o o "node" e o nome do arquivo (com ou sem extenção)
// Ex.: "node index"
// Verificar se apareceu a mensagem "O servidor está rodando..." no próprio terminal

// (2)
// No browser acesse a URL: "http://localhost:3000/"

// (3)
// Verificar se no console 