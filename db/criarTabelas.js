// db/criarTabelas.js
// Script para criar/atualizar o schema do banco (adiciona coluna Titulo e ajusta TAREFA)
// Execute: node db/criarTabelas.js
require('dotenv').config();
const { executarQuery } = require('./dbConnect');

async function criarTabelas() {
  try {
    console.log('Iniciando verificação/atualização do schema...');

    // 1) Criar tabela USUARIO se não existir
    await executarQuery(`
      CREATE TABLE IF NOT EXISTS USUARIO (
        Id_usuario SMALLINT AUTO_INCREMENT PRIMARY KEY,
        Nome_usuario VARCHAR(60) NOT NULL,
        Email_usuario VARCHAR(100) NOT NULL UNIQUE
      );
    `);
    console.log('Tabela USUARIO verificada/criada.');

    // 2) Criar tabela TAREFA se não existir (com coluna Titulo já inclusa)
    await executarQuery(`
      CREATE TABLE IF NOT EXISTS TAREFA (
        Id_tarefa SMALLINT AUTO_INCREMENT PRIMARY KEY,
        Titulo VARCHAR(255),
        Descricao TEXT NOT NULL,
        Setor VARCHAR(100),
        Data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
        Status ENUM('A Fazer','Fazendo','Feito') DEFAULT 'A Fazer',
        Prioridade ENUM('Baixa','Média','Alta') DEFAULT 'Média',
        FK_USUARIO_Id_usuario SMALLINT,
        INDEX idx_fk_usuario (FK_USUARIO_Id_usuario)
      );
    `);
    console.log('Tabela TAREFA verificada/criada (com coluna Titulo).');

    
    await executarQuery(`
        ALTER TABLE TAREFA
        ADD CONSTRAINT FK_TAREFA_USUARIO
        FOREIGN KEY (FK_USUARIO_Id_usuario)
        REFERENCES USUARIO(Id_usuario)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    `);

    console.log('Constraint FK_TAREFA_USUARIO criada com sucesso ');
  
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  } finally {
    process.exit(); 
  }
}    

criarTabelas();
