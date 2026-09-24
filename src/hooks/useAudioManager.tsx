import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

interface AudioManager {
  /** Id of the player currently allowed to produce sound, or null. */
  activeId: string | null;
  /** Claim playback. Every other player watches this and pauses itself. */
  claim: (id: string) => void;
  /** Give up playback if this player still holds it. */
  release: (id: string) => void;
}

const AudioManagerContext = createContext<AudioManager | null>(null);

/**
 * Single-playback coordinator. There is no autoplay anywhere in the app: a
 * player only claims the channel from a direct user gesture.
 */
export function AudioManagerProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);

  const claim = useCallback((id: string) => setActiveId(id), []);
  const release = useCallback(
    (id: string) => setActiveId((current) => (current === id ? null : current)),
    [],
  );

  const value = useMemo<AudioManager>(
    () => ({ activeId, claim, release }),
    [activeId, claim, release],
  );

  return <AudioManagerContext.Provider value={value}>{children}</AudioManagerContext.Provider>;
}

export function useAudioManager(): AudioManager {
  const ctx = useContext(AudioManagerContext);
  if (!ctx) throw new Error('useAudioManager must be used inside <AudioManagerProvider>');
  return ctx;
}
