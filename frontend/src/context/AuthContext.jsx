"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  authConfig: { domain: "", clientId: "", isConfigured: false },
  loginWithAuth0: () => {},
  logout: () => {},
  updateDemographics: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authConfig, setAuthConfig] = useState({
    domain: "",
    clientId: "",
    audience: "",
    isConfigured: false,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  // 1. Initial Load: Check Auth0 Callback, Local Storage, and Backend Config
  useEffect(() => {
    // Fetch backend Auth0 configuration
    fetch(`${apiUrl}/auth/config`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setAuthConfig({
            domain: data.domain || "",
            clientId: data.client_id || "",
            audience: data.audience || "",
            isConfigured: Boolean(data.is_configured),
          });
        }
      })
      .catch(() => {});

    // Parse Auth0 Universal Login Callback Hash (#access_token=...&id_token=...)
    if (typeof window !== "undefined" && window.location.hash) {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get("access_token");
        const idToken = hashParams.get("id_token");

        if (idToken || accessToken) {
          let parsedUser = {
            sub: "auth0|user",
            name: "Verified Citizen",
            demographics: null,
          };

          if (idToken) {
            // Decode payload segment of JWT without external dependencies
            const base64Url = idToken.split(".")[1];
            const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
            const jsonPayload = decodeURIComponent(
              atob(base64)
                .split("")
                .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
                .join("")
            );
            const claims = JSON.parse(jsonPayload);
            parsedUser = {
              sub: claims.sub,
              name: claims.name || claims.nickname || "Verified Citizen",
              email: claims.email || null,
              picture: claims.picture || null,
              demographics: claims["https://yojanasetu-api.local/demographics"] || null,
            };
          }

          const authToken = idToken || accessToken;
          setUser(parsedUser);
          setToken(authToken);
          localStorage.setItem("yojanasetu_auth_user", JSON.stringify(parsedUser));
          localStorage.setItem("yojanasetu_auth_token", authToken);

          // Clean hash from browser URL without page reload
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          setIsLoading(false);

          // Fetch persisted demographics from database for this citizen
          loadSavedProfile(authToken, parsedUser);
          return;
        }
      } catch (err) {
        console.warn("Failed to parse Auth0 token hash:", err);
      }
    }

    // Load persisted session from localStorage
    if (typeof window !== "undefined") {
      try {
        const storedUser = localStorage.getItem("yojanasetu_auth_user");
        const storedToken = localStorage.getItem("yojanasetu_auth_token");

        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          setUser(parsed);
          setToken(storedToken);
          if (storedToken) {
            loadSavedProfile(storedToken, parsed);
          }
        }
      } catch (err) {
        console.warn("Could not load stored user session:", err);
      }
    }

    setIsLoading(false);
  }, [apiUrl]);

  // Helper to load citizen profile criteria from backend database
  const loadSavedProfile = async (authToken, baseUser) => {
    if (!baseUser?.sub) return;
    try {
      const res = await fetch(`${apiUrl}/auth/me`, {
        headers: {
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          "X-Citizen-Sub": baseUser.sub,
        },
      });
      if (res.ok) {
        const profileData = await res.json();
        if (profileData && profileData.demographics) {
          const updatedUser = {
            ...baseUser,
            demographics: profileData.demographics,
          };
          setUser(updatedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("yojanasetu_auth_user", JSON.stringify(updatedUser));
          }
        }
      }
    } catch (err) {
      console.warn("Could not load citizen profile from server:", err);
    }
  };

  // 2. Auth0 Universal Login Redirect Trigger
  const loginWithAuth0 = () => {
    const domain = authConfig.domain || process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = authConfig.clientId || process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

    if (domain && clientId && !domain.startsWith("your-") && domain !== "dev-yojanasetu.us.auth0.com") {
      const redirectUri = (process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || window.location.origin).replace(/\/$/, "");
      // Only attach audience if a real custom API audience is registered in Auth0
      const hasCustomAudience = authConfig.audience && !authConfig.audience.includes("yojanasetu-api.local");
      const audienceParam = hasCustomAudience ? `&audience=${encodeURIComponent(authConfig.audience)}` : "";
      const nonce = Math.random().toString(36).substring(2, 15);
      const authUrl = `https://${domain}/authorize?client_id=${clientId}&response_type=token%20id_token&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=openid%20profile%20email${audienceParam}&nonce=${nonce}`;

      window.location.href = authUrl;
      return true;
    } else {
      // Auth0 not yet configured with real user tenant
      return false;
    }
  };

  // 3. Logout (Clears local state and localStorage)
  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("yojanasetu_auth_user");
      localStorage.removeItem("yojanasetu_auth_token");
    }

    // If live Auth0 is configured, redirect to Auth0 logout endpoint
    if (authConfig.isConfigured && authConfig.domain && authConfig.clientId) {
      const returnTo = encodeURIComponent((process.env.NEXT_PUBLIC_AUTH0_REDIRECT_URI || window.location.origin).replace(/\/$/, ""));
      window.location.href = `https://${authConfig.domain}/v2/logout?client_id=${authConfig.clientId}&returnTo=${returnTo}`;
    }
  };

  // 4. Update Citizen Demographics
  const updateDemographics = async (newDemographics) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      demographics: newDemographics,
    };
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("yojanasetu_auth_user", JSON.stringify(updatedUser));
    }

    // Sync to backend database
    try {
      const res = await fetch(`${apiUrl}/auth/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(user?.sub ? { "X-Citizen-Sub": user.sub } : {}),
        },
        body: JSON.stringify(newDemographics),
      });
      if (res.ok) {
        const savedProfile = await res.json();
        if (savedProfile && savedProfile.demographics) {
          const syncedUser = {
            ...updatedUser,
            demographics: savedProfile.demographics,
          };
          setUser(syncedUser);
          if (typeof window !== "undefined") {
            localStorage.setItem("yojanasetu_auth_user", JSON.stringify(syncedUser));
          }
        }
      }
    } catch (err) {
      console.warn("Could not sync demographics to backend DB:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: Boolean(user),
        isLoading,
        authConfig,
        loginWithAuth0,
        logout,
        updateDemographics,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
