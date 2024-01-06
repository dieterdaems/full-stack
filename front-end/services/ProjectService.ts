
import { Project, Team } from "@/types";

const getAll = () => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
}

const create = (name : string, team: Team) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/projects', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({name, team}),
    });
}

const deleteProject = (projectId: string) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/projects/' + projectId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
}

const ProjectService = {
    getAll,
    create,
    deleteProject
}

export default ProjectService;