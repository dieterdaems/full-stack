import UserService from "@/services/UserService";
import { User } from "@/types";
import { useTranslation } from "next-i18next";
import router from "next/router";
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

    const { t } = useTranslation();
    
    const validate = () => {
        setNameError('');
        setEmailError('');
        setSpecialisationError('');

        let valid = true;

        if ((name === "" || name.trim() === "")) {
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


        if (specialisation === "" || specialisation.trim() === "") {
            setSpecialisationError(t('users.errorSpecialisation'));
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
                setErrorMessage(t('users.profile.updated'));
                // Refresh the page (/users/profile after a second
                setTimeout(() => router.reload(), 1000);
            }
        }
        else {
            setErrorMessage(t('users.profile.errorInvalidInput'));
        }

    }

    return (
        <>
        <div className="bg-gray-100 flex items-center justify-center">
        <div className="container mx-auto my-8" >
        <div className="bg-gray-100 flex items-center justify-center">
            <p className=" text-red-500">{errorMessage}</p>
            </div>
            <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>

                <div className=" bg-gray-100 p-4 rounded-lg">
                    <div className="relative bg-inherit mt-4">
                    <label className="global-label" htmlFor="name">{t('users.name')}</label>
                    <input className="global-input"type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} />
                    <p className=" text-red-500">{nameError}</p>
                    </div>
                </div>

                <div className=" bg-gray-100 p-4 rounded-lg">
                    <div className="relative bg-inherit mt-4">
                    <label className="global-label" htmlFor="email">{t('users.email')}</label>
                    <input className="global-input" type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <p className=" text-red-500">{emailError}</p>
                    </div>
                </div>

                <div className=" bg-gray-100 p-4 rounded-lg">
                    <div className="relative bg-inherit mt-4">
                    <label className="global-label" htmlFor="specialisation">{t('users.specialization')}</label>
                    <input className="global-input" type="text" id="specialisation" name={specialisation} value={specialisation} onChange={(e) => setSpecialisation(e.target.value)} />
                    <p className=" text-red-500">{specialisationError}</p>
                    </div>
                </div>



                <button className="global-button" type="submit">{t('users.profile.save')}</button>
            </form>
        </div>
        </div>
        </>
    );
}

export default EditProfileForm;
