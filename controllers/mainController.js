const Exemplo = require('../models/mainModel.js')

const mostraPaginaInicial = (req, res) => {

    console.log('mainController.js','mostraPaginaInicial()')

    // Este exemplo pode ser usado para testar o envio de dados direto (hardcoded) para a view
    //===================================================================================================================================
    // dados = {
    //     mensagem:'rota raiz', 
    //     titulo:'pagina principal',

    //     // É possível enviar dados diretamente para testes da view sem precisar consultar o banco
    //     exemplos:[ 
    //         {
    //             campo1: 'L1 - Dados 1',
    //             campo2: 'L1 - Dados 2',
    //             campo3: 'L1 - Dados 3',
    //         },
    //         {
    //             campo1: 'L2 - Dados 1',
    //             campo2: 'L2 - Dados 2',
    //             campo3: 'L2 - Dados 3',
    //         }            
    //     ]
    // }
    
    // res.render('main', { dados:dados})


    // Este exemplo pode ser usado para pesquisar usando termos específicos. Por exemplo quando tempos campos de pesquisa
    //===================================================================================================================================
    // Exemplo.readExemplos({campo1:'teste'}).then(
    //     (dadosdb) => {

    //         dados = {
    //             mensagem:'rota raiz', 
    //             titulo:'pagina principal',

    //             // É possível enviar dados diretamente para testes da view sem precisar consultar o banco
    //             exemplos: dadosdb
    //         }
            
    //         res.render('main', { dados})
    //     }
    // )



    // Busca os dados no banco
    Exemplo.readAllExemplos().then(
        (dadosdb) => {

            dados = {
                mensagem:'rota raiz', 
                titulo:'pagina principal',

                // É possível enviar dados diretamente para testes da view sem precisar consultar o banco
                exemplos: dadosdb
            }
            
            res.render('main', { dados})
        }
    )
    
}


const mostraPaginaCadastrar = (req, res) => {

    console.log('mainController.js','mostraPaginaCadastrar()')

    dados = {
        mensagem:'rota cadastrar', 
        titulo:'Cadastrar exemplo',
    }

    res.render('cadastrar', { dados:dados})

}

// chamado a partir da rota GET /cadastrar
const  mostraPaginaAlterar = (req, res) => {

    console.log('mainController.js','mostraPaginaAlterar()')

    const id = req.params.id;

    let dados

    dados = {
                mensagem:'rota cadastrar', 
                titulo:'Cadastrar exemplo',
    }

    Exemplo.readExemplo(id).then(
        (dadosdb) => {
            dados.exemplo = dadosdb[0]
            res.render('cadastrar', {dados})
        }
    )
     
}


// chamado a partir da rota POST /cadastrar
const  cadastrarExemplo = (req, res) => {
    
    console.log('mainController.js','cadastrarExemplo()')
    const dados = req.body;
    console.log('Dados no body: ',dados)

    Exemplo.createExemplo(dados)

    return res.redirect('/')

}


const  alterarExemplo = (req, res) => {

    console.log('mainController.js','alterarExemplo()')
    const dados = req.body;

    Exemplo.updateExemplo(dados.id_exemplo,dados)

    return res.redirect('/')

}

const  excluirExemplo = (req, res) => {

    console.log('mainController.js','alterarExemplo()')
    const id = req.params.id;

    Exemplo.deleteExemplo(id)
    
    return res.send('dados excluidos com sucesso')

}

module.exports =  {
    mostraPaginaInicial,
    mostraPaginaCadastrar,
    mostraPaginaAlterar,
    cadastrarExemplo,
    alterarExemplo,
    excluirExemplo,
};