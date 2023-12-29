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
    project: Project;
    completed: boolean;
}

type Project = {
    id?: number;
    name?: string;
    team?: Team;
}

type StatusMessage = {
    type: 'error' | 'success';
    message: string
}

export type { User, UserLogin, Project, Task, StatusMessage, Team};