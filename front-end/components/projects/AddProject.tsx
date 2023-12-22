import ProjectService from '@/services/ProjectService';
import { Project } from '@/types';
import { time } from 'console';
import React, { FormEvent, useState } from 'react';
import { setTimeout } from 'timers/promises';

const AddProject: React.FC = () => {

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
        <button onClick={(e) => setButton(!button)}>Add Project</button>
        {button && <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
            <button type='submit'>Submit</button>
        </form>}
        {errorMessage && <p>{errorMessage}</p>}
        </>
    );
}

export default AddProject;