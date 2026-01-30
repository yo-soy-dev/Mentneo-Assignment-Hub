import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Role = "mentor" | "student";

interface UserState {
  token: string | null;
  role: Role | null;
}

interface AuthContextType {
  user: UserState;
  loginUser: (token: string, role: Role) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserState>({
    token: localStorage.getItem("token"),
    role: (localStorage.getItem("role") as Role) || null,
  });

  const loginUser = (token: string, role: Role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ token, role });
  };

  const logout = () => {
    localStorage.clear();
    setUser({ token: null, role: null });
  };

  return (
    <AuthContext.Provider value={{ user, loginUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
