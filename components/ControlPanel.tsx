'use client';

import { useState, useRef, useEffect } from 'react';

export type WaterPreset = 'clear' | 'stained' | 'muddy' | 'custom';

const PRESETS: Record<Exclude<WaterPreset, 'custom'>, { cdom: number; turbidity: number }> = {
  clear:   { cdom: 0.15, turbidity: 0.05 },
  stained: { cdom: 1.2,  turbidity: 0.3  },
  muddy:   { cdom: 3.0,  turbidity: 2.0  },
};

function Tooltip({
  children,
  text,
  href,
}: {
  children: React.ReactNode;
  text: string;
  href: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  return (
    <div className="relative inline-flex items-center gap-1.5" ref={ref}>
      {children}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-300 text-deep-black text-[10px] font-bold leading-none hover:bg-bayou-lime transition-colors cursor-help shrink-0"
        aria-label="More info"
      >
        ?
      </button>
      {open && (
        <div className="absolute left-0 bottom-full mb-2 w-64 bg-deep-black text-white text-xs rounded-lg p-3 shadow-lg z-50 leading-relaxed">
          <p>{text}</p>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-1.5 text-bayou-lime hover:underline text-[11px]"
          >
            Learn more &rarr;
          </a>
          <div className="absolute left-4 top-full w-0 h-0 border-x-[6px] border-x-transparent border-t-[6px] border-t-deep-black" />
        </div>
      )}
    </div>
  );
}

interface ControlPanelProps {
  depthFt: number;
  onDepthFtChange: (v: number) => void;
  waterPreset: WaterPreset;
  onPresetChange: (preset: WaterPreset, cdom: number, turbidity: number) => void;
  cdomFactor: number;
  onCdomChange: (v: number) => void;
  turbidity: number;
  onTurbidityChange: (v: number) => void;
}

export default function ControlPanel({
  depthFt,
  onDepthFtChange,
  waterPreset,
  onPresetChange,
  cdomFactor,
  onCdomChange,
  turbidity,
  onTurbidityChange,
}: ControlPanelProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePreset = (key: Exclude<WaterPreset, 'custom'>) => {
    const p = PRESETS[key];
    onPresetChange(key, p.cdom, p.turbidity);
  };

  const handleCdom = (v: number) => {
    onCdomChange(v);
    onPresetChange('custom', v, turbidity);
  };

  const handleTurbidity = (v: number) => {
    onTurbidityChange(v);
    onPresetChange('custom', cdomFactor, v);
  };

  return (
    <div className="space-y-4">
      {/* Depth slider */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-deep-black">
          Depth: {depthFt.toFixed(1)} ft
        </label>
        <input
          type="range"
          min={0}
          max={50}
          step={0.1}
          value={depthFt}
          onChange={(e) => onDepthFtChange(parseFloat(e.target.value))}
          className="w-full accent-bayou-lime"
        />
      </div>

      {/* Water clarity presets */}
      <div>
        <label className="block text-sm font-semibold mb-1 text-deep-black">Water Clarity</label>
        <div className="flex gap-2 flex-wrap">
          {(['clear', 'stained', 'muddy', 'custom'] as const).map((key) => (
            <button
              key={key}
              onClick={() => key !== 'custom' && handlePreset(key)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors capitalize ${
                waterPreset === key
                  ? 'bg-bayou-lime text-deep-black'
                  : 'bg-light-gray text-deep-black hover:bg-gray-200'
              }`}
              disabled={key === 'custom'}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced controls */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="text-sm font-medium text-olive-green hover:underline"
      >
        {showAdvanced ? 'Hide' : 'Show'} Advanced Controls
      </button>

      {showAdvanced && (
        <div className="space-y-3 pl-2 border-l-2 border-bayou-lime">
          <div>
            <div className="mb-1">
              <Tooltip
                text="Colored Dissolved Organic Matter — tannins and humic acids from decaying vegetation. Higher values simulate tea-stained or swamp water that absorbs blue/UV light and shifts visibility toward green-yellow."
                href="https://en.wikipedia.org/wiki/Colored_dissolved_organic_matter"
              >
                <label className="text-sm font-semibold text-deep-black">
                  CDOM: {cdomFactor.toFixed(2)} m⁻¹
                </label>
              </Tooltip>
            </div>
            <input
              type="range"
              min={0}
              max={10}
              step={0.01}
              value={cdomFactor}
              onChange={(e) => handleCdom(parseFloat(e.target.value))}
              className="w-full accent-bayou-lime"
            />
          </div>
          <div>
            <div className="mb-1">
              <Tooltip
                text="Suspended particles (silt, clay, algae) that scatter light in all directions. Higher values simulate muddy or stirred-up water, reducing overall visibility without favoring a particular color."
                href="https://en.wikipedia.org/wiki/Turbidity"
              >
                <label className="text-sm font-semibold text-deep-black">
                  Turbidity: {turbidity.toFixed(2)} m⁻¹
                </label>
              </Tooltip>
            </div>
            <input
              type="range"
              min={0}
              max={5}
              step={0.01}
              value={turbidity}
              onChange={(e) => handleTurbidity(parseFloat(e.target.value))}
              className="w-full accent-bayou-lime"
            />
          </div>
        </div>
      )}
    </div>
  );
}
