# Projeto Base com MariaDB

Este projeto deve ser usado como ponto de partida para criar o projeto que você vai entregar para o professor. 

# Pré-requisitos

1. O ambiente node deve estar instalado. Se ainda não está instalado baixe o ambiente e instale em https://nodejs.org/pt

2. MariaDB: Para este projeto é necessário acesso a um SGBD MariaDB instalado localmente ou configurado na nuvem. Configure o acesso no arquivo .env

# Instalação do projeto


1. Baixe este projeto usando degit

`npx degit josuemrosario/<repositorio> <pasta>`


| TROQUE | POR |
|----------|----------|
| `<repositorio>` | nome do repositorio que sera usado como base (este por exemplo)|
| `<pasta>` | Nome da pasta do seu projeto que será criada automaticamente |

2. Instale todas as dependencias

```
npm i
```

3. Faça uma copia do arquivo .env.example e renomeie para .env

obs: Guarde o arquivo .env em local seguro. Este arquivo não será enviado ao github e precisa ser recriado todas as vezes em que o projeto for baixado do gihub

4. Altere as configurações do arquivo .env

| VARIAVEL | DESCRIÇÃO |
|----------|----------|
|PORTA |Porta em que a aplicação vai rodar|
|DBHOST | Local onde seu banco está roando. defina como localhost quando estiver rodando local |
|DBUSER | Usuário do Banco |
|DBNAME | nome do banco |
|DBPASS | Senha para acesso ao banco |


5. Rode o projeto

```
npm run dev
```

6. Configure o Git/Github

O projeto é baixado sem a configuração do git ou github portanto será necessário criar o repositório local(git) e remoto(github) além de subir as atualizações.

## Algumas informações para uso do projeto

Use a pasta docs para colocar todos os documentos relativos ao seu projeto tais como :
- Diagrama de classe
- Dicionario de dados
- Modelo conceitual
- Scripts de criação do banco
- Trabalho de conclusão de curso

## Tecnologias utilizadas/configuradas neste projeto

* node
* Javascript
* HTML/CSS
* Express
* MariaDB
* ejs