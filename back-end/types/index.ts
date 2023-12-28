type UserInput = {
    id?: number;
    name?: string;
    specialisation?: string;
    email?: string;
    password?: string;
    role?: Role;
};

type ProjectInput = {
    name?: string;
    id?: number;
};

type TeamInput = {
    name?: string;
    id?: number;
    users?: UserInput[];
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