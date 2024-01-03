import { useEffect, useState } from "react";
import Language from "./language/Language";
import { useRouter } from "next/router";

const Header: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const router = useRouter();
 
    const handleLogout = () => {
        sessionStorage.removeItem("loggedUser");
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("role");
        setLoggedIn(null);
        router.push("/");

    };

    useEffect(() => {
        setLoggedIn(sessionStorage.getItem("loggedUser"));
        setRole(sessionStorage.getItem("role"));
    }, []);

    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    {loggedIn && (role === "91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8") && (
                    <li>
                        <a href="/users">Users</a>
                    </li>
                    )}
                    {loggedIn && (
                    <li>
                        <a href="/teams">Teams</a>
                    </li>
                    )}
                    {loggedIn && (
                    <li>
                        <a href="/projects">Projects</a>
                    </li>
                    )}
                    {/* {loggedIn && (
                    <li>
                        <a href="/tasks">Tasks</a>
                    </li>
                    )} */}
                    {loggedIn && (
                        <li>
                            <a href={"/users/profile/"}>Profile</a>
                        </li>
                    )}
                    <li>
                        <Language />
                    </li>
                    {loggedIn && (
                        <button onClick={handleLogout}>Logout</button>
                    )}
                    {!loggedIn && (
                        <li>
                            <a href="/login">Login</a>
                        </li>
                    )}
                    {!loggedIn && (
                        <li>
                            <a href="/register">Register</a>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;