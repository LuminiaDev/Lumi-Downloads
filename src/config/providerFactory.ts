import { ReposiliteVersionProviderSource } from "../providers/reposilite.js";
import type { VersionProviderSource } from "../types";

type ProviderEnvironment = Record<string, string | undefined>;

export function createProviderSources(env: ProviderEnvironment): VersionProviderSource[] {
  const artifactId = env.VITE_LUMI_ARTIFACT_ID ?? "Lumi";
  const groupId = env.VITE_LUMI_GROUP_ID ?? "com.koshakmine";
  const reposiliteUrl = env.VITE_LUMI_REPOSILITE_URL ?? "https://repo.lumi.su";

  return [
    new ReposiliteVersionProviderSource({
      artifactId,
      baseUrl: reposiliteUrl,
      branch: "stable",
      branchLabel: "branches.stable",
      groupId,
      id: "stable-releases",
      label: "Stable / Releases",
      repository: env.VITE_LUMI_STABLE_REPOSITORY ?? "releases",
    }),
    new ReposiliteVersionProviderSource({
      artifactId,
      baseUrl: reposiliteUrl,
      branch: "dev",
      branchLabel: "branches.dev",
      groupId,
      id: "dev-snapshots",
      label: "Dev / Snapshots",
      repository: env.VITE_LUMI_DEV_REPOSITORY ?? "snapshots",
    }),
    new ReposiliteVersionProviderSource({
      artifactId: "Lumi-old",
      baseUrl: reposiliteUrl,
      branch: "legacy",
      branchLabel: "branches.legacy",
      fileArtifactId: "Lumi",
      groupId,
      id: "legacy-snapshots",
      label: "Legacy Snapshots",
      repository: "snapshots",
      showInAllBranches: false,
    }),
  ];
}
