import { useEffect, useState } from 'react';
import { Globe } from 'lucide-react';
import { setLanguage, getLanguage, onLanguageChange, type Lang } from '../lib/i18n';
import { useData } from '../context/DataContext';
import { cn } from '../utils/helpers';

const languages: { value: Lang; label: string }[] = [
  { value: 'English', label: 'English' },
  { value: 'Nepali', label: 'नेपाली' },
  { value: 'Hindi', label: 'हिन्दी' },
];

export function LanguageSwitcher() {
  const { updatePreferences } = useData();
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(getLanguage);

  useEffect(() => {
    return onLanguageChange(() => setCurrent(getLanguage()));
  }, []);

  const handleSelect = (lang: Lang) => {
    setLanguage(lang);
    updatePreferences({ language: lang });
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Change language"
      >
        <Globe className="w-4 h-4 text-text-secondary" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 z-50 w-36 rounded-lg bg-card border border-border shadow-lg overflow-hidden">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => handleSelect(lang.value)}
                className={cn(
                  'w-full px-3 py-2 text-sm text-left transition-colors hover:bg-gray-50',
                  current === lang.value ? 'bg-primary-50 text-primary font-medium' : 'text-text-secondary',
                )}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
