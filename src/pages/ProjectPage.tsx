import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useParams } from "react-router-dom";
import { projectService } from "../config/projects";
import { createProjectPath } from "../utils/project";
import { HomePage } from "./HomePage";

export function ProjectPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const project = projectService.findById(projectId);
  const defaultProject = projectService.getDefault();

  useEffect(() => {
    if (project) {
      document.title = t("app.projectTitle", { project: project.name });
    }
  }, [project, t]);

  if (!project) {
    return defaultProject ? <Navigate replace to={createProjectPath(defaultProject.id)} /> : null;
  }

  return <HomePage project={project} />;
}
