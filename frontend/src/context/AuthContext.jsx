"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { fetchAPI } from "@/lib/api";

const AuthContext = createContext();
const TOKEN_KEY = "lms_token";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // getting token from cookies on initial load
    const storedToken = Cookies.get(TOKEN_KEY);
    if (storedToken) {
      setToken(storedToken);
      loadUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // getting user data from Strapi using the token
  const loadUser = async (authToken) => {
    try {
      const data = await fetchAPI("/users/me?populate=role", { token: authToken });
      setUser(data);
    } catch (err) {
      console.error("Session expired:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // login with username/email and password
  const login = async (identifier, password) => {
    const res = await fetchAPI("/auth/local", {
      method: "POST",
      body: { identifier, password },
    });

    if (res?.jwt) {
      // storing token in cookies for 7 days
      Cookies.set(TOKEN_KEY, res.jwt, { expires: 7, sameSite: "lax" });
      setToken(res.jwt);

      const fullUserData = await fetchAPI("/users/me?populate=role", { token: res.jwt });
      setUser(fullUserData);
      
      // setting role by role name in cookies for 7 days
      if (fullUserData?.role?.name) {
        Cookies.set("lms_role", fullUserData.role.name, { expires: 7, sameSite: "lax" });
      }

      redirectByRole(fullUserData?.role?.name);
      return fullUserData;
    }
  };

  // new student registration
  const register = async (username, email, password) => {
    const res = await fetchAPI("/auth/local/register", {
      method: "POST",
      body: { username, email, password },
    });

    if (res?.jwt) {
      Cookies.set(TOKEN_KEY, res.jwt, { expires: 7, sameSite: "lax" });
      Cookies.set("lms_role", "Student", { expires: 7, sameSite: "lax" });
      setToken(res.jwt);

      const fullUserData = await fetchAPI("/users/me?populate=role", { token: res.jwt });
      setUser(fullUserData);
      router.push("/dashboard/student");
      return fullUserData;
    }
  };

  // initiate Google OAuth login by redirecting to Strapi's Google connect endpoint
  const loginWithGoogle = () => {
    const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
    window.location.href = `${strapiUrl}/api/connect/google`;
  };

  // google redirect callback handler to fetch user data and set token
  const handleGoogleCallback = async (accessToken) => {
    setLoading(true);
    try {
      const res = await fetchAPI(`/auth/google/callback?access_token=${accessToken}`);
      if (res?.jwt) {
        Cookies.set(TOKEN_KEY, res.jwt, { expires: 7, sameSite: "lax" });
        setToken(res.jwt);

        const fullUserData = await fetchAPI("/users/me?populate=role", { token: res.jwt });
        setUser(fullUserData);
        
        if (fullUserData?.role?.name) {
          Cookies.set("lms_role", fullUserData.role.name, { expires: 7, sameSite: "lax" });
        }

        redirectByRole(fullUserData?.role?.name);
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
    Cookies.remove("lms_role");
    setToken(null);
    setUser(null);
    router.push("/login");
  };

  // dashboard redirection based on user role
const redirectByRole = (roleName) => {
  if (roleName === "Admin") {
    router.push("/dashboard/admin");
  } else if (roleName === "Content Manager") {
    router.push("/dashboard/manager");
  } else if (roleName === "Instructor") {
    router.push("/dashboard/instructor");
  } else {
    //fallback to student dashboard for any other role or if role is undefined
    router.push("/dashboard/student");
  }
};

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role?.name || null,
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