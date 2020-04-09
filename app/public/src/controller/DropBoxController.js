// Criando a classe que será responsável pelo controle da aplicação

class DropBoxCrontroler {

    // Criando o método construtor
    constructor() {

        // ***************** ATRIBUTOS *********************************//
        // Criando um atributo para acessar o botão (btn-send-file)
        this.btnsendfileEL = document.querySelector('#btn-send-file');
        // Criando um atributo para acessar a tag ("input type="file"")
        this.inputFileEL = document.querySelector('#files');
        // Criando um atributo para acessar o modal da barra de progresso
        this.snackModalEL = document.querySelector('#react-snackbar-root');
        // Criando um atributo para acessar o demonstrador de progresso
        this.progressBarEl = document.querySelector('.mc-progress-bar-fg')
        // Criando um atributo para acessar conteudo do modal 
        this.namefileEL = document.querySelector('.filename')
        this.timeleftEL = document.querySelector('.timeleft')

                
        // Criando um método para iniciar os eventos
        this.initEvents();

        // Criando um método para conectar ao firebase
        this.connectFirebase();
    }
    
    // *********************** MÉTODOS *************************************************//

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
        // firebase.analytics();
    }

    // Método para Eventos Iniciais (enviar arquivos // abrir janela de seleção)
    initEvents() {

        // Adicionando o evendo para "escutar" o "click" do botão "enviar arquivos"
        this.btnsendfileEL.addEventListener('click', event => {

            // Quando se clica no botão, temos que abrir a janela que vai anexar arquivos
            // Precisamos de um "input type="file""  /  index.ejs => id="files"
            this.inputFileEL.click();

        })

        // Vamos também já mostrar o modal de progresso de anexo dos arquivos
        // Note.: que estamos pegando do elemento "inputFileEl", pois é no input file
        // que está a coleção de arquivos a serem selecionados
        this.inputFileEL.addEventListener('change', event => {

            // console.log(event.target.files);
            // Para importar vários arquivos
            // event.target.files são os parâmetros a serem passados
            // Nesse método uploadTask tem o retorno da Promise
            this.uploadTask(event.target.files).then(responses => {

                // Teremos várias respostas das promises
                responses.forEach(resp => {

                    // O Firebase sempre guarda colecoes de documentos (array's de json)
                    // ou um documento (que é um json)
                    console.log(resp.files['input-file'])

                    // O Firebase trabalha com objeto
                    // Vamos adicionar itens na colecao com o "push"
                    // como o "resp.files['input-file']" já é um objeto
                    //Já podemos salvar os dados direto
                    this.getFirebaseRef().push().set(resp.files['input-file'])

                });

                // Para fechar o modal da barra de progresso
                this.modalShow(false)

            });

            // Exibilindo o modal na tela // Exibindo via "css"
            this.modalShow()

            // Zerando campo para poder startar o campo de novo
            this.inputFileEL.value = ''

        })

    }

    //Criando um método para pegar a referência do Firebase
    getFirebaseRef() {

        return firebase.database().ref('files')

    }

    // Criando um método para exibir ou não o modal de progresso
    modalShow(show = true) {  

        //Exibilindo o modal na tela // Exibindo via "css"
        this.snackModalEL.style.display = (show) ? 'block' : 'none'
        
    }


    // Método para receber os nossos arquivos
    // Vamos receber os arquivos como parâmetros 
    uploadTask(files) {

        // Para cada arquivo teremos uma Promise
        let promises = [];

        // Obs.: O "files" não é um array e sim uma coleção e usamos o spread (espalhar)
        // Spread: Pega a coleção e transforma num array
        [...files].forEach(file => {

            // Isso porque, para cada arquivo teremos uma Promise
            // E ela foi quebrada num array
            promises.push(new Promise((resolve, reject ) => {

                // Para cada uma, vamos fazer a nossa soliitação assincrona Ajax para o servidor
                let ajax = new XMLHttpRequest();

                // Abrindo a nossa conexão ajax / POST, pois estamos enviadno
                ajax.open('POST', '/upload')

                // E para verificar se já acabou, chamamos o event onload
                ajax.onload = event => {

                    try {

                        // Verificando a resposta do nosso servidor
                        resolve(JSON.parse(ajax.responseText))

                    } catch (e) {

                        reject(e)

                    }

                }

                // Para erro, também podemos usar a mensagem de erro do ajax
                ajax.onerror = event => {

                    reject(event)

                }

                // Barra de progresso
                // Existe o "ajax.onprogress" e o "ajax.upload.onprogress"
                // O ajax.upload.onprogress é durante o processo e não apenas o final
                ajax.upload.onprogress = event => {

                    // Método para fazer o cálculo do progresso do envio do arquivo
                    // Esse é um método criado. Não é um método nativo
                    this.uploadProgress(event, file)
                    // console.log(event);

                }

                // Estmos querendo enviar arquivos.
                // Mas para "ler" os arquivos podemos usar a API FormData
                let formData = new FormData()

                // E também, temos que colocar o arquivo que queremos enviar
                // dentro da API do FormData pelo método append('parametro 1', 'parametro 2')
                // append('o nome que o post do servidor vai receber', 'arquivo')
                formData.append('input-file', file) // file: variável do forEach

                // Pegando o timestamp para fazer o cálculo de quanto tempo vai faltar
                this.startUploadTime = Date.now();

                //Quem é enviado (a variável do formdata que foi criada)
                ajax.send(formData);

            }))

        })

        // Promis.all (é um método nativo) e recebe um Array
        return Promise.all(promises);
    }

    uploadProgress(event, file) {

        // Fazer o cálculo para mostrar o tempo gasto
        let timespent = Date.now() - this.startUploadTime;

        // Loaded e total são atributos do event ProgressEvent
        let loaded = event.loaded
        let total = event.total

        let porcent = parseInt((loaded / total) * 100);
        let timeleft = ((100 - porcent)  * timespent) / porcent

        this.progressBarEl.style.width = `${porcent}%`

        this.namefileEL.innerHTML = file.name;
        this.timeleftEL.innerHTML = this.formatTimeToHuman(timeleft);

        // console.log(this.namefileEL.innerHTML, this.timeleftEL.innerHTML)

    }

    // Criando um metodo para formatar o timestamp 
    // Do tempo restante para apresentar ao usuário
    formatTimeToHuman(duration){

        let seconds = parseInt((duration / 1000) % 60 )
        let minutes = parseInt((duration / (1000 * 60 )) % 60)
        let hours = parseInt((duration / (1000 * 60* 60 )) % 24)

        if(hours > 0){
            return `${hours} horas, ${minutes} minutos e ${seconds} segundos`
        }

        if(minutes > 0){
            return `${minutes} minutos e ${seconds} segundos`
        }

        if(seconds > 0){
            return `${seconds} segundos`
        }

        return '';
    }

}