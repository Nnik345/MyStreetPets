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
  scope: "openid email phone profile",
  automaticSilentRenew: true, // Enables automatic token renewal
  loadUserInfo: true, // Fetches user info after login
};

// Token Management Component
const AuthHandler = () => {
  const auth = useAuth();

  // Automatically renew the token when it expires
  useEffect(() => {
    const handleTokenExpiry = async () => {
      console.log("Access token expired, attempting silent refresh...");
      try {
        await auth.signinSilent();
        console.log("Token successfully refreshed.");
      } catch (error) {
        console.error("Silent sign-in failed:", error);
        auth.signoutRedirect(); // Redirect user to login if refresh fails
      }
    };

    // Listen for token expiration event and refresh it
    auth.events.addAccessTokenExpired(handleTokenExpiry);

    return () => {
      auth.events.removeAccessTokenExpired(handleTokenExpiry);
    };
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
