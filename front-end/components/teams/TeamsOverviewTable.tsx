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

    const handleLeaveTeam = async (team: {id: any, name: string}) => {
        if (cooldownTeamId || !id) {
            return;
        }
        setCooldownTeamId(team.id);

        const response = await UserService.removeUserFromTeam(team.id, parseInt(id));
        const data = await response.json();
        if (response.ok) {
            setStatusMessage("Left team " + team.name + " successfully!");
        }
        else {
            setStatusMessage(data.errorMessage);
        }
        setTimeout(() => setCooldownTeamId(null), 500);
    };

    const handleJoinTeam = async (team: {id: any, name: string}) => {
        if (cooldownTeamId || !id) {
            return;
        }
        setCooldownTeamId(team.id);

        const response = await UserService.addUserToTeam(team.id, parseInt(id));
        const data = await response.json();
        if (response.ok) {
            setStatusMessage("Joined team " + team.name + " successfully!");
        }
        else {
            setStatusMessage(data.errorMessage);
        }
        setTimeout(() => setCooldownTeamId(null), 500);
    };

    const handleDeleteTeam = async (id: any) => {
        const response = await TeamService.deleteById(id);
        const data = await response.json();
        if (response.ok) {
            setStatusMessage("Deleted team successfully!");
        }
        else {
            setStatusMessage(data.errorMessage);
        }
    };

    const handleAddTeam = async () => {
        if (newTeamName.trim() === "") { setStatusMessage("Team name cannot be empty!"); return; }

        const response = await TeamService.create(newTeamName.trim());
        const data = await response.json();
        if (response.ok) {
            setStatusMessage("Created team " + newTeamName + " successfully!");
            setShowAddTeam(false);
            setNewTeamName("");
        }
        else {
            setStatusMessage(data.errorMessage);
        }
    }

    function abortCreateButton(): void {
        setShowAddTeam(false);
        setNewTeamName("");
    }

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
                                    <button onClick={() => handleDeleteTeam(team.id)}>
                                        🗑️</button>
                                ) : (
                                    currentTeams.some((currentTeam) => currentTeam.id == team.id) ? (
                                        <button
                                            disabled={cooldownTeamId === team.id}
                                            onClick={() => handleLeaveTeam({id: team.id, name: team.name})}>Leave</button>
                                    ) : (
                                        <button
                                            disabled={cooldownTeamId === team.id}
                                            onClick={() => handleJoinTeam({id: team.id, name: team.name})}>Join</button>
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
                    <button onClick={() => abortCreateButton()}>🗑️</button>
                </>
            )}
            <p>{statusMessage}</p>
        </>
    );
};

export default TeamsOverviewTable;
