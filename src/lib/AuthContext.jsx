import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '@/api/client';

// Autenticação LOCAL.
// O usuário da sessão vem de `api.auth.me()` (definido em seedData.js). Não há chamadas de
// rede nem redirecionamento para login externo — o app abre direto, já autenticado.
// Quando plugar um login real, reimplemente `checkUserAuth`, `logout` e `navigateToLogin`.

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [authError, setAuthError] = useState(null);
  const [appPublicSettings, setAppPublicSettings] = useState(null);

  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);
    try {
      const currentUser = await api.auth.me();
      setUser(currentUser);
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (error) {
      console.error('Local auth check failed:', error);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingAuth(false);
      setAuthChecked(true);
    }
  }, []);

  const checkAppState = useCallback(async () => {
    setIsLoadingPublicSettings(true);
    setAuthError(null);
    setAppPublicSettings({ id: 'local', public_settings: {} });
    await checkUserAuth();
    setIsLoadingPublicSettings(false);
  }, [checkUserAuth]);

  useEffect(() => {
    checkAppState();
  }, [checkAppState]);

  const logout = useCallback((shouldRedirect = true) => {
    api.auth.logout(shouldRedirect ? window.location.href : undefined);
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const navigateToLogin = useCallback(() => {
    api.auth.redirectToLogin(window.location.href);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authChecked,
        authError,
        appPublicSettings,
        logout,
        navigateToLogin,
        checkAppState,
        checkUserAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
