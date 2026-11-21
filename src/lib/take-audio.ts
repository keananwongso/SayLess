const downloadedAudio = new Map<string, Promise<ArrayBuffer>>();

export function loadTakeAudio(source: Blob | string): Promise<ArrayBuffer> {
  if (typeof source !== "string") return source.arrayBuffer();

  const cached = downloadedAudio.get(source);
  if (cached) return cached;
  const download = fetch(source).then((response) => {
    if (!response.ok) throw new Error("Sample audio unavailable");
    return response.arrayBuffer();
  }).catch((error: unknown) => {
    downloadedAudio.delete(source);
    throw error;
  });
  downloadedAudio.set(source, download);
  return download;
}
