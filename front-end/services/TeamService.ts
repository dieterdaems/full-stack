const getAll = () => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/teams', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const addUser = (teamId: number, userId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/teams/' + teamId + '/user/' + userId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const removeUser = (teamId: number, userId: number) => {
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/teams/' + teamId + '/user/' + userId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

const TeamService = {
    getAll,
    addUser,
    removeUser
}

export default TeamService;