// Use este arquivo para criar as tabelas do seu banco.
// O banco deve ser criado manualmente, este script não cria o banco.
// Esse script depende da configuração do arquivo .env

require('dotenv').config();
const { executarQuery } = require('./dbConnect');

async function criarTabelas() {
  try {
    console.log('Criando tabelas...');

    // Este codigo é responsavel por criar uma nova tabela
    // Se for criar uma nova tabela duplique este código e coloque sua tabela
    await executarQuery(`
      CREATE TABLE IF NOT EXISTS tabelaExemplo(
        id_exemplo INT AUTO_INCREMENT PRIMARY KEY,
        campo1 VARCHAR(100),
        campo2 VARCHAR(100),
        campo3 VARCHAR(100)
      );
    `);
    

   // Tenha cuidado porque a ordem de criação é importante
   // Se a tabela A possui uma foreing key para a tabela B
   // entao a tabela B deve ser criada antes da tabela A

    console.log('Tabelas criadas/verificadas com sucesso!');
  } catch (err) {
    console.error('Erro ao criar tabelas:', err);
  } finally {
    process.exit(); 
  }
}

criarTabelas();


 HEAD

/*
Criação da tabela USUARIO
CREATE TABLE USUARIO (
    Id_usuario SMALLINT auto_increment PRIMARY KEY,
    Nome_usuario VARCHAR (60) not null,
    Email_usuario VARCHAR (61) not null
);

Criação da tabela TAREFA
CREATE TABLE TAREFA (
    Id_tarefa SMALLINT auto_increment PRIMARY KEY,
    Descricao VARCHAR (80) not null,
    Setor VARCHAR (5) not null,
    Data_cadastro DATE 10,
    Status CHAR ENUM('A Fazer','Fazendo','Feito'),
    Prioridade CHAR ENUM('Baixa','Média','Alta'),
    FK_USUARIO_Id_usuario SMALLINT
);

Adicionando a restrição de chave estrangeira (FK) na tabela TAREFA
ALTER TABLE TAREFA ADD CONSTRAINT FK_TAREFA_2
    FOREIGN KEY (FK_USUARIO_Id_usuario)
    REFERENCES USUARIO (Id_usuario)
    ON DELETE CASCADE;
*/

/*
-- 1. Tabela de USUÁRIOS

CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE
);

-- 2. Tabela de TAREFAS

CREATE TABLE IF NOT EXISTS tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,           -- Vinculo com o usuário (Foreign Key)
    descricao TEXT NOT NULL,           -- No documento pede 'descrição', não título
    setor VARCHAR(100) NOT NULL,       -- Nome do setor (Ex: "Qualidade", "Produção")
    prioridade VARCHAR(20) NOT NULL,   -- Baixa, Média, Alta
    data_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'a_fazer', -- Padrão: "A Fazer"
    
    CONSTRAINT fk_usuario FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
);


*/
