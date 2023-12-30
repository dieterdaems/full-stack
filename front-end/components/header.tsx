import { useState } from "react";

const Header: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <a href="/">Home</a>
                    </li>
                    <li>
                        <a href="/users">Users</a>
                    </li>
                    <li>
                        <a href="/teams">Teams</a>
                    </li>
                    <li>
                        <a href="/projects">Projects</a>
                    </li>
                    <li>
                        <a href="/tasks">Tasks</a>
                    </li>
                    {loggedIn && (
                        <li>
                            <a href="/profile">Profile</a>
                        </li>
                    )}
                    {!loggedIn && (
                        <li>
                            <a href="/login">Login</a>
                        </li>
                    )}
                    {!loggedIn && (
                        <li>
                            <a href="/users/register">Register</a>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;