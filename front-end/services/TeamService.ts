const getAll = () => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/teams', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`

        },
    });
}


const TeamService = {
    getAll
}

export default TeamService;