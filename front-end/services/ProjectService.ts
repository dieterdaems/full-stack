const getAll = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const ProjectService = {
    getAll
}

export default ProjectService;