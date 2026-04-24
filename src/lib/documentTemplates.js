// Templates de Peças Processuais - campos variáveis + corpo do documento
export const DOCUMENT_TEMPLATES = [
  {
    id: "peticao_inicial",
    name: "Petição Inicial",
    description: "Peça inaugural para distribuição de ação judicial com qualificação das partes, fatos, direito e pedidos.",
    category: "Petição",
    icon: "gavel",
    fields: [
      { key: "vara", label: "Vara / Juízo Competente", type: "text", placeholder: "Ex: 3ª Vara Cível da Comarca de São Paulo", required: true },
      { key: "autor", label: "Nome do Autor", type: "text", placeholder: "Nome completo do requerente", required: true },
      { key: "cpf_autor", label: "CPF / CNPJ do Autor", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "estado_civil", label: "Estado Civil", type: "select", options: ["solteiro(a)", "casado(a)", "divorciado(a)", "viúvo(a)", "união estável"], required: true },
      { key: "profissao", label: "Profissão", type: "text", placeholder: "Ex: comerciante", required: true },
      { key: "endereco_autor", label: "Endereço do Autor", type: "text", placeholder: "Rua, número, bairro, cidade, estado", required: true },
      { key: "reu", label: "Nome do Réu", type: "text", placeholder: "Nome completo ou razão social do réu", required: true },
      { key: "cpf_reu", label: "CPF / CNPJ do Réu", type: "text", placeholder: "000.000.000-00" },
      { key: "endereco_reu", label: "Endereço do Réu", type: "text", placeholder: "Endereço para citação do réu" },
      { key: "area", label: "Área do Direito", type: "select", options: ["Cível", "Consumidor", "Família", "Empresarial", "Trabalhista", "Previdenciário", "Tributário"], required: true },
      { key: "valor_causa", label: "Valor da Causa (R$)", type: "text", placeholder: "Ex: R$ 15.000,00", required: true },
      { key: "fatos", label: "Dos Fatos", type: "textarea", placeholder: "Descreva cronologicamente os fatos que embasam a ação...", required: true },
      { key: "fundamentos", label: "Do Direito / Fundamentos Jurídicos", type: "textarea", placeholder: "Cite os dispositivos legais, jurisprudências e doutrina aplicáveis...", required: true },
      { key: "pedidos", label: "Dos Pedidos", type: "textarea", placeholder: "Liste todos os pedidos de forma numerada...", required: true },
      { key: "advogado", label: "Advogado(a) Subscritor", type: "text", placeholder: "Dr(a). Nome completo", required: true },
      { key: "oab", label: "OAB", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "cidade", label: "Cidade e Data", type: "text", placeholder: "São Paulo, 24 de abril de 2026", required: true },
    ],
    body: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{vara}}

{{autor}}, {{estado_civil}}, {{profissao}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_autor}}, residente e domiciliado(a) na {{endereco_autor}}, por seu(sua) advogado(a) infra-assinado(a), vem, respeitosamente, à presença de Vossa Excelência, propor a presente

AÇÃO — ÁREA: {{area}}

em face de {{reu}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_reu}}, com endereço em {{endereco_reu}}, pelos fundamentos de fato e de direito a seguir expostos.

I – DOS FATOS

{{fatos}}

II – DO DIREITO

{{fundamentos}}

III – DOS PEDIDOS

Ante o exposto, requer-se a Vossa Excelência que se digne a:

{{pedidos}}

IV – DO VALOR DA CAUSA

Dá-se à presente causa o valor de {{valor_causa}}.

V – DAS PROVAS

O(A) Autor(a) pretende provar o alegado por todos os meios de prova em direito admitidos, especialmente documental, testemunhal e pericial.

Nestes termos,
Pede deferimento.

{{cidade}}

{{advogado}}
{{oab}}`
  },

  {
    id: "contestacao",
    name: "Contestação",
    description: "Resposta do réu à petição inicial, com preliminares, mérito e impugnação aos pedidos do autor.",
    category: "Contestação",
    icon: "shield",
    fields: [
      { key: "vara", label: "Vara / Juízo", type: "text", placeholder: "Ex: 2ª Vara do Trabalho de Campinas", required: true },
      { key: "processo", label: "Número do Processo", type: "text", placeholder: "0000000-00.0000.0.00.0000", required: true },
      { key: "reu", label: "Nome do Réu (Contestante)", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "cpf_reu", label: "CPF / CNPJ do Réu", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "autor", label: "Nome do Autor (Requerente)", type: "text", placeholder: "Nome completo do autor da ação", required: true },
      { key: "preliminares", label: "Das Preliminares (opcional)", type: "textarea", placeholder: "Ex: incompetência do juízo, ilegitimidade de parte, inépcia da inicial... (deixe em branco se não houver)" },
      { key: "impugnacao_fatos", label: "Impugnação dos Fatos", type: "textarea", placeholder: "Apresente a versão do réu e negue especificadamente os fatos narrados pelo autor...", required: true },
      { key: "fundamentos_defesa", label: "Fundamentos Jurídicos da Defesa", type: "textarea", placeholder: "Cite os dispositivos legais, jurisprudências e doutrina que embasam a defesa...", required: true },
      { key: "pedidos_contestacao", label: "Dos Pedidos", type: "textarea", placeholder: "Ex: seja julgado improcedente o pedido; seja reconhecida a prescrição...", required: true },
      { key: "advogado", label: "Advogado(a) Subscritor", type: "text", placeholder: "Dr(a). Nome completo", required: true },
      { key: "oab", label: "OAB", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "cidade", label: "Cidade e Data", type: "text", placeholder: "São Paulo, 24 de abril de 2026", required: true },
    ],
    body: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{vara}}

Processo nº {{processo}}

{{reu}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_reu}}, parte Ré nos autos do processo em epígrafe, movido por {{autor}}, por seu(sua) advogado(a) infra-assinado(a), vem, tempestivamente, apresentar sua

CONTESTAÇÃO

pelos fundamentos de fato e de direito a seguir expostos.

I – DAS PRELIMINARES

{{preliminares}}

II – DA IMPUGNAÇÃO AOS FATOS

A Ré impugna, especificadamente, os fatos narrados na peça inaugural, pelos seguintes motivos:

{{impugnacao_fatos}}

III – DO MÉRITO

{{fundamentos_defesa}}

IV – DOS PEDIDOS

Diante do exposto, requer-se:

{{pedidos_contestacao}}

V – DAS PROVAS

A Ré pretende comprovar suas alegações por todos os meios de prova em direito admitidos, especialmente documental, testemunhal e pericial.

Nestes termos,
Pede deferimento.

{{cidade}}

{{advogado}}
{{oab}}`
  },

  {
    id: "recurso_apelacao",
    name: "Recurso de Apelação",
    description: "Recurso para reformar sentença de primeiro grau perante o Tribunal de Justiça.",
    category: "Recurso",
    icon: "arrow-up-circle",
    fields: [
      { key: "tribunal", label: "Tribunal Destinatário", type: "text", placeholder: "Ex: Tribunal de Justiça do Estado de São Paulo", required: true },
      { key: "vara_origem", label: "Vara de Origem", type: "text", placeholder: "Ex: 5ª Vara Cível de Santos", required: true },
      { key: "processo", label: "Número do Processo", type: "text", placeholder: "0000000-00.0000.0.00.0000", required: true },
      { key: "recorrente", label: "Nome do Recorrente", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "recorrido", label: "Nome do Recorrido", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "data_sentenca", label: "Data da Sentença", type: "date", required: true },
      { key: "sintese_sentenca", label: "Síntese da Sentença Recorrida", type: "textarea", placeholder: "Resuma o que decidiu o juiz e porque o recorrente discorda...", required: true },
      { key: "razoes", label: "Das Razões do Recurso", type: "textarea", placeholder: "Fundamente detalhadamente os erros da sentença, citando leis e jurisprudências...", required: true },
      { key: "pedido_recursal", label: "Do Pedido Recursal", type: "textarea", placeholder: "Ex: dar provimento ao recurso para reformar a sentença e julgar procedente o pedido inicial...", required: true },
      { key: "advogado", label: "Advogado(a) Subscritor", type: "text", placeholder: "Dr(a). Nome completo", required: true },
      { key: "oab", label: "OAB", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "cidade", label: "Cidade e Data", type: "text", placeholder: "São Paulo, 24 de abril de 2026", required: true },
    ],
    body: `EGRÉGIO {{tribunal}}
CÂMARA / TURMA: _______________________________

Processo nº {{processo}}
Vara de Origem: {{vara_origem}}

{{recorrente}}, parte nos autos do processo acima referenciado, por seu(sua) advogado(a) infra-assinado(a), vem, tempestivamente e com fundamento no art. 1.009 do CPC, interpor o presente

RECURSO DE APELAÇÃO

em face da sentença proferida em {{data_sentenca}}, pelos seguintes fundamentos.

I – DA ADMISSIBILIDADE

O presente recurso é próprio, tempestivo, possui preparo e legitimidade recursal, preenchendo todos os requisitos de admissibilidade previstos nos arts. 1.009 a 1.014 do CPC.

II – DA SENTENÇA RECORRIDA

{{sintese_sentenca}}

III – DAS RAZÕES DO RECURSO

{{razoes}}

IV – DO PEDIDO

Ante o exposto, requer o(a) {{recorrente}} seja o presente recurso conhecido e provido, para que:

{{pedido_recursal}}

Nestes termos,
Pede deferimento.

{{cidade}}

{{advogado}}
{{oab}}`
  },

  {
    id: "agravo_instrumento",
    name: "Agravo de Instrumento",
    description: "Recurso cabível contra decisões interlocutórias, com pedido de efeito suspensivo.",
    category: "Recurso",
    icon: "alert-triangle",
    fields: [
      { key: "tribunal", label: "Tribunal Destinatário", type: "text", placeholder: "Ex: Tribunal de Justiça do Estado do Rio de Janeiro", required: true },
      { key: "processo", label: "Número do Processo de Origem", type: "text", placeholder: "0000000-00.0000.0.00.0000", required: true },
      { key: "agravante", label: "Nome do Agravante", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "agravado", label: "Nome do Agravado", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "decisao_agravada", label: "Síntese da Decisão Agravada", type: "textarea", placeholder: "Descreva o conteúdo da decisão interlocutória recorrida...", required: true },
      { key: "razoes", label: "Das Razões do Agravo", type: "textarea", placeholder: "Fundamente o error in procedendo ou in judicando da decisão...", required: true },
      { key: "pedido_efeito_suspensivo", label: "Pedido de Efeito Suspensivo / Tutela", type: "textarea", placeholder: "Justifique a urgência e o risco de dano irreparável...", required: true },
      { key: "pedido", label: "Do Pedido Final", type: "textarea", placeholder: "Ex: seja concedido o efeito suspensivo e dado provimento ao agravo...", required: true },
      { key: "advogado", label: "Advogado(a) Subscritor", type: "text", placeholder: "Dr(a). Nome completo", required: true },
      { key: "oab", label: "OAB", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "cidade", label: "Cidade e Data", type: "text", placeholder: "Rio de Janeiro, 24 de abril de 2026", required: true },
    ],
    body: `EGRÉGIO {{tribunal}}

Processo de Origem nº {{processo}}

{{agravante}}, parte nos autos do processo acima referenciado, por seu(sua) advogado(a) infra-assinado(a), vem, tempestivamente, com fundamento no art. 1.015 do CPC, interpor o presente

AGRAVO DE INSTRUMENTO

em face de {{agravado}}, pelos fundamentos a seguir expostos.

I – DA DECISÃO AGRAVADA

{{decisao_agravada}}

II – DAS RAZÕES DO AGRAVO

{{razoes}}

III – DO PEDIDO DE EFEITO SUSPENSIVO / TUTELA ANTECIPADA RECURSAL

Presentes o fumus boni iuris e o periculum in mora, requer-se a concessão de efeito suspensivo / tutela antecipada recursal:

{{pedido_efeito_suspensivo}}

IV – DO PEDIDO

Diante do exposto, requer:

{{pedido}}

Nestes termos,
Pede deferimento.

{{cidade}}

{{advogado}}
{{oab}}`
  },

  {
    id: "embargos_declaracao",
    name: "Embargos de Declaração",
    description: "Peça para sanar omissão, contradição, obscuridade ou erro material em decisão judicial.",
    category: "Recurso",
    icon: "file-question",
    fields: [
      { key: "vara", label: "Vara / Juízo", type: "text", placeholder: "Ex: 1ª Vara Federal de Brasília", required: true },
      { key: "processo", label: "Número do Processo", type: "text", placeholder: "0000000-00.0000.0.00.0000", required: true },
      { key: "embargante", label: "Nome do Embargante", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "embargado", label: "Nome do Embargado", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "tipo_vicio", label: "Tipo de Vício", type: "select", options: ["Omissão", "Contradição", "Obscuridade", "Erro Material", "Omissão e Contradição"], required: true },
      { key: "fundamentacao", label: "Da Fundamentação", type: "textarea", placeholder: "Aponte precisamente onde se encontra o vício na decisão e como ele deve ser sanado...", required: true },
      { key: "pedido", label: "Do Pedido", type: "textarea", placeholder: "Ex: sejam acolhidos os embargos para sanar a omissão quanto ao capítulo de custas...", required: true },
      { key: "advogado", label: "Advogado(a) Subscritor", type: "text", placeholder: "Dr(a). Nome completo", required: true },
      { key: "oab", label: "OAB", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "cidade", label: "Cidade e Data", type: "text", placeholder: "Brasília, 24 de abril de 2026", required: true },
    ],
    body: `EXCELENTÍSSIMO(A) SENHOR(A) DOUTOR(A) JUIZ(A) DE DIREITO DA {{vara}}

Processo nº {{processo}}

{{embargante}}, parte nos autos do processo em epígrafe, por seu(sua) advogado(a) infra-assinado(a), vem, tempestivamente e com fundamento no art. 1.022 do CPC, opor os presentes

EMBARGOS DE DECLARAÇÃO

em face da decisão/sentença proferida nestes autos, com vício de {{tipo_vicio}}, pelos seguintes fundamentos.

I – DA TEMPESTIVIDADE

Os presentes embargos são tempestivos, interpostos no prazo de 5 (cinco) dias úteis previsto no art. 1.023 do CPC.

II – DOS FUNDAMENTOS

{{fundamentacao}}

III – DO PEDIDO

Diante do exposto, requer seja intimado o(a) {{embargado}} para, querendo, impugnar os presentes embargos, e ao final sejam os mesmos acolhidos para:

{{pedido}}

Nestes termos,
Pede deferimento.

{{cidade}}

{{advogado}}
{{oab}}`
  },

  {
    id: "habeas_corpus",
    name: "Habeas Corpus",
    description: "Ação constitucional para tutelar a liberdade de locomoção contra ato ilegal ou abuso de poder.",
    category: "Constitucional",
    icon: "lock-open",
    fields: [
      { key: "tribunal", label: "Tribunal Destinatário", type: "text", placeholder: "Ex: Egrégio Tribunal de Justiça do Estado de Minas Gerais", required: true },
      { key: "paciente", label: "Nome do Paciente", type: "text", placeholder: "Nome completo do preso / ameaçado", required: true },
      { key: "cpf_paciente", label: "CPF do Paciente", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "autoridade_coatora", label: "Autoridade Coatora", type: "text", placeholder: "Ex: MM. Juiz de Direito da 3ª Vara Criminal de BH", required: true },
      { key: "situacao_prisao", label: "Situação da Prisão / Constrangimento", type: "textarea", placeholder: "Descreva como, quando e por que o paciente está preso ou ameaçado de prisão...", required: true },
      { key: "ilegalidade", label: "Da Ilegalidade / Abuso de Poder", type: "textarea", placeholder: "Fundamente juridicamente a ilegalidade do ato coator...", required: true },
      { key: "pedido_liminar", label: "Do Pedido Liminar", type: "textarea", placeholder: "Justifique a urgência e requeira a liminar de soltura ou salvo-conduto...", required: true },
      { key: "pedido_merito", label: "Do Pedido de Mérito", type: "textarea", placeholder: "Ex: seja concedida a ordem de habeas corpus para expedição de alvará de soltura...", required: true },
      { key: "advogado", label: "Advogado(a) Impetrante", type: "text", placeholder: "Dr(a). Nome completo", required: true },
      { key: "oab", label: "OAB", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "cidade", label: "Cidade e Data", type: "text", placeholder: "Belo Horizonte, 24 de abril de 2026", required: true },
    ],
    body: `{{tribunal}}

{{paciente}}, inscrito(a) no CPF sob o nº {{cpf_paciente}}, por seu(sua) advogado(a) infra-assinado(a), vem, com fundamento no art. 5º, LXVIII, da Constituição Federal e nos arts. 647 e seguintes do CPP, impetrar o presente

HABEAS CORPUS

com pedido de LIMINAR, em face de ato atribuído a {{autoridade_coatora}}, pelos seguintes fundamentos.

I – DA SITUAÇÃO DE FATO

{{situacao_prisao}}

II – DA ILEGALIDADE DO ATO COATOR

{{ilegalidade}}

III – DO PEDIDO LIMINAR

Presente a fumaça do bom direito e o perigo de demora, requer a concessão de medida liminar para:

{{pedido_liminar}}

IV – DO PEDIDO DE MÉRITO

Ante o exposto, requer ao final seja concedida a ordem de habeas corpus para:

{{pedido_merito}}

Nestes termos,
Pede deferimento.

{{cidade}}

{{advogado}}
{{oab}}`
  },

  {
    id: "notificacao_extrajudicial",
    name: "Notificação Extrajudicial",
    description: "Instrumento para constituir em mora, exigir obrigação ou preservar direitos antes de ajuizar ação.",
    category: "Extrajudicial",
    icon: "bell",
    fields: [
      { key: "notificante", label: "Nome do Notificante", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "cpf_notificante", label: "CPF / CNPJ do Notificante", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "notificado", label: "Nome do Notificado", type: "text", placeholder: "Nome completo ou razão social do destinatário", required: true },
      { key: "endereco_notificado", label: "Endereço do Notificado", type: "text", placeholder: "Rua, número, bairro, cidade, estado", required: true },
      { key: "objeto_notificacao", label: "Objeto da Notificação", type: "textarea", placeholder: "Descreva a obrigação exigida, a mora constituída ou o direito preservado...", required: true },
      { key: "prazo", label: "Prazo para Cumprimento", type: "text", placeholder: "Ex: 10 (dez) dias corridos", required: true },
      { key: "consequencias", label: "Consequências do Descumprimento", type: "textarea", placeholder: "Ex: ajuizamento de ação judicial, cobrança de multa contratual, rescisão...", required: true },
      { key: "advogado", label: "Advogado(a) Subscritor", type: "text", placeholder: "Dr(a). Nome completo", required: true },
      { key: "oab", label: "OAB", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "cidade", label: "Cidade e Data", type: "text", placeholder: "Curitiba, 24 de abril de 2026", required: true },
    ],
    body: `NOTIFICAÇÃO EXTRAJUDICIAL

Ao Senhor(a)
{{notificado}}
{{endereco_notificado}}

{{notificante}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_notificante}}, por seu(sua) advogado(a) infra-assinado(a), vem, por meio desta NOTIFICAÇÃO EXTRAJUDICIAL, notificar Vossa Senhoria nos seguintes termos:

I – DO OBJETO

{{objeto_notificacao}}

II – DO PRAZO

Fica Vossa Senhoria notificado(a) a cumprir a obrigação acima descrita no prazo de {{prazo}}, contado do recebimento da presente notificação.

III – DAS CONSEQUÊNCIAS DO DESCUMPRIMENTO

O descumprimento da presente notificação no prazo estabelecido implicará:

{{consequencias}}

Serve a presente notificação, ainda, para preservação dos direitos do notificante e constituição em mora do notificado, nos termos dos arts. 394 e 397 do Código Civil.

{{cidade}}

{{advogado}}
{{oab}}`
  },

  {
    id: "acordo_extrajudicial",
    name: "Acordo Extrajudicial",
    description: "Instrumento de composição amigável entre partes para evitar ou encerrar litígios.",
    category: "Extrajudicial",
    icon: "handshake",
    fields: [
      { key: "parte1", label: "Nome da 1ª Parte", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "cpf1", label: "CPF / CNPJ da 1ª Parte", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "parte2", label: "Nome da 2ª Parte", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "cpf2", label: "CPF / CNPJ da 2ª Parte", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "objeto_controversia", label: "Objeto da Controvérsia", type: "textarea", placeholder: "Descreva o que originou o conflito entre as partes...", required: true },
      { key: "termos_acordo", label: "Termos do Acordo", type: "textarea", placeholder: "Descreva detalhadamente o que cada parte se obriga a fazer...", required: true },
      { key: "valor", label: "Valor Total do Acordo (R$)", type: "text", placeholder: "Ex: R$ 8.000,00 (se houver)" },
      { key: "forma_pagamento", label: "Forma de Pagamento", type: "text", placeholder: "Ex: 2 parcelas de R$ 4.000,00, 30/60 dias" },
      { key: "quitacao", label: "Cláusula de Quitação", type: "textarea", placeholder: "Descreva o que está sendo quitado e em que extensão..." },
      { key: "cidade", label: "Cidade e Data", type: "text", placeholder: "Porto Alegre, 24 de abril de 2026", required: true },
    ],
    body: `ACORDO EXTRAJUDICIAL DE QUITAÇÃO E COMPOSIÇÃO AMIGÁVEL

Pelo presente instrumento particular, as partes abaixo qualificadas:

PRIMEIRA PARTE: {{parte1}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf1}};

SEGUNDA PARTE: {{parte2}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf2}};

têm entre si, justo e acordado, o presente ACORDO EXTRAJUDICIAL, mediante as seguintes cláusulas:

CLÁUSULA 1ª – DO OBJETO DA CONTROVÉRSIA

{{objeto_controversia}}

CLÁUSULA 2ª – DOS TERMOS DO ACORDO

{{termos_acordo}}

CLÁUSULA 3ª – DO VALOR E PAGAMENTO

As partes acordam o valor total de {{valor}}, a ser pago na seguinte forma: {{forma_pagamento}}.

CLÁUSULA 4ª – DA QUITAÇÃO

{{quitacao}}

Com o cumprimento integral do presente acordo, as partes concedem recíproca e plena quitação das obrigações aqui descritas, comprometendo-se a não ajuizar qualquer ação judicial relacionada ao objeto desta composição.

CLÁUSULA 5ª – DA EFICÁCIA

O presente instrumento é celebrado em caráter irrevogável e irretratável, obrigando as partes e seus sucessores.

{{cidade}}

______________________________          ______________________________
{{parte1}}                              {{parte2}}
CPF/CNPJ: {{cpf1}}                      CPF/CNPJ: {{cpf2}}

______________________________
Testemunha 1: _____________________ CPF: _______________
Testemunha 2: _____________________ CPF: _______________`
  },
];

// Categorias disponíveis
export const DOCUMENT_CATEGORIES = [
  "Todos",
  "Petição",
  "Contestação",
  "Recurso",
  "Constitucional",
  "Extrajudicial",
];