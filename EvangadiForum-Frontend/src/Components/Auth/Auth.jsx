import { createContext, useState, useEffect } from "react";
import { axiosInstance } from "../../Utility/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize with token from localStorage immediately
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("authToken");
    return {
      token: token || null,
      user: null,
    };
  });

  const isAuthenticated = !!auth.token;
  
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const checkAuth = async () => {
      // Get token directly from localStorage instead of state
      const token = localStorage.getItem("authToken");
      
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await axiosInstance.get("/api/users/check"); 

        if (res.data) {
          setAuth({
            token,
            user: res.data
          });
        }
      } catch (err) {
        console.warn("Auth check failed:", err.response?.data || err.message);
        localStorage.removeItem("authToken");
        setAuth({ token: null, user: null });
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });
      const token = res.data.token;

      if (!token) throw new Error("No token received");

      localStorage.setItem("authToken", token);

      const userRes = await axiosInstance.get("/api/users/check");

      setAuth({ token, user: userRes.data });
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.msg || "Login failed",
      };
    }
  };

  const register = async (username, firstname, lastname, email, password) => {
    try {
      await axiosInstance.post("/api/users/register", {
        username,
        firstname,
        lastname,
        email,
        password,
      });

      return await login(email, password);
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.msg || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setAuth({ token: null, user: null });
  };

  return (
    <AuthContext.Provider
      value={{
        token: auth.token,
        user: auth.user,
        isAuthenticated,
        login,
        register,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};