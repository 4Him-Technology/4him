# 4Him

Aplicação web (React + Vite) de **gestão para Clínica Médica**: dashboard de indicadores,
agendamentos, cadastro de pacientes, financeiro, leads e atendimento por WhatsApp, configurações
da clínica, gestão de usuários e um assistente de IA (**Elo4h**).

> **Aplicação independente.** Não depende de nenhuma plataforma ou SDK externo de backend — você
> commita, roda e publica por conta própria. Os dados ficam em uma **camada local** (ver
> [Modo de dados local](#modo-de-dados-local)); integrações externas (IA, WhatsApp, e-mail) estão
> em modo *stub* até que um backend real seja conectado.

## Stack

- **React 18** + **Vite 6** (dev/build)
- **React Router DOM 6** (navegação)
- **Tailwind CSS 3** + **shadcn/ui** (Radix UI) — componentes em `src/components/ui`
- **TanStack Query 5** (estado assíncrono / cache)
- **Recharts** (gráficos), **Leaflet** (mapas), **jsPDF** + **html2canvas** (PDF),
  **react-quill** (editor de texto), **framer-motion** (animações), entre outros
- **react-hook-form** + **zod** (formulários e validação)

## Como rodar

**Pré-requisitos:** Node.js 18+ (recomendado 20+).

```bash
npm install      # instala as dependências
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção (pasta dist/)
npm run preview  # serve o build de produção localmente
npm run lint     # checagem de lint (ESLint)
```

Não há variáveis de ambiente obrigatórias. O app abre direto, já autenticado com um usuário
local de exemplo.

## Telas

Todas as telas abaixo ficam dentro do `Layout` (sidebar + topo). A sidebar mostra o grupo
**Clínica Médica** e, no rodapé, um botão **"LP"** que expande as 3 landing pages.

| Rota | Tela | O que faz |
|---|---|---|
| `/` | **Dashboard** | Visão geral da clínica com indicadores e gráficos (pacientes, agendamentos, financeiro, mensagens). |
| `/agendamentos` | **Agendamentos** | Agenda de consultas (entidade `Appointment`): criar/editar/excluir, status (Agendado, Confirmado, Realizado, etc.), tipo, convênio. |
| `/pacientes` | **Pacientes** | Cadastro de pacientes (`Patient`): dados pessoais, contato, origem, status. |
| `/financeiro` | **Financeiro** | Receitas e custos (`FinancialRecord`) com análise por categoria e período. |
| `/leads` | **Leads / Kanban** | Funil de leads das conversas (integra com Chatwoot via `functions.invoke` — *stub*). |
| `/whatsapp` | **WhatsApp** | Caixa de mensagens (`WhatsAppMessage`) e envio (Chatwoot — *stub*). |
| `/assistente` | **Fale com a Elo4h** | Assistente de IA com histórico de conversas (`localAgents` — resposta *stub*). |
| `/configuracoes` | **Configurações** | Dados da clínica (`ClinicSettings`): nome, horários, duração de slot, WhatsApp, prompt da IA. |
| `/usuarios` | **Usuários** | Gestão de usuários (`User`) e papéis. |
| `/landing`, `/landing2`, `/landing3` | **Landing Pages** | Três variações de página de divulgação (abertas pelo botão "LP"). |

## Modo de dados local

No lugar de um backend, o app usa uma **camada de dados local** em `src/api/`:

| Arquivo | Responsabilidade |
|---|---|
| `seedData.js` | **Dados das entidades, escritos direto no código** (pacientes, agendamentos, financeiro, mensagens, configurações, usuário). |
| `localDb.js` | Camada genérica de entidades (`list`/`filter`/`get`/`create`/`update`/`delete`/`subscribe`) sobre o `localStorage`. |
| `localAgents.js` | Assistente de IA local (mantém conversas; a resposta é um *stub*, pois a IA real exige um provedor externo). |
| `client.js` | Monta o objeto **`api`** (`entities` / `auth` / `integrations` / `functions` / `agents`) a partir das peças acima. É a interface usada em todo o app: `import { api } from "@/api/client"`. |
| `../lib/AuthContext.jsx` | Autenticação local (sempre autenticado; sem rede e sem login externo). |

**Persistência:** na primeira execução, os dados de `seedData.js` são carregados; as alterações
feitas no app ficam salvas no `localStorage` do navegador (chaves com prefixo `4him_db_`).
Para restaurar os dados originais, limpe o `localStorage` do site.

### Entidades

`Patient`, `Appointment`, `FinancialRecord`, `ClinicSettings`, `WhatsAppMessage`, `User`.
Os esquemas de referência ficam em `reference/entities/*.jsonc` (e o agente Elo4h em
`reference/agents/elo4h.jsonc`) — material de referência, **não** usado em runtime.

### O que está em modo stub (precisa de backend para funcionar de verdade)

Estes recursos dependem de serviços externos e hoje retornam respostas seguras (não quebram a UI),
mas **não** executam de verdade no modo local:

- **IA** — `api.integrations.Core.InvokeLLM` e o assistente **Elo4h** (`api.agents`).
- **WhatsApp / Leads** — `api.functions.invoke("chatwoot", …)` (integração Chatwoot externa).
- **Envio de e-mail** — `api.integrations.Core.SendEmail`.

## Estrutura

```
src/
  api/          # camada de dados local (client.js, localDb.js, localAgents.js, seedData.js)
  components/   # Layout, ProtectedRoute, UserNotRegisteredError, ui/ (shadcn)
                # + por domínio: appointments, assistant, chatwoot, dashboard,
                #   financial, patients, whatsapp
  lib/          # AuthContext, PageNotFound, query-client, utils
  pages/        # telas da clínica + landing pages
public/images/  # logos servidos localmente
reference/      # esquemas de entidades e agentes (.jsonc) — referência, NÃO usado em runtime
```

## Plugando um banco/serviço real depois

A aplicação inteira consome `api.entities.X` com um contrato simples, então basta trocar a
implementação **sem mexer nos componentes**:

1. **Dados:** reimplemente `createCollection` em `src/api/localDb.js` (ou substitua `src/api/client.js`)
   apontando para a sua API — Supabase, REST, etc. Os esquemas estão em `reference/entities/*.jsonc`
   e refletidos em `src/api/seedData.js`.
2. **Login:** reimplemente `checkUserAuth`, `logout` e `navigateToLogin` em `src/lib/AuthContext.jsx`.
3. **IA / integrações:** implemente as chamadas reais em `src/api/client.js` e `src/api/localAgents.js`
   (IA, Chatwoot/WhatsApp, e-mail).
