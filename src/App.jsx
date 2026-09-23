import { BrowserRouter, Route, Routes } from "react-router-dom"

import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import DashboardPage from "./pages/DashboardPage"
import ActivityAnalysisPage from "./pages/ActivityAnalysisPage"
import ExportSyncPage from "./pages/ExportSyncPage"

import AppLayout from "./components/layout/AppLayout"
import ProtectedRoute from "./components/auth/ProtectedRoute"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/activity-analysis"
              element={<ActivityAnalysisPage />}
            />
            <Route path="/export-sync" element={<ExportSyncPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App