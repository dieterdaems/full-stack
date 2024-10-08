import TeamService from "@/services/TeamService";
import UserService from "@/services/UserService";
import { Team } from "@/types";
import { useTranslation } from "next-i18next";
import { useState } from "react";

type Props = {
    teams: Team[],
    currentTeams: Team[],
    isAdmin: boolean
};

const TeamsOverviewTable: React.FC<Props> = ({ teams, currentTeams, isAdmin }: Props) => {

    const [statusMessage, setStatusMessage] = useState<string>("");

    const { t } = useTranslation();


    /* ---------------------------------------------- */
    // User -- Join&Leave handling

    const handleLeaveTeam = async (team: { id: any, name: string }) => {
        setStatusMessage("");
        const id = sessionStorage.getItem("loggedUser");
        const response = await UserService.removeUserFromTeam({ teamId: team.id, userId: id });
        if (response.ok) setStatusMessage(t('teams.left1') + team.name + t('teams.left2'));
        else setStatusMessage(response.statusText);
    };

    const handleJoinTeam = async (team: { id: any, name: string }) => {
        setStatusMessage("");
        const id = sessionStorage.getItem("loggedUser");
        const response = await UserService.addUserToTeam({ teamId: team.id, userId: id });
        if (response.ok) 
            setStatusMessage(t('teams.joined1') + team.name + t('teams.joined2'));
        else setStatusMessage(response.statusText);
    };


    /* ---------------------------------------------- */
    // Admin -- Delete handling

    
    const [teamToDelete, setTeamToDelete] = useState<any>();
    const [showConfirmation, setShowConfirmation] = useState<boolean>(false);

    const handleDeleteButton = async (id: any) => {
        setStatusMessage("");
        setTeamToDelete(id);
        setShowConfirmation(true);
    };

    const handleDeleteConfirm = async () => {
        setStatusMessage("");
        const response = await TeamService.deleteById(teamToDelete);
        if (response.ok) {
            setStatusMessage(t('teams.deleted'));
            setTimeout(() => setStatusMessage(""), 2000);
        }
        else {
            if (response.status === 401) {
                setStatusMessage(t('notAuthorizedAction'));
            }
            else {
                setStatusMessage(t('teams.deteleFail'));
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
                                {isAdmin ? (
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

            {showConfirmation && (
                <div className="bg-gray-100 flex items-center justify-center">
                    <div className="bg-gray-100 p-4 rounded-lg text-center">
                        <p className="text-red-500">{t('teams.confirmation')}</p>
                        <div className="flex justify-center items-center">
                            <button className="global-button" onClick={handleDeleteConfirm}>{t('confirm')}</button>
                            <button className="global-button" onClick={(() => setShowConfirmation(false))}>{t('cancel')}</button>
                        </div>
                    </div>
                </div>

            )}
            <p className=" mt-4 flex items-center justify-center text-red-500">{statusMessage}</p>
            <div className="bg-gray-100 flex items-center justify-center text-red-500">
            {isAdmin && (teams.length === 0) && <p className=" mt-4 flex items-center justify-center">{t('teams.noTeams')}</p>}
             </div>
        </div>
        </div>
        </>
    );
};

export default TeamsOverviewTable;
