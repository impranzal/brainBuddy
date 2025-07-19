import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const AdminWrapper = () => {
  const { user } = useAuth();
  const token = localStorage.getItem("brainbuddy_token");

  const isAdmin = user.role.toUpperCase() === "ADMIN" && token;

  return <>
  {isAdmin?<Outlet/>:<Navigate to={"/login"} replace />}
  </>
};

export default AdminWrapper;
