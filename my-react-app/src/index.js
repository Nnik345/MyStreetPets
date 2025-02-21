import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider, useAuth } from "react-oidc-context";
import { WebStorageStateStore } from "oidc-client-ts";

const cognitoAuthConfig = {
  authority: "https://cognito-idp.ap-south-1.amazonaws.com/ap-south-1_JLy2YIb3Q",
  client_id: "6c1sk5bjlf8ritr0vmkec9f2eq",
  redirect_uri: "https://main.deealfgqu77r6.amplifyapp.com",
  post_logout_redirect_uri: "https://main.deealfgqu77r6.amplifyapp.com/logout",
  response_type: "code",
  scope: "email openid phone",
  automaticSilentRenew: true,
  monitorSession: true,
  loadUserInfo: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
};

const AuthWrapper = ({ children }) => {
  const auth = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (!auth.isAuthenticated && !auth.activeNavigator) {
          console.log("Restoring session...");
          await auth.signinSilent();
        }
      } catch (error) {
        console.log("Session restore failed", error);
      }
      setLoading(false);
    };

    restoreSession();
  }, [auth]);

  if (loading) return <div>Loading...</div>;

  return children;
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <AuthWrapper>
        <App />
      </AuthWrapper>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
