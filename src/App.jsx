import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Appointments from './pages/Appointments';
import WhatsApp from './pages/WhatsApp';
import Patients from './pages/Patients';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import FinancialAnalysis from './pages/FinancialAnalysis';
import Leads from './pages/Leads';
import AIAssistant from './pages/AIAssistant';
import LawDashboard from './pages/law/LawDashboard';
import LawClients from './pages/law/LawClients';
import LawCases from './pages/law/LawCases';
import LawFinancial from './pages/law/LawFinancial';
import LawAssistant from './pages/law/LawAssistant';
import LawDocuments from './pages/law/LawDocuments';
import LawSearch from './pages/law/LawSearch';
import LawContracts from './pages/law/LawContracts';
import LawReports from './pages/law/LawReports';
import LawDocumentTemplates from './pages/law/LawDocumentTemplates';
import LawTimeline from './pages/law/LawTimeline';
import LandingPage from './pages/LandingPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Handle authentication errors
  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      // Redirect to login automatically
      navigateToLogin();
      return null;
    }
  }

  // Render the main app
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agendamentos" element={<Appointments />} />
        <Route path="/whatsapp" element={<WhatsApp />} />
        <Route path="/pacientes" element={<Patients />} />
        <Route path="/configuracoes" element={<Settings />} />
        <Route path="/usuarios" element={<UserManagement />} />
        <Route path="/financeiro" element={<FinancialAnalysis />} />
        <Route path="/leads" element={<Leads />} />
        <Route path="/assistente" element={<AIAssistant />} />
        {/* Módulo Advocacia */}
        <Route path="/advocacia/dashboard" element={<LawDashboard />} />
        <Route path="/advocacia/clientes" element={<LawClients />} />
        <Route path="/advocacia/processos" element={<LawCases />} />
        <Route path="/advocacia/financeiro" element={<LawFinancial />} />
        <Route path="/advocacia/assistente" element={<LawAssistant />} />
        <Route path="/advocacia/pecas" element={<LawDocuments />} />
        <Route path="/advocacia/pesquisa" element={<LawSearch />} />
        <Route path="/advocacia/contratos" element={<LawContracts />} />
        <Route path="/advocacia/relatorios" element={<LawReports />} />
        <Route path="/advocacia/pecas-processuais" element={<LawDocumentTemplates />} />
        <Route path="/advocacia/linha-do-tempo" element={<LawTimeline />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
      <Route path="/landing" element={<LandingPage />} />
    </Routes>
  );
};


function App() {

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App