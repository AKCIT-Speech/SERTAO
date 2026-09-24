/** Formats seconds as m:ss. Returns an em dash when the value is unknown. */
export function formatTime(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds) || seconds < 0) return '—';
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

/** Formats a duration for metadata rows, e.g. "2.80 s". */
export function formatDuration(seconds: number | null | undefined): string {
  if (seconds == null || !Number.isFinite(seconds)) return 'unknown';
  return `${seconds.toFixed(2)} s`;
}

export function formatInteger(value: number): string {
  return value.toLocaleString('en-US');
}

/** "7 min 57 s" style summary for aggregate durations. */
export function formatAggregateDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  const m = Math.floor(seconds / 60);
  const s = Math.round(seconds % 60);
  return m > 0 ? `${m} min ${s} s` : `${s} s`;
}

/**
 * Resolves a relative audio_url from samples.json against the app base URL, so
 * the site keeps working when hosted from a sub-path. Never touches absolute
 * URLs and never produces an OS path.
 */
export function resolveAssetUrl(relativeUrl: string): string {
  if (/^(https?:)?\/\//i.test(relativeUrl)) return relativeUrl;
  const base = import.meta.env.BASE_URL || '/';
  const trimmedBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const trimmedPath = relativeUrl.startsWith('/') ? relativeUrl : `/${relativeUrl}`;
  return `${trimmedBase}${trimmedPath}`;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
}
