export function createDownloadLatestPath(branch: string) {
  return `/download/${encodeURIComponent(branch)}/latest`;
}

export function createDownloadFilePath(branch: string, fileName: string) {
  return `/download/${encodeURIComponent(branch)}/${encodeURIComponent(fileName)}`;
}
