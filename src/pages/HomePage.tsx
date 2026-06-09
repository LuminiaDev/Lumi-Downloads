import { Card, CardContent } from "@heroui/react";
import { VersionFilters } from "../components/VersionFilters";
import { VersionsTable } from "../components/VersionsTable";
import { useVersions } from "../hooks/useVersions";

export function HomePage() {
  const {
    branchFilter,
    branchOptions,
    entries,
    error,
    isLoading,
    reload,
    seriesFilter,
    seriesOptions,
    setBranchFilter,
    setSeriesFilter,
  } = useVersions();

  return (
    <section className="mx-auto w-full max-w-[1382px] px-4 py-8 md:px-6">
      <Card>
        <CardContent className="space-y-4">
          <VersionFilters
            branchFilter={branchFilter}
            branchOptions={branchOptions}
            onBranchChange={setBranchFilter}
            onSeriesChange={setSeriesFilter}
            seriesFilter={seriesFilter}
            seriesOptions={seriesOptions}
          />
          <VersionsTable entries={entries} error={error} isLoading={isLoading} onRetry={reload} />
        </CardContent>
      </Card>
    </section>
  );
}
