type User = {
    id?: number;
    name: string;
    specialisation: string;
    email: string;
    password?: string;
    teams?: Array<Team>;
}

type UserLogin = {
    email: string;
    password: string;
}

type Team = {
    id?: number;
    name: string;
}

type TeamUpdate = {
    id: number;
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
}

type StatusMessage = {
    type: 'error' | 'success';
    message: string
}

export type { User, UserLogin, Project, Task, StatusMessage, Team, TeamUpdate};