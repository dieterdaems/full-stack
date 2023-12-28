import ProjectService from '@/services/ProjectService';
import { Project } from '@/types';
import { time } from 'console';
import { useTranslation } from 'next-i18next';
import React, { FormEvent, useState } from 'react';
import { setTimeout } from 'timers/promises';

const AddProject: React.FC = () => {

    const { t } = useTranslation();
    const [name, setName] = useState<string>("");
    const [button, setButton] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validate = () => {
        if (name === "" || name.trim() === "") {
            setErrorMessage("Name is required\n");
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent) => {
        setErrorMessage('');
        e.preventDefault();
        // console.log(name);
        if (validate()) {
            // console.log('valid');
            const project = {name};
            // console.log(project);
            setButton(!button)
            const response = await ProjectService.create(name);
            if (response.status === 200) {
                // console.log('Project created');
                setName('');
            } else {
                // console.log('Project not created');
                setErrorMessage('Project not created');
                
            }

        }
    }

    return (
        <>  
        <button onClick={(e) => setButton(!button)}>{t('projects.new')}</button>
        {button && <form onSubmit={handleSubmit}>
            <label htmlFor="name">{t('projects.name')}</label>
            <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
            <button type='submit'>{t('projects.submit')}</button>
        </form>}
        {errorMessage && <p>{errorMessage}</p>}
        </>
    );
}

export default AddProject;