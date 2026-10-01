import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import CustomerShell from './pages/CustomerShell';
import AgentShell from './pages/AgentShell';
import AdminShell from './pages/AdminShell';
import LegalPage from './pages/LegalPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Overview is the initial public page */}
        <Route path="/" element={<Landing />} />
        
        {/* Authentication page */}
        <Route path="/login" element={<Login />} />

        {/* Legal & Compliance Pages */}
        <Route path="/privacy" element={<LegalPage initialTab="privacy" />} />
        <Route path="/terms" element={<LegalPage initialTab="terms" />} />
        
        {/* Customer Portal requires authentication */}
        <Route
          path="/customer/*"
          element={
            <ProtectedRoute role="customer">
              <CustomerShell />
            </ProtectedRoute>
          }
        />
        
        {/* Agent OS requires authentication */}
        <Route
          path="/agent/*"
          element={
            <ProtectedRoute role="agent">
              <AgentShell />
            </ProtectedRoute>
          }
        />
        
        {/* Admin Console requires authentication */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminShell />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
