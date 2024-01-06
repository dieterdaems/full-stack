import TeamService from "@/services/TeamService";
import UserService from "@/services/UserService";
import { Team } from "@/types";
import { useTranslation } from "next-i18next";
import { useState } from "react";

type Props = {
    teams: Team[],
    currentTeams: Team[]
};

const TeamsOverviewTable: React.FC<Props> = ({ teams, currentTeams }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");

    const [newTeamName, setNewTeamName] = useState<string>("");
    const [showAddTeam, setShowAddTeam] = useState<boolean>(false);

    const id = sessionStorage.getItem("loggedUser");
    const role = sessionStorage.getItem("role");
    const { t } = useTranslation();

    /* ---------------------------------------------- */
    // Join&Leave handling

    const handleLeaveTeam = async (team: { id: any, name: string }) => {

        const response = await UserService.removeUserFromTeam({ teamId: team.id, userId: id });
        if (response.ok) setStatusMessage(t('teams.left1') + team.name + t('teams.left2'));
        else setStatusMessage(response.statusText);
    };

    const handleJoinTeam = async (team: { id: any, name: string }) => {

        const response = await UserService.addUserToTeam({ teamId: team.id, userId: id });
        if (response.ok) 
            setStatusMessage(t('teams.joined1') + team.name + t('teams.joined2'));
        else setStatusMessage(response.statusText);
    };


    /* ---------------------------------------------- */
    // Create handling

    const handleAddTeam = async () => {
        if (newTeamName.trim() === "") { setStatusMessage(t('teams.nameError')); return; }

        const response = await TeamService.create(newTeamName.trim());
        if (response.ok) {
            setStatusMessage(t('teams.created'));
            setTimeout(() => setStatusMessage(""), 3000);
            setShowAddTeam(false);
            setNewTeamName("");
        }
        else {
            if (response.status === 401)
                setStatusMessage(t('notAuthorized'));
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
            setStatusMessage(t('teams.deleted'));
            setTimeout(() => setStatusMessage(""), 3000);
        }
        else {
            if (response.status === 401) {
                setStatusMessage(t('notAuthorized'));
            }
            else {
                setStatusMessage(response.statusText);
            }
        }
        setShowConfirmation(false);
    };


    return (
        <>
        <div className="bg-gray-100 flex items-start justify-center">

        <div className="container mx-auto my-8" >
            <table className="mx-auto bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="py-2 px-4 border-b border-r">Id</th>
                        <th className="py-2 px-4 border-b border-r">{t('teams.name')}</th>
                    </tr>
                </thead>
                <tbody>
                    {teams && teams.map((team, index) => (
                        <tr key={index}>
                            <td className="py-2 px-4 border-b border-r">{team.id}</td>
                            <td className="py-2 px-4 border-b border-r">{team.name}</td>
                            <td className="py-2 px-4 border-b border-r">
                                {role === '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8' ? (
                                    <button className="global-button" onClick={() => handleDeleteButton(team.id)}>
                                        🗑️</button>
                                ) : (
                                    currentTeams.some((currentTeam) => currentTeam.id == team.id) ? (
                                        <button
                                            className="global-button"
                                            onClick={() => handleLeaveTeam({ id: team.id, name: team.name })}>{t('teams.leave')}</button>
                                    ) : (
                                        <button
                                            className="global-button"
                                            onClick={() => handleJoinTeam({ id: team.id, name: team.name })}>{t('teams.join')}</button>
                                    ))}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {role === '91fb3f8394dead2470aaf953e1bed9d9abf34a41f65ac666cff414ca229245b8' && !showAddTeam && (
                <div className= "flex justify-center mb-4">
                <button className="global-button" onClick={() => setShowAddTeam(true)}>➕</button>
                </div>
            )}
            {showAddTeam && (
                <div className="bg-gray-100 flex items-center justify-center">
                    <input
                        className="global-input"
                        type="text"
                        placeholder="The avengers"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                    />
                    <button className="global-button" onClick={() => handleAddTeam()}>💾</button>
                    <button className="global-button" onClick={() => abortAddButton()}>🗑️</button>
                </div>
            )}

            {showConfirmation && (
                <div className="bg-gray-100 flex items-center justify-center">
                    <p>Are you sure you want to delete this team?</p>
                    <button className="global-button" onClick={handleDeleteConfirm}>{t('confirm')}</button>
                    <button className="global-button" onClick={(() => setShowConfirmation(false))}>{t('cancel')}</button>
                </div>

            )}
            <p className=" mt-4 flex items-center justify-center">{statusMessage}</p>
        </div>
        </div>
        </>
    );
};

export default TeamsOverviewTable;
