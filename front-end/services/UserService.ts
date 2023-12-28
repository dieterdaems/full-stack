import { User, UserLogin } from "@/types";

const getAll = async () => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
}

const getById = async (id: number) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/' + id, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
}

const getByEmail = async (email: string) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/email/' + email, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
}


const create = async ({name, specialisation, email, password} : User) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            specialisation,
            email,
            password
        })
    });
}

const update = async ({id, name, specialisation, email} : User) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/update/' + id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            name,
            specialisation,
            email,
        })
    });
}

const login = async ({email, password}: UserLogin) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
            email,
            password
        })
    });
}

const addUserToTeam = (teamId: number, userId: number) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/team/' + teamId + '/user/' + userId, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
}

const removeUserFromTeam = (teamId: number, userId: number) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/team/' + teamId + '/user/' + userId, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
}

const UserService = {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    login,
    addUserToTeam,
    removeUserFromTeam
}

export default UserService;
