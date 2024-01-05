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
        const newTask = {name, description, deadline, projectId};
        const response = await TaskService.create(newTask);
        router.push('/tasks/project/' + projectId);
        }

    }

    return (
        <>
        <div className="bg-gray-100 flex items-center justify-center">
        <div className="container mx-auto my-8" >
        <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>
            <div>
            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
            <label className='global-label' htmlFor="name">Name</label>
            <input className='global-input' type="text" id="name" onChange={(e) => setName(e.target.value)} />
            </div>
            </div>
            {nameError && <p className=" text-red-500">{nameError}</p>}
            </div>
            <div>
            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
            <label className="global-label" htmlFor="description">Description</label>
            <input className='global-input' type="text" id="description" onChange={(e) => setDescription(e.target.value)} />
            </div>
            </div>
            {descriptionError && <p className=" text-red-500">{descriptionError}</p>}
            </div>
            <div>
            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
            <label className="global-label" htmlFor="deadline">Deadline</label>
            <input className='global-input' type="date" id="deadline" onChange={(e) => setDeadline(new Date(e.target.value))} />
            </div>
            </div>
            {deadlineError && <p className=" text-red-500">{deadlineError}</p>}
            </div>
            <label htmlFor="project">Project</label>
            <div className="flex justify-center">
            <button className="global-button" type="submit">Submit</button>
            </div>
        </form>
        <div>
        {errorMessage && <p className=" text-red-500">{errorMessage}</p>}
        </div>
        </div>
        </div>
                
                </>
            );
        }

        export default TaskRegistrationForm;
