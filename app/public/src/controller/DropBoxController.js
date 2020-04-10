// Criando a classe que será responsável pelo controle da aplicação

class DropBoxCrontroler {

    // Criando o método construtor
    constructor() {

        // ***************** ATRIBUTOS *********************************//

        // Atribuo para localização de pastas
        this.currentFolder = ['DropBoxClone']

        // Atributo que vai informar a mudança do evento
        this.onselectionchange = new Event('selectionchange');

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
        //Criando um atributo para pegar o campo de "listar"
        this.listFilesEL = document.querySelector('#list-of-files-and-directories')

        // Criando um atributo para acessar a opção de "Nova Pasta"
        this.btnNewFolder = document.querySelector('#btn-new-folder')
        // Criando um atributo para acessar a opção de "Renomear"
        this.btnRename = document.querySelector('#btn-rename')
        // Criando um atributo para acessar a opção de "Excluir"
        this.btnDelete = document.querySelector('#btn-delete')

        // Criando um atributo para a navegação
        this.navEL = document.querySelector('#browse-location')

                
        // Criando um método para conectar ao firebase
        this.connectFirebase();
        // Criando um método para iniciar os eventos
        this.initEvents();
        //Criando um método para abrir pastas
        this.openFolder();
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

    // Criando um método para saber os itens que estão selecionados
    getSeletion() {

        return this.listFilesEL.querySelectorAll('.selected');

    }

    removeFolderTask(ref, name, key) {

        return new Promise ((resolve, reject) => {

            let folderRef = this.getFirebaseRef(ref +  '/' + name)

            // Percorrer cada um dos itens dessa pasta
            folderRef.on('value', snapshot => {

                folderRef.off('value')

                if (snapshot.exists()) {

                    snapshot.forEach(item => {

                        let data = item.val();
                        data.key = item.key

                        if(data.type === 'folder') {

                            this.removeFolderTask(ref +  '/' + name, data.name).then(() => {

                                resolve({

                                    fields: {
                                        key: data.key
                                    }

                                })

                            }).catch(err => {

                                reject(err)

                            })

                        } else if (data.type) {

                            this.removeFile(ref +  '/' + name, data.name).then(() => {

                                resolve({

                                    fields: {
                                        key: data.key
                                    }

                                })

                            }).catch(err => {

                                reject(err)

                            })

                        }

                    })

                    folderRef.remove()

                } else{

                    this.getFirebaseRef('DropBoxClone').child(key).remove();

                }
            })
        })

    }

    removeTask() {

        // Criando o array de Promises
        let promises = [];

        this.getSeletion().forEach(li => {

            // Nesse ponto está como string, então temos que fazer um parse
            let file = JSON.parse(li.dataset.file)

            // A chave (key) não está dentro do arquivo
            let key = li.dataset.key

            // ******************* NOVO - FIREBASE **************************//

            promises.push(new Promise((resolve, reject) =>{

                // Criando um lógica para remover pastas e arquivo
                if (file.type === 'folder') {

                    this.removeFolderTask(this.currentFolder.join('/'), file.name, key).then(() => {

                        resolve({
                            fields: {
                                key
                            }
                        });

                    }).catch(err => {
    
                        reject(err);
    
                    });

                } else if (file.type) {

                    this.removeFile(this.currentFolder.join('/'), file.name).then(() => {

                        resolve({
                            fields: {
                                key
                            }
                        });
    
                    }).catch(err => {
    
                        reject(err);
    
                    });

                }

            }));

            // ******************* ANTIGO - AJAX **************************//
            // // formData: São os dados que queremos mandar para o "Node"
            // let formData = new FormData();
            // // path: nome do campo que queremos enviar
            // formData.append('path', file.path)
            // formData.append('key', key)
            // // Temos que usar o Ajax novamente para realizar a requisição
            // // Precisamos criar a nossa rota no arquivo (/routes/index.js)
            // promises.push(this.ajax('/file', 'DELETE', formData))
            // ******************* ANTIGO - AJAX **************************//

        });

        return Promise.all(promises);

    }

    // Método para remover arquivos do Storage
    removeFile(ref, file) {

        let fileRef = firebase.storage().ref(ref).child(file)

        return fileRef.delete()
    }

    // Método para Eventos Iniciais (enviar arquivos // abrir janela de seleção)
    initEvents() {

        // ************** INICIO - Criando pasta ************************//
        this.btnNewFolder.addEventListener('click', e => {

            //Gerar um propt, informando para criar uma nova pasta
            let name = prompt('Nome da nova pasta:')

            if(name) {

                this.getFirebaseRef().push().set({

                    name: name,
                    type: 'folder',
                    path: this.currentFolder.join("/")

                })

            }

        })
        // ************** FIM - Criando pasta ************************//

        // ************** INICIO - Renomenando Arquivo ************************//
        this.btnRename.addEventListener('click', e => {

            let li = this.getSeletion()[0]

            // Nesse momento estamos recebendo uma string e temos que passar para objeto JSON
            let file = JSON.parse(li.dataset.file)

            // Criando um prompt para alterar o nome do arquivo
            let name = prompt("Renomear o arquivo:", file.name)

            if(name) {

                file.name = name;

                this.getFirebaseRef().child(li.dataset.key).set(file);

            }

        })
        // ************** FIM - Renomenando Arquivo ************************//

        // ************ INICIO - Deletando o arquivo Arquivo *************//
        // Serão 2 ações
        // 1: Apagar do disco rígido: pelo nome do caminho "físico"
        // 2: Apagar do Firebase
        this.btnDelete.addEventListener('click', e => {

            // Como pode ser um ou vários. Vamos uma Promise
            this.removeTask().then(responses => {

                responses.forEach(response => {

                    if(response.fields.key) {

                        this.getFirebaseRef().child(response.fields.key).remove();

                    }

                })

            }).catch(err => {

                console.error(err)

            })

        })

        // **************** FIM - Deletando o arquivo Arquivo ******************//


        // Adicionando evento (change - element)
        this.listFilesEL.addEventListener('selectionchange', e => {

            switch(this.getSeletion().length) {

                case 0:
                    this.btnDelete.style.display = 'none'
                    this.btnRename.style.display = 'none'
                    break;

                case 1:
                    this.btnDelete.style.display = 'block'
                    this.btnRename.style.display = 'block'
                    break;

                default: 
                    this.btnDelete.style.display = 'block'
                    this.btnRename.style.display = 'none'
                    
            }

        })

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

            // Desabilitando o botão (enviar), enquanto os dados estão
            // sendo carregados
            this.btnsendfileEL.disabled = true

            // console.log(event.target.files);
            // Para importar vários arquivos
            // event.target.files são os parâmetros a serem passados
            // Nesse método uploadTask tem o retorno da Promise
            this.uploadTask(event.target.files).then(responses => {

                responses.forEach(resp => {

                    this.getFirebaseRef().push().set({

                        name: resp.name,
                        type: resp.contentType,
                        path: resp.customMetadata.downloadURL,
                        size: resp.size

                    })

                })

                this.uploadComplete();

            }).catch(err => {

                this.uploadComplete();
                console.error(err);

            })

            // Exibilindo o modal na tela // Exibindo via "css"
            this.modalShow()           

        })

    }

    // Criando um método para zerar.....
    uploadComplete() {

        // Exibilindo o modal na tela // Exibindo via "css"
        this.modalShow(false)

        // Zerando campo para poder startar o campo de novo
        this.inputFileEL.value = ''

        // Habilitando o botão (enviar), após os dados serem carregados
        this.btnsendfileEL.disabled = false

    }


    //Criando um método para pegar a referência do Firebase
    getFirebaseRef(path) {

        if(!path) path = this.currentFolder.join("/")

        return firebase.database().ref(path)


    }

    // Criando um método para exibir ou não o modal de progresso
    modalShow(show = true) {  

        //Exibilindo o modal na tela // Exibindo via "css"
        this.snackModalEL.style.display = (show) ? 'block' : 'none'
        
    }

    ajax(url, method = 'GET', formData = new FormData(), onprogress = function(){}, onloadstart = function(){}) {

        return new Promise((resolve, reject) => {

            // Para cada uma, vamos fazer a nossa soliitação assincrona Ajax para o servidor
            let ajax = new XMLHttpRequest();

            // Abrindo a nossa conexão ajax / POST, pois estamos enviadno
            ajax.open(method, url)

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
            ajax.upload.onprogress = onprogress            

            // Pegando o timestamp para fazer o cálculo de quanto tempo vai faltar
            // this.startUploadTime = Date.now();
            onloadstart();

            //Quem é enviado (a variável do formdata que foi criada)
            ajax.send(formData);

        })

    }

    // Método para receber os nossos arquivos
    // Vamos receber os arquivos como parâmetros 
    uploadTask(files) {

        // Para cada arquivo teremos uma Promise
        let promises = [];

        // Obs.: O "files" não é um array e sim uma coleção e usamos o spread (espalhar)
        // Spread: Pega a coleção e transforma num array
        [...files].forEach(file => {

            // ************************ Novo - Usando o Firebase Storage *****************//
            
            promises.push(new Promise((resolve, reject) => {

                 // Vamos criar uma referência para salvar o arquivo no Storage do Firebase
                // Usamos o join aqui para transformar o array em string            
                let fileRef = firebase.storage().ref(this.currentFolder.join('/')).child(file.name)

                // Método put() para fazer o upload
                let task = fileRef.put(file)

                // task.on('state_changed', progress, error, resolve)
                task.on('state_changed', snapshot => {

                    this.uploadProgress({

                        loaded: snapshot.bytesTransferred,
                        total: snapshot.totalBytes

                    }, file)}, error => {
                    
                        console.error(error)
                        reject(error)

                        }, () => {
 
                            task.snapshot.ref.getDownloadURL().then( downloadURL => {
                    
                                task.snapshot.ref.updateMetadata({ customMetadata: { downloadURL }}).then( metadata => {
                    
                                    resolve( metadata )
                    
                            }).catch( error => {
                    
                                console.error( 'Error update metadata:', error)
                                reject( error ) 

                            })

                    })
                })
            
            }))
            // ************************ Antigo - Usavamos o Ajax ************************//
            // let formData = new FormData()
            // formData.append('input-file', file)
            // // Usando a promese do Ajax
            // // ajax('url', 'method', formData, onprogress , onloadstart )
            // /* O que eu quero fazer conforme ele for atualizando */ 
            // /* Assim que ele iniciar o upload, o que eu quero que ele faça */
            // promises.push(this.ajax('/upload', 'POST', formData, () => {
            //     this.uploadProgress(event, file)
            //     }, () => {
            //         this.startUploadTime = Date.now()
            // }))
            // *********************************************************************//

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

    // Criando um método para tratar o ícone
    getFileIconView(file) {

        switch (file.type) {

            case 'folder':
                return `
                    <svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon">
                        <title>content-folder-large</title>
                        <g fill="none" fill-rule="evenodd">
                            <path d="M77.955 53h50.04A3.002 3.002 0 0 1 131 56.007v58.988a4.008 4.008 0 0 1-4.003 4.005H39.003A4.002 4.002 0 0 1 35 114.995V45.99c0-2.206 1.79-3.99 3.997-3.99h26.002c1.666 0 3.667 1.166 4.49 2.605l3.341 5.848s1.281 2.544 5.12 2.544l.005.003z" fill="#71B9F4"></path>
                            <path d="M77.955 52h50.04A3.002 3.002 0 0 1 131 55.007v58.988a4.008 4.008 0 0 1-4.003 4.005H39.003A4.002 4.002 0 0 1 35 113.995V44.99c0-2.206 1.79-3.99 3.997-3.99h26.002c1.666 0 3.667 1.166 4.49 2.605l3.341 5.848s1.281 2.544 5.12 2.544l.005.003z" fill="#92CEFF"></path>
                        </g>
                    </svg>
                `;
                break;

            case 'application/pdf':
                return `
                    <svg version="1.1" id="Camada_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="160px" height="160px" viewBox="0 0 160 160" enable-background="new 0 0 160 160" xml:space="preserve">
                        <filter height="102%" width="101.4%" id="mc-content-unknown-large-a" filterUnits="objectBoundingBox" y="-.5%" x="-.7%">
                            <feOffset result="shadowOffsetOuter1" in="SourceAlpha" dy="1"></feOffset>
                            <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1">
                            </feColorMatrix>
                        </filter>
                        <title>PDF</title>
                        <g>
                            <g>
                                <g filter="url(#mc-content-unknown-large-a)">
                                    <path id="mc-content-unknown-large-b_2_" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47c-2.209,0-4-1.791-4-4V34
                                            C43,31.791,44.791,30,47,30z"></path>
                                </g>
                                <g>
                                    <path id="mc-content-unknown-large-b_1_" fill="#F7F9FA" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47
                                            c-2.209,0-4-1.791-4-4V34C43,31.791,44.791,30,47,30z"></path>
                                </g>
                            </g>
                        </g>
                        <path fill-rule="evenodd" clip-rule="evenodd" fill="#F15124" d="M102.482,91.479c-0.733-3.055-3.12-4.025-5.954-4.437
                                c-2.08-0.302-4.735,1.019-6.154-0.883c-2.167-2.905-4.015-6.144-5.428-9.482c-1.017-2.402,1.516-4.188,2.394-6.263
                                c1.943-4.595,0.738-7.984-3.519-9.021c-2.597-0.632-5.045-0.13-6.849,1.918c-2.266,2.574-1.215,5.258,0.095,7.878
                                c3.563,7.127-1.046,15.324-8.885,15.826c-3.794,0.243-6.93,1.297-7.183,5.84c0.494,3.255,1.988,5.797,5.14,6.825
                                c3.062,1,4.941-0.976,6.664-3.186c1.391-1.782,1.572-4.905,4.104-5.291c3.25-0.497,6.677-0.464,9.942-0.025
                                c2.361,0.318,2.556,3.209,3.774,4.9c2.97,4.122,6.014,5.029,9.126,2.415C101.895,96.694,103.179,94.38,102.482,91.479z
                                M67.667,94.885c-1.16-0.312-1.621-0.97-1.607-1.861c0.018-1.199,1.032-1.121,1.805-1.132c0.557-0.008,1.486-0.198,1.4,0.827
                                C69.173,93.804,68.363,94.401,67.667,94.885z M82.146,65.949c1.331,0.02,1.774,0.715,1.234,1.944
                                c-0.319,0.725-0.457,1.663-1.577,1.651c-1.03-0.498-1.314-1.528-1.409-2.456C80.276,65.923,81.341,65.938,82.146,65.949z
                                M81.955,86.183c-0.912,0.01-2.209,0.098-1.733-1.421c0.264-0.841,0.955-2.04,1.622-2.162c1.411-0.259,1.409,1.421,2.049,2.186
                                C84.057,86.456,82.837,86.174,81.955,86.183z M96.229,94.8c-1.14-0.082-1.692-1.111-1.785-2.033
                                c-0.131-1.296,1.072-0.867,1.753-0.876c0.796-0.011,1.668,0.118,1.588,1.293C97.394,93.857,97.226,94.871,96.229,94.8z"></path>
                    </svg>
                `;
                break;

            case 'audio/mp3':
            case 'audio/ogg':
                return `
                    <svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon">
                        <title>content-audio-large</title>
                        <defs>
                            <rect id="mc-content-audio-large-b" x="30" y="43" width="100" height="74" rx="4"></rect>
                            <filter x="-.5%" y="-.7%" width="101%" height="102.7%" filterUnits="objectBoundingBox" id="mc-content-audio-large-a">
                                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                                <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix>
                            </filter>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <g>
                                <use fill="#000" filter="url(#mc-content-audio-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-audio-large-b"></use>
                                <use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-audio-large-b"></use>
                            </g>
                            <path d="M67 60c0-1.657 1.347-3 3-3 1.657 0 3 1.352 3 3v40c0 1.657-1.347 3-3 3-1.657 0-3-1.352-3-3V60zM57 78c0-1.657 1.347-3 3-3 1.657 0 3 1.349 3 3v4c0 1.657-1.347 3-3 3-1.657 0-3-1.349-3-3v-4zm40 0c0-1.657 1.347-3 3-3 1.657 0 3 1.349 3 3v4c0 1.657-1.347 3-3 3-1.657 0-3-1.349-3-3v-4zm-20-5.006A3 3 0 0 1 80 70c1.657 0 3 1.343 3 2.994v14.012A3 3 0 0 1 80 90c-1.657 0-3-1.343-3-2.994V72.994zM87 68c0-1.657 1.347-3 3-3 1.657 0 3 1.347 3 3v24c0 1.657-1.347 3-3 3-1.657 0-3-1.347-3-3V68z" fill="#637282"></path>
                        </g>
                    </svg>
                `;
                break;

            case 'video/mp4':
            case 'video/quicktime':
                return `
                    <svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon">
                        <title>content-video-large</title>
                        <defs>
                            <rect id="mc-content-video-large-b" x="30" y="43" width="100" height="74" rx="4"></rect>
                            <filter x="-.5%" y="-.7%" width="101%" height="102.7%" filterUnits="objectBoundingBox" id="mc-content-video-large-a">
                                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                                <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix>
                            </filter>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <g>
                                <use fill="#000" filter="url(#mc-content-video-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-video-large-b"></use>
                                <use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-video-large-b"></use>
                            </g>
                            <path d="M69 67.991c0-1.1.808-1.587 1.794-1.094l24.412 12.206c.99.495.986 1.3 0 1.794L70.794 93.103c-.99.495-1.794-.003-1.794-1.094V67.99z" fill="#637282"></path>
                        </g>
                    </svg>
                `;
                break;
            
            case 'image/jpeg':
            case 'image/jpg':
            case 'image/png':
            case 'image/gif':
                return `                
                    <svg version="1.1" id="Camada_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="160px" height="160px" viewBox="0 0 160 160" enable-background="new 0 0 160 160" xml:space="preserve">
                        <filter height="102%" width="101.4%" id="mc-content-unknown-large-a" filterUnits="objectBoundingBox" y="-.5%" x="-.7%">
                            <feOffset result="shadowOffsetOuter1" in="SourceAlpha" dy="1"></feOffset>
                            <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1">
                            </feColorMatrix>
                        </filter>
                        <title>Imagem</title>
                        <g>
                            <g>
                                <g filter="url(#mc-content-unknown-large-a)">
                                    <path id="mc-content-unknown-large-b_2_" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47c-2.209,0-4-1.791-4-4V34
                                            C43,31.791,44.791,30,47,30z"></path>
                                </g>
                                <g>
                                    <path id="mc-content-unknown-large-b_1_" fill="#F7F9FA" d="M47,30h66c2.209,0,4,1.791,4,4v92c0,2.209-1.791,4-4,4H47
                                            c-2.209,0-4-1.791-4-4V34C43,31.791,44.791,30,47,30z"></path>
                                </g>
                            </g>
                        </g>
                        <g>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M81.148,62.638c8.086,0,16.173-0.001,24.259,0.001
                                    c1.792,0,2.3,0.503,2.301,2.28c0.001,11.414,0.001,22.829,0,34.243c0,1.775-0.53,2.32-2.289,2.32
                                    c-16.209,0.003-32.417,0.003-48.626,0c-1.775,0-2.317-0.542-2.318-2.306c-0.002-11.414-0.003-22.829,0-34.243
                                    c0-1.769,0.532-2.294,2.306-2.294C64.903,62.637,73.026,62.638,81.148,62.638z M81.115,97.911c7.337,0,14.673-0.016,22.009,0.021
                                    c0.856,0.005,1.045-0.238,1.042-1.062c-0.028-9.877-0.03-19.754,0.002-29.63c0.003-0.9-0.257-1.114-1.134-1.112
                                    c-14.637,0.027-29.273,0.025-43.91,0.003c-0.801-0.001-1.09,0.141-1.086,1.033c0.036,9.913,0.036,19.826,0,29.738
                                    c-0.003,0.878,0.268,1.03,1.069,1.027C66.443,97.898,73.779,97.911,81.115,97.911z"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M77.737,85.036c3.505-2.455,7.213-4.083,11.161-5.165
                                    c4.144-1.135,8.364-1.504,12.651-1.116c0.64,0.058,0.835,0.257,0.831,0.902c-0.024,5.191-0.024,10.381,0.001,15.572
                                    c0.003,0.631-0.206,0.76-0.789,0.756c-3.688-0.024-7.375-0.009-11.062-0.018c-0.33-0.001-0.67,0.106-0.918-0.33
                                    c-2.487-4.379-6.362-7.275-10.562-9.819C78.656,85.579,78.257,85.345,77.737,85.036z"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M87.313,95.973c-0.538,0-0.815,0-1.094,0
                                    c-8.477,0-16.953-0.012-25.43,0.021c-0.794,0.003-1.01-0.176-0.998-0.988c0.051-3.396,0.026-6.795,0.017-10.193
                                    c-0.001-0.497-0.042-0.847,0.693-0.839c6.389,0.065,12.483,1.296,18.093,4.476C81.915,90.33,84.829,92.695,87.313,95.973z"></path>
                            <path fill-rule="evenodd" clip-rule="evenodd" fill="#848484" d="M74.188,76.557c0.01,2.266-1.932,4.223-4.221,4.255
                                    c-2.309,0.033-4.344-1.984-4.313-4.276c0.03-2.263,2.016-4.213,4.281-4.206C72.207,72.338,74.179,74.298,74.188,76.557z"></path>
                        </g>
                    </svg>                  
                `;
                break;

            default:
                return `
                    <svg width="160" height="160" viewBox="0 0 160 160" class="mc-icon-template-content tile__preview tile__preview--icon">
                        <title>1357054_617b.jpg</title>
                        <defs>
                            <rect id="mc-content-unknown-large-b" x="43" y="30" width="74" height="100" rx="4"></rect>
                            <filter x="-.7%" y="-.5%" width="101.4%" height="102%" filterUnits="objectBoundingBox" id="mc-content-unknown-large-a">
                                <feOffset dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
                                <feColorMatrix values="0 0 0 0 0.858823529 0 0 0 0 0.870588235 0 0 0 0 0.88627451 0 0 0 1 0" in="shadowOffsetOuter1"></feColorMatrix>
                            </filter>
                        </defs>
                        <g fill="none" fill-rule="evenodd">
                            <g>
                                <use fill="#000" filter="url(#mc-content-unknown-large-a)" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-unknown-large-b"></use>
                                <use fill="#F7F9FA" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#mc-content-unknown-large-b"></use>
                            </g>
                        </g>
                    </svg>
                `;

        }

    }

    
    // Criando um método para retornar o HTML
    // Esse método é para organizar as nossas arquivos por tipo
    getFileView(file, key) {

        let li = document.createElement('li')

        li.dataset.key = key

        // Como o file é um objeto e só conseguimos guardar string,
        // Temos que fazer a conversão
        li.dataset.file = JSON.stringify(file)

        li.innerHTML  = 
            `
                ${this.getFileIconView(file)}
                <div class='name text-center'>${file.name}</div>
            `;

        this.initEventsLi(li);

        return li;
    }

    //Criando um método para listar os dados do Firebase
    readFiles() {

        // A última pasta atual é a pasta que vc está acessando agora
        this.lastFolder = this.currentFolder.join('/')

        // No Firebase (ferramenta do banco), ele fica monitorando 
        // se houve mudança, e ELE que te informa se houve ou não
        // getFirebaseRef() => Para pegar as nossas referencias
        // on() => para ficar monitorando o evento
        // 'value' => no firebase é considerado um "evento"
        this.getFirebaseRef().on('value', snapshot => {

            // Limpando o HTML pela primeira vez
            this.listFilesEL.innerHTML = '';

            // Como a nossa referencia é uma coleção, podemos fazer um forEach
            snapshot.forEach(snapshotItem => {

                let key = snapshotItem.key //Key é uma propriedade
                let data = snapshotItem.val(); // val() é um método

                // Fazendo uma validação para saber se no 
                // data existe os campo (type), para diferenciar pastas de arquivos
                if(data.type) {

                    // console.log(key, data)

                    // appendChild: criando/adiciona um elemento filho
                    // Obs.: não adiciona texto e sim hum elemento
                    this.listFilesEL.appendChild(this.getFileView(data, key))

                }

            })

        })

    }

    // Criando o método que abre a pasta
    openFolder() {

        // Temos que parar de "ouvir" os eventos de pastas anteriores
        if(this.lastFolder) this.getFirebaseRef(this.lastFolder).off('value')

        // Chamando um método de renderização (nagevação)
        this.renderNav();

        // Dentro da pasta, precisamos ler os arquivos dessa pasta
        // Chamando o método para listar os item do Firebase
        this.readFiles();

    }

    renderNav() {

        // Criando o objeto de navegação
        let nav = document.createElement('nav')

        // Variável para salvar o caminho das pastas
        let path = []

        for(let i = 0; i < this.currentFolder.length; i++) {

            let folderName = this.currentFolder[i]
            let span = document.createElement('span') 

            // Populando o array com o caminho das pastas
            // push para adicionar a última pasta no final do array
            path.push(folderName);

            // Verificando se é a ultima pasta ou não
            if((i + 1) === this.currentFolder.length) {

                span.innerHTML = folderName;

            } else {

                span.className = 'breadcrumb-segment__wrapper'
                span.innerHTML = `
                    <span class="ue-effect-container uee-BreadCrumbSegment-link-0">
                    <a href="#" data-path="${path.join("/")}" class="breadcrumb-segment">${folderName}</a>
                    </span>
                    <svg width="24" height="24" viewBox="0 0 24 24" class="mc-icon-template-stateless" style="top: 4px; position: relative;">
                    <title>arrow-right</title>
                    <path d="M10.414 7.05l4.95 4.95-4.95 4.95L9 15.534 12.536 12 9 8.464z" fill="#637282" fill-rule="evenodd"></path>
                    </svg> 
                `;

            }

            // O "appendChild" so recebe "nós"
            nav.appendChild(span)

        }

        this.navEL.innerHTML = nav.innerHTML;

        // Pegando o links de navegação
        this.navEL.querySelectorAll('a').forEach(a => {

            a.addEventListener('click', e => {

                e.preventDefault();

                // O currentFolder espera um array
                // e nesse momento está vindo uma string
                this.currentFolder = a.dataset.path.split('/')
                
                this.openFolder()

            })

        })

    }

    // Criando um método para pegar o arquivo (li)
    // selecionado
    initEventsLi(li) {

        // Configurando duplo click ('dblclick) para acesso a pastas
        // ou para abrir arquivos
        li.addEventListener('dblclick', e => {

            // console.log("Entrei no modo do duplo click")

            // Pegando informação lo "li" para saber se é um pasta ou um arquivo
            // Como a informação vem num json, temos que fazer o parse
            let file = JSON.parse(li.dataset.file)

            switch (file.type) {

                case 'folder':
                    // Sendo uma pasta, fazer um push do nome da pasta
                    this.currentFolder.push(file.name )
                    // Método para abrir a pasta
                    this.openFolder()
                    // console.log(file.type)
                    break;

                // Default pega qualquer outro tipo de arquivo
                default:
                    window.open(file.path)

            }

        })


        li.addEventListener('click', e => {

            // Vamos implementar a lógica de Ctrol / Shift

            // Lógica: Se não estiver com o "ctrol apertado"
            // remove todas as marcações e marca a que clicamos
            if(e.shiftKey) {

                // Obtendo os índices dos "li's" clicados
                // Obs.: O querySelector só irá pegar o primeiro elemento encontrado
                let firstLi = this.listFilesEL.querySelector('.selected');

                // console.log(firstLi)
                if(firstLi) {

                    let indexStart, indexEnd
                    let lis = li.parentElement.childNodes

                    // console.log(firstLi)
                    // console.log(li)

                    // Para obter a lista dos "li's", temos que acessar o 
                    // elemento "pai", do "li"
                    lis.forEach((el, index) => {

                        if(firstLi === el) indexStart = index;
                        if(li === el) indexEnd = index;

                    })

                    let index = [indexStart, indexEnd].sort();

                    // console.log(indexStart)
                    // console.log(indexEnd)
                    // console.log(index)

                    lis.forEach((el, i) => {

                        if(i >= index[0] && i<= index[1]) {

                            el.classList.add('selected')

                        }

                    })

                    // Atributo para despachar estado de mundança
                    this.listFilesEL.dispatchEvent(this.onselectionchange);

                    return true
                    
                }

            }

            // Lógica: Se não estiver com o "ctrol apertado"
            // remove todas as marcações e marca a que clicamos
            if(!e.ctrlKey){

                this.listFilesEL.querySelectorAll('li.selected').forEach(el => {

                    el.classList.remove('selected')

                })

            }

            // Vamos alterar a classe "selected" que já existe no css
            li.classList.toggle('selected')
            // console.log('selected')

            // Atributo para despachar estado de mundança
            this.listFilesEL.dispatchEvent(this.onselectionchange);

        })

    }

}