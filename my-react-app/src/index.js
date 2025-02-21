import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: "https://ap-south-1jly2yib3q.auth.ap-south-1.amazoncognito.com",
  client_id: "6c1sk5bjlf8ritr0vmkec9f2eq",
  redirect_uri: "https://main.deealfgqu77r6.amplifyapp.com",
  response_type: "code",
  scope: "email openid phone",
  automaticSilentRenew: true,
  userStore: window.localStorage, // Ensures tokens persist across sessions
};


const savedTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-bs-theme", savedTheme);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
