const dbExemplo = require('../db/dbConnect.js')

// CRUD PARA CADA CLASSE DA TABELA
class Exemplo {


    //CREATE
    //==============================================================================
    static async createExemplo(dados){

        const { campo1, campo2, campo3 } = dados
        // debug da função
        console.log('mainModel.js','Exemplo.createExemplo()')
        console.log(arguments);


        return await dbExemplo.executarQuery(
            'INSERT INTO tabelaExemplo(campo1, campo2, campo3) VALUES (?, ?, ?)',
            [campo1, campo2, campo3]
        )

    }        

    //READ
    //==============================================================================
    static async readAllExemplos(){
        
        // debug da função
        console.log('mainModel.js','Exemplo.readAllExemplos');
        console.log(arguments);


        return await dbExemplo.executarQuery('SELECT * FROM tabelaExemplo');
    }


    static async readExemplos(filtros = {}){

        // debug da função
        console.log('mainModel.js','Exemplo.readExemplos()')
        console.log(arguments);


        const {id_exemplo,campo1,campo2,campo3} = filtros
 
        var query = 'SELECT * FROM tabelaExemplo WHERE '
        query+= 'id_exemplo LIKE ? '
        query+= 'AND campo1 LIKE ? '
        query+= 'AND campo2 LIKE ? '
        query+= 'AND campo3 LIKE ? '
        

        return  await dbExemplo.executarQuery(query,[`%${id_exemplo||''}%`, `%${campo1||''}%`,`%${campo2||''}%`,`%${campo3||''}%`])
    }

    static async readExemplo(id){

        // debug da função
        console.log('mainModel.js','Exemplo.readExemplo()')
        console.log(arguments);

        return await dbExemplo.executarQuery('SELECT * FROM tabelaExemplo where id_exemplo = ?',[id]);

    }

    //UPDATE
    //==============================================================================
    static async updateExemplo(id,dados = {}){
        
        // debug da função
        console.log('mainModel.js','Exemplo.updateExemplo()')
        console.log(arguments);

        const {campo1,campo2,campo3} = dados

        const query = 'UPDATE tabelaExemplo SET campo1 = ?, campo2 = ?, campo3 = ? WHERE id_exemplo = ?';

        return dbExemplo.executarQuery(query,[campo1,campo2,campo3, id]);
    }

    
    //DELETE
    //==============================================================================
    static async deleteExemplo(id){
        
        // debug da função
        console.log('mainModel.js','Exemplo.deleteExemplo()')
        console.log(arguments);

        return await dbExemplo.executarQuery('DELETE FROM tabelaExemplo where id_exemplo = ?',[id]);
    }


}

module.exports = Exemplo;