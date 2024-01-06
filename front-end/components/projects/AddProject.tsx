import ProjectService from '@/services/ProjectService';
import TeamService from '@/services/TeamService';
import { Project } from '@/types';
import { time } from 'console';
import { useTranslation } from 'next-i18next';
import React, { FormEvent, useState } from 'react';
import { setTimeout } from 'timers/promises';

const AddProject: React.FC = () => {

    const { t } = useTranslation();
    const [name, setName] = useState<string>("");
    const [teamId, setTeamId] = useState<number>(0);
    const [button, setButton] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [nameError, setNameError] = useState('');
    const [teamIdError, setTeamIdError] = useState('');

    const validate = () => {
        setNameError('');
        setTeamIdError('');
        let valid = true;
        if (name === "" || name.trim() === "") {
            setNameError("Name is required");
            valid = false;
        }
        if (teamId === null || teamId < 1 || teamId === undefined) {
            setTeamIdError("Team Id is required");
            valid = false;
        }
        return valid;
    }

    const handleSubmit = async (e: FormEvent) => {
        setErrorMessage('');
        e.preventDefault();
        if (validate()) {
            const project = {name};
            setButton(!button)
            // const teams = await TeamService.getAll();
            // const teamsResponse = await teams.json();
            // const team = teamsResponse.find((team: { id: number; }) => team.id === teamId);
            const response = await ProjectService.create(name,teamId);
            if (response.status === 200) {
                setName('');
            } else {
                setErrorMessage('Project not created');
                
            }

        }
    }

    return (
        <>  
        <div className="bg-gray-100 flex items-center justify-center">

        <div className="container mx-auto my-8" >
        <div className="flex justify-center">
            {!button && <button className="global-button"
                onClick={(e) => setButton(!button)}>{t('projects.new')}</button>}
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
            htmlFor="teamid">Team Id</label>
            <input className="global-input"
            type="number" min='1' id="teamid" onChange={(e) => setTeamId(parseInt(e.target.value))} />
            <p className=' text-red-500'>{teamIdError}</p>
            </div>
            </div>
        <div className="flex justify-center">
            <button className="global-button"
            type='submit'>{t('projects.submit')}</button>
            {button && <button className="global-button"
                onClick={(e) => {setButton(!button); setErrorMessage('')}}>{t('projects.cancel')}</button>}
        </div>
        </form>}
        {button && <p>{errorMessage}</p>}
        {!button && errorMessage && <p>{errorMessage}</p>}
        </div>
        </div>
        </>
    );
}

export default AddProject;