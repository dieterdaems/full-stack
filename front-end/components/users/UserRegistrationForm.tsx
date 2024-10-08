import UserService from "@/services/UserService";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";


const UserRegistrationForm: React.FC = () => {

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [specialisation, setSpecialisation] = useState<string>("");
    const [statusMessage, setStatusMessage] = useState("");

    const [nameError, setNameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [specialisationError, setSpecialisationError] = useState<string>("");

    const router = useRouter();
    const { t } = useTranslation();

    const validate = () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setSpecialisationError('');

        let valid = true;

        if (name === "" || name.trim() === "") {
            setNameError(t('users.errorName'));
            valid = false;
        }

        if (email === "" || email.trim() === "") {
            setEmailError(t('users.errorEmail'));
            valid = false;
        }
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) { valid = false; setEmailError(t('users.errorEmailFormat')); }
        }

        if (password === "" || password.trim() === "" || password.length < 7) {
            setPasswordError(t('users.errorPasswordLength'));
            valid = false;
        }

        if (specialisation === "" || specialisation.trim() === "") {
            setSpecialisationError(t('users.errorSpecialization'));
            valid = false;
        }

        return valid;
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const response = await UserService.create({ name, specialisation, email, password });
            if (response.ok) {
                setStatusMessage(t('users.register.success'));
                const response = await UserService.login({ email, password });
                const user = await response.json();
                if (response.ok) {
                    sessionStorage.setItem('token', user.token);
                    sessionStorage.setItem('loggedUser', user.id);
                    // Hash roles to give malicious users just a bit of a challenge
                    // admin = SHA256-hash of 4dM1nFullStaCk
                    // user = SHA256-hash of Us3rFullSt4ck
                    if (user.role === 'admin')
                        sessionStorage.setItem('role', '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8');
                    else sessionStorage.setItem('role', '4b975fd8f0ff3e9fe958e701d5053be7dc223b684ec633f3d322d8868d395d33');
                    setTimeout(() => setStatusMessage(t('users.login.success')), 500);
                    setTimeout(() => {
                        router.push('/');
                    }, 3500)
                } else {
                    setStatusMessage(t('users.login.errorAutoLogin'));
                    setTimeout(() => {
                        router.push('/login/');
                    }, 2500)
                }
            } else {
                setStatusMessage(t('users.register.fail') + response.statusText);
            }
        }
        else {
            setStatusMessage(t('users.register.error'));
        }

    }

    return (
        <>
        <div className="bg-gray-100 flex items-center justify-center">

        <div className="container mx-auto my-8" >
            <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>

            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
                    <label className="global-label" htmlFor="name">{t('users.name')}</label>
                    <input className="global-input" type="text" id="name" onChange={(e) => setName(e.target.value)} />
                    <p className=" text-red-500">{nameError}</p>
                </div>
            </div>

            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
                    <label className="global-label" htmlFor="email">{t('users.email')}</label>
                    <input className="global-input" type="text" id="email" onChange={(e) => setEmail(e.target.value)} />
                    <p className=" text-red-500">{emailError}</p>
                </div>
            </div>

            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
                    <label className="global-label" htmlFor="specialisation">{t('users.specialization')}</label>
                    <input className="global-input" type="text" id="specialisation" onChange={(e) => setSpecialisation(e.target.value)} />
                    <p className=" text-red-500">{specialisationError}</p>
                </div>
            </div>

            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
                    <label className="global-label" htmlFor="password">{t('users.password')}</label>
                    <input className="global-input" type="text" id="password" onChange={(e) => setPassword(e.target.value)} />
                    <p className=" text-red-500">{passwordError}</p>
                </div>
            </div>


                <button className="global-button" type="submit">{t('users.register.title')}</button>
            </form>
            <div>
                <p className=" text-red-500">{statusMessage}</p>
            </div>
        </div>
        </div>
        </>
    );
}

export default UserRegistrationForm;
