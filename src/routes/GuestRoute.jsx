import { Navigate, Outlet } from 'react-router-dom';



export default function GuestRoute() {
  
 const isLoggedIn = localStorage.getItem('isLoggedIn');
 
  return isLoggedIn ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
