import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "react-oidc-context";

// Cognito Authentication Configuration
const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_JLy2YIb3Q",
  client_id: "6c1sk5bjlf8ritr0vmkec9f2eq",
  redirect_uri: "https://main.deealfgqu77r6.amplifyapp.com",
  response_type: "code",
  scope: "email openid phone",
  automaticSilentRenew: true, // Enables silent token renewal
  loadUserInfo: true, // Fetches user info after login
};

// Function to handle token storage and silent sign-in
const AuthHandler = () => {
  const auth = useAuth();

  // Save refresh token once user logs in
  useEffect(() => {
    if (auth.user && auth.user.refresh_token) {
      localStorage.setItem("refresh_token", auth.user.refresh_token);
    }
  }, [auth.user]);

  // Try to sign in silently using refresh token
  useEffect(() => {
    const refreshAuth = async () => {
      if (!auth.isAuthenticated && localStorage.getItem("refresh_token")) {
        try {
          const user = await auth.signinSilent();
          if (user) {
            console.log("User automatically signed in.");
          }
        } catch (error) {
          console.error("Silent sign-in failed:", error);
          localStorage.removeItem("refresh_token"); // Remove invalid token
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
      <AuthHandler /> {/* Ensures refresh token handling */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
