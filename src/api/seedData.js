// DADOS DAS ENTIDADES — direto no código (sem banco de dados).
//
// Estes são os dados iniciais carregados pela camada local (`localDb.js`) na primeira execução.
// Depois disso, as alterações feitas no app ficam salvas no localStorage do navegador.
// Para "zerar" os dados, limpe o localStorage (chaves com prefixo "4him_db_").
//
// Quando for plugar um banco real, estes objetos servem de referência para popular as tabelas.

// ---- Helpers de data (relativas a hoje, para os gráficos terem dados recentes) ----
const now = new Date();
const pad = (n) => String(n).padStart(2, '0');

// 'YYYY-MM-DD' com deslocamento em dias
function dateOnly(dayOffset = 0) {
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

// ISO completo com deslocamento em dias (para created_date / ordenação)
function iso(dayOffset = 0) {
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  return d.toISOString();
}

// ---- IDs estáveis para manter os relacionamentos entre entidades ----
const ID = {
  patient: { ana: 'pat_ana', bruno: 'pat_bruno', carla: 'pat_carla', diego: 'pat_diego', elaine: 'pat_elaine' },
};

// =====================================================================================
// CLÍNICA
// =====================================================================================

const Patient = [
  { id: ID.patient.ana, created_date: iso(-40), updated_date: iso(-40), full_name: 'Ana Beatriz Souza', phone: '(11) 98877-1234', email: 'ana.souza@email.com', cpf: '123.456.789-00', date_of_birth: '1990-03-12', gender: 'Feminino', source: 'WhatsApp', status: 'Ativo', notes: 'Paciente recorrente.' },
  { id: ID.patient.bruno, created_date: iso(-30), updated_date: iso(-30), full_name: 'Bruno Carvalho', phone: '(11) 99654-7788', email: 'bruno.carvalho@email.com', cpf: '234.567.890-11', date_of_birth: '1985-07-25', gender: 'Masculino', source: 'Indicação', status: 'Ativo', notes: '' },
  { id: ID.patient.carla, created_date: iso(-22), updated_date: iso(-22), full_name: 'Carla Mendes', phone: '(21) 98123-4567', email: 'carla.mendes@email.com', cpf: '345.678.901-22', date_of_birth: '1998-11-02', gender: 'Feminino', source: 'Site', status: 'Ativo', notes: 'Convênio Unimed.' },
  { id: ID.patient.diego, created_date: iso(-12), updated_date: iso(-12), full_name: 'Diego Almeida', phone: '(31) 99876-5432', email: 'diego.almeida@email.com', cpf: '456.789.012-33', date_of_birth: '1979-01-18', gender: 'Masculino', source: 'Presencial', status: 'Ativo', notes: '' },
  { id: ID.patient.elaine, created_date: iso(-5), updated_date: iso(-5), full_name: 'Elaine Rodrigues', phone: '(11) 97777-0099', email: 'elaine.r@email.com', cpf: '567.890.123-44', date_of_birth: '2001-06-30', gender: 'Feminino', source: 'Telefone', status: 'Inativo', notes: 'Reagendar retorno.' },
];

const Appointment = [
  { id: 'apt_001', created_date: iso(-3), updated_date: iso(-3), patient_id: ID.patient.ana, patient_name: 'Ana Beatriz Souza', patient_phone: '(11) 98877-1234', date: dateOnly(0), time: '09:00', type: 'Consulta', status: 'Confirmado', insurance: 'Unimed', notes: '' },
  { id: 'apt_002', created_date: iso(-2), updated_date: iso(-2), patient_id: ID.patient.bruno, patient_name: 'Bruno Carvalho', patient_phone: '(11) 99654-7788', date: dateOnly(0), time: '10:30', type: 'Retorno', status: 'Agendado', insurance: 'Bradesco Saúde', notes: '' },
  { id: 'apt_003', created_date: iso(-2), updated_date: iso(-2), patient_id: ID.patient.carla, patient_name: 'Carla Mendes', patient_phone: '(21) 98123-4567', date: dateOnly(1), time: '14:00', type: 'Exame', status: 'Agendado', insurance: 'Unimed', notes: 'Trazer exames anteriores.' },
  { id: 'apt_004', created_date: iso(-6), updated_date: iso(-6), patient_id: ID.patient.diego, patient_name: 'Diego Almeida', patient_phone: '(31) 99876-5432', date: dateOnly(-2), time: '11:00', type: 'Consulta', status: 'Realizado', insurance: 'Particular', notes: '' },
  { id: 'apt_005', created_date: iso(-8), updated_date: iso(-8), patient_id: ID.patient.elaine, patient_name: 'Elaine Rodrigues', patient_phone: '(11) 97777-0099', date: dateOnly(-3), time: '16:00', type: 'Consulta', status: 'Não Compareceu', insurance: 'Particular', notes: '' },
  { id: 'apt_006', created_date: iso(-1), updated_date: iso(-1), patient_id: ID.patient.ana, patient_name: 'Ana Beatriz Souza', patient_phone: '(11) 98877-1234', date: dateOnly(3), time: '08:30', type: 'Urgência', status: 'Confirmado', insurance: 'Unimed', notes: '' },
];

const FinancialRecord = [
  { id: 'fin_001', created_date: iso(-20), updated_date: iso(-20), description: 'Consulta - Ana Beatriz', type: 'Receita', category: 'Consulta', amount: 350, date: dateOnly(-20), notes: '' },
  { id: 'fin_002', created_date: iso(-15), updated_date: iso(-15), description: 'Exame laboratorial', type: 'Receita', category: 'Exame', amount: 220, date: dateOnly(-15), notes: '' },
  { id: 'fin_003', created_date: iso(-10), updated_date: iso(-10), description: 'Aluguel do consultório', type: 'Custo', category: 'Aluguel', amount: 4200, date: dateOnly(-10), notes: '' },
  { id: 'fin_004', created_date: iso(-8), updated_date: iso(-8), description: 'Salário recepção', type: 'Custo', category: 'Salário', amount: 2100, date: dateOnly(-8), notes: '' },
  { id: 'fin_005', created_date: iso(-5), updated_date: iso(-5), description: 'Procedimento - Diego', type: 'Receita', category: 'Procedimento', amount: 900, date: dateOnly(-5), notes: '' },
  { id: 'fin_006', created_date: iso(-3), updated_date: iso(-3), description: 'Anúncios Instagram', type: 'Custo', category: 'Marketing', amount: 500, date: dateOnly(-3), notes: '' },
];

const ClinicSettings = [
  {
    id: 'clinic_settings',
    created_date: iso(-60),
    updated_date: iso(-1),
    clinic_name: 'Clínica 4Him',
    doctor_name: 'Dra. Responsável',
    working_days: ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'],
    start_time: '08:00',
    end_time: '18:00',
    slot_duration: 30,
    whatsapp_number: '(11) 90000-0000',
    ai_prompt: 'Você é a assistente virtual da Clínica 4Him. Seja cordial, objetiva e ajude com agendamentos e dúvidas dos pacientes.',
  },
];

const WhatsAppMessage = [
  { id: 'wa_001', created_date: iso(-1), updated_date: iso(-1), contact_name: 'Ana Beatriz', contact_phone: '(11) 98877-1234', message: 'Olá, gostaria de remarcar minha consulta.', direction: 'incoming', status: 'received', is_ai_response: false, whatsapp_line: '1' },
  { id: 'wa_002', created_date: iso(-1), updated_date: iso(-1), contact_name: 'Ana Beatriz', contact_phone: '(11) 98877-1234', message: 'Claro! Para qual data você prefere?', direction: 'outgoing', status: 'read', is_ai_response: true, whatsapp_line: '1' },
  { id: 'wa_003', created_date: iso(0), updated_date: iso(0), contact_name: 'João Pereira', contact_phone: '(11) 96543-2211', message: 'Vocês atendem pelo convênio Amil?', direction: 'incoming', status: 'received', is_ai_response: false, whatsapp_line: '1' },
  { id: 'wa_004', created_date: iso(0), updated_date: iso(0), contact_name: 'João Pereira', contact_phone: '(11) 96543-2211', message: 'Sim, atendemos Amil. Deseja agendar?', direction: 'outgoing', status: 'delivered', is_ai_response: true, whatsapp_line: '1' },
  { id: 'wa_005', created_date: iso(0), updated_date: iso(0), contact_name: 'Mariana Lopes', contact_phone: '(21) 98000-1122', message: 'Bom dia, qual o valor da consulta particular?', direction: 'incoming', status: 'received', is_ai_response: false, whatsapp_line: '2' },
];

// =====================================================================================
// USUÁRIO (sessão local — substitui um login externo)
// =====================================================================================

const User = [
  {
    id: 'user_local_admin',
    created_date: iso(-60),
    updated_date: iso(-1),
    full_name: 'Administrador 4Him',
    email: 'admin@4him.local',
    role: 'admin',
  },
];

export const seed = {
  Patient,
  Appointment,
  FinancialRecord,
  ClinicSettings,
  WhatsAppMessage,
  User,
};

export default seed;
