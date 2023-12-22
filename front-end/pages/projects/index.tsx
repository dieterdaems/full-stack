import AddProject from "@/components/projects/AddProject";
import ProjectOverviewTable from "@/components/projects/ProjectsOverviewTable";
import ProjectService from "@/services/ProjectService";
import { Project } from "@/types";
import { Head } from "next/document";
import { mainModule } from "process";
import { useEffect, useState, useDeferredValue } from "react";
import useSWR, { mutate } from "swr";
import useInterval from "use-interval";

const Projects: React.FC = () => {


    const fetchProjects = async () => {
        
        const response = await ProjectService.getAll();
        const projects = await response.json();
        
        return projects;
    }

    // const change = () => {
    //     add = !add;
    //     toggle();
    // }
    
    // const toggle = () => {
    //     return add;
    // }

// useEffect(() => {
//     fetchProjects();
// }, []);

const {data, isLoading, error} = useSWR('projectsFromDb', fetchProjects);
// const {data: data2, error: error2} = useSWR('toggle', toggle);

useInterval(() => {
    mutate('projectsFromDb', fetchProjects());
    // mutate('toggle', toggle());
}, 1000);


return (
    <>
    <main>
        <h1>Projects</h1>
        {error && <p>{error}</p>}
        {isLoading && <p>Loading...</p>}
        <section>
            {data && (<ProjectOverviewTable projects={data} />) }
        </section>
        <section>
            <AddProject />
        </section>
    </main>
    
    
    </>

)

    };

export default Projects;
