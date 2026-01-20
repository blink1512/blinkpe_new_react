import { Navigate, Outlet } from 'react-router-dom';
import { useMerchant } from '../context/MerchantContext';

function getCookie(name) {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

export default function ProtectedRoute({ allowedRoles }) {
  const { role} = useMerchant();
  const sid = getCookie('sid');
  const isLoggedIn = localStorage.getItem('isLoggedIn');

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
}
