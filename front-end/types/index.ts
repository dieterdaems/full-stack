type User = {
    id?: number;
    name: string;
    specialisation: string;
    email: string;
    password?: string;
    teams?: Array<Team>;
    role: string;
}

type UserLogin = {
    email: string;
    password: string;
}

type Team = {
    id?: number;
    name: string;
}

type Task = {
    id?: number;
    name: string;
    description: string;
    deadline: Date;
    projectId: number;
    completed?: boolean;
    userId?: number;
}

type Project = {
    id?: number;
    name?: string;
}

type StatusMessage = {
    type: 'error' | 'success';
    message: string
}

export type { User, UserLogin, Project, Task, StatusMessage, Team};