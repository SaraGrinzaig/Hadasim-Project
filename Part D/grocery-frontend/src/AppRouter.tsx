import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import StoreOwnerDashboard from './pages/storeOwner/OwnerDashboard';

function AppRouter() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/supplier"
          element={token ? <SupplierDashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/store-owner"
          element={token ? <StoreOwnerDashboard /> : <Navigate to="/" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
