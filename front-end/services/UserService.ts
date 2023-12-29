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

const deleteUser = (id: number) => {
    const token = sessionStorage.getItem('token');
    return fetch(process.env.NEXT_PUBLIC_API_URL + '/users/' + id, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
    });
}

const getAuth = async () => {
    const id = sessionStorage.getItem('loggedUser');
    if (id === undefined) return false;
    if (id) {
        const res = await UserService.getById(parseInt(id));
        if (res.status === 200) {
            return true;
        }
    }
    return false;
}

const UserService = {
    getAll,
    getById,
    getByEmail,
    create,
    update,
    login,
    addUserToTeam,
    removeUserFromTeam,
    deleteUser,
    getAuth
}

export default UserService;
