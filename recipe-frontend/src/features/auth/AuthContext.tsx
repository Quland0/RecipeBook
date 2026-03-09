import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthResponse, AuthUser } from "./auth.types";
import { loginUser, registerUser } from "./auth.api";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "token";
const USER_KEY = "user";

type Props = {
  children: ReactNode;
};

export function AuthProvider({ children }: Props) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem(TOKEN_KEY);
    const savedUser = localStorage.getItem(USER_KEY);

    if (savedToken) {
      setToken(savedToken);
    }

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const saveAuth = (data: AuthResponse) => {
    setToken(data.jwt);
    setUser(data.user);

    localStorage.setItem(TOKEN_KEY, data.jwt);
    localStorage.setItem(USER_KEY, JSON.stringify(data.user));
  };

  const login = async (identifier: string, password: string) => {
    const data = await loginUser({ identifier, password });
    saveAuth(data);
  };

  const register = async (
    username: string,
    email: string,
    password: string,
  ) => {
    const data = await registerUser({ username, email, password });
    saveAuth(data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: !!token,
      login,
      register,
      logout,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
