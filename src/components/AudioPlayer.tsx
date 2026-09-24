import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, Loader2, Pause, Play, RotateCcw } from 'lucide-react';
import { useAudioManager } from '../hooks/useAudioManager';
import { formatTime, resolveAssetUrl } from '../lib/format';
import Waveform from './Waveform';

interface AudioPlayerProps {
  /** Unique id used by the single-playback coordinator. */
  id: string;
  /** Relative url from samples.json, e.g. /audio/sertao/fear/example.wav */
  src: string;
  color: string;
  /** Human-readable description used for accessible labels. */
  title: string;
  /** Duration from the manifest, shown before the file is ever fetched. */
  metadataDuration: number | null;
  showWaveform?: boolean;
  waveformBars?: number;
  compact?: boolean;
}

type PlaybackState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export default function AudioPlayer({
  id,
  src,
  color,
  title,
  metadataDuration,
  showWaveform = true,
  waveformBars = 48,
  compact = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { activeId, claim, release } = useAudioManager();

  const [state, setState] = useState<PlaybackState>('idle');
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState<number | null>(metadataDuration);

  const isPlaying = state === 'playing';
  const isBusy = state === 'loading';
  const hasError = state === 'error';
  const resolvedSrc = resolveAssetUrl(src);

  // Another player claimed the channel → stop making sound immediately.
  useEffect(() => {
    if (activeId !== id && isPlaying) {
      audioRef.current?.pause();
    }
  }, [activeId, id, isPlaying]);

  // Release the channel on unmount (e.g. when filters remove this card).
  useEffect(() => () => release(id), [id, release]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || hasError) return;

    if (isPlaying) {
      audio.pause();
      return;
    }

    claim(id);
    setState('loading');
    try {
      await audio.play();
    } catch (error) {
      // AbortError happens when the user toggles quickly; not a real failure.
      if ((error as Error)?.name === 'AbortError') return;
      setState('error');
    }
  }, [claim, hasError, id, isPlaying]);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasError) return;
    audio.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) void toggle();
  }, [hasError, isPlaying, toggle]);

  const onSeek = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    const next = Number(event.target.value);
    setCurrentTime(next);
    if (audio && Number.isFinite(next)) audio.currentTime = next;
  }, []);

  const effectiveDuration = duration ?? metadataDuration;
  const progress =
    effectiveDuration && effectiveDuration > 0
      ? Math.min(1, currentTime / effectiveDuration)
      : 0;
  const percent = Math.round(progress * 100);

  const statusLabel = hasError
    ? 'Audio file unavailable'
    : isBusy
      ? 'Loading audio'
      : isPlaying
        ? 'Playing'
        : 'Paused';

  return (
    <div className={compact ? 'space-y-2' : 'space-y-3'}>
      {/* preload="none": nothing is fetched until the user asks for it. */}
      <audio
        ref={audioRef}
        src={resolvedSrc}
        preload="none"
        onPlaying={() => setState('playing')}
        onPause={() => setState((prev) => (prev === 'error' ? prev : 'paused'))}
        onEnded={() => {
          setState('paused');
          setCurrentTime(0);
          release(id);
        }}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => {
          const value = event.currentTarget.duration;
          if (Number.isFinite(value) && value > 0) setDuration(value);
        }}
        onError={() => {
          setState('error');
          release(id);
        }}
      />

      {showWaveform && (
        <Waveform
          seed={id + src}
          color={hasError ? 'var(--solid-faint)' : color}
          progress={progress}
          bars={waveformBars}
          height={compact ? 28 : 36}
        />
      )}

      {hasError ? (
        <p
          className="flex items-start gap-2 rounded-card border border-emotion-angry/40 bg-emotion-angry/10 px-2.5 py-2 font-mono text-[11px] leading-snug text-paper"
          role="status"
        >
          <AlertTriangle className="mt-[1px] h-3.5 w-3.5 shrink-0 text-emotion-angry" aria-hidden="true" />
          <span>
            Audio file missing or unreadable.
            <span className="block text-muted">{src}</span>
          </span>
        </p>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              aria-label={`${isPlaying ? 'Pause' : 'Play'} ${title}`}
              aria-pressed={isPlaying}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-card border border-line bg-ink-900
                text-paper transition-colors hover:border-paper/60 focus-visible:ring-2"
              style={{ ['--focus-ring' as string]: color }}
            >
              {isBusy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Play className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={restart}
              aria-label={`Restart ${title}`}
              className="grid h-9 w-9 shrink-0 place-items-center rounded-card border border-line bg-ink-900
                text-muted transition-colors hover:border-paper/60 hover:text-paper focus-visible:ring-2"
              style={{ ['--focus-ring' as string]: color }}
            >
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            </button>

            <div className="min-w-0 flex-1">
              <input
                type="range"
                className="seek focus-visible:ring-2"
                min={0}
                max={effectiveDuration && effectiveDuration > 0 ? effectiveDuration : 1}
                step={0.01}
                value={currentTime}
                onChange={onSeek}
                disabled={!effectiveDuration}
                aria-label={`Seek within ${title}`}
                aria-valuetext={`${formatTime(currentTime)} of ${formatTime(effectiveDuration)}`}
                style={{
                  ['--seek-track' as string]: `linear-gradient(to right, ${color} 0%, ${color} ${percent}%, var(--solid-track) ${percent}%, var(--solid-track) 100%)`,
                  ['--seek-thumb' as string]: color,
                  ['--focus-ring' as string]: color,
                }}
              />
            </div>

            <p className="shrink-0 font-mono text-[11px] tabular-nums text-muted">
              {formatTime(currentTime)}
              <span className="px-1 text-faint">/</span>
              {formatTime(effectiveDuration)}
            </p>
          </div>

          {/* Announced to screen readers without cluttering the visual layout. */}
          <p className="sr-only" role="status" aria-live="polite">
            {statusLabel}: {title}
          </p>
        </>
      )}
    </div>
  );
}
