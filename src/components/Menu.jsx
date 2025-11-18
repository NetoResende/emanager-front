import { NavLink } from "react-router-dom";

const Menu = () => {
    return (
        <div className="w-[250px] h-screen bg-blue-600">
            <ul>
                <li>
                    <NavLink to={"/dashboard"}>Dashboard</NavLink>
                </li>
                <li>
                    <NavLink to={"/dashboard/niveis"}>Níveis</NavLink>
                </li>
                <li>
                    <NavLink to={"/dashboard/usuarios"}>Usuarios</NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Menu;