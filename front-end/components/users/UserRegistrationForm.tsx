import UserService from "@/services/UserService";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";


const UserRegistrationForm: React.FC = () => {

    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [specialisation, setSpecialisation] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState("");

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
            setPasswordError("Password is required and should be at least 7 characters");
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

            if (response.status === 200) {
                // ToDo: log in user instead of overview
                router.push('/users/');
            } else {
                setErrorMessage('Something went wrong. Please try again or contact the system adminstration.')
            }
        }
        else {
            setErrorMessage("Can't process registration. Please fill in with valid input.");
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">Name *</label>
                    <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
                    {nameError && <p>{nameError}</p>}
                </div>

                <div>
                    <label htmlFor="email">Email *</label>
                    <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} />
                    {emailError && <p>{emailError}</p>}
                </div>

                <div>
                    <label htmlFor="specialisation">Specialisation *</label>
                    <input type="text" id="specialisation" onChange={(e) => setSpecialisation(e.target.value)} />
                    {specialisationError && <p>{specialisationError}</p>}
                </div>

                <div>
                    <label htmlFor="password">Password *</label>
                    <input type="text" id="password" onChange={(e) => setPassword(e.target.value)} />
                    {passwordError && <p>{passwordError}</p>}
                </div>


                <button type="submit">Register</button>
            </form>
            <div>
                {errorMessage && <p>{errorMessage}</p>}
            </div>
        </>
    );
}

export default UserRegistrationForm;
