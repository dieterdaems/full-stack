import ProjectService from '@/services/ProjectService';
import { Project } from '@/types';
import React, { FormEvent, useState } from 'react';

const AddProject: React.FC = () => {

    const [name, setName] = useState<string>("");

    const validate = () => {
        if (name === "" || name.trim() === "") {
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        console.log(name);
        if (validate()) {
            console.log('valid');
            const project = {name};
            console.log(project);
            await ProjectService.create(name);

        }
    }

    return (
        <>  
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
            <button type='submit'>Submit</button>
        </form>
        </>
    );
}

export default AddProject;