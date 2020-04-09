var express = require('express');
var router = express.Router();

// Importando a API Formidable
var formidable = require('formidable')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

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