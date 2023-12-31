import UserService from "@/services/UserService";
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

    const validate = () => {
        setNameError('');
        setEmailError('');
        setPasswordError('');
        setSpecialisationError('');

        let valid = true;

        if (name === "" || name.trim() === "") {
            setNameError("Name is required");
            valid = false;
        }

        if (email === "" || email.trim() === "") {
            setEmailError("Email is required");
            valid = false;
        }
        else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) { valid = false; setEmailError('Invalid Email format'); }
        }

        if (password === "" || password.trim() === "" || password.length < 7) {
            setPasswordError("Password should be at least 7 characters");
            valid = false;
        }

        if (specialisation === "" || specialisation.trim() === "") {
            setSpecialisationError("Specialisation is required");
            valid = false;
        }

        return valid;
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const response = await UserService.create({ name, specialisation, email, password });
            const user = await response.json();
            if (response.ok) {
                setStatusMessage('Registration successful, logging in...');
                const response = await UserService.login({ email, password });
                const user = await response.json();
                if (response.ok) {
                    sessionStorage.setItem('token', user.token);
                    sessionStorage.setItem('loggedUser', user.id);
                    sessionStorage.setItem('role', user.role);
                    setStatusMessage('Login successful, redirecting...');
                    setTimeout(() => {
                        router.push('/');
                    }, 2500)
                } else {
                    setStatusMessage('Something went wrong with auto login, please login manually. Redirecting...');
                    setTimeout(() => {
                        router.push('/login/');
                    }, 2500)
                }
            } else {
                setStatusMessage("Couldn't register user, " + user.errorMessage); 
            }
        }
        else {
            setStatusMessage("Please fill in with valid input.");
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">Name *</label>
                    <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
                    {nameError}
                </div>

                <div>
                    <label htmlFor="email">Email *</label>
                    <input type="text" id="email" onChange={(e) => setEmail(e.target.value)} />
                    {emailError}
                </div>

                <div>
                    <label htmlFor="specialisation">Specialisation *</label>
                    <input type="text" id="specialisation" onChange={(e) => setSpecialisation(e.target.value)} />
                    {specialisationError}
                </div>

                <div>
                    <label htmlFor="password">Password *</label>
                    <input type="text" id="password" onChange={(e) => setPassword(e.target.value)} />
                    {passwordError}
                </div>


                <button type="submit">Register</button>
            </form>
            <div>
                <p>{statusMessage}</p>
            </div>
        </>
    );
}

export default UserRegistrationForm;
