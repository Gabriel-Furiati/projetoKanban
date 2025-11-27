const express = require('express');
const app = express();

//importação de rotas
const mainRoutes = require('./routes/mainRoutes'); 

//variáveis de ambiente
require('dotenv').config();


// configurações iniciais
app.set('views', './views');
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const porta = Number(process.env.PORTA) || 3000


//rotas principais da aplicação
app.use('/',mainRoutes);

// Rota de erro
app.use((req, res) => {
  res.status(404).render('erro404',{titulo:'rota não encontrada'});
});

app.listen(porta, () => {
    console.log('Servidor rodando');
    console.log('Endereco: http://localhost:'+porta);
});