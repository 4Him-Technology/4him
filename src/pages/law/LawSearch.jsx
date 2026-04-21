import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Scale, Hash, User, FileText, Loader2 } from "lucide-react";
import ProcessCard from "@/components/law/ProcessCard";
import LinkProcessModal from "@/components/law/LinkProcessModal";

export default function LawSearch() {
  const [query, setQuery] = useState("");
  const [searchType, setSearchType] = useState("numero"); // numero | parte | assunto
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [clients, setClients] = useState([]);
  const [linkingProcess, setLinkingProcess] = useState(null);

  useEffect(() => {
    base44.entities.LegalClient.list("-created_date", 300).then(setClients);
  }, []);

  async function handleSearch() {
    if (!query.trim()) return;
    setLoading(true);
    setResults(null);

    const typeLabel = {
      numero: `número do processo "${query}"`,
      parte: `parte/nome "${query}"`,
      cpf: `CPF ou CNPJ "${query}" (busque processos vinculados a este documento)`,
      assunto: `assunto/tema "${query}"`,
    }[searchType];

    const prompt = `Você é um assistente jurídico especializado em processos judiciais brasileiros.
Pesquise informações sobre processos judiciais por ${typeLabel} nos tribunais brasileiros (TJ, TRT, TRF, STJ, STF, JusBrasil, etc.).

Retorne um JSON com os processos encontrados. Se não encontrar dados reais, simule processos plausíveis baseados na busca, mas indique que são dados aproximados.

Retorne EXATAMENTE neste formato:
{
  "processos": [
    {
      "numero": "número completo do processo no formato CNJ",
      "tribunal": "nome do tribunal (ex: TJSP, TRT2, TRF3)",
      "vara": "vara ou câmara",
      "classe": "classe processual (ex: Ação Civil, Reclamação Trabalhista)",
      "assunto": "assunto principal",
      "area": "área jurídica (Cível/Criminal/Trabalhista/Família/Tributário/Empresarial/Previdenciário/Outro)",
      "partes": {
        "autor": "nome do autor/reclamante",
        "reu": "nome do réu/reclamado"
      },
      "ultima_movimentacao": "descrição da última movimentação",
      "data_ultima_movimentacao": "data no formato DD/MM/AAAA",
      "data_distribuicao": "data de distribuição no formato DD/MM/AAAA",
      "status": "Ativo/Encerrado/Suspenso/Arquivado",
      "valor_causa": "valor da causa formatado em reais (ex: R$ 50.000,00) ou null",
      "fonte": "JusBrasil/TJSP/TRT2/etc",
      "url_externo": "https://www.jusbrasil.com.br/processos/..." 
    }
  ],
  "total_encontrado": número,
  "observacao": "nota sobre a busca (se dados são reais, aproximados, etc.)"
}`;

    const response = await base44.integrations.Core.InvokeLLM({
      prompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          processos: {
            type: "array",
            items: {
              type: "object",
              properties: {
                numero: { type: "string" },
                tribunal: { type: "string" },
                vara: { type: "string" },
                classe: { type: "string" },
                assunto: { type: "string" },
                area: { type: "string" },
                partes: {
                  type: "object",
                  properties: {
                    autor: { type: "string" },
                    reu: { type: "string" },
                  }
                },
                ultima_movimentacao: { type: "string" },
                data_ultima_movimentacao: { type: "string" },
                data_distribuicao: { type: "string" },
                status: { type: "string" },
                valor_causa: { type: "string" },
                fonte: { type: "string" },
                url_externo: { type: "string" },
              }
            }
          },
          total_encontrado: { type: "number" },
          observacao: { type: "string" },
        }
      }
    });

    setResults(response);
    setLoading(false);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleSearch();
  }

  const searchTypes = [
    { value: "numero", label: "Nº do Processo", icon: Hash },
    { value: "parte", label: "Nome da Parte", icon: User },
    { value: "cpf", label: "CPF / CNPJ", icon: User },
    { value: "assunto", label: "Assunto / Tema", icon: FileText },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-700/10 flex items-center justify-center">
          <Scale className="w-5 h-5 text-amber-700" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pesquisa de Processos</h1>
          <p className="text-sm text-muted-foreground">Busque processos nos tribunais e vincule aos seus clientes</p>
        </div>
      </div>

      {/* Search Panel */}
      <div className="bg-card rounded-xl border border-border p-6 space-y-4">
        {/* Type selector */}
        <div className="flex gap-2 flex-wrap">
          {searchTypes.map(({ value, label, icon: Icon }) => (
            <button
              key={value}
              onClick={() => setSearchType(value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                searchType === value
                  ? "bg-amber-700 text-white border-amber-700"
                  : "bg-background text-muted-foreground border-border hover:border-amber-600/50 hover:text-foreground"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                searchType === "numero"
                  ? "Ex: 1234567-89.2024.8.26.0100"
                  : searchType === "parte"
                  ? "Ex: Carlos Eduardo Mendonça"
                  : searchType === "cpf"
                  ? "Ex: 123.456.789-00 ou 12.345.678/0001-90"
                  : "Ex: indenização por danos morais, trabalhista"
              }
              className="pl-10 h-11 text-sm"
            />
          </div>
          <Button onClick={handleSearch} disabled={loading || !query.trim()} className="h-11 px-6 gap-2 bg-amber-700 hover:bg-amber-800 text-white">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {loading ? "Buscando..." : "Buscar"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground">
          A busca utiliza IA com acesso à internet para encontrar dados nos tribunais brasileiros e JusBrasil.
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-amber-700" />
          <p className="text-sm font-medium">Pesquisando nos tribunais...</p>
          <p className="text-xs">Isso pode levar alguns segundos</p>
        </div>
      )}

      {/* Results */}
      {results && !loading && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-foreground">
                {results.total_encontrado || results.processos?.length || 0} processo(s) encontrado(s)
              </p>
              {results.observacao && (
                <p className="text-xs text-muted-foreground mt-0.5">{results.observacao}</p>
              )}
            </div>
          </div>

          {results.processos?.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
                <Search className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground">Nenhum processo encontrado</p>
              <p className="text-sm text-muted-foreground">Tente buscar por número completo ou nome diferente</p>
            </div>
          )}

          {results.processos?.map((proc, i) => (
            <ProcessCard
              key={i}
              processo={proc}
              onLink={() => setLinkingProcess(proc)}
            />
          ))}
        </div>
      )}

      {/* Link Modal */}
      {linkingProcess && (
        <LinkProcessModal
          processo={linkingProcess}
          clients={clients}
          onClose={() => setLinkingProcess(null)}
          onLinked={() => {
            setLinkingProcess(null);
          }}
        />
      )}
    </div>
  );
}