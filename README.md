# 4Him

Aplicação web (React + Vite) com dois módulos — **Clínica Médica** e **Advocacia** — incluindo
dashboards, agendamentos, financeiro, gestão de clientes/pacientes, processos, peças jurídicas,
integração de WhatsApp/Leads e assistente de IA.

> **Independente do Base44.** Este projeto **não** depende mais da plataforma Base44 (nem do SDK,
> nem do plugin de build, nem do login/hospedagem do Base44). Você commita, roda e publica por
> conta própria. Veja [Modo de dados local](#modo-de-dados-local) abaixo.

## Stack

- **React 18** + **Vite 6**
- **React Router** (navegação)
- **Tailwind CSS** + **shadcn/ui** (Radix UI)
- **TanStack Query** (estado assíncrono)
- **Recharts** (gráficos), **Leaflet**, **jsPDF**, **react-quill**, entre outros

## Como rodar

**Pré-requisitos:** Node.js 18+ (recomendado 20+).

```bash
npm install      # instala as dependências
npm run dev      # ambiente de desenvolvimento (http://localhost:5173)
npm run build    # build de produção (pasta dist/)
npm run preview  # serve o build de produção localmente
npm run lint     # checagem de lint
```

Não há variáveis de ambiente obrigatórias. O app abre direto, já autenticado com um usuário
local de exemplo.

## Modo de dados local

No lugar do backend do Base44, o app usa uma **camada de dados local**:

| Arquivo | Responsabilidade |
|---|---|
| `src/api/seedData.js` | **Os dados das entidades, escritos direto no código** (pacientes, agendamentos, clientes, processos, financeiro, etc.). |
| `src/api/localDb.js` | Camada genérica que emula a API de entidades (`list`/`filter`/`get`/`create`/`update`/`delete`/`subscribe`) sobre o `localStorage`. |
| `src/api/localAgents.js` | Assistente de IA local (mantém conversas; resposta é um stub, pois a IA real exige um provedor externo). |
| `src/api/base44Client.js` | Monta o objeto `base44` (entities/auth/integrations/functions/agents) a partir das peças acima. **Mantém a mesma interface** usada em todo o app. |
| `src/lib/AuthContext.jsx` | Autenticação local (sempre autenticado; sem rede e sem redirecionar para login externo). |

**Persistência:** na primeira execução, os dados de `seedData.js` são carregados; as alterações
feitas no app ficam salvas no `localStorage` do navegador (chaves com prefixo `4him_db_`).
Para restaurar os dados originais, limpe o `localStorage` do site.

### O que está em modo stub (precisa de backend para funcionar de verdade)

Estes recursos dependem de serviços externos e hoje retornam respostas seguras (não quebram a UI),
mas **não** executam de verdade no modo local:

- **IA** (`InvokeLLM` e os assistentes Elo4h/Lex) — conecte um provedor (ex.: Claude API).
- **WhatsApp / Leads** (`functions.invoke("chatwoot", …)`) — integração Chatwoot externa.
- **Envio de e-mail** (`SendEmail`).

## Plugando um banco/serviço real depois

A aplicação inteira consome `base44.entities.X` com um contrato simples, então basta trocar a
implementação **sem mexer nos componentes**:

1. **Dados:** reimplemente `createCollection` em `src/api/localDb.js` (ou substitua `base44Client.js`)
   apontando para a sua API — Supabase, REST, etc. Os esquemas das entidades estão documentados em
   `base44/entities/*.jsonc` e refletidos em `src/api/seedData.js`.
2. **Login:** reimplemente `checkUserAuth`, `logout` e `navigateToLogin` em `src/lib/AuthContext.jsx`.
3. **IA / integrações:** implemente as chamadas reais em `src/api/base44Client.js` e
   `src/api/localAgents.js`.

## Estrutura

```
src/
  api/         # camada de dados local (substitui o backend)
  components/  # componentes (incl. ui/ do shadcn) e modais por módulo
  lib/         # AuthContext, utils, templates, query-client
  pages/       # telas da clínica e de advocacia (pages/law/*)
public/images/ # logos servidos localmente
base44/        # esquemas de entidades/funções/agentes (referência — não é usado em runtime)
```
