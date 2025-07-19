import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Outlet } from "react-router-dom";

const OpenRoutes =()=>{
    return <>
    <Navbar/>
    <Outlet/>
    <Footer/>
    </>
}

export default OpenRoutes;