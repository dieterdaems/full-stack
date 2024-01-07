import ProjectService from '@/services/ProjectService';
import { Team } from '@/types';
import { useTranslation } from 'next-i18next';
import React, { FormEvent, useState } from 'react';

type Props = {
    userTeams: Team[],
    handleShowAddProject: () => void
}

const AddProject: React.FC<Props> = ({userTeams, handleShowAddProject} : Props) => {

    const { t } = useTranslation();
    const [name, setName] = useState<string>("");
    const [teamId, setTeamId] = useState<number>();
    const [button, setButton] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nameError, setNameError] = useState('');
    const [teamIdError, setTeamIdError] = useState('');

    const validate = () => {
        setNameError('');
        setTeamIdError('');
        let valid = true;
        if (name === "" || name.trim() === "") {
            setNameError(t('projects.errorName'));
            valid = false;
        }
        if (teamId == -1 || !teamId) {
            setTeamIdError(t('projects.errorTeam'));
            valid = false;
        }
        return valid;
    }

    const handleSubmit = async (e: FormEvent) => {
        setErrorMessage('');
        e.preventDefault();
        if (validate()) {
            setButton(!button)
            const response = await ProjectService.create({name, teamId});
            if (!response.ok) {
                if (response.status === 401) {
                    setErrorMessage(t('projects.notAuthorizedCreate'));
                }
                else setErrorMessage(t('projects.createError'));
            }
            else {
                setErrorMessage(t('projects.createSuccess'));
            }
            setName('');
            setTeamId(undefined);
            handleShowAddProject();
        }
    }

    const handleShowOrHideAddProject = () => {
        setButton(!button);
        setErrorMessage('');
        handleShowAddProject();
    }
    return (
        <>  
        <div className="bg-gray-100 flex items-center justify-center">

        <div className="container mx-auto my-8" >
        <div className="flex justify-center">
            {!button && <button className="global-button"
                onClick={(() => handleShowOrHideAddProject() )}>{t('projects.new')}</button>}
        </div>
        {button && <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>
            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
                    <input className="global-input"
                    type="text" id="name" onChange={(e) => setName(e.target.value)} />
                    <label className="global-label"
                    htmlFor="name">{t('projects.name')}</label>
                    <p className=' text-red-500'>{nameError}</p>
                </div>
            </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="relative bg-inherit mt-4">
                <label className="global-label"
                htmlFor="teamid">Team</label>
                <select className='global-input' id="teamid" onChange={((e) => setTeamId(parseInt(e.target.value)))} value={teamId}>
                    <option value={-1}>{t('projects.selectTeam')}</option>
                        {userTeams && (userTeams.map((team) => (
                    <option key={team.id} value={team.id}>
                    {team.name}
                    </option>)
                    ))}
                </select>
                <p className=' text-red-500'>{teamIdError}</p>
                </div>
            </div>

        <div className="flex justify-center">
            <button className="global-button"
            type='submit'>{t('projects.submit')}</button>
            {button && <button className="global-button"
                onClick={(() => handleShowOrHideAddProject() )}>{t('projects.cancel')}</button>}
        </div>
        </form>}
        <div className="flex justify-center">
        {<p className="text-red-500">{errorMessage}</p>}
        </div>
        </div>
        </div>
        </>
    );
}

export default AddProject;