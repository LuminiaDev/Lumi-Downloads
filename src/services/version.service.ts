import type { VersionProviderSource } from "../types";
import { sortEntries } from "../utils/versioning.js";

export type VersionFilters = {
  branches?: string[];
  limit?: number | null;
  versions?: string[];
};

export class VersionService {
  constructor(private readonly providers: VersionProviderSource[]) {}

  async loadAll() {
    const result = await Promise.all(this.providers.map(provider => provider.loadEntries()));

    return sortEntries(
      result.flat(),
      this.providers.map(provider => provider.branch)
    );
  }

  async load(filters: VersionFilters = {}) {
    const entries = await this.loadAll();
    const branches = this.normalizeFilter(filters.branches);
    const versions = this.normalizeFilter(filters.versions);
    const filteredEntries = entries.filter(entry => {
      const matchesBranch = branches.length
        ? branches.includes(entry.branch)
        : entry.showInAllBranches;
      const matchesVersion = versions.length ? versions.includes(entry.series) : true;
      return matchesBranch && matchesVersion;
    });

    return filters.limit ? filteredEntries.slice(0, filters.limit) : filteredEntries;
  }

  private normalizeFilter(values: string[] | undefined) {
    return Array.from(new Set(values?.filter(value => value && value !== "all") ?? []));
  }
}
