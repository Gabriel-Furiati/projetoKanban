const express = require('express');
const mainController = require('../controllers/mainController.js');
const router = express.Router();

// router.get('/', mainController.mostraPaginaInicial);

// router.get('/cadastrar', mainController.mostraPaginaCadastrar);
// router.post('/cadastrar', mainController.cadastrarExemplo);

// router.get('/alterarexemplo/:id', mainController.mostraPaginaAlterar);
// router.post('/alterarexemplo/', mainController.alterarExemplo);

// router.get('/excluirexemplo/:id', mainController.excluirExemplo);

router.get('/', mainController.mostraPaginaInicial);
router.get('/novousuario', mainController.mostraPaginaNovoUsuario);
router.get('/novatarefa', mainController.mostraPaginaNovaTarefa);

module.exports = router;



