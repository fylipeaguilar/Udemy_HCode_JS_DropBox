var express = require('express');
var router = express.Router();

// Importando a API Formidable
var formidable = require('formidable')

// Módulo nativo do Node
// fs: file system
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/file', (req, res) => {

  let path = './' + req.query.path;

  if (fs.existsSync(path)) {

    fs.readFile(path, (err, data) => {

      if(err) {

        console.error(err)
        res.status(400).json({

          error: err

        })

      } else {

        res.status(200).end(data);
        
      }

    })

  } else {

    res.status(404).json({

      error: 'File not found'

    })

  }

})

router.delete('/file', (req, res) => {

  // Usando a API Formidable: usando a classe que tem dentro do formidable
  // Metodo: IncomingForm, que chama o formulário
  let form = new formidable.IncomingForm({

    // Ele recebe alguns parâmetros
    uploadDir: './upload',
    // Para manter a extensão do arquivo 
    keepExtensions: true

  })
  
  form.parse(req, (err, fields, files)=>{

    let path = "./" + fields.path

    // Primeiro vamos verificar se o arquivo existe na pasta
    // existsSync() = método nativo
    if(fs.existsSync(path)) {

      //fs.unlink() = método para remover arquivo físico
      fs.unlink(path, err => {

        if(err) {

          // Erro 400 = request inválido
          res.status(400).json({

            err

          });

        } else {

            // Respostado do JSON para os nossos dados 
            res.json({
      
            fields,

          })

        } 

      })

    } else {

      res.status(404).json({
  
        error: 'File not found'
  
      })
  
    }

  })

})

router.post('/upload', (req, res) => {

  // Usando a API Formidable: usando a classe que tem dentro do formidable
  // Metodo: IncomingForm, que chama o formulário
  let form = new formidable.IncomingForm({

    // Ele recebe alguns parâmetros
    uploadDir: './upload',
    // Para manter a extensão do arquivo 
    keepExtensions: true

  })
  
  form.parse(req, (err, fields, files)=>{

    // Respostado do JSON para os nossos dados 
    res.json({
      files: files,

    })

  })

})

module.exports = router;