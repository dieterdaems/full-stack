import { Task } from "@/types";

const getAll = () => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },
    });
}

const getByProjectId = (projectId: string) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks/project/' + projectId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },
    });
}

const create = ({ name, description, deadline, project }: Task) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

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
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },
    });
}

const completeTask = ({ id, name, description, deadline, project }: Task) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/tasks/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            id,
            name,
            description,
            deadline,
            completed: true,
            project
        })
    });
}

const TaskService = {
    getAll,
    getByProjectId,
    create,
    deleteById,
    completeTask
}

export default TaskService;