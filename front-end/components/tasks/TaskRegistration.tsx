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
    const [nameError, setNameError] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [descriptionError, setDescriptionError] = useState<string>("");
    const [deadline, setDeadline] = useState<Date>(new Date());
    const [deadlineError, setDeadlineError] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();

    const validate = () => {
        setNameError('');
        setDescriptionError('');
        setDeadlineError('');
        if (name === "" || name.trim() === "") {
            setNameError("Name is required");
        }
        if (description === "" || description.trim() === "") {
            setDescriptionError("Description is required");
        }
        if (deadline === null || deadline < new Date()) {
            setDeadlineError("Deadline is required and has to be in the future");
        }
        if (nameError !== "" || descriptionError !== "" || deadlineError !== "") {
            return false;
        }
        return true;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
        const newTask = {name, description, deadline, project: {id: projectId}, completed: false};
        // console.log(newTask);
        const response = await TaskService.create(newTask);
        const data = await response.json();

        router.push('/tasks/project/' + projectId);
        }

    }

    return (
        <>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="name">Name</label>
            <input type="text" id="name" onChange={(e) => setName(e.target.value)} />
            {nameError && <p>{nameError}</p>}
            </div>
            <div>
            <label htmlFor="description">Description</label>
            <input type="text" id="description" onChange={(e) => setDescription(e.target.value)} />
            {descriptionError && <p>{descriptionError}</p>}
            </div>
            <div>
            <label htmlFor="deadline">Deadline</label>
            <input type="date" id="deadline" onChange={(e) => setDeadline(new Date(e.target.value))} />
            {deadlineError && <p>{deadlineError}</p>}
            </div>
            <label htmlFor="project">Project</label>
            <button type="submit">Submit</button>
        </form>
        <div>
        {errorMessage && <p>{errorMessage}</p>}
        </div>
                
                </>
            );
        }

        export default TaskRegistrationForm;
