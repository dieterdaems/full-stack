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
    project?: ProjectInput;
    completed?: boolean;
};

type Role = 'admin' | 'user';
export { UserInput, ProjectInput, TeamInput, TaskInput, Role};