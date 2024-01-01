import { useEffect, useState } from "react";
import Language from "./language/Language";

const Header: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);
 
    const handleLogout = () => {
        sessionStorage.removeItem("loggedUser");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setLoggedIn(null);
    };

    useEffect(() => {
        setLoggedIn(sessionStorage.getItem("loggedUser"));
        setRole(sessionStorage.getItem("role"));
    }, []);

    return (
        <header className="lg:px-16 px-4 flex flex-wrap items-center py-4 shadow-md justify-center bg-gray-100">


    <div className="hidden md:flex md:items-center md:w-auto w-full">
            <nav>
                <ul  className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/">Home</a>
                    </li>
                    {loggedIn && (role === "admin") && (
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/users">Users</a>
                    </li>
                    )}
                    {loggedIn && (
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/teams">Teams</a>
                    </li>
                    )}
                    {loggedIn && (
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/projects">Projects</a>
                    </li>
                    )}
                    {loggedIn && (
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/tasks">Tasks</a>
                    </li>
                    )}
                    {loggedIn && (
                        <li>
                            <a className="md:p-4 py-3 px-0 block" href={"/users/profile/" + loggedIn}>Profile</a>
                        </li>
                    )}
                    {loggedIn && (
                        <button className="md:p-4 py-3 px-0 block" onClick={handleLogout}>Logout</button>
                    )}
                    {!loggedIn && (
                        <li>
                            <a className="md:p-4 py-3 px-0 block" href="/login">Login</a>
                        </li>
                    )}
                    {!loggedIn && (
                        <li>
                            <a className="md:p-4 py-3 px-0 block" href="/register">Register</a>
                        </li>
                    )}
                    <li>
                        <Language />
                    </li>
                </ul>
            </nav>
        </div>
        </header>
    );
}

export default Header;