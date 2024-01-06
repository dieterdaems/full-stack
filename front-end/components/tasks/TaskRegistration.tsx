import TaskService from "@/services/TaskService";
import { useRouter } from "next/router";
import { FormEvent, useState } from "react";
import { useTranslation } from "next-i18next";

type Props = {
    projectId: number;
};

const TaskRegistrationForm: React.FC<Props> = ({projectId} : Props) => {

    const [name, setName] = useState<string>("");
    const [nameError, setNameError] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [descriptionError, setDescriptionError] = useState<string>("");
    const [deadline, setDeadline] = useState<Date>(new Date());
    const [deadlineError, setDeadlineError] = useState<string>("");
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();
    const { t } = useTranslation();

    const validate = () => {
        setNameError('');
        setDescriptionError('');
        setDeadlineError('');
        let valid = true;
        if (name === "" || name.trim() === "") {
            setNameError(t('tasks.errorName'));
            valid = false;
        }

        if (description === "" || description.trim() === "") {
            setDescriptionError(t('tasks.errorDescription'));
            valid = false;
        }

        if (!deadline || deadline < new Date()){
            setDeadlineError(t('tasks.errorDeadline'));
            valid = false;
        }

        return valid;
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (validate()) {
        const newTask = {name, description, deadline, projectId};
        const response = await TaskService.create(newTask);
        if (!response.ok) {
         setErrorMessage(response.statusText);
        }
        else router.push('/tasks/project/' + projectId);
        }
    }

    return (
        <>
        <div className="bg-gray-100 flex items-center justify-center">
        <div className="container mx-auto my-8" >
        <form className="mt-4 flex flex-col items-center" onSubmit={handleSubmit}>
            <div>
            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
            <label className='global-label' htmlFor="name">{t('tasks.name')}</label>
            <input className='global-input' type="text" id="name" onChange={(e) => setName(e.target.value)} />
            </div>
            </div>
            {nameError && <p className=" text-red-500">{nameError}</p>}
            </div>
            <div>
            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
            <label className="global-label" htmlFor="description">{t('tasks.description')}</label>
            <input className='global-input' type="text" id="description" onChange={(e) => setDescription(e.target.value)} />
            </div>
            </div>
            {descriptionError && <p className=" text-red-500">{descriptionError}</p>}
            </div>
            <div>
            <div className=" bg-gray-100 p-4 rounded-lg">
                <div className="relative bg-inherit mt-4">
            <label className="global-label" htmlFor="deadline">{t('tasks.deadline')}</label>
            <input className='global-input' type="date" id="deadline" onChange={(e) => setDeadline(new Date(e.target.value))} />
            </div>
            </div>
            {deadlineError && <p className=" text-red-500">{deadlineError}</p>}
            </div>
            <div className="flex justify-center">
            <button className="global-button" type="submit">{t('add')}</button>
            </div>
        </form>
        <div>
        {errorMessage && <p className=" text-red-500">{errorMessage}</p>}
        </div>
        </div>
        </div>
                
                </>
            );
        }

        export default TaskRegistrationForm;
