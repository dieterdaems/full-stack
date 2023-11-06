import ProjectService from "@/services/ProjectService";
import TaskService from "@/services/TaskService";
import { Project } from "@/types";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { StatusMessage } from "@/types";

type Props = {
    projectId: number;
};

const TaskRegistrationForm: React.FC<Props> = ({projectId} : Props) => {

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [deadline, setDeadline] = useState<Date>(new Date());
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    const validate = () => {
        let errorMessage = '';
        
        if (name === "" || name.trim() === "") {
            errorMessage += "Name is required\n";
            return false;
        }
        if (description === "" || description.trim() === "") {
            errorMessage += "Description is required\n";
            return false;
        }
        if (deadline === null || deadline < new Date()) {
            errorMessage += "Deadline is required and has to be in the future\n";
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        const newTask = {name, description, deadline, project: {id: projectId}};
        console.log(newTask);
        const response = await TaskService.create(newTask);
        const data = await response.json();

        router.push('/tasks/project/' + projectId);

    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
            <label htmlFor="description">Description</label>
            <input type="text" id="description" onChange={(e) => setDescription(e.target.value)} />
            <label htmlFor="deadline">Deadline</label>
            <input type="date" id="deadline" onChange={(e) => setDeadline(new Date(e.target.value))} />
            <label htmlFor="project">Project</label>
            <button type="submit">Submit</button>
        </form>
        <div>
        {errorMessage && errorMessage.split('\n').map((line, index) => (
        <p key={index}>{line}</p>
      ))}
        </div>
                
                </>
            );
        }

        export default TaskRegistrationForm;
