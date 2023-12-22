import { Project } from "@/types";

const getAll = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const getById = (projectId: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/projects/' + projectId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const create = (name : string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({name}),
    });
}

const deleteProject = (projectId: string) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/projects/' + projectId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
const ProjectService = {
    getAll,
    getById,
    create,
    deleteProject
}

export default ProjectService;