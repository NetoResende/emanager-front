import { BiSolidDashboard } from "react-icons/bi";
import { LuAward, LuGamepad, LuReceipt, LuUser } from "react-icons/lu";
import { NavLink } from "react-router-dom";

const Menu = () => {
    return (
        <div className="w-[250px] h-screen text-white/80 p-4 bg-blue-600 ">
            <ul>
                <li>
                    <NavLink
                        className={`flex items-center gap-3 px-4 rounded leading-8 [&.active]:bg-white [&.active]:text-blue-600`}
                        to={"/dashboard"}
                        end
                    >
                        <BiSolidDashboard />
                        Dashboard
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={`flex items-center gap-3 px-4 rounded leading-8 [&.active]:bg-white [&.active]:text-blue-600`}
                        end
                        to={"/dashboard/niveis"}>
                        <LuAward />
                        Níveis
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={`flex items-center gap-3 px-4 rounded leading-8 [&.active]:bg-white [&.active]:text-blue-600`}
                        end
                        to={"/dashboard/usuarios"}>
                        <LuUser/>
                        Usuarios
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={`flex items-center gap-3 px-4 rounded leading-8 [&.active]:bg-white [&.active]:text-blue-600`}
                        end
                        to={"/dashboard/plataformas"}>
                        <LuGamepad/>
                        Plataformas
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={`flex items-center gap-3 px-4 rounded leading-8 [&.active]:bg-white [&.active]:text-blue-600`}
                        end
                        to={"/dashboard/clientes"}>
                        <LuUser/>
                        Clientes
                    </NavLink>
                </li>
                <li>
                    <NavLink
                        className={`flex items-center gap-3 px-4 rounded leading-8 [&.active]:bg-white [&.active]:text-blue-600`}
                        end
                        to={"/dashboard/pedidos"}>
                            <LuReceipt/>
                        Pedidos
                    </NavLink>
                </li>
            </ul>
        </div>
    );
}

export default Menu;