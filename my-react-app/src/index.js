import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "react-oidc-context";

// Cognito Authentication Configuration
const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_JLy2YIb3Q",
  client_id: "6c1sk5bjlf8ritr0vmkec9f2eq",
  redirect_uri: "https://main.deealfgqu77r6.amplifyapp.com",
  response_type: "code",
  scope: "email openid phone",
  automaticSilentRenew: true, // Enables silent token renewal
  loadUserInfo: true, // Ensures user info is fetched on refresh
};

// Function to refresh authentication
const RefreshAuth = () => {
  const auth = useAuth();

  useEffect(() => {
    const refreshAuth = async () => {
      const storedRefreshToken = localStorage.getItem("refresh_token");

      if (storedRefreshToken && !auth.isAuthenticated) {
        try {
          const user = await auth.signinSilent();
          if (user) {
            console.log("User automatically signed in");
          }
        } catch (error) {
          console.error("Error refreshing token:", error);
          localStorage.removeItem("refresh_token"); // Clear invalid token
        }
      }
    };

    refreshAuth();
  }, [auth]);

  return null; // No UI, just logic
};

// Set the theme on initial load
const savedTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-bs-theme", savedTheme);

// Render the App
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <RefreshAuth /> {/* Ensures token refresh on load */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
