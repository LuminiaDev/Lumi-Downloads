import { ProjectService } from "../services/project.service.js";
import { createDownloadProjects } from "./projectFactory.js";

export const downloadProjects = createDownloadProjects(import.meta.env);
export const projectService = new ProjectService(downloadProjects);
