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
const ProjectService = {
    getAll,
    getById
}

export default ProjectService;