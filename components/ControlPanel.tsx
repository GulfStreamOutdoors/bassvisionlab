'use client';

import { useState } from 'react';

export type WaterPreset = 'clear' | 'stained' | 'muddy' | 'custom';

const PRESETS: Record<Exclude<WaterPreset, 'custom'>, { cdom: number; turbidity: number }> = {
  clear:   { cdom: 0.15, turbidity: 0.05 },
  stained: { cdom: 1.2,  turbidity: 0.3  },
  muddy:   { cdom: 3.0,  turbidity: 2.0  },
};

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
        <label className="block text-sm font-semibold mb-1">
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
        <label className="block text-sm font-semibold mb-1">Water Clarity</label>
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
            <label className="block text-sm font-semibold mb-1">
              CDOM: {cdomFactor.toFixed(2)} m⁻¹
            </label>
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
            <label className="block text-sm font-semibold mb-1">
              Turbidity: {turbidity.toFixed(2)} m⁻¹
            </label>
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
