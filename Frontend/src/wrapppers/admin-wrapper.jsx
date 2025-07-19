import { Navigate, Outlet } from "react-router-dom";



const AdminWrapper =()=>{
    const token = localStorage.getItem("brainbuddy_token")
    console.log(token);

    return <>
    {token ? <Outlet/> : <Navigate to={"/login"} replace/>}
    </>
}

export default AdminWrapper