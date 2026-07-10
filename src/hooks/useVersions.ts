import { useCallback, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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

function parseMultiValue(value: string | null) {
  const values =
    value
      ?.split(",")
      .map(item => item.trim())
      .filter(Boolean) ?? [];

  return values.length > 0 && !values.includes("all") ? values : ["all"];
}

function parseLimit(value: string | null) {
  if (!value) {
    return null;
  }

  const limit = Number.parseInt(value, 10);
  return Number.isFinite(limit) && limit > 0 ? limit : null;
}

function serializeFilter(values: string[]) {
  const normalizedValues = values.filter(value => value !== "all");
  return normalizedValues.length > 0 ? normalizedValues.join(",") : null;
}

export function useVersions() {
  const providers = useMemo(() => providerSources, []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [reloadToken, setReloadToken] = useState(0);
  const branchFilter = parseMultiValue(searchParams.get("branches")) as BranchFilter;
  const seriesFilter = parseMultiValue(searchParams.get("versions"));
  const limit = parseLimit(searchParams.get("limit"));

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
    const nextEntries = entries.filter(entry => {
      const matchesBranch = matchesBranchSelection(branchFilter, entry);
      const matchesSeries = matchesSelection(seriesFilter, entry.series);
      return matchesBranch && matchesSeries;
    });

    return limit ? nextEntries.slice(0, limit) : nextEntries;
  }, [branchFilter, entries, limit, seriesFilter]);

  const reload = () => setReloadToken(current => current + 1);
  const updateFilterParam = (key: string, values: string[]) => {
    setSearchParams(current => {
      const nextParams = new URLSearchParams(current);
      const serializedValue = serializeFilter(values);

      if (serializedValue) {
        nextParams.set(key, serializedValue);
      } else {
        nextParams.delete(key);
      }

      return nextParams;
    });
  };
  const setBranchFilter = (value: BranchFilter) => updateFilterParam("branches", value);
  const setSeriesFilter = (value: string[]) => updateFilterParam("versions", value);
  const resetFilters = () => {
    setSearchParams(current => {
      const nextParams = new URLSearchParams(current);
      nextParams.delete("branches");
      nextParams.delete("versions");
      nextParams.delete("limit");
      return nextParams;
    });
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
