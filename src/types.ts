export type Branch = string;

export type VersionEntry = {
  branch: Branch;
  branchLabel: string;
  downloadUrl: string;
  fileName: string;
  id: string;
  logicalVersion: string;
  modifiedAt: number | null;
  providerId: string;
  providerLabel: string;
  series: string;
  checksumUrl: string | null;
  showInAllBranches: boolean;
  sourceText: string | null;
  sourceUrl: string | null;
  version: string;
};

export interface VersionProviderSource {
  readonly branch: Branch;
  readonly branchLabel: string;
  readonly id: string;
  readonly label: string;
  readonly showInAllBranches: boolean;
  loadEntries(): Promise<VersionEntry[]>;
}
