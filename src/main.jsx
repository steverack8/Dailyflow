import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App.jsx"
import { AuthProvider } from "./contexts/AuthContext.jsx"
import ToastProvider from "./components/ui/ToastProvider.jsx"

import "./index.css"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
)