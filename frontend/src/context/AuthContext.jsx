"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { fetchAPI } from "@/lib/api";

const AuthContext = createContext();
const TOKEN_KEY = "lms_token";
const ROLE_KEY = "lms_role";

// role normalization function to ensure consistent role naming
export const normalizeRole = (role) => {
  if (!role) return "Student";
  const r = (typeof role === "string" ? role : role?.name || role?.type || "").toLowerCase().trim();
  if (r === "admin") return "Admin";
  if (r.includes("manager") || r.includes("content")) return "Content Manager";
  if (r.includes("instructor") || r.includes("teacher")) return "Instructor";
  return "Student";
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // dashboard redirect based on role
  const redirectByRole = useCallback((roleInput) => {
    const cleanRole = normalizeRole(roleInput);

    if (cleanRole === "Admin") {
      router.push("/dashboard/admin");
    } else if (cleanRole === "Content Manager") {
      router.push("/dashboard/manager");
    } else if (cleanRole === "Instructor") {
      router.push("/dashboard/instructor");
    } else {
      router.push("/dashboard/student");
    }
  }, [router]);

  // me Data fetcher to load user info based on token
  const loadUser = useCallback(async (authToken) => {
    try {
      const data = await fetchAPI("/users/me?populate=role", { token: authToken });
      setUser(data);
      
      const rawRole = data?.role?.name || data?.role?.type || data?.role;
      const userRole = normalizeRole(rawRole);
      Cookies.set(ROLE_KEY, userRole, { expires: 7, sameSite: "lax" });
    } catch (err) {
      console.error("Session expired or unauthorized:", err);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedToken = Cookies.get(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      loadUser(storedToken);
    } else {
      setLoading(false);
    }
  }, [loadUser]);

  // login function with role detection and redirection
  const login = async (identifier, password) => {
    try {
      const res = await fetchAPI("/auth/local", {
        method: "POST",
        body: { identifier, password },
      });

      if (res?.jwt) {
        Cookies.set(TOKEN_KEY, res.jwt, { expires: 7, sameSite: "lax" });
        setToken(res.jwt);

        // me Data fetcher to load user info based on token with populate role
        const fullUserData = await fetchAPI("/users/me?populate=role", { token: res.jwt });
        
        console.log("Logged In User with Role:", fullUserData);

        setUser(fullUserData);

        const rawRole = fullUserData?.role?.name || fullUserData?.role?.type || fullUserData?.role;
        const userRole = normalizeRole(rawRole);
        
        console.log("Normalized Detected Role:", userRole);

        Cookies.set(ROLE_KEY, userRole, { expires: 7, sameSite: "lax" });
        redirectByRole(userRole);

        return fullUserData;
      }
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // new user signup
  const register = async (username, email, password) => {
    try {
      const res = await fetchAPI("/auth/local/register", {
        method: "POST",
        body: { username, email, password },
      });

      if (res?.jwt) {
        Cookies.set(TOKEN_KEY, res.jwt, { expires: 7, sameSite: "lax" });
        Cookies.set(ROLE_KEY, "Student", { expires: 7, sameSite: "lax" });
        setToken(res.jwt);

        const fullUserData = await fetchAPI("/users/me?populate=role", { token: res.jwt });
        setUser(fullUserData);
        router.push("/dashboard/student");
        return fullUserData;
      }
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };

  // googl login
  const loginWithGoogle = () => {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    window.location.href = `${strapiUrl}/api/connect/google`;
  };

  // google callback handler
  const handleGoogleCallback = async (accessToken) => {
    setLoading(true);
    try {
      const res = await fetchAPI(`/auth/google/callback?access_token=${accessToken}`);
      if (res?.jwt) {
        Cookies.set(TOKEN_KEY, res.jwt, { expires: 7, sameSite: "lax" });
        setToken(res.jwt);

        const fullUserData = await fetchAPI("/users/me?populate=role", { token: res.jwt });
        setUser(fullUserData);

        const rawRole = fullUserData?.role?.name || fullUserData?.role?.type || fullUserData?.role;
        const userRole = normalizeRole(rawRole);
        
        Cookies.set(ROLE_KEY, userRole, { expires: 7, sameSite: "lax" });
        redirectByRole(userRole);
      }
    } catch (err) {
      console.error("Google Auth error:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // logout function to clear cookies and reset state
  const logout = () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(ROLE_KEY);
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: normalizeRole(user?.role?.name || user?.role?.type || user?.role),
        token,
        loading,
        login,
        register,
        loginWithGoogle,
        handleGoogleCallback,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
