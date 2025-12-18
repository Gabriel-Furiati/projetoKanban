// index.js
const path = require('path');
const express = require('express');
const mainRoutes = require('./routes/mainRoutes');
require('dotenv').config();

const app = express();

// --- COLE ISSO AQUI PARA TESTAR ---
console.log('--- DIAGNÓSTICO ---');
console.log('Pasta atual (__dirname):', __dirname);
console.log('Onde o servidor busca a pasta public:', path.join(__dirname, 'public'));
console.log('---------------------');
// ----------------------------------

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', mainRoutes);

// rota 404 com fallback seguro
app.use((req, res) => {
  try {
    return res.status(404).render('erro404', { titulo: 'Rota não encontrada' });
  } catch (err) {
    console.error('Erro ao renderizar erro404:', err);
    return res.status(404).send('Rota não encontrada');
  }
});

if (require.main === module) {
  const PORT = process.env.PORTA || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse em: http://localhost:${PORT}`);
  });
}

module.exports = app;
