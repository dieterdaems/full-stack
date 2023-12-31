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
        setErrorMessage('');
        if (name === "" || name.trim() === "") {
            setErrorMessage("Name is required\n");
            return false;
        }
        if (description === "" || description.trim() === "") {
            setErrorMessage("Description is required\n");
            return false;
        }
        if (deadline === null || deadline < new Date()) {
            setErrorMessage("Deadline is required and has to be in the future\n");
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
        const newTask = {name, description, deadline, projectId};
        const response = await TaskService.create(newTask);
        router.push('/tasks/project/' + projectId);
        }

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
            <button type="submit">Submit</button>
        </form>
        <div>
        {errorMessage && <p>{errorMessage}</p>}
        </div>
                
                </>
            );
        }

        export default TaskRegistrationForm;
