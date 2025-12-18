const db = require('../db/dbConnect.js')

// ============================================================================
//  MODEL USUARIO
// ============================================================================
class Usuario {

    // CREATE
    // --------------------------------------------------------------------------
    static async createUsuario(dados) {

        const { Nome_usuario, Email_usuario } = dados;
        console.log('mainModel.js', 'Usuario.createUsuario()');
        console.log(arguments);

        return await db.executarQuery(
            'INSERT INTO usuario (Nome_usuario, Email_usuario) VALUES (?, ?)',
            [Nome_usuario, Email_usuario]
        );
    }

    // READ ALL
    // --------------------------------------------------------------------------
    static async readAllUsuarios() {

        console.log('mainModel.js', 'Usuario.readAllUsuarios()');
        console.log(arguments);

        return await db.executarQuery('SELECT * FROM usuario');
    }

    // READ COM FILTROS
    // --------------------------------------------------------------------------
    static async readUsuarios(filtros = {}) {

        console.log('mainModel.js', 'Usuario.readUsuarios()');
        console.log(arguments);

        const { Id_usuario, Nome_usuario, Email_usuario } = filtros;

        var query = 'SELECT * FROM usuario WHERE ';
        query += 'Id_usuario LIKE ? ';
        query += 'AND Nome_usuario LIKE ? ';
        query += 'AND Email_usuario LIKE ? ';

        return await db.executarQuery(query, [
            `%${Id_usuario || ''}%`,
            `%${Nome_usuario || ''}%`,
            `%${Email_usuario || ''}%`
        ]);
    }

    // READ BY ID
    // --------------------------------------------------------------------------
    static async readUsuario(id) {

        console.log('mainModel.js', 'Usuario.readUsuario()');
        console.log(arguments);

        return await db.executarQuery(
            'SELECT * FROM usuario WHERE Id_usuario = ?',
            [id]
        );
    }

    // UPDATE
    // --------------------------------------------------------------------------
    static async updateUsuario(id, dados = {}) {

        console.log('mainModel.js', 'Usuario.updateUsuario()');
        console.log(arguments);

        const { Nome_usuario, Email_usuario } = dados;

        return db.executarQuery(
            'UPDATE usuario SET Nome_usuario = ?, Email_usuario = ? WHERE Id_usuario = ?',
            [Nome_usuario, Email_usuario, id]
        );
    }

    // DELETE
    // --------------------------------------------------------------------------
    static async deleteUsuario(id) {

        console.log('mainModel.js', 'Usuario.deleteUsuario()');
        console.log(arguments);

        return await db.executarQuery(
            'DELETE FROM usuario WHERE Id_usuario = ?',
            [id]
        );
    }
}



// ============================================================================
//  MODEL TAREFA
// ============================================================================
class Tarefa {

    // CREATE
    // --------------------------------------------------------------------------
    static async createTarefa(dados) {

        const {
            Descricao,
            Setor,
            Data_cadastro,
            Status,
            Prioridade,
            FK_USUARIO_Id_usuario
        } = dados;

        console.log('mainModel.js', 'Tarefa.createTarefa()');
        console.log(arguments);

        return await db.executarQuery(
            `
            INSERT INTO tarefa 
                (Descricao, Setor, Data_cadastro, Status, Prioridade, FK_USUARIO_Id_usuario)
            VALUES (?, ?, ?, ?, ?, ?)
            `,
            [
                Descricao,
                Setor,
                Data_cadastro,
                Status,
                Prioridade,
                FK_USUARIO_Id_usuario
            ]
        );
    }

    // READ ALL
    // --------------------------------------------------------------------------
    static async readAllTarefas() {

        console.log('mainModel.js', 'Tarefa.readAllTarefas()');
        console.log(arguments);

        return await db.executarQuery('SELECT * FROM tarefa');
    }

    // READ FILTRADO
    // --------------------------------------------------------------------------
    static async readTarefas(filtros = {}) {

        console.log('mainModel.js', 'Tarefa.readTarefas()');
        console.log(arguments);

        const {
            Id_tarefa,
            Descricao,
            Setor,
            Data_cadastro,
            Status,
            Prioridade,
            FK_USUARIO_Id_usuario
        } = filtros;

        var query = 'SELECT * FROM tarefa WHERE ';
        query += 'Id_tarefa LIKE ? ';
        query += 'AND Descricao LIKE ? ';
        query += 'AND Setor LIKE ? ';
        query += 'AND Data_cadastro LIKE ? ';
        query += 'AND Status LIKE ? ';
        query += 'AND Prioridade LIKE ? ';
        query += 'AND FK_USUARIO_Id_usuario LIKE ? ';

        return await db.executarQuery(query, [
            `%${Id_tarefa || ''}%`,
            `%${Descricao || ''}%`,
            `%${Setor || ''}%`,
            `%${Data_cadastro || ''}%`,
            `%${Status || ''}%`,
            `%${Prioridade || ''}%`,
            `%${FK_USUARIO_Id_usuario || ''}%`
        ]);
    }

    // READ BY ID
    // --------------------------------------------------------------------------
    static async readTarefa(id) {

        console.log('mainModel.js', 'Tarefa.readTarefa()');
        console.log(arguments);

        return await db.executarQuery(
            'SELECT * FROM tarefa WHERE Id_tarefa = ?',
            [id]
        );
    }

    // UPDATE
    // --------------------------------------------------------------------------
    static async updateTarefa(id, dados = {}) {

        console.log('mainModel.js', 'Tarefa.updateTarefa()');
        console.log(arguments);

        const {
            Descricao,
            Setor,
            Data_cadastro,
            Status,
            Prioridade,
            FK_USUARIO_Id_usuario
        } = dados;

        return db.executarQuery(
            `
            UPDATE tarefa SET 
                Descricao = ?,
                Setor = ?,
                Data_cadastro = ?,
                Status = ?,
                Prioridade = ?,
                FK_USUARIO_Id_usuario = ?
            WHERE Id_tarefa = ?
            `,
            [
                Descricao,
                Setor,
                Data_cadastro,
                Status,
                Prioridade,
                FK_USUARIO_Id_usuario,
                id
            ]
        );
    }

    // DELETE
    // --------------------------------------------------------------------------
    static async deleteTarefa(id) {

        console.log('mainModel.js', 'Tarefa.deleteTarefa()');
        console.log(arguments);

        return await db.executarQuery(
            'DELETE FROM tarefa WHERE Id_tarefa = ?',
            [id]
        );
    }
}



// EXPORTA AS DUAS CLASSES
module.exports = {
    Usuario,
    Tarefa
}
