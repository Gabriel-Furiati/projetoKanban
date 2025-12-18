// controllers/mainController.js
const { executarQuery } = require('../db/dbConnect');

// --- Helpers ---
function normalizePriorityBackend(raw) {
  if (!raw) return 'Média';
  const r = raw.toString().trim().toLowerCase();
  if (r.includes('alta') || r === 'high') return 'Alta';
  if (r.includes('baixa') || r === 'low') return 'Baixa';
  // cobre 'media', 'média', 'normal', 'medium'
  return 'Média';
}

// --- Views (render) ---
async function mostraPaginaInicial(req, res) {
  try {
    res.render('kanban');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar página inicial');
  }
}

async function mostraPaginaNovoUsuario(req, res) {
  try {
    res.render('novousuario');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar novo usuário');
  }
}

async function mostraPaginaNovaTarefa(req, res) {
  try {
    res.render('novatarefa');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao carregar nova tarefa');
  }
}

// --- API Usuários ---
async function listarUsuarios(req, res) {
  try {
    const sql = 'SELECT Id_usuario, Nome_usuario FROM USUARIO ORDER BY Nome_usuario';
    const usuarios = await executarQuery(sql);
    res.json(usuarios);
  } catch (err) {
    console.error('listarUsuarios:', err);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
}

async function criarUsuario(req, res) {
  try {
    const { nome, email } = req.body;
    if (!nome || !email) return res.status(400).json({ error: 'Nome e email são obrigatórios' });

    const existe = await executarQuery('SELECT Id_usuario FROM USUARIO WHERE Email_usuario = ?', [email]);
    if (existe && existe.length) return res.status(409).json({ error: 'E-mail já cadastrado' });

    const result = await executarQuery('INSERT INTO USUARIO (Nome_usuario, Email_usuario) VALUES (?, ?)', [nome, email]);
    const novoId = result.insertId;
    const usuario = await executarQuery('SELECT Id_usuario, Nome_usuario FROM USUARIO WHERE Id_usuario = ?', [novoId]);
    res.status(201).json(usuario[0]);
  } catch (err) {
    console.error('criarUsuario:', err);
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
}

// --- API Tarefas ---
// Observação: este controller tenta gravar Titulo quando a coluna existir.
// Se a coluna não existir, há fallback que grava apenas Descricao e normaliza Titulo na resposta.

async function listarTarefas(req, res) {
  try {
    const sql = `
      SELECT t.Id_tarefa, t.Titulo, t.Descricao, t.Prioridade, t.Status, t.FK_USUARIO_Id_usuario,
             u.Nome_usuario
      FROM TAREFA t
      LEFT JOIN USUARIO u ON t.FK_USUARIO_Id_usuario = u.Id_usuario
      ORDER BY t.Id_tarefa ASC
    `;
    const tarefas = await executarQuery(sql);

    // Normaliza e garante campo Titulo e Descricao para cada tarefa
    const tarefasNormalizadas = (tarefas || []).map(t => {
      const descricao = (t.Descricao ?? t.descricao ?? '').toString().trim();
      const tituloExistente = (t.Titulo ?? t.titulo ?? '').toString().trim();

      let titulo;
      if (tituloExistente.length > 0) {
        titulo = tituloExistente;
      } else if (descricao.length > 0) {
        const primeiraLinha = descricao.split('\n')[0].trim();
        titulo = primeiraLinha.length > 0 ? primeiraLinha : descricao;
        if (titulo.length > 60) titulo = titulo.slice(0, 57) + '...';
      } else {
        titulo = 'Sem título';
      }

      // Normaliza prioridade para garantir valores esperados no front
      const prioridadeRaw = (t.Prioridade ?? t.prioridade ?? '').toString().trim();
      const prioridade = prioridadeRaw ? normalizePriorityBackend(prioridadeRaw) : 'Média';

      return {
        ...t,
        Titulo: titulo,
        Descricao: descricao,
        Prioridade: prioridade
      };
    });

    res.json(tarefasNormalizadas);
  } catch (err) {
    console.error('listarTarefas:', err);
    res.status(500).json({ error: 'Erro ao listar tarefas' });
  }
}

async function criarTarefa(req, res) {
  console.log('POST /api/tarefas body:', req.body);
  try {
    const { titulo, descricao, prioridade, fk_usuario } = req.body;
    if (!titulo && !descricao) return res.status(400).json({ error: 'Título ou descrição é obrigatório' });

    const status = 'A Fazer';
    const tituloParaSalvar = (titulo ?? '').toString().trim() || null;
    const descParaSalvar = (descricao ?? titulo ?? '').toString().trim();
    const prioridadeFinal = normalizePriorityBackend(prioridade);

    // Tenta inserir Titulo se a coluna existir; se não existir, o DB pode lançar erro.
    try {
      const insert = await executarQuery(
        `INSERT INTO TAREFA (Titulo, Descricao, Setor, Data_cadastro, Status, Prioridade, FK_USUARIO_Id_usuario)
         VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
        [tituloParaSalvar, descParaSalvar, '', status, prioridadeFinal, fk_usuario || null]
      );

      const novoId = insert.insertId;
      const rows = await executarQuery(
        `SELECT t.Id_tarefa, t.Titulo, t.Descricao, t.Prioridade, t.Status, t.FK_USUARIO_Id_usuario, u.Nome_usuario
         FROM TAREFA t
         LEFT JOIN USUARIO u ON t.FK_USUARIO_Id_usuario = u.Id_usuario
         WHERE t.Id_tarefa = ?`,
        [novoId]
      );

      const tarefa = (rows && rows[0]) || null;
      if (!tarefa) return res.status(500).json({ error: 'Erro ao recuperar tarefa criada' });

      // Normaliza resposta
      const descricaoBanco = (tarefa.Descricao ?? '').toString().trim();
      const tituloBanco = (tarefa.Titulo ?? '').toString().trim();
      let tituloFinal = tituloBanco || (tituloParaSalvar ?? '');
      if (!tituloFinal) {
        const primeiraLinha = descricaoBanco.split('\n')[0].trim();
        tituloFinal = primeiraLinha.length > 0 ? primeiraLinha : descricaoBanco;
        if (tituloFinal.length > 60) tituloFinal = tituloFinal.slice(0, 57) + '...';
      }

      const prioridadeBanco = (tarefa.Prioridade ?? prioridadeFinal ?? '').toString().trim();
      const prioridadeNormalized = normalizePriorityBackend(prioridadeBanco);

      const tarefaNormalizada = {
        ...tarefa,
        Titulo: tituloFinal,
        Descricao: descricaoBanco,
        Prioridade: prioridadeNormalized
      };

      return res.status(201).json(tarefaNormalizada);
    } catch (errInsert) {
      // Se falhar por causa da coluna Titulo inexistente, tenta inserir sem Titulo (compatibilidade)
      console.warn('Inserção com Titulo falhou, tentando sem Titulo:', errInsert.message || errInsert);
      const insert2 = await executarQuery(
        `INSERT INTO TAREFA (Descricao, Setor, Data_cadastro, Status, Prioridade, FK_USUARIO_Id_usuario)
         VALUES (?, ?, NOW(), ?, ?, ?)`,
        [descParaSalvar, '', status, prioridadeFinal, fk_usuario || null]
      );

      const novoId2 = insert2.insertId;
      const rows2 = await executarQuery(
        `SELECT t.Id_tarefa, t.Descricao, t.Prioridade, t.Status, t.FK_USUARIO_Id_usuario, u.Nome_usuario
         FROM TAREFA t
         LEFT JOIN USUARIO u ON t.FK_USUARIO_Id_usuario = u.Id_usuario
         WHERE t.Id_tarefa = ?`,
        [novoId2]
      );

      const tarefa2 = (rows2 && rows2[0]) || null;
      if (!tarefa2) return res.status(500).json({ error: 'Erro ao recuperar tarefa criada (fallback)' });

      const descricaoBanco = (tarefa2.Descricao ?? '').toString().trim();
      let tituloFinal = (tituloParaSalvar ?? '').toString().trim();
      if (!tituloFinal) {
        const primeiraLinha = descricaoBanco.split('\n')[0].trim();
        tituloFinal = primeiraLinha.length > 0 ? primeiraLinha : descricaoBanco;
        if (tituloFinal.length > 60) tituloFinal = tituloFinal.slice(0, 57) + '...';
      }

      const prioridadeBanco = (tarefa2.Prioridade ?? prioridadeFinal ?? '').toString().trim();
      const prioridadeNormalized = normalizePriorityBackend(prioridadeBanco);

      const tarefaNormalizada = {
        ...tarefa2,
        Titulo: tituloFinal,
        Descricao: descricaoBanco,
        Prioridade: prioridadeNormalized
      };

      return res.status(201).json(tarefaNormalizada);
    }
  } catch (err) {
    console.error('criarTarefa:', err);
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
}

async function atualizarTarefa(req, res) {
  try {
    const id = req.params.id;
    const { titulo, descricao, prioridade, fk_usuario, status } = req.body;
    if (!id) return res.status(400).json({ error: 'Id é obrigatório' });

    const tituloParaSalvar = (titulo ?? '').toString().trim() || null;
    const descParaSalvar = (descricao ?? titulo ?? '').toString().trim();
    const prioridadeFinal = normalizePriorityBackend(prioridade);

    // Tenta atualizar incluindo Titulo (se existir)
    try {
      await executarQuery(
        `UPDATE TAREFA
         SET Titulo = ?, Descricao = ?, Prioridade = ?, FK_USUARIO_Id_usuario = ?, Status = ?
         WHERE Id_tarefa = ?`,
        [tituloParaSalvar, descParaSalvar, prioridadeFinal, fk_usuario || null, status || 'A Fazer', id]
      );
    } catch (errUpdate) {
      // fallback: tabela sem coluna Titulo
      console.warn('UPDATE com Titulo falhou, tentando sem Titulo:', errUpdate.message || errUpdate);
      await executarQuery(
        `UPDATE TAREFA
         SET Descricao = ?, Prioridade = ?, FK_USUARIO_Id_usuario = ?, Status = ?
         WHERE Id_tarefa = ?`,
        [descParaSalvar, prioridadeFinal, fk_usuario || null, status || 'A Fazer', id]
      );
    }

    const rows = await executarQuery(
      `SELECT t.Id_tarefa, t.Titulo, t.Descricao, t.Prioridade, t.Status, t.FK_USUARIO_Id_usuario, u.Nome_usuario
       FROM TAREFA t
       LEFT JOIN USUARIO u ON t.FK_USUARIO_Id_usuario = u.Id_usuario
       WHERE t.Id_tarefa = ?`,
      [id]
    );

    const tarefa = (rows && rows[0]) || null;
    if (!tarefa) return res.status(404).json({ error: 'Tarefa não encontrada' });

    const descricaoBanco = (tarefa.Descricao ?? '').toString().trim();
    const tituloBanco = (tarefa.Titulo ?? '').toString().trim();
    let tituloFinal = tituloBanco || (tituloParaSalvar ?? '');
    if (!tituloFinal) {
      const primeiraLinha = descricaoBanco.split('\n')[0].trim();
      tituloFinal = primeiraLinha.length > 0 ? primeiraLinha : descricaoBanco;
      if (tituloFinal.length > 60) tituloFinal = tituloFinal.slice(0, 57) + '...';
    }

    const prioridadeBanco = (tarefa.Prioridade ?? prioridadeFinal ?? '').toString().trim();
    const prioridadeNormalized = normalizePriorityBackend(prioridadeBanco);

    const tarefaNormalizada = {
      ...tarefa,
      Titulo: tituloFinal,
      Descricao: descricaoBanco,
      Prioridade: prioridadeNormalized
    };

    res.json(tarefaNormalizada);
  } catch (err) {
    console.error('atualizarTarefa:', err);
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
}

async function deletarTarefa(req, res) {
  try {
    const id = req.params.id;
    if (!id) return res.status(400).json({ error: 'Id é obrigatório' });
    await executarQuery('DELETE FROM TAREFA WHERE Id_tarefa = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('deletarTarefa:', err);
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
}

module.exports = {
  mostraPaginaInicial,
  mostraPaginaNovoUsuario,
  mostraPaginaNovaTarefa,
  listarUsuarios,
  criarUsuario,
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  deletarTarefa
};
