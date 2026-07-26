# Public API

The public API is implemented with Express and versioned independently from the website. The
current base path is `/api/v1`.

## Endpoints

### Health

```http
GET /api/v1/health
```

Returns:

```json
{
  "status": "ok",
  "version": "v1"
}
```

### Projects

```http
GET /api/v1/projects
GET /api/v1/projects/{projectId}
```

The collection endpoint returns all configured projects. A project contains its branches,
providers, forwarded domains, and links to the website and versions endpoint.

### Versions

```http
GET /api/v1/projects/{projectId}/versions
```

Supported query parameters:

| Parameter | Description |
| --- | --- |
| `branches` | Branch IDs separated by commas or passed multiple times |
| `versions` | Version series separated by commas or passed multiple times |
| `limit` | Maximum result count from `1` to `1000` |

Examples:

```http
GET /api/v1/projects/lumi/versions?branches=dev
GET /api/v1/projects/lumi/versions?branches=stable,dev&versions=1.6,1.5
GET /api/v1/projects/lumi/versions?branches=dev&versions=1.6&limit=1
```

Without `branches`, the endpoint returns only entries whose provider is configured to appear in
the all-branches view. Passing a branch explicitly also makes hidden legacy branches available.
Each version may include a `properties` object with provider-specific build metadata. The
Reposilite provider fills it from the matching `.properties` file when one exists.

### Version lookup

```http
GET /api/v1/projects/{projectId}/versions/lookup
```

Lookup performs an exact match inside one branch. The `branch` parameter and at least one lookup
field are required:

```http
GET /api/v1/projects/lumi/versions/lookup?branch=dev&properties.git.commit.id=34306164cd295823eb701f3ea8d4aa71de79e6ab
GET /api/v1/projects/lumi/versions/lookup?branch=dev&fileName=Lumi-1.6.4-20260624.173236-4.jar
GET /api/v1/projects/lumi/versions/lookup?branch=dev&providerId=dev-snapshots&version=1.6.4-20260624.173236-4
```

All primitive `VersionEntry` fields are searchable:

`branch`, `branchLabel`, `checksumUrl`, `downloadUrl`, `fileName`, `id`, `logicalVersion`,
`modifiedAt`, `providerId`, `providerLabel`, `series`, `showInAllBranches`, `sourceText`,
`sourceUrl`, and `version`.

Provider properties use the `properties.{key}` syntax. Property names may contain dots:

```http
GET /api/v1/projects/lumi/versions/lookup?branch=dev&properties.github.repo=KoshakMineDev%2FLumi
```

Filters are combined with logical AND. A unique match returns the version, its neighboring builds,
and its zero-based position in the branch:

```json
{
  "neighbors": {
    "newer": null,
    "older": {}
  },
  "position": {
    "index": 0,
    "newerCount": 0,
    "olderCount": 20,
    "total": 21
  },
  "version": {}
}
```

The endpoint returns `404` when nothing matches and `409` when multiple versions match. For
example, a common value such as `properties.github.repo` will usually require an additional filter
to make the lookup unique.

## Responses

Collection endpoints return JSON arrays directly:

```json
[]
```

Single-resource endpoints return the resource object directly. Errors have a consistent message:

```json
{
  "message": "Project not found"
}
```

Invalid query parameters return status `400` and include validation details.

All API endpoints support cross-origin `GET` requests. A future incompatible API can be added as
another Express router under `src/server/api/v2` and mounted at `/api/v2` without changing v1.
