import { z } from "zod";

function parseList(value: unknown) {
  const values = Array.isArray(value) ? value : value === undefined ? [] : [value];

  return Array.from(
    new Set(
      values
        .filter((item): item is string => typeof item === "string")
        .flatMap(item => item.split(","))
        .map(item => item.trim())
        .filter(item => item && item !== "all")
    )
  );
}

const filterListSchema = z.preprocess(parseList, z.array(z.string()));

const limitSchema = z.preprocess(
  value => (Array.isArray(value) ? value[0] : value),
  z.coerce.number().int().min(1).max(1000).optional()
);

export const versionsQuerySchema = z.object({
  branches: filterListSchema,
  limit: limitSchema,
  versions: filterListSchema,
});
