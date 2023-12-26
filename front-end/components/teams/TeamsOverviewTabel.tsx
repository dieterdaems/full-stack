import TeamService from "@/services/TeamService";
import { Team } from "@/types";
import { useState } from "react";

type Props = {
    teams: Team[],
    id: number
};

const TeamsOverviewTabel: React.FC<Props> = ({ teams, id }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");
    const [cooldownTeamId, setCooldownTeamId] = useState<number | null>(null);

    const handleLeaveTeam = async (team: {id: number, name: string}) => {
        if (cooldownTeamId !== null) {
            return;
        }
        setCooldownTeamId(team.id);

        const response = await TeamService.removeUser(team.id, id);
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
        if (cooldownTeamId !== null) {
            return;
        }
        setCooldownTeamId(team.id);

        const response = await TeamService.addUser(team.id, id);
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
                        <th>Id</th>
                        <th>Name</th>
                        <th>Total members</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {teams && teams.map((team, index) => (
                        <tr key={index}>
                            <td>{team.id}</td>
                            <td>{team.name}</td>
                            <td>{team.users.length}</td>
                            <td>
                                {team.users.some((user) => user.id === id) ? (
                                    <button
                                        disabled={cooldownTeamId === team.id}
                                        onClick={() => handleLeaveTeam({id: team.id!, name: team.name})}>Leave</button>
                                ) : (
                                    <button
                                        disabled={cooldownTeamId === team.id}
                                        onClick={() => handleJoinTeam({id: team.id!, name: team.name})}>Join</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <p>{statusMessage}</p>
        </>
    );
};

export default TeamsOverviewTabel;
