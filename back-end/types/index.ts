type UserInput = {
    id?: number;
    name?: string;
    specialisation?: string;
    email?: string;
    password?: string;
    role?: Role;
    teams?: TeamInput[];
};

type ProjectInput = {
    name?: string;
    id?: number;
    team?: TeamInput;
    teamId?: number;
};

type TeamInput = {
    name?: string;
    id?: number;
};

type TaskInput = {
    name?: string;
    id?: number;
    description?: string;
    deadline?: Date;
    projectId?: number;
    completed?: boolean;
    userId?: number;
};

type AuthenticationResponse = {
    token: string;
    id: number;
    role: Role;
}

type Role = 'admin' | 'user';
export { UserInput, ProjectInput, TeamInput, TaskInput, Role, AuthenticationResponse};