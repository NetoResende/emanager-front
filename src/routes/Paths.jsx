import { BrowserRouter } from "react-router-dom";
import { Route, Routes } from "react-router"
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import SafePath from "./SafePath";
import Niveis from "../pages/Niveis";
import DashboardLayout from "../layouts/DashboardLayout";
import NotFound from "../pages/NotFound";
import Usuarios from "../pages/Usuarios";

const Paths = () => {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<SafePath><DashboardLayout /></SafePath>}>
                        <Route index element={<Dashboard />} />
                        <Route path="/dashboard/niveis" element={<Niveis />} />
                        <Route path="/dashboard/usuarios" element={<Usuarios />} />
                    </Route>

                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default Paths;