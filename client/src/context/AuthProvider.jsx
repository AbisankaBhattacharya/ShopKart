import { useEffect, useState } from "react";
import authApi from "../api/authApi";
import {
  AUTH_UNAUTHORIZED_EVENT,
  clearStoredAuth,
  getStoredAuth,
  getTokenExpiresAt,
  storeAuth,
} from "../utils/authStorage";
import AuthContext from "./AuthContext";

function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => getStoredAuth());
  const [isLoading] = useState(false);

  useEffect(() => {
    const handleUnauthorized = () => setAuth(null);
    window.addEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);

    return () => window.removeEventListener(AUTH_UNAUTHORIZED_EVENT, handleUnauthorized);
  }, []);

  useEffect(() => {
    const expiresAt = auth ? getTokenExpiresAt(auth.token) : null;

    if (!expiresAt) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      clearStoredAuth();
      setAuth(null);
    }, Math.max(expiresAt - Date.now(), 0));

    return () => window.clearTimeout(timeoutId);
  }, [auth]);

  const setAuthenticatedUser = (auth) => {
    storeAuth(auth);
    setAuth(auth);
  };

  const register = async (credentials) => {
    const auth = await authApi.register(credentials);
    setAuthenticatedUser(auth);
    return auth.user;
  };

  const login = async (credentials) => {
    const auth = await authApi.login(credentials);
    setAuthenticatedUser(auth);
    return auth.user;
  };

  const logout = () => {
    clearStoredAuth();
    setAuth(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user: auth?.user ?? null,
        isAuthenticated: Boolean(auth),
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
