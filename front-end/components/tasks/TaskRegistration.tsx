import ProjectService from "@/services/ProjectService";
import TaskService from "@/services/TaskService";
import { Project } from "@/types";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";

type Props = {
    projectId: number;
};

const TaskRegistrationForm: React.FC<Props> = ({projectId} : Props) => {

    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [deadline, setDeadline] = useState<Date>(new Date());

    const router = useRouter();


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
                
                </>
            );
        }

        export default TaskRegistrationForm;
