'use client';

const MODES = [
  { value: 0, label: 'Underwater' },
  { value: 1, label: 'Bass Color' },
  { value: 2, label: 'Bass Contrast' },
] as const;

interface ViewModeSelectorProps {
  viewMode: number;
  onChange: (mode: number) => void;
}

export default function ViewModeSelector({ viewMode, onChange }: ViewModeSelectorProps) {
  return (
    <div className="flex gap-2">
      {MODES.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={`px-4 py-2 rounded font-semibold text-sm transition-colors ${
            viewMode === m.value
              ? 'bg-bayou-lime text-deep-black'
              : 'bg-light-gray text-deep-black hover:bg-gray-200'
          }`}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}
