const getAll = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/teams', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const TeamService = {
    getAll,
}

export default TeamService;