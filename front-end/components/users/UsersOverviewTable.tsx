import UserService from "@/services/UserService";
import { User } from "@/types";
import { useState } from "react";

type Props = {
    users: User[],
};

const UsersOverviewTable: React.FC<Props> = ({ users }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
    const [userToDelete, setUserToDelete] = useState<any>();

    const handleDeleteButton = async (id: any) => {
        setUserToDelete(id);
        setShowConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        const response = await UserService.deleteUser(userToDelete);
        const data = await response.json();
        if (response.ok) {
            setStatusMessage("Deleted user successfully!");
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
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Specialisation</th>
                        <th>Email</th>
                        <th>Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.name}</td>
                            <td>{user.specialisation}</td>
                            <td>{user.email}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => handleDeleteButton(user.id)}>
                                    🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {showConfirmation && (
                            <>
                                <p>Are you sure you want to delete this user?</p>
                                <button onClick={handleDeleteConfirm}>Confirm</button>
                                <button onClick={handleDeleteCancel}>Cancel</button>
                            </>
                        )}
            <p>{statusMessage}</p>
        </>
    );
};

export default UsersOverviewTable;