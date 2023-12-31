import TeamService from "@/services/TeamService";
import UserService from "@/services/UserService";
import { Team } from "@/types";
import { useState } from "react";

type Props = {
    teams: Team[],
    currentTeams: Team[]
};

const TeamsOverviewTable: React.FC<Props> = ({ teams, currentTeams }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [cooldownTeamId, setCooldownTeamId] = useState<number | null>(null);

    const [newTeamName, setNewTeamName] = useState<string>("");
    const [showAddTeam, setShowAddTeam] = useState<boolean>(false);

    const id = sessionStorage.getItem("loggedUser");
    const role = sessionStorage.getItem("role");


    /* ---------------------------------------------- */
    // Join&Leave handling

    const handleLeaveTeam = async (team: { id: any, name: string }) => {
        setCooldownTeamId(team.id);

        const response = await UserService.removeUserFromTeam({ teamId: team.id, userId: id });
        if (response.ok) {
            setTimeout(() => setStatusMessage("Left team " + team.name + " successfully!"), 1000);
        }
        else
            setStatusMessage(response.statusText);

        setTimeout(() => setCooldownTeamId(null), 1000);
    };

    const handleJoinTeam = async (team: { id: any, name: string }) => {
        setCooldownTeamId(team.id);

        const response = await UserService.addUserToTeam({ teamId: team.id, userId: id });
        if (response.ok) {
            setTimeout(() => setStatusMessage("Joined team " + team.name + " successfully!"), 1000);
        }
        else
            setStatusMessage(response.statusText);


        setTimeout(() => setCooldownTeamId(null), 1000);
    };


    /* ---------------------------------------------- */
    // Create handling

    const handleAddTeam = async () => {
        if (newTeamName.trim() === "") { setStatusMessage("Team name cannot be empty!"); return; }

        const response = await TeamService.create(newTeamName.trim());
        if (response.ok) {
            setStatusMessage("Created team successfully!");
            setTimeout(() => setStatusMessage(""), 3000);
            setShowAddTeam(false);
            setNewTeamName("");
        }
        else {
            if (response.status === 401)
                setStatusMessage("You are not authorized to create a team!");
            else
                setStatusMessage(response.statusText);
        }
    }

    const abortAddButton = () => {
        setShowAddTeam(false);
        setNewTeamName("");
        setStatusMessage("");
    }

    const [teamToDelete, setTeamToDelete] = useState<any>();
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    /* ---------------------------------------------- */
    // Delete handling

    const handleDeleteButton = async (id: any) => {
        setTeamToDelete(id);
        setShowConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        const response = await TeamService.deleteById(teamToDelete);
        if (response.ok) {
            setStatusMessage("Deleted team successfully!");
            setTimeout(() => setStatusMessage(""), 3000);
        }
        else {
            if (response.status === 401) {
                setStatusMessage("You are not authorized to delete this team!");
            }
            else {
                setStatusMessage(response.statusText);
            }
        }
        setShowConfirmation(false);
    };


    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                    </tr>
                </thead>
                <tbody>
                    {teams && teams.map((team, index) => (
                        <tr key={index}>
                            <td>{team.name}</td>
                            <td>
                                {role === 'admin' ? (
                                    <button onClick={() => handleDeleteButton(team.id)}>
                                        🗑️</button>
                                ) : (
                                    currentTeams.some((currentTeam) => currentTeam.id == team.id) ? (
                                        <button
                                            disabled={cooldownTeamId === team.id}
                                            onClick={() => handleLeaveTeam({ id: team.id, name: team.name })}>Leave</button>
                                    ) : (
                                        <button
                                            disabled={cooldownTeamId === team.id}
                                            onClick={() => handleJoinTeam({ id: team.id, name: team.name })}>Join</button>
                                    ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {role === 'admin' && !showAddTeam && (
                <button onClick={() => setShowAddTeam(true)}>➕</button>
            )}
            {showAddTeam && (
                <>
                    <input
                        type="text"
                        placeholder="The avengers"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                    />
                    <button onClick={() => handleAddTeam()}>💾</button>
                    <button onClick={() => abortAddButton()}>🗑️</button>
                </>
            )}


            {showConfirmation && (
                <>
                    <p>Are you sure you want to delete this team?</p>
                    <button onClick={handleDeleteConfirm}>Confirm</button>
                    <button onClick={(() => setShowConfirmation(false))}>Cancel</button>
                </>
            )}
            <p>{statusMessage}</p>
        </>
    );
};

export default TeamsOverviewTable;
