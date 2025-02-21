import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "react-oidc-context";
import { useState } from "react";

const cognitoAuthConfig = {
  authority:
    "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_JLy2YIb3Q",
  client_id: "6c1sk5bjlf8ritr0vmkec9f2eq",
  redirect_uri: "https://main.deealfgqu77r6.amplifyapp.com",
  response_type: "code",
  scope: "email openid phone",
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
