import UserService from "@/services/UserService";
import { User } from "@/types";
import { useState } from "react";
import { useTranslation } from "next-i18next";


type Props = {
    users: User[],
};

const UsersOverviewTable: React.FC<Props> = ({ users }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<any>();

    const { t } = useTranslation();

    const handleDeleteButton = async (id: any) => {
        setStatusMessage("");
        setUserToDelete(id);
        setShowConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        const response = await UserService.deleteUser(userToDelete);
        const data = await response.json();
        if (response.ok) {
            setStatusMessage(t('users.overview.deleted'));
        }
        else {
            setStatusMessage(data.errorMessage);
        }
        setShowConfirmation(false);
    };


    const handleDeleteCancel = () => {
        setShowConfirmation(false);
    }



    return (
        <>
        <div className="bg-gray-100 flex items-start justify-center">

        <div className="container mx-auto my-8" >
            <table className="mx-auto bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-r">{t('users.name')}</th>
                        <th className="py-2 px-4 border-b border-r">{t('users.specialization')}</th>
                        <th className="py-2 px-4 border-b border-r">{t('users.email')}</th>
                        <th className="py-2 px-4 border-b border-r">{t('users.role')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b text-center border-r">{user.name}</td>
                            <td className="py-2 px-4 border-b text-center border-r">{user.specialisation}</td>
                            <td className="py-2 px-4 border-b text-center border-r">{user.email}</td>
                            <td className="py-2 px-4 border-b text-center border-r">{user.role}</td>
                            <td>
                                <button className="global-button" onClick={() => handleDeleteButton(user.id)}>
                                    🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="bg-gray-100 flex items-center justify-center">
            {showConfirmation && (
                            <>
                                <p>{t('users.overview.confirmation')}</p>
                                <button className="global-button" onClick={handleDeleteConfirm}>{t('confirm')}</button>
                                <button className="global-button" onClick={handleDeleteCancel}>{t('cancel')}</button>
                            </>
                        )}
            <p className=' text-red-600'>{statusMessage}</p>
            </div>
            </div>
        </div>
        </>

    );
};

export default UsersOverviewTable;