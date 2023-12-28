type UserInput = {
    id?: number;
    name?: string;
    specialisation?: string;
    email?: string;
    password?: string;
    };

type ProjectInput = {
    name?: string;
    id?: number;
    team?: TeamInput;
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


export { UserInput, ProjectInput, TeamInput, TaskInput };