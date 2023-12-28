import UserService from "@/services/UserService";
import { Team, TeamUpdate } from "@/types";
import { useState } from "react";

type Props = {
    teams: TeamUpdate[],
    currentTeams: Team[]
};

const TeamsOverviewTable: React.FC<Props> = ({ teams, currentTeams }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [cooldownTeamId, setCooldownTeamId] = useState<number | null>(null);

    const id = sessionStorage.getItem("loggedUser");
    const role = sessionStorage.getItem("role");

    const handleLeaveTeam = async (team: {id: number, name: string}) => {
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

    const handleJoinTeam = async (team: {id: number, name: string}) => {
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

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {teams && teams.map((team, index) => (
                        <tr key={index}>
                            <td>{team.name}</td>
                            <td>
                                {role === 'admin' ? (
                                    <button>
                                        Delete</button>
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
            <p>{statusMessage}</p>
        </>
    );
};

export default TeamsOverviewTable;
