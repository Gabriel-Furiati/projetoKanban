const dbExemplo = require('../db/dbConnect.js'); // Importação obrigatória para o mock
const Exemplo = require('../models/mainModel');


jest.mock('../db/dbConnect', () => {
    
    const executarQuery = jest.fn((query, params) => {

        const respostas = {
            "INSERT INTO tabelaExemplo (campo1, campo2, campo3) VALUES (?, ?, ?)": { affectedRows: 1, insertId: 9n, warningStatus: 0 },
        };

        return respostas[query] || []; 
    });

    return {
        executarQuery: executarQuery, // <--- ESTE É O PONTO CHAVE: Expondo a função mock
        pool: {
            end: jest.fn() // Simula o fechamento da pool
        }
    };
});

describe('Exemplo Model', () => { // Agrupa testes relacionados
    
    // Define um caso de teste específico
    test('deve criar um novo Exemplo', async () => {
        
        const dadosExemplo = {
            campo1: 'João',
            campo2: 'joao@email.com',
            campo3: '123456',
        };

        // 1. Executa a função que está sendo testada
        const result = await Exemplo.createExemplo(dadosExemplo);
        
        // 2. Asserção 1: Verifica o valor de retorno (o OkPacket simulado)
        // Assume-se que o mock retorna { affectedRows: 1, insertId: 9n, warningStatus: 0 }
        expect(result).toEqual({ affectedRows: 1, insertId: 9n, warningStatus: 0 });

        
        await dbExemplo.pool.end();
    });

    test('deve retornar todos os exemplos cadastrados', async () => {

        


    })
    
});