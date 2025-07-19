import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";


const UserLayout = () => {
  return (
    <>
      <AdminNavbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
