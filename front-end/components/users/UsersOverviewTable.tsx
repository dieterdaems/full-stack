import { User } from "@/types";
import { useState } from "react";

type Props = {
    users: User[],
};

const UsersOverviewTable: React.FC<Props> = ({ users }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const handleDeleteUser = async (id: any) => {
        throw new Error("Not implemented");
    };
    
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
                                <button onClick={() => handleDeleteUser(user.id)}>
                                    🗑️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>{statusMessage}</p>
        </>
    );
};

export default UsersOverviewTable;