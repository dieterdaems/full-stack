import { Project, Task } from "@/types";

const getAll = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const getByProjectId = (projectId: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks/project/' + projectId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const create = ({name, description, deadline, project} : Task) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name,
            description,
            deadline,
            project
        })
    });
}

const deleteById = (id: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const TaskService = {
    getAll,
    getByProjectId,
    create,
    deleteById
}

export default TaskService;