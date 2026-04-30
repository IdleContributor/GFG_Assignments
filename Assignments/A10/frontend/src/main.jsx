import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

if (!GOOGLE_CLIENT_ID) {
  console.error(
    "[BlogSpace] VITE_GOOGLE_CLIENT_ID is not set. " +
    "Create Assignments/A10/frontend/.env and add:\n" +
    "VITE_GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com"
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
