"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { getCurrentUser } from "../../actions/auth-action";

type AuthContextType = {
  isLogin: boolean;
  setIsLogin: (value: boolean) => void;
  refreshAuth: () => Promise<void>;
  isUser: string;
  setIsUser: (value: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [isUser, setIsUser] = useState<string>("");

  const refreshAuth = async (retries = 3, delayMs = 200) => {
    try {
      let user = null;
      for (let i = 0; i < retries; i++) {
        user = await getCurrentUser();
        if (user) break;

        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      setIsLogin(!!user);
      if (user && user.user_metadata && user.user_metadata.display_name) {
        setIsUser(user.user_metadata.display_name);
      }
    } catch (err) {
      console.log("getCurrentUser error >>>", err);
      setIsLogin(false);
      setIsUser("");
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLogin, setIsLogin, refreshAuth, isUser, setIsUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
