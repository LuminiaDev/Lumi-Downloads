import { createDownloadProjects } from "../../config/projectFactory.js";
import { ProjectService } from "../../services/project.service.js";
import { VersionService } from "../../services/version.service.js";
import type { VersionEntry } from "../../types";

type ServerEnvironment = Record<string, string | undefined>;

export class DownloadService {
  private readonly projectService: ProjectService;

  constructor(env: ServerEnvironment) {
    this.projectService = new ProjectService(createDownloadProjects(env));
  }

  async resolve(
    projectId: string | null,
    branch: string,
    target: string
  ): Promise<VersionEntry | null> {
    const project = projectId
      ? this.projectService.findById(projectId)
      : this.projectService.getDefault();

    if (!project) {
      return null;
    }

    const entries = await new VersionService(project.providers).loadAll();

    if (target === "latest") {
      return entries.find(entry => entry.branch === branch) ?? null;
    }

    const candidates = entries.filter(
      entry => entry.branch === branch && entry.fileName === target
    );
    return candidates.length === 1 ? candidates[0] : null;
  }
}
