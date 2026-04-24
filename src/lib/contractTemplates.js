export const TEMPLATES = [
  {
    id: "honorarios",
    name: "Contrato de Honorários Advocatícios",
    description: "Contrato padrão para prestação de serviços jurídicos com cláusulas de honorários, prazos e obrigações.",
    category: "Honorários",
    fields: [
      { key: "contratante", label: "Nome do Contratante", type: "text", placeholder: "Nome completo ou razão social", required: true },
      { key: "cpf_cnpj", label: "CPF / CNPJ do Contratante", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "contratado", label: "Nome do Advogado (Contratado)", type: "text", placeholder: "Dr(a). Nome completo", required: true },
      { key: "oab", label: "OAB do Advogado", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "objeto", label: "Objeto / Causa", type: "textarea", placeholder: "Descreva a causa ou serviço jurídico...", required: true },
      { key: "valor", label: "Valor dos Honorários (R$)", type: "text", placeholder: "Ex: R$ 5.000,00", required: true },
      { key: "forma_pagamento", label: "Forma de Pagamento", type: "select", options: ["À vista", "Parcelado", "Êxito", "Mensal", "Misto"], required: true },
      { key: "parcelas", label: "Detalhes do Pagamento", type: "text", placeholder: "Ex: 3x de R$ 1.666,67" },
      { key: "vigencia", label: "Vigência do Contrato", type: "text", placeholder: "Ex: 12 meses", required: true },
      { key: "data_inicio", label: "Data de Início", type: "date", required: true },
      { key: "cidade", label: "Cidade", type: "text", placeholder: "Ex: São Paulo - SP", required: true },
      { key: "data_assinatura", label: "Data de Assinatura", type: "date", required: true },
    ],
    body: `PREÂMBULO

Pelo presente instrumento particular de Contrato de Prestação de Serviços Advocatícios, de um lado {{contratante}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_cnpj}}, doravante denominado CONTRATANTE; e de outro lado {{contratado}}, advogado(a) inscrito(a) na OAB sob o nº {{oab}}, doravante denominado CONTRATADO; têm entre si justa e acordada a prestação de serviços jurídicos nas condições a seguir estipuladas.

CLÁUSULA 1ª – DO OBJETO

O CONTRATADO obriga-se a prestar ao CONTRATANTE serviços advocatícios referentes a: {{objeto}}.

CLÁUSULA 2ª – DOS HONORÁRIOS

Pela prestação dos serviços acordados, o CONTRATANTE pagará ao CONTRATADO o valor de {{valor}}, na forma de pagamento: {{forma_pagamento}}. {{parcelas}}

CLÁUSULA 3ª – DA VIGÊNCIA

O presente contrato terá vigência de {{vigencia}}, com início em {{data_inicio}}, podendo ser renovado mediante acordo entre as partes.

CLÁUSULA 4ª – DAS OBRIGAÇÕES DO CONTRATADO

O CONTRATADO obriga-se a: (a) prestar os serviços com zelo, diligência e boa-fé, observando o Código de Ética e Disciplina da OAB; (b) informar o CONTRATANTE sobre o andamento do processo; (c) guardar sigilo sobre todas as informações recebidas.

CLÁUSULA 5ª – DAS OBRIGAÇÕES DO CONTRATANTE

O CONTRATANTE obriga-se a: (a) fornecer ao CONTRATADO todos os documentos e informações necessários; (b) efetuar os pagamentos nos prazos acordados; (c) comunicar qualquer alteração nos fatos relevantes ao caso.

CLÁUSULA 6ª – DA RESCISÃO

O presente contrato poderá ser rescindido por qualquer das partes, mediante notificação por escrito com antecedência mínima de 15 (quinze) dias, sem prejuízo da remuneração pelos serviços já prestados.

CLÁUSULA 7ª – DO FORO

As partes elegem o foro da Comarca de {{cidade}} para dirimir quaisquer dúvidas ou litígios decorrentes do presente contrato, com renúncia expressa a qualquer outro, por mais privilegiado que seja.

E por estarem justas e contratadas, as partes assinam o presente instrumento em 2 (duas) vias de igual teor e forma.`,
  },

  {
    id: "prestacao_servicos",
    name: "Contrato de Prestação de Serviços",
    description: "Contrato para formalização de prestação de serviços profissionais em geral.",
    category: "Prestação de Serviços",
    fields: [
      { key: "contratante", label: "Nome do Contratante", type: "text", placeholder: "Nome ou razão social", required: true },
      { key: "cpf_cnpj", label: "CPF / CNPJ do Contratante", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "contratado", label: "Nome do Prestador", type: "text", placeholder: "Nome completo do prestador", required: true },
      { key: "cpf_cnpj_prestador", label: "CPF / CNPJ do Prestador", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "objeto", label: "Serviço Prestado", type: "textarea", placeholder: "Descreva detalhadamente os serviços...", required: true },
      { key: "valor", label: "Valor Total (R$)", type: "text", placeholder: "Ex: R$ 3.000,00", required: true },
      { key: "forma_pagamento", label: "Forma de Pagamento", type: "select", options: ["À vista", "Parcelado", "Mensal", "Quinzenal"], required: true },
      { key: "vigencia", label: "Vigência", type: "text", placeholder: "Ex: 6 meses", required: true },
      { key: "data_inicio", label: "Data de Início", type: "date", required: true },
      { key: "cidade", label: "Cidade", type: "text", placeholder: "Ex: São Paulo - SP", required: true },
      { key: "data_assinatura", label: "Data de Assinatura", type: "date", required: true },
    ],
    body: `PREÂMBULO

Pelo presente instrumento particular, {{contratante}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_cnpj}}, doravante denominado CONTRATANTE; e {{contratado}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_cnpj_prestador}}, doravante denominado CONTRATADO; celebram o presente Contrato de Prestação de Serviços.

CLÁUSULA 1ª – DO OBJETO

O presente contrato tem por objeto a prestação dos seguintes serviços pelo CONTRATADO ao CONTRATANTE: {{objeto}}.

CLÁUSULA 2ª – DO VALOR E PAGAMENTO

Pelos serviços prestados, o CONTRATANTE pagará ao CONTRATADO o valor total de {{valor}}, na modalidade: {{forma_pagamento}}.

CLÁUSULA 3ª – DA VIGÊNCIA

O presente contrato vigorará pelo prazo de {{vigencia}}, com início em {{data_inicio}}.

CLÁUSULA 4ª – DAS OBRIGAÇÕES DAS PARTES

O CONTRATADO obriga-se a executar os serviços com qualidade e dentro dos prazos acordados. O CONTRATANTE obriga-se a fornecer as condições necessárias para a execução dos serviços e efetuar os pagamentos nas datas acordadas.

CLÁUSULA 5ª – DA RESCISÃO

Este contrato poderá ser rescindido por mútuo acordo ou por descumprimento de qualquer cláusula, mediante notificação prévia de 15 (quinze) dias.

CLÁUSULA 6ª – DO FORO

Fica eleito o foro da Comarca de {{cidade}} para dirimir quaisquer controvérsias oriundas deste contrato.`,
  },

  {
    id: "nda",
    name: "Acordo de Confidencialidade (NDA)",
    description: "Documento para proteção de informações sigilosas entre partes em negociação ou parceria.",
    category: "Sigilo",
    fields: [
      { key: "contratante", label: "Parte Divulgadora", type: "text", placeholder: "Nome ou empresa", required: true },
      { key: "cpf_cnpj", label: "CPF / CNPJ da Divulgadora", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "contratado", label: "Parte Receptora", type: "text", placeholder: "Nome ou empresa", required: true },
      { key: "objeto", label: "Natureza das Informações Confidenciais", type: "textarea", placeholder: "Ex: planos de negócio, dados financeiros, tecnologia...", required: true },
      { key: "vigencia", label: "Período de Confidencialidade", type: "text", placeholder: "Ex: 2 anos", required: true },
      { key: "cidade", label: "Cidade", type: "text", placeholder: "Ex: Belo Horizonte - MG", required: true },
      { key: "data_assinatura", label: "Data de Assinatura", type: "date", required: true },
    ],
    body: `PREÂMBULO

Pelo presente instrumento particular de Acordo de Confidencialidade e Não Divulgação, {{contratante}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_cnpj}}, denominada PARTE DIVULGADORA; e {{contratado}}, denominada PARTE RECEPTORA; acordam as seguintes condições.

CLÁUSULA 1ª – DAS INFORMAÇÕES CONFIDENCIAIS

As partes reconhecem que, no âmbito de suas tratativas, a PARTE DIVULGADORA poderá compartilhar com a PARTE RECEPTORA informações de caráter sigiloso, incluindo, mas não se limitando a: {{objeto}}.

CLÁUSULA 2ª – DAS OBRIGAÇÕES DA PARTE RECEPTORA

A PARTE RECEPTORA obriga-se a: (a) manter em sigilo todas as informações recebidas; (b) não divulgar, reproduzir ou utilizar as informações para fins alheios ao acordado; (c) restringir o acesso às informações a colaboradores estritamente necessários.

CLÁUSULA 3ª – DO PRAZO

As obrigações de confidencialidade previstas neste instrumento vigorarão pelo prazo de {{vigencia}} a partir da data de assinatura.

CLÁUSULA 4ª – DAS EXCEÇÕES

As obrigações de sigilo não se aplicam a informações que: (a) sejam ou se tornem de domínio público sem violação deste acordo; (b) tenham sido obtidas legitimamente de terceiros; (c) sejam exigidas por determinação judicial ou legal.

CLÁUSULA 5ª – DAS PENALIDADES

O descumprimento deste acordo sujeitará a parte infratora ao pagamento de perdas e danos, além das sanções legais aplicáveis.

CLÁUSULA 6ª – DO FORO

Fica eleito o foro da Comarca de {{cidade}} para dirimir quaisquer questões oriundas deste instrumento.`,
  },

  {
    id: "locacao",
    name: "Contrato de Locação de Imóvel",
    description: "Formalização de locação residencial ou comercial conforme a Lei do Inquilinato.",
    category: "Locação",
    fields: [
      { key: "contratante", label: "Nome do Locador", type: "text", placeholder: "Nome completo do proprietário", required: true },
      { key: "cpf_cnpj", label: "CPF / CNPJ do Locador", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "contratado", label: "Nome do Locatário", type: "text", placeholder: "Nome completo do inquilino", required: true },
      { key: "cpf_locatario", label: "CPF / CNPJ do Locatário", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "imovel", label: "Endereço do Imóvel", type: "text", placeholder: "Rua, número, bairro, cidade", required: true },
      { key: "valor", label: "Valor do Aluguel (R$)", type: "text", placeholder: "Ex: R$ 1.500,00", required: true },
      { key: "dia_vencimento", label: "Dia de Vencimento", type: "text", placeholder: "Ex: todo dia 10", required: true },
      { key: "vigencia", label: "Prazo da Locação", type: "text", placeholder: "Ex: 30 meses", required: true },
      { key: "data_inicio", label: "Data de Início", type: "date", required: true },
      { key: "objeto", label: "Finalidade da Locação", type: "select", options: ["Residencial", "Comercial"], required: true },
      { key: "cidade", label: "Cidade", type: "text", placeholder: "Ex: Rio de Janeiro - RJ", required: true },
      { key: "data_assinatura", label: "Data de Assinatura", type: "date", required: true },
    ],
    body: `PREÂMBULO

Pelo presente instrumento particular, {{contratante}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_cnpj}}, denominado LOCADOR; e {{contratado}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_locatario}}, denominado LOCATÁRIO; celebram o presente Contrato de Locação.

CLÁUSULA 1ª – DO OBJETO

O LOCADOR cede ao LOCATÁRIO, a título de locação, o imóvel situado à {{imovel}}, para fins {{objeto}}.

CLÁUSULA 2ª – DO PRAZO

A locação terá prazo determinado de {{vigencia}}, com início em {{data_inicio}}, renovando-se automaticamente por igual período salvo manifestação contrária de qualquer das partes com antecedência de 30 dias.

CLÁUSULA 3ª – DO ALUGUEL

O aluguel mensal é de {{valor}}, com vencimento {{dia_vencimento}} de cada mês, a ser pago mediante transferência bancária ou outra forma acordada entre as partes.

CLÁUSULA 4ª – DOS ENCARGOS

Correrão por conta do LOCATÁRIO: água, energia elétrica, gás, taxas condominiais ordinárias e demais despesas decorrentes do uso do imóvel.

CLÁUSULA 5ª – DA CONSERVAÇÃO

O LOCATÁRIO compromete-se a conservar o imóvel em bom estado, responsabilizando-se pelos danos causados por seu uso indevido.

CLÁUSULA 6ª – DA RESCISÃO ANTECIPADA

Em caso de rescisão antecipada pelo LOCATÁRIO, será devida multa proporcional ao tempo restante do contrato, calculada sobre o valor do aluguel, nos termos da Lei nº 8.245/91.

CLÁUSULA 7ª – DO FORO

Fica eleito o foro da Comarca de {{cidade}} para dirimir quaisquer questões oriundas desta locação.`,
  },

  {
    id: "trabalhista",
    name: "Acordo de Rescisão Consensual",
    description: "Formalização da rescisão consensual de contrato de trabalho conforme Reforma Trabalhista.",
    category: "Trabalhista",
    fields: [
      { key: "contratante", label: "Razão Social da Empresa", type: "text", placeholder: "Nome da empresa empregadora", required: true },
      { key: "cpf_cnpj", label: "CNPJ da Empresa", type: "text", placeholder: "00.000.000/0001-00", required: true },
      { key: "contratado", label: "Nome do Empregado", type: "text", placeholder: "Nome completo", required: true },
      { key: "cargo", label: "Cargo / Função", type: "text", placeholder: "Ex: Auxiliar Administrativo", required: true },
      { key: "data_admissao", label: "Data de Admissão", type: "date", required: true },
      { key: "data_rescisao", label: "Data da Rescisão", type: "date", required: true },
      { key: "valor", label: "Valor da Indenização / Verbas Rescisórias (R$)", type: "text", placeholder: "Ex: R$ 4.500,00", required: true },
      { key: "objeto", label: "Observações / Acordos Adicionais", type: "textarea", placeholder: "Ex: quitação de pendências, aviso prévio indenizado..." },
      { key: "cidade", label: "Cidade", type: "text", placeholder: "Ex: Curitiba - PR", required: true },
      { key: "data_assinatura", label: "Data de Assinatura", type: "date", required: true },
    ],
    body: `PREÂMBULO

Pelo presente instrumento, {{contratante}}, inscrita no CNPJ sob o nº {{cpf_cnpj}}, denominada EMPREGADORA; e {{contratado}}, ocupante do cargo de {{cargo}}, admitido(a) em {{data_admissao}}, denominado(a) EMPREGADO(A); celebram o presente Acordo de Rescisão Consensual do Contrato de Trabalho, nos termos do art. 484-A da CLT.

CLÁUSULA 1ª – DA RESCISÃO

As partes, de comum acordo, resolvem resilir o contrato de trabalho em vigor, com data de rescisão em {{data_rescisao}}.

CLÁUSULA 2ª – DAS VERBAS RESCISÓRIAS

A EMPREGADORA pagará ao EMPREGADO(A) o valor total de {{valor}}, a título de verbas rescisórias legais devidas, conforme discriminado no Termo de Rescisão.

CLÁUSULA 3ª – DA QUITAÇÃO

O recebimento das verbas rescisórias implica quitação das obrigações decorrentes do contrato de trabalho rescindido, nos termos da lei.

CLÁUSULA 4ª – DAS DISPOSIÇÕES ADICIONAIS

{{objeto}}

CLÁUSULA 5ª – DO FORO

Fica eleito o foro da Comarca de {{cidade}} para dirimir quaisquer questões decorrentes deste instrumento.`,
  },

  {
    id: "consultoria",
    name: "Contrato de Consultoria Jurídica",
    description: "Contrato de assessoria e consultoria jurídica contínua com cláusulas de retainer mensal.",
    category: "Consultoria",
    fields: [
      { key: "contratante", label: "Nome / Empresa Contratante", type: "text", placeholder: "Nome ou razão social", required: true },
      { key: "cpf_cnpj", label: "CPF / CNPJ do Contratante", type: "text", placeholder: "000.000.000-00", required: true },
      { key: "contratado", label: "Escritório / Advogado Consultor", type: "text", placeholder: "Nome do escritório ou advogado", required: true },
      { key: "oab", label: "OAB", type: "text", placeholder: "OAB/XX 000.000", required: true },
      { key: "objeto", label: "Escopo da Consultoria", type: "textarea", placeholder: "Descreva as áreas de atuação e serviços incluídos...", required: true },
      { key: "valor", label: "Honorário Mensal (R$)", type: "text", placeholder: "Ex: R$ 2.500,00/mês", required: true },
      { key: "horas", label: "Horas Incluídas por Mês", type: "text", placeholder: "Ex: até 10 horas/mês", required: true },
      { key: "vigencia", label: "Vigência Mínima", type: "text", placeholder: "Ex: 12 meses", required: true },
      { key: "data_inicio", label: "Data de Início", type: "date", required: true },
      { key: "cidade", label: "Cidade", type: "text", placeholder: "Ex: Brasília - DF", required: true },
      { key: "data_assinatura", label: "Data de Assinatura", type: "date", required: true },
    ],
    body: `PREÂMBULO

Pelo presente instrumento particular de Contrato de Consultoria Jurídica, {{contratante}}, inscrito(a) no CPF/CNPJ sob o nº {{cpf_cnpj}}, doravante denominado CONTRATANTE; e {{contratado}}, inscrito(a) na OAB sob o nº {{oab}}, doravante denominado CONSULTOR; celebram o presente contrato.

CLÁUSULA 1ª – DO OBJETO

O CONSULTOR prestará ao CONTRATANTE serviços de consultoria e assessoria jurídica nas seguintes áreas e atividades: {{objeto}}.

CLÁUSULA 2ª – DOS HONORÁRIOS

Pelos serviços mensais de consultoria, o CONTRATANTE pagará ao CONSULTOR o valor de {{valor}}, incluindo até {{horas}} de atendimento por mês. Horas excedentes serão cobradas proporcionalmente.

CLÁUSULA 3ª – DA VIGÊNCIA

O presente contrato terá vigência mínima de {{vigencia}}, com início em {{data_inicio}}, renovando-se automaticamente por períodos iguais.

CLÁUSULA 4ª – DAS OBRIGAÇÕES DO CONSULTOR

O CONSULTOR obriga-se a: (a) atender às demandas do CONTRATANTE dentro do escopo acordado; (b) emitir pareceres e orientações por escrito quando solicitado; (c) guardar sigilo sobre todas as informações do CONTRATANTE.

CLÁUSULA 5ª – DAS LIMITAÇÕES

Este contrato não inclui atuação em processos judiciais, salvo acordo específico. Ações judiciais serão objeto de contrato complementar.

CLÁUSULA 6ª – DA RESCISÃO

O contrato poderá ser rescindido por qualquer das partes após o período mínimo de vigência, mediante aviso prévio de 30 (trinta) dias.

CLÁUSULA 7ª – DO FORO

Fica eleito o foro da Comarca de {{cidade}} para dirimir quaisquer litígios decorrentes deste instrumento.`,
  },
];