import { AlertTriangle } from 'lucide-react';
import { EMOTIONS } from './lib/emotions';
import { copy } from './lib/i18n';
import { useLanguage } from './hooks/useLanguage';
import { useSamples } from './hooks/useSamples';
import { AudioManagerProvider } from './hooks/useAudioManager';
import Hero from './components/Hero';
import AudioGallery from './components/AudioGallery';
import EmotionComparison from './components/EmotionComparison';

export default function App() {
  const { language, setLanguage } = useLanguage();
  const { status, manifest, error } = useSamples();
  const t = copy[language];
  const samples = manifest?.samples ?? [];

  if (status === 'error') {
    return (
      <div className="flex min-h-screen items-center justify-center px-5">
        <div className="max-w-md rounded-card border border-emotion-angry/40 bg-emotion-angry/10 p-6">
          <AlertTriangle className="h-6 w-6 text-emotion-angry" aria-hidden="true" />
          <h1 className="mt-4 font-display text-xl font-semibold text-paper">{t.manifestError}</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">{error}</p>
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-faint">{t.manifestExpected}</p>
        </div>
      </div>
    );
  }

  return (
    <AudioManagerProvider>
      <a href="#gallery" className="skip-link">{t.skip}</a>
      <Hero language={language} onLanguageChange={setLanguage} />

      <main>
        {status === 'loading' || !manifest ? (
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8" role="status" aria-live="polite">
            <p className="label-mono">{t.collection}</p>
            <p className="mt-3 font-display text-xl text-paper">{t.manifestLoading}</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {EMOTIONS.slice(0, 6).map((emotion) => (
                <div key={emotion.label} className="h-20 animate-pulse border-b border-line bg-ink-800/40" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <EmotionComparison samples={samples} language={language} />
            <AudioGallery samples={samples} language={language} />
          </>
        )}
      </main>
    </AudioManagerProvider>
  );
}
