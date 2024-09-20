import React, {useEffect, useState} from 'react';
import {Project} from "../../utils/types";
import {Loading} from "./Loading";
import {ChevronDownIcon} from "@heroicons/react/24/solid";
import {ExclamationTriangleIcon} from "@heroicons/react/24/outline";

export interface ProjectDropdownProps {
    isLoadingProjects: boolean;
    projects: Project[];
    onSelectProject: (projectId: string) => void;
    projectId: string;
}

const ProjectDropdown: React.FC<ProjectDropdownProps> = ({
                                                             isLoadingProjects,
                                                             projects,
                                                             onSelectProject,
                                                             projectId
                                                         }: ProjectDropdownProps) => {
    const [selectedProject, setSelectedProject] = useState(projects?.find(project => project.id === projectId));
    const [dropdownOpen, setDropdownOpen] = useState(false);


    useEffect(() => {
        if (projects === undefined) return;
        setSelectedProject(projects.find(project => project.id === projectId));
    }, [projectId]);

    const handleSelectProject = (project: Project) => {
        setSelectedProject(project);
        setDropdownOpen(false);
        onSelectProject(project.id);
    };

    if (isLoadingProjects || projects === undefined) return <Loading message={"Loading projects..."}/>

    return (
        <div className="relative w-full">
            <div
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex justify-between items-center cursor-pointer bg-white border border-gray-300 rounded-t-sm shadow-sm py-2 px-4 w-full"
            >
                {selectedProject ? (
                    <div className="flex items-center">
                        <img
                            src={selectedProject.image}
                            alt={selectedProject.name}
                            className="w-8 h-8 rounded-full mr-3"
                        />
                        <span>{selectedProject.name}</span>
                    </div>
                ) : (
                    <span className="text-qonic-gray-400">Project</span>
                )}
                <ChevronDownIcon className="size-6 text-qonic-gray-400"/>
            </div>

            {dropdownOpen && (
                <div
                    className="absolute top-full left-0 w-full bg-white border-b border-x border-gray-300 rounded-sm z-10 max-h-48 overflow-y-auto">
                    {projects.length === 0 ? (
                        <div className="flex flex-col justify-center items-center px-4 py-7">
                            <div className="bg-gray-100 rounded-full size-10 flex justify-center items-center">
                                <ExclamationTriangleIcon className="size-6 text-red-500 text-center"/>
                            </div>
                            <p className="mt-3 text-center text-qonic-gray-400">You have no projects available.</p>
                            <p className="text-center text-qonic-gray-400">Create a project and upload models in the Qonic Dashboard.</p>
                        </div>

                    ) : (
                        <>
                            {projects.map((project, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleSelectProject(project)}
                                    className="flex items-center py-2 px-4 hover:bg-gray-100 cursor-pointer"
                                >
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="w-8 h-8 rounded-full mr-3"
                                    />
                                    <span>{project.name}</span>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectDropdown;
