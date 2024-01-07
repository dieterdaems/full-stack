import TeamService from "@/services/TeamService";
import { useTranslation } from "next-i18next";
import { FormEvent, useState } from "react";


const TeamsOverviewTable: React.FC = () => {

    const [statusMessage, setStatusMessage] = useState<string>("");

    const [newTeamName, setNewTeamName] = useState<string>("");
    const [showAddTeam, setShowAddTeam] = useState<boolean>(false);

    const { t } = useTranslation();



    const handleAddTeam = async (event: FormEvent) => {
        event.preventDefault();
        setStatusMessage("");
        
        if (newTeamName.trim() === "") { setStatusMessage(t('teams.nameError')); return; }

        const response = await TeamService.create(newTeamName);
        if (response.ok) {
            setStatusMessage(t('teams.created'));
            setShowAddTeam(false);
            setNewTeamName("");
        }
        else {
            if (response.status === 401)
                setStatusMessage(t('notAuthorizedAction'));
            else
                setStatusMessage(t('teams.createError'));
        }
        setTimeout(() => setStatusMessage(""), 2000);
    }

    const abortAddButton = () => {
        setShowAddTeam(false);
        setNewTeamName("");
        setStatusMessage("");
    }


    return (
        <>
            <div className="bg-gray-100 flex items-start justify-center">

                <div className="container mx-auto my-8" >
            
                    {!showAddTeam && (
                        <div className= "flex justify-center mb-4">
                            <button className="global-button" onClick={() => setShowAddTeam(true)}>{t('teams.newTeam')}</button>
                        </div>
                    )}

                    {showAddTeam && (
                        <form className="mt-4 flex flex-col items-center" onSubmit={handleAddTeam}>
                            <div className=" bg-gray-100 p-4 rounded-lg">
                                <div className="relative bg-inherit mt-4">
                                    <input
                                        className="global-input"
                                        type="text"
                                        value={newTeamName}
                                        id="newTeamName"
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                    />
                                    <label className="global-label" htmlFor="newTeamName">{t('teams.name')}</label>
                                </div>
                                <div className="flex justify-center items-center">
                                    <button className="global-button" type="submit">{t('confirm')}</button>
                                    <button className="global-button" onClick={() => abortAddButton()}>{t('cancel')}</button>
                                </div>
                            </div>
                        </form>
                    )}

                    <p className=" mt-4 flex items-center justify-center text-red-700">{statusMessage}</p>
                </div>
            </div>
        </>
    );
};

export default TeamsOverviewTable;
