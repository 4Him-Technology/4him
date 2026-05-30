// Cliente "base44" — implementação LOCAL (sem Base44).
//
// Mantém EXATAMENTE a mesma interface que o SDK do Base44 expunha
// (base44.entities / auth / integrations / functions / agents), de modo que nenhum dos
// componentes que importam `{ base44 }` precise ser alterado. A diferença é que tudo roda
// localmente: os dados vêm de `seedData.js` e são persistidos no localStorage.
//
// >>> PARA PLUGAR UM BANCO/SERVIÇO REAL DEPOIS <<<
//   - Dados (entidades): troque a fábrica em `localDb.js`.
//   - IA (InvokeLLM / agentes): implemente as chamadas reais aqui e em `localAgents.js`.
//   - Integrações externas (Chatwoot/WhatsApp via `functions.invoke`): implemente abaixo.

import { createCollection } from './localDb.js';
import { localAgents } from './localAgents.js';
import { seed } from './seedData.js';

// ---- Entidades (banco de dados local) ----
const entities = {
  Patient: createCollection('Patient', seed.Patient),
  Appointment: createCollection('Appointment', seed.Appointment),
  FinancialRecord: createCollection('FinancialRecord', seed.FinancialRecord),
  ClinicSettings: createCollection('ClinicSettings', seed.ClinicSettings),
  WhatsAppMessage: createCollection('WhatsAppMessage', seed.WhatsAppMessage),
  LegalClient: createCollection('LegalClient', seed.LegalClient),
  LegalCase: createCollection('LegalCase', seed.LegalCase),
  LegalDocument: createCollection('LegalDocument', seed.LegalDocument),
  LegalFinancial: createCollection('LegalFinancial', seed.LegalFinancial),
  CaseReminder: createCollection('CaseReminder', seed.CaseReminder),
  User: createCollection('User', seed.User),
};

// ---- Autenticação (sessão local — sem redirecionar para o Base44) ----
const sessionUser = { ...seed.User[0] };

const auth = {
  async me() {
    return sessionUser;
  },
  async login() {
    return sessionUser;
  },
  async logout() {
    console.info('[base44 local] logout() — sem ação no modo local.');
  },
  async redirectToLogin() {
    console.info('[base44 local] redirectToLogin() — sem ação no modo local.');
  },
  async updateMyUserData(data = {}) {
    Object.assign(sessionUser, data);
    return sessionUser;
  },
};

// ---- Integrações (IA / arquivos) ----
const AI_NOTICE =
  'IA desconectada (modo local). Configure um provedor de IA em src/api/base44Client.js.';

// Gera um objeto padrão a partir de um JSON Schema (usado quando o app pede resposta estruturada).
function defaultFromSchema(schema) {
  const out = {};
  const props = schema?.properties || {};
  for (const [key, def] of Object.entries(props)) {
    switch (def?.type) {
      case 'array':
        out[key] = [];
        break;
      case 'number':
      case 'integer':
        out[key] = 0;
        break;
      case 'boolean':
        out[key] = false;
        break;
      case 'object':
        out[key] = {};
        break;
      default:
        out[key] = '';
    }
  }
  if ('observacao' in out) out.observacao = AI_NOTICE;
  if ('observation' in out) out.observation = AI_NOTICE;
  return out;
}

const integrations = {
  Core: {
    async InvokeLLM({ response_json_schema } = {}) {
      // Sem provedor de IA real: devolve um placeholder que não quebra a UI.
      if (response_json_schema) return defaultFromSchema(response_json_schema);
      return AI_NOTICE;
    },
    async UploadFile({ file } = {}) {
      // Cria uma URL local temporária para o arquivo (funciona no navegador, sem upload externo).
      const file_url =
        file && typeof URL !== 'undefined' && URL.createObjectURL ? URL.createObjectURL(file) : '';
      return { file_url };
    },
    async SendEmail() {
      console.info('[base44 local] SendEmail() — e-mail não enviado no modo local.');
      return { success: true, local: true };
    },
    async GenerateImage() {
      return { url: '' };
    },
    async ExtractDataFromUploadedFile() {
      return { status: 'success', output: {} };
    },
  },
};

// ---- Functions (integração externa Chatwoot/WhatsApp) ----
const functions = {
  async invoke(/* name, payload */) {
    // A integração Chatwoot vive em um serviço externo. Sem ela, devolvemos um formato
    // "vazio mas seguro" para os componentes renderizarem sem erro.
    return { data: { data: { payload: [] }, payload: [] }, status: 200 };
  },
};

export const base44 = {
  entities,
  auth,
  integrations,
  functions,
  agents: localAgents,
};

export default base44;
