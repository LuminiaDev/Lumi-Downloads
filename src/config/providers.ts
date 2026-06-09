import { ReposiliteVersionProviderSource } from "../providers/reposilite";
import type { VersionProviderSource } from "../types";

const artifactId = import.meta.env.VITE_LUMI_ARTIFACT_ID ?? "Lumi";
const groupId = import.meta.env.VITE_LUMI_GROUP_ID ?? "com.koshakmine";
const reposiliteUrl = import.meta.env.VITE_LUMI_REPOSILITE_URL ?? "https://repo.lumi.su";

export const providerSources: VersionProviderSource[] = [
  new ReposiliteVersionProviderSource({
    artifactId,
    baseUrl: reposiliteUrl,
    branch: "stable",
    branchLabel: "branches.stable",
    groupId,
    id: "stable-releases",
    label: "Stable / Releases",
    repository: import.meta.env.VITE_LUMI_STABLE_REPOSITORY ?? "releases",
  }),
  new ReposiliteVersionProviderSource({
    artifactId,
    baseUrl: reposiliteUrl,
    branch: "dev",
    branchLabel: "branches.dev",
    groupId,
    id: "dev-snapshots",
    label: "Dev / Snapshots",
    repository: import.meta.env.VITE_LUMI_DEV_REPOSITORY ?? "snapshots",
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
