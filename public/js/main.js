// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
  init();
});

async function init() {
  await carregarUsuariosNoSelect();
  await carregarTarefasNoKanban();
  ligarEventos();
}

function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }

/* ---------- Usuários ---------- */
async function carregarUsuariosNoSelect() {
  const select = qs('#responsavelSelect');
  if (!select) return console.warn('select #responsavelSelect não encontrado na página');

  try {
    const res = await fetch('/api/usuarios');
    if (!res.ok) throw new Error('Erro ao buscar usuários: ' + res.status);
    const usuarios = await res.json();

    select.innerHTML = '<option value="">Selecione</option>';
    usuarios.forEach(u => {
      const opt = document.createElement('option');
      opt.value = u.Id_usuario ?? u.id ?? u.id_usuario;
      opt.textContent = u.Nome_usuario ?? u.nome ?? u.name;
      select.appendChild(opt);
    });
    console.log('Usuários carregados:', usuarios.length);
  } catch (err) {
    console.error('carregarUsuariosNoSelect:', err);
    select.innerHTML = '<option value="">Erro ao carregar</option>';
  }
}

/* ---------- Normalização de prioridade (frontend) ---------- */
function mapPriorityFrontend(raw) {
  if (!raw) return 'Média';
  const r = raw.toString().trim().toLowerCase();
  if (r === 'alta' || r === 'high') return 'Alta';
  if (r === 'baixa' || r === 'low') return 'Baixa';
  if (r === 'media' || r === 'média' || r === 'normal' || r === 'medium') return 'Média';
  return 'Média';
}

/* ---------- Eventos dos formulários ---------- */
function ligarEventos() {
  const formUsuario = qs('#formNovoUsuario');
  if (formUsuario) {
    formUsuario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const nomeEl = qs('#nomeUsuario');
      const emailEl = qs('#emailUsuario');
      const nome = nomeEl ? nomeEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      if (!nome || !email) return alert('Preencha nome e email');

      try {
        const res = await fetch('/api/usuarios', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nome, email })
        });
        if (!res.ok) {
          const errBody = await res.json().catch(()=>null);
          throw new Error('Status ' + res.status + ' ' + (errBody?.error || ''));
        }
        await res.json();
        formUsuario.reset();
        await carregarUsuariosNoSelect();
        alert('Usuário criado com sucesso');
      } catch (err) {
        console.error('Erro criar usuário:', err);
        alert('Erro ao criar usuário. Veja console.');
      }
    });
  }

  const formTarefa = qs('#formNovaTarefa');
  if (formTarefa) {
    formTarefa.addEventListener('submit', async (e) => {
      e.preventDefault();

      // coleta valores
      let titulo = qs('#tituloTarefa')?.value.trim() || '';
      const descricao = qs('#descricaoTarefa')?.value.trim() || '';
      const prioridadeRaw = qs('#prioridadeTarefa')?.value || '';
      const prioridade = mapPriorityFrontend(prioridadeRaw);
      const fk_usuario = qs('#responsavelSelect')?.value || '';

      // se título vazio, derive a partir da descrição
      if (!titulo) {
        if (descricao.length > 0) {
          const primeiraLinha = descricao.split('\n')[0].trim();
          titulo = primeiraLinha.length > 0 ? primeiraLinha : descricao;
          if (titulo.length > 60) titulo = titulo.slice(0, 57) + '...';
        } else {
          titulo = 'Sem título';
        }
      }

      if (!titulo || !fk_usuario) return alert('Preencha título e responsável');

      try {
        const res = await fetch('/api/tarefas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ titulo, descricao, prioridade, fk_usuario: Number(fk_usuario) })
        });
        if (!res.ok) {
          const errBody = await res.json().catch(()=>null);
          throw new Error('Status ' + res.status + ' ' + (errBody?.error || ''));
        }
        await res.json();
        formTarefa.reset();
        await carregarTarefasNoKanban();
        alert('Tarefa criada com sucesso');
      } catch (err) {
        console.error('Erro criar tarefa:', err);
        alert('Erro ao criar tarefa. Veja console.');
      }
    });
  }
}

/* ---------- Carregar e renderizar tarefas (com ID, título, descrição e responsável) ---------- */
async function carregarTarefasNoKanban() {
  const container = qs('#kanbanContainer');
  if (!container) return console.warn('#kanbanContainer não encontrado na página');

  try {
    const res = await fetch('/api/tarefas');
    if (!res.ok) throw new Error('Erro ao buscar tarefas: ' + res.status);
    const tarefas = await res.json();

    const todo = qs('#todoColumn'); const doing = qs('#doingColumn'); const done = qs('#doneColumn');
    if (todo) todo.innerHTML = '<h3 class="column-title">A fazer</h3>';
    if (doing) doing.innerHTML = '<h3 class="column-title">Em andamento</h3>';
    if (done) done.innerHTML = '<h3 class="column-title">Pronto</h3>';

    // habilita handlers de drop nas colunas
    setupColumnDragAndDrop('#todoColumn', 'A Fazer');
    setupColumnDragAndDrop('#doingColumn', 'Fazendo');
    setupColumnDragAndDrop('#doneColumn', 'Feito');

    (tarefas || []).forEach(t => {
      const card = criarCard(t);
      const rawStatus = (t.Status ?? t.status ?? 'A Fazer').toString().toLowerCase();
      if (rawStatus.includes('fazendo') || rawStatus.includes('doing') || rawStatus.includes('em andamento')) {
        if (doing) doing.appendChild(card);
      } else if (rawStatus.includes('concl') || rawStatus.includes('done') || rawStatus.includes('feito') || rawStatus.includes('pronto')) {
        if (done) done.appendChild(card);
      } else {
        if (todo) todo.appendChild(card);
      }
    });

    console.log('Tarefas carregadas:', (tarefas || []).length);
  } catch (err) {
    console.error('carregarTarefasNoKanban:', err);
  }
}

/* ---------- Criar card DOM (draggable + delete) ---------- */
function criarCard(t) {
  const id = t.Id_tarefa ?? t.id ?? t.id_tarefa ?? '—';
  const tituloRaw = (t.Titulo ?? t.titulo ?? '').toString().trim();
  const descricao = (t.Descricao ?? t.descricao ?? '').toString().trim();
  const responsavel = (t.Nome_usuario ?? t.nome ?? t.responsavel ?? '—').toString().trim();
  const prioridadeRaw = (t.Prioridade ?? t.prioridade ?? '').toString().trim().toLowerCase();

  // normaliza prioridade e classe
  let prioridadeLabel = prioridadeRaw ? prioridadeRaw.charAt(0).toUpperCase() + prioridadeRaw.slice(1) : 'Média';
  let prioridadeClass = 'media';
  if (prioridadeRaw.includes('alta')) prioridadeClass = 'alta';
  else if (prioridadeRaw.includes('baixa')) prioridadeClass = 'baixa';
  else prioridadeClass = 'media';

  // gera título se não houver
  let titulo;
  if (tituloRaw.length > 0) {
    titulo = tituloRaw;
  } else if (descricao.length > 0) {
    const primeiraLinha = descricao.split('\n')[0].trim();
    titulo = primeiraLinha.length > 0 ? primeiraLinha : descricao;
    if (titulo.length > 60) titulo = titulo.slice(0, 57) + '...';
  } else {
    titulo = 'Sem título';
  }

  const tituloCurto = titulo.length > 60 ? titulo.slice(0, 57) + '...' : titulo;

  const card = document.createElement('div');
  card.className = 'task-card';
  card.dataset.id = id;
  card.draggable = true;

  card.innerHTML = `
    <div class="meta-row">
      <small style="font-weight:700">#${escapeHtml(id)}</small>
      <span class="priority ${escapeHtml(prioridadeClass)}">${escapeHtml(prioridadeLabel)}</span>
    </div>

    <h4>${escapeHtml(tituloCurto)}</h4>

    <p>${escapeHtml(descricao)}</p>

    <div class="owner">Responsável: ${escapeHtml(responsavel)}</div>

    <div class="actions">
      <button class="btn-delete" data-id="${escapeHtml(id)}">Excluir</button>
    </div>
  `;

  // drag events
  card.addEventListener('dragstart', (e) => {
    card.classList.add('dragging');
    e.dataTransfer.setData('text/plain', id.toString());
    // opcional: set drag image
  });
  card.addEventListener('dragend', () => {
    card.classList.remove('dragging');
  });

  // delete button
  const btn = card.querySelector('.btn-delete');
  if (btn) {
    btn.addEventListener('click', async (ev) => {
      ev.stopPropagation();
      const idToDelete = btn.dataset.id;
      if (!confirm('Excluir esta tarefa?')) return;
      try {
        const res = await fetch(`/api/tarefas/${idToDelete}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Erro ao excluir: ' + res.status);
        // remove do DOM
        card.remove();
      } catch (err) {
        console.error('Erro deletar tarefa:', err);
        alert('Erro ao excluir tarefa. Veja console.');
      }
    });
  }

  // clique opcional para debug/detalhes
  card.addEventListener('click', () => {
    console.log('Card clicado:', id);
  });

  return card;
}

/* ---------- Drag & Drop helpers ---------- */
function setupColumnDragAndDrop(columnSelector, statusValue) {
  const col = qs(columnSelector);
  if (!col) return;

  col.addEventListener('dragover', (e) => {
    e.preventDefault();
    col.classList.add('drag-over');
  });

  col.addEventListener('dragleave', () => {
    col.classList.remove('drag-over');
  });

  col.addEventListener('drop', async (e) => {
    e.preventDefault();
    col.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    if (!id) return;
    // move element in DOM
    const dragged = qsa('.task-card').find(c => c.dataset.id == id);
    if (dragged) col.appendChild(dragged);

    // map statusValue (friendly) to DB status string
    // statusValue passed as 'A Fazer' | 'Fazendo' | 'Feito'
    try {
      await atualizarStatusTarefa(id, statusValue);
      console.log(`Tarefa ${id} atualizada para status "${statusValue}"`);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status da tarefa. Veja console.');
      // opcional: recarregar lista para sincronizar
      await carregarTarefasNoKanban();
    }
  });
}

/* ---------- Atualizar status via API ---------- */
async function atualizarStatusTarefa(id, status) {
  // Faz PUT com body mínimo; backend atualiza Descricao/Titulo se necessário
  const payload = { status };
  const res = await fetch(`/api/tarefas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errBody = await res.json().catch(()=>null);
    throw new Error('Status ' + res.status + ' ' + (errBody?.error || ''));
  }
  return await res.json();
}

/* ---------- utilitário para escapar HTML (XSS) ---------- */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
