import { Navigate, useLocation, useParams } from "react-router-dom";
import { projectService } from "../config/projects";
import { createProjectPath } from "../utils/project";

export function DefaultProjectRedirect() {
  const location = useLocation();
  const forwardedProject = projectService.findByDomain(window.location.hostname);
  const project = forwardedProject ?? projectService.getDefault();

  if (!project) {
    return null;
  }

  return (
    <Navigate
      replace
      to={{
        pathname: createProjectPath(project.id),
        search: forwardedProject ? location.search : "",
      }}
    />
  );
}

export function ProjectAliasRedirect() {
  const location = useLocation();
  const { projectId } = useParams();
  const requestedProject = projectService.findById(projectId);
  const project = requestedProject ?? projectService.getDefault();

  if (!project) {
    return null;
  }

  return (
    <Navigate
      replace
      to={{
        pathname: createProjectPath(project.id),
        search: requestedProject ? location.search : "",
      }}
    />
  );
}
