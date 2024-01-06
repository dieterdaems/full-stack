import { useEffect, useState } from "react";
import Language from "./language/Language";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

const Header: React.FC = () => {
    const [loggedIn, setLoggedIn] = useState<string | null>(null);
    const [role, setRole] = useState<string | null>(null);

    const router = useRouter();
    const { t } = useTranslation();

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
        <header className="lg:px-16 px-4 flex flex-wrap items-center py-4 shadow-md justify-center bg-gray-100">


    <div className="hidden md:flex md:items-center md:w-auto w-full">
            <nav>
                <ul  className="md:flex items-center justify-between text-base text-gray-700 pt-4 md:pt-0">
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/">{t('header.nav.home')}</a>
                    </li>
                    {loggedIn && (role === "91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8") && (
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/users">{t('header.nav.users')}</a>
                    </li>
                    )}
                    {loggedIn && (
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/teams">{t('header.nav.teams')}</a>
                    </li>
                    )}
                    {loggedIn && (
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/projects">{t('header.nav.projects')}</a>
                    </li>
                    )}
                    {/* {loggedIn && (
                    <li>
                        <a className="md:p-4 py-3 px-0 block" href="/tasks">Tasks</a>
                    </li>
                    )} */}
                    {loggedIn && (
                        <li>
                            <a className="md:p-4 py-3 px-0 block" href={"/users/profile/"}>{t('header.nav.profile')}</a>
                        </li>
                    )}
                    {loggedIn && (
                        <button className="md:p-4 py-3 px-0 block" onClick={handleLogout}>{t('header.nav.logout')}</button>
                    )}
                    {!loggedIn && (
                        <li>
                            <a className="md:p-4 py-3 px-0 block" href="/login">{t('header.nav.login')}</a>
                        </li>
                    )}
                    {!loggedIn && (
                        <li>
                            <a className="md:p-4 py-3 px-0 block" href="/register">{t('header.nav.register')}</a>
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