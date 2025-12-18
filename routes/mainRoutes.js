// routes/mainRoutes.js
const express = require('express');
const mainController = require('../controllers/mainController.js');
const router = express.Router();

// ROTAS DE PÁGINA
router.get('/', mainController.mostraPaginaInicial);
router.get('/novo-usuario', mainController.mostraPaginaNovoUsuario);
router.get('/nova-tarefa', mainController.mostraPaginaNovaTarefa);

// ROTAS DE USUÁRIO (API)
router.get('/api/usuarios', mainController.listarUsuarios);
router.post('/api/usuarios', mainController.criarUsuario);

// ROTAS DE TAREFA (API)
router.get('/api/tarefas', mainController.listarTarefas);
router.post('/api/tarefas', mainController.criarTarefa);
router.put('/api/tarefas/:id', mainController.atualizarTarefa);
router.delete('/api/tarefas/:id', mainController.deletarTarefa);

module.exports = router;
