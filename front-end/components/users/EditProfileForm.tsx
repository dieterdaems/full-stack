import UserService from "@/services/UserService";
import { User } from "@/types";
import router, { useRouter } from "next/router";
import { FormEvent, useState } from "react";


type Props = {
    user: User;
};

const EditProfileForm: React.FC<Props> = ({ user }: Props) => {

    const [name, setName] = useState<string>(user.name);
    const [email, setEmail] = useState<string>(user?.email);
    const [specialisation, setSpecialisation] = useState<string>(user?.specialisation);
    const [errorMessage, setErrorMessage] = useState("");

    const [nameError, setNameError] = useState<string>("");
    const [emailError, setEmailError] = useState<string>("");
    const [specialisationError, setSpecialisationError] = useState<string>("");

    const validate = () => {
        setNameError('');
        setEmailError('');
        setSpecialisationError('');

        let valid = true;

        if ((name === "" || name.trim() === "")) {
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


        if (specialisation === "" || specialisation.trim() === "") {
            setSpecialisationError("Specialisation is required");
            valid = false;
        }

        return valid;
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const response = await UserService.update({ id: user.id, name, specialisation, email });
            if (!response.ok) {
                setErrorMessage(response.statusText);
            }
            else {
                const data = await response.json();
                setErrorMessage("Profile updated successfully");
                // Refresh the page (/users/profile after a second
                setTimeout(() => router.reload(), 1000);
            }
        }
        else {
            setErrorMessage("Cannot update information. Please fill in with valid input.");
        }

    }

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    {nameError}
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {emailError}
                </div>

                <div>
                    <label htmlFor="specialisation">Specialisation</label>
                    <input type="text" id="specialisation" name={specialisation} value={specialisation} onChange={(e) => setSpecialisation(e.target.value)} />
                    {specialisationError}
                </div>



                <button type="submit">Update</button>
            </form>
            <div>
                {errorMessage}
            </div>
        </>
    );
}

export default EditProfileForm;
