// Camada de dados LOCAL.
//
// Emula uma API de entidades (list/filter/get/create/update/delete/subscribe)
// usando os dados que vivem em `seedData.js` e persistindo as alterações no localStorage do
// navegador. Assim o app roda 100% offline, sem nenhuma chamada de rede.
//
// COMO PLUGAR UM BANCO REAL DEPOIS:
//   Basta reimplementar `createCollection` (ou os métodos abaixo) apontando para a sua API
//   (Supabase, REST, etc.). Nenhum componente da aplicação precisa ser alterado, porque todos
//   consomem `api.entities.X` com este mesmo contrato.

const STORAGE_PREFIX = '4him_db_';
const hasWindow = typeof window !== 'undefined';

function storageKey(name) {
  return STORAGE_PREFIX + name;
}

// Carrega a coleção do localStorage; na primeira execução grava o seed vindo do código.
function loadRows(name, seed) {
  if (!hasWindow) return [...seed];
  const key = storageKey(name);
  try {
    const raw = window.localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn(`[localDb] não foi possível ler "${key}":`, err);
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(seed));
  } catch (err) {
    console.warn(`[localDb] não foi possível semear "${key}":`, err);
  }
  return [...seed];
}

function persist(name, rows) {
  if (!hasWindow) return;
  try {
    window.localStorage.setItem(storageKey(name), JSON.stringify(rows));
  } catch (err) {
    console.warn(`[localDb] não foi possível gravar "${name}":`, err);
  }
}

function uid() {
  if (hasWindow && window.crypto?.randomUUID) return window.crypto.randomUUID();
  return 'id_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function compareBy(a, b, field) {
  const av = a?.[field];
  const bv = b?.[field];
  if (av == null && bv == null) return 0;
  if (av == null) return -1;
  if (bv == null) return 1;
  if (av < bv) return -1;
  if (av > bv) return 1;
  return 0;
}

// Formato de ordenação aceito: "campo" (asc) ou "-campo" (desc).
function applySort(rows, sort) {
  if (!sort) return [...rows];
  const desc = sort.startsWith('-');
  const field = desc ? sort.slice(1) : sort;
  const sorted = [...rows].sort((a, b) => compareBy(a, b, field));
  return desc ? sorted.reverse() : sorted;
}

function matchesQuery(row, query) {
  return Object.entries(query || {}).every(([key, value]) => row?.[key] === value);
}

/**
 * Cria uma coleção em memória/localStorage com a mesma interface usada no app.
 * @param {string} name  Nome da entidade (chave de armazenamento).
 * @param {Array}  seed  Dados iniciais definidos em código.
 */
export function createCollection(name, seed = []) {
  let rows = loadRows(name, seed);
  const subscribers = new Set();

  function emit(type, record) {
    const event = { type, data: record };
    subscribers.forEach((cb) => {
      try {
        cb(event);
      } catch (err) {
        console.error(`[localDb] erro em subscriber de "${name}":`, err);
      }
    });
  }

  function save() {
    persist(name, rows);
  }

  return {
    async list(sort, limit) {
      const result = applySort(rows, sort);
      return typeof limit === 'number' ? result.slice(0, limit) : result;
    },

    async filter(query, sort, limit) {
      const filtered = rows.filter((row) => matchesQuery(row, query));
      const sorted = applySort(filtered, sort);
      return typeof limit === 'number' ? sorted.slice(0, limit) : sorted;
    },

    async get(id) {
      return rows.find((row) => row.id === id) || null;
    },

    async create(data) {
      const now = new Date().toISOString();
      const record = { ...data, id: uid(), created_date: now, updated_date: now };
      rows = [record, ...rows];
      save();
      emit('create', record);
      return record;
    },

    async bulkCreate(items = []) {
      const created = items.map((data) => {
        const now = new Date().toISOString();
        return { ...data, id: uid(), created_date: now, updated_date: now };
      });
      rows = [...created, ...rows];
      save();
      created.forEach((record) => emit('create', record));
      return created;
    },

    async update(id, data) {
      let updated = null;
      rows = rows.map((row) => {
        if (row.id !== id) return row;
        updated = { ...row, ...data, id: row.id, updated_date: new Date().toISOString() };
        return updated;
      });
      save();
      if (updated) emit('update', updated);
      return updated;
    },

    async delete(id) {
      const removed = rows.find((row) => row.id === id) || null;
      rows = rows.filter((row) => row.id !== id);
      save();
      if (removed) emit('delete', removed);
      return removed;
    },

    // Real-time simples: retorna uma função para cancelar a inscrição.
    subscribe(callback) {
      subscribers.add(callback);
      return () => subscribers.delete(callback);
    },
  };
}
