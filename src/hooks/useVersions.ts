import { useCallback, useMemo, useState } from "react";
import { providerSources } from "../config/providers";
import { sortEntries, sortSeries } from "../utils/versioning";
import type { Branch, VersionEntry } from "../types";
import { useAsync } from "./useAsync";

export type BranchFilter = Array<"all" | Branch>;

function matchesSelection(values: string[], value: string) {
  return values.includes("all") || values.includes(value);
}

function matchesBranchSelection(values: string[], entry: VersionEntry) {
  if (values.includes("all")) {
    return entry.showInAllBranches;
  }

  return values.includes(entry.branch);
}

export function useVersions() {
  const providers = useMemo(() => providerSources, []);
  const [reloadToken, setReloadToken] = useState(0);
  const [branchFilter, setBranchFilter] = useState<BranchFilter>(["all"]);
  const [seriesFilter, setSeriesFilter] = useState<string[]>(["all"]);

  const loadEntries = useCallback(async () => {
    const result = await Promise.all(providers.map(provider => provider.loadEntries()));
    return sortEntries(
      result.flat(),
      providers.map(provider => provider.branch)
    );
  }, [providers]);

  const { data, error, isLoading } = useAsync(loadEntries, [loadEntries, reloadToken]);
  const entries = data ?? [];

  const branchOptions = useMemo(
    () => {
      const branches = new Map<string, string>();

      for (const provider of providers) {
        branches.set(provider.branch, provider.branchLabel);
      }

      return [
        { id: "all", labelKey: "filters.allBranches" },
        ...Array.from(branches, ([id, labelKey]) => ({ id, label: id, labelKey })),
      ];
    },
    [providers]
  );

  const seriesOptions = useMemo(
    () => [
      { id: "all", label: null },
      ...sortSeries(Array.from(new Set(entries.map(entry => entry.series)))).map(series => ({
        id: series,
        label: series,
      })),
    ],
    [entries]
  );

  const filteredEntries = useMemo(() => {
    return entries.filter(entry => {
      const matchesBranch = matchesBranchSelection(branchFilter, entry);
      const matchesSeries = matchesSelection(seriesFilter, entry.series);
      return matchesBranch && matchesSeries;
    });
  }, [branchFilter, entries, seriesFilter]);

  const reload = () => setReloadToken(current => current + 1);
  const resetFilters = () => {
    setBranchFilter(["all"]);
    setSeriesFilter(["all"]);
  };

  return {
    branchFilter,
    branchOptions,
    entries: filteredEntries,
    error,
    isLoading,
    providers,
    reload,
    resetFilters,
    seriesFilter,
    seriesOptions,
    setBranchFilter,
    setSeriesFilter,
  };
}
