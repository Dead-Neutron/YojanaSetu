"use client";

import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  authConfig: { domain: "", clientId: "", isConfigured: false },
  loginWithAuth0: () => {},
  loginWithDemo: () => {},
  logout: () => {},
  updateDemographics: () => {},
});

const DEMO_PROFILES = {
  farmer: {
    sub: "auth0|demo_farmer_01",
    name: "Ramesh Kumar",
    email: "ramesh.kumar@kisan.in",
    picture: null,
    demographics: {
      state: "Bihar",
      occupation: "Farmer",
      gender: "Male",
      caste: "OBC",
      age: 42,
    },
  },
  artisan: {
    sub: "auth0|demo_artisan_02",
    name: "Sunita Devi",
    email: "sunita.devi@karigar.in",
    picture: null,
    demographics: {
      state: "West Bengal",
      occupation: "Artisan",
      gender: "Female",
      caste: "SC",
      age: 38,
    },
  },
  student: {
    sub: "auth0|demo_student_03",
    name: "Aarav Sharma",
    email: "aarav.sharma@vidya.in",
    picture: null,
    demographics: {
      state: "Maharashtra",
      occupation: "Student",
      gender: "Male",
      caste: "General",
      age: 20,
    },
  },
};

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

          setUser(parsedUser);
          setToken(accessToken || idToken);
          localStorage.setItem("yojanasetu_auth_user", JSON.stringify(parsedUser));
          localStorage.setItem("yojanasetu_auth_token", accessToken || idToken);

          // Clean hash from browser URL without page reload
          window.history.replaceState(null, "", window.location.pathname + window.location.search);
          setIsLoading(false);
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
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (err) {
        console.warn("Could not load stored user session:", err);
      }
    }

    setIsLoading(false);
  }, [apiUrl]);

  // 2. Auth0 Universal Login Redirect Trigger
  const loginWithAuth0 = () => {
    const domain = authConfig.domain || process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
    const clientId = authConfig.clientId || process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;

    if (domain && clientId && !domain.startsWith("your-")) {
      const redirectUri = window.location.origin;
      const audienceParam = authConfig.audience ? `&audience=${encodeURIComponent(authConfig.audience)}` : "";
      const nonce = Math.random().toString(36).substring(2, 15);
      const authUrl = `https://${domain}/authorize?client_id=${clientId}&response_type=token%20id_token&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=openid%20profile%20email${audienceParam}&nonce=${nonce}`;

      window.location.href = authUrl;
    } else {
      // If Auth0 credentials not yet set in .env, activate default demo login
      loginWithDemo("farmer");
    }
  };

  // 3. One-Click Demo Login (Enables rapid evaluation without external Auth0 account)
  const loginWithDemo = (role = "farmer") => {
    const profile = DEMO_PROFILES[role] || DEMO_PROFILES.farmer;
    const fakeToken = `demo-token-${role}-${Date.now()}`;

    setUser(profile);
    setToken(fakeToken);

    if (typeof window !== "undefined") {
      localStorage.setItem("yojanasetu_auth_user", JSON.stringify(profile));
      localStorage.setItem("yojanasetu_auth_token", fakeToken);
    }

    // Sync demographics to backend
    if (profile.demographics) {
      fetch(`${apiUrl}/auth/profile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${fakeToken}`,
        },
        body: JSON.stringify(profile.demographics),
      }).catch(() => {});
    }
  };

  // 4. Logout (Clears local state and localStorage)
  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("yojanasetu_auth_user");
      localStorage.removeItem("yojanasetu_auth_token");
    }

    // If live Auth0 is configured, redirect to Auth0 logout endpoint
    if (authConfig.isConfigured && authConfig.domain && authConfig.clientId) {
      const returnTo = encodeURIComponent(window.location.origin);
      window.location.href = `https://${authConfig.domain}/v2/logout?client_id=${authConfig.clientId}&returnTo=${returnTo}`;
    }
  };

  // 5. Update Citizen Demographics
  const updateDemographics = (newDemographics) => {
    if (!user) return;
    const updatedUser = {
      ...user,
      demographics: {
        ...(user.demographics || {}),
        ...newDemographics,
      },
    };
    setUser(updatedUser);
    if (typeof window !== "undefined") {
      localStorage.setItem("yojanasetu_auth_user", JSON.stringify(updatedUser));
    }

    // Sync to backend
    fetch(`${apiUrl}/auth/profile`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(newDemographics),
    }).catch(() => {});
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
        loginWithDemo,
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
