import TeamService from "@/services/TeamService";
import { useTranslation } from "next-i18next";
import { FormEvent, useState } from "react";

type Props = {
    isAdmin: boolean
};

const TeamsOverviewTable: React.FC<Props> = ({isAdmin} : Props ) => {

    const [statusMessage, setStatusMessage] = useState<string>("");

    const [newTeamName, setNewTeamName] = useState<string>("");
    const [showAddTeam, setShowAddTeam] = useState<boolean>(false);

    const { t } = useTranslation();



    const handleAddTeam = async (event: FormEvent) => {
        event.preventDefault();
        setStatusMessage("");
        
        if (newTeamName.trim() === "") { setStatusMessage(t('teams.nameError')); return; }

        const response = await TeamService.create(newTeamName);
        const team = await response.json();
        if (response.ok) {
            setStatusMessage(t('teams.created'));
            setTimeout(() => setStatusMessage(""), 3000);
            setShowAddTeam(false);
            setNewTeamName("");
        }
        else {
            if (response.status === 401)
                setStatusMessage(t('notAuthorizedAction'));
            else
                setStatusMessage(team.errorMessage);
        }
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
            
            {isAdmin && !showAddTeam && (
                <div className= "flex justify-center mb-4">
                <button className="global-button" onClick={() => setShowAddTeam(true)}>{t('teams.newTeam')}</button>
                </div>
            )}
            {showAddTeam && (
                <form className="mt-4 flex flex-col items-center" onSubmit={handleAddTeam}>
                <div className="bg-gray-100 flex items-center justify-center">
                    <input
                        className="global-input"
                        type="text"
                        placeholder="The avengers"
                        value={newTeamName}
                        onChange={(e) => setNewTeamName(e.target.value)}
                    />
                    <button className="global-button" type="submit">{t('confirm')}</button>
                    <button className="global-button" onClick={() => abortAddButton()}>{t('cancel')}</button>
                </div>
                </form>
            )}

            <p className=" mt-4 flex items-center justify-center text-red-500">{statusMessage}</p>
        </div>
        </div>
        </>
    );
};

export default TeamsOverviewTable;
