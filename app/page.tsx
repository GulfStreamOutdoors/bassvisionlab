'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ControlPanel, { type WaterPreset } from '@/components/ControlPanel';
import ImageSourcePanel from '@/components/ImageSourcePanel';
import ImageViewport from '@/components/ImageViewport';
import { generateCubeLUT, downloadCubeLUT } from '@/lib/lut/cube-generator';
import { ViewMode, transformColor } from '@/lib/spectral/transform-engine';
import { removeBackground } from '@/lib/image/background-removal';
import type { SpectralRenderer } from '@/lib/webgl/renderer';

function PanelTooltip({ children, text, align = 'left' }: { children: React.ReactNode; text: string; align?: 'left' | 'right' }) {
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
    <div className="relative inline-flex items-center gap-2" ref={ref}>
      {children}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-olive-green text-white text-[10px] font-bold leading-none hover:bg-bayou-lime hover:text-deep-black transition-colors cursor-help shrink-0"
        aria-label="More info"
      >
        ?
      </button>
      {open && (
        <div className={`absolute top-full mt-2 w-72 bg-white text-deep-black text-xs rounded-lg p-3 shadow-lg z-50 leading-relaxed border border-gray-200 normal-case tracking-normal font-normal ${align === 'right' ? 'right-0' : 'left-0'}`}>
          <p>{text}</p>
          <div className={`absolute ${align === 'right' ? 'right-4' : 'left-4'} bottom-full w-0 h-0 border-x-[6px] border-x-transparent border-b-[6px] border-b-white`} />
        </div>
      )}
    </div>
  );
}

function getVisibilityLabel(brightness: number | null): {
  label: string;
  color: string;
  tip: string;
} {
  if (brightness === null) return { label: '', color: '', tip: '' };
  if (brightness >= 0.6)
    return {
      label: 'High Contrast',
      color: 'bg-bayou-lime text-deep-black',
      tip: 'This lure pops hard against the water. Good for dirty water, reaction bites, and low light when you need the bass to find it. In clear water under pressure, this much contrast can look unnatural — consider sizing down or slowing your presentation to compensate.',
    };
  if (brightness >= 0.35)
    return {
      label: 'Moderate Contrast',
      color: 'bg-yellow-400 text-deep-black',
      tip: 'The bass can see this but it doesn\'t scream for attention. Often a productive sweet spot — visible enough to get noticed, natural enough not to spook wary fish. Works well for finesse presentations in moderate clarity.',
    };
  if (brightness >= 0.15)
    return {
      label: 'Subtle',
      color: 'bg-orange-500 text-white',
      tip: 'This lure blends toward the background. That can be an advantage in clear, pressured water where natural presentations win. But in stained or deep water the bass may simply not see it — consider whether you\'re relying on color alone or also using vibration and movement to draw strikes.',
    };
  return {
    label: 'Near Invisible',
    color: 'bg-red-600 text-white',
    tip: 'The bass would have a very hard time seeing this by color alone at this depth and clarity. If that\'s intentional (dark silhouette profile, vibration-based presentation), it can still work. If you need the bass to find it visually, try more contrast — brighter or darker.',
  };
}

const VIEW_MODE_MAP: Record<number, ViewMode> = {
  0: ViewMode.Underwater,
  1: ViewMode.BassDichromatic,
  2: ViewMode.BassContrast,
};

export default function Home() {
  // Image state
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  // Background removal
  const [bgRemovalEnabled, setBgRemovalEnabled] = useState(false);
  const [bgThreshold, setBgThreshold] = useState(50);

  // Water parameters
  const [depthFt, setDepthFt] = useState(5);
  const [waterPreset, setWaterPreset] = useState<WaterPreset>('clear');
  const [cdomFactor, setCdomFactor] = useState(0.15);
  const [turbidity, setTurbidity] = useState(0.05);

  // Contrast visibility
  const [contrastBrightness, setContrastBrightness] = useState<number | null>(null);

  // Export
  const [exportMode, setExportMode] = useState(0);
  const rendererRef = useRef<SpectralRenderer | null>(null);

  const depthM = depthFt * 0.3048;

  // Process image through background removal when settings change
  useEffect(() => {
    if (!originalSrc) {
      setImageSrc(null);
      return;
    }

    if (!bgRemovalEnabled) {
      setImageSrc(originalSrc);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const processed = removeBackground(img, { threshold: bgThreshold });
      setImageSrc(processed.toDataURL('image/png'));
    };
    img.src = originalSrc;
  }, [originalSrc, bgRemovalEnabled, bgThreshold]);

  // Compute bass contrast brightness using CPU-side spectral engine
  useEffect(() => {
    if (!imageSrc) {
      setContrastBrightness(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, w, h).data;

      const water = { depth: depthM, cdomFactor, turbidityFactor: turbidity };
      const step = Math.max(1, Math.floor(Math.sqrt((w * h) / 400)));
      let total = 0;
      let count = 0;

      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const i = (y * w + x) * 4;
          const a = data[i + 3];
          if (a < 10) continue; // skip transparent
          const result = transformColor(
            { r: data[i], g: data[i + 1], b: data[i + 2] },
            water,
            ViewMode.BassContrast
          );
          total += result.r / 255; // grayscale, so r=g=b
          count++;
        }
      }

      setContrastBrightness(count > 0 ? total / count : 0);
    };
    img.src = imageSrc;
  }, [imageSrc, depthM, cdomFactor, turbidity]);

  // Handlers
  const handleImageSelect = useCallback((src: string) => {
    setOriginalSrc(src);
  }, []);

  const handleColorSelect = useCallback((hex: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, 256, 256);
    setOriginalSrc(canvas.toDataURL('image/png'));
  }, []);

  const handlePresetChange = useCallback((preset: WaterPreset, cdom: number, turb: number) => {
    setWaterPreset(preset);
    setCdomFactor(cdom);
    setTurbidity(turb);
  }, []);

  const handleDownloadLUT = useCallback(() => {
    const mode = VIEW_MODE_MAP[exportMode];
    const water = { depth: depthM, cdomFactor, turbidityFactor: turbidity };
    const title = `BassVision_${mode}_d${depthFt.toFixed(0)}ft`;
    const content = generateCubeLUT(water, mode, title);
    downloadCubeLUT(content, `${title}.cube`);
  }, [exportMode, depthM, depthFt, cdomFactor, turbidity]);

  const handleExportImage = useCallback(() => {
    if (!rendererRef.current) return;
    const dataUrl = rendererRef.current.exportImage();
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = 'bass-vision-export.png';
    a.click();
  }, []);

  const handleRendererReady = useCallback((renderer: SpectralRenderer) => {
    rendererRef.current = renderer;
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-6 space-y-6">
        {/* 2x2 Grid: Original + 3 Transform Views */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-deep-black px-3 py-2 text-xs font-bold text-bayou-lime uppercase tracking-wide">
              <PanelTooltip text="The unmodified lure color or image as it appears above water in full daylight. Compare this to the other panels to see how much color is lost underwater.">
                <span>Original</span>
              </PanelTooltip>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-2 min-h-[240px]">
              {originalSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={originalSrc}
                  alt="Original"
                  className="max-w-full max-h-[350px] object-contain"
                />
              ) : (
                <span className="text-gray-600 text-sm">Select an image below</span>
              )}
            </div>
          </div>

          {/* Underwater Human View */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-deep-black px-3 py-2 text-xs font-bold text-bayou-lime uppercase tracking-wide">
              <PanelTooltip text="What YOU would see looking at this lure underwater at the selected depth and water clarity. Water absorbs red light first, so reds and oranges disappear quickly — notice how colors shift toward blue-green as depth increases.">
                <span>Underwater (Human View)</span>
              </PanelTooltip>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-2 min-h-[240px]">
              <ImageViewport
                imageSrc={imageSrc}
                depth={depthM}
                cdomFactor={cdomFactor}
                turbidity={turbidity}
                viewMode={0}
                onRendererReady={handleRendererReady}
              />
            </div>
          </div>

          {/* Bass Dichromatic View */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-deep-black px-3 py-2 text-xs font-bold text-bayou-lime uppercase tracking-wide">
              <PanelTooltip text="How a largemouth bass actually perceives this lure's color. Bass only have green (535nm) and red (614nm) cones — no blue. Blues and purples look nearly black to them, while greens and reds are their strongest colors.">
                <span>Bass Color Vision</span>
              </PanelTooltip>
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-2 min-h-[240px]">
              <ImageViewport
                imageSrc={imageSrc}
                depth={depthM}
                cdomFactor={cdomFactor}
                turbidity={turbidity}
                viewMode={1}
              />
            </div>
          </div>

          {/* Bass Contrast View */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-deep-black px-3 py-2 text-xs font-bold text-bayou-lime uppercase tracking-wide flex items-center justify-between">
              <PanelTooltip text="How much this lure stands out to a bass — bright areas pop, dark areas blend in. More contrast isn't always better: high contrast helps in dirty water and for reaction bites, but subtle/natural colors often win in clear water under pressure. Use this to understand what the bass actually sees, then match your strategy. Sometimes the 'wrong' color is the right call.">
                <span>Bass Contrast (Visibility)</span>
              </PanelTooltip>
              {contrastBrightness !== null && imageSrc && (() => {
                const v = getVisibilityLabel(contrastBrightness);
                return (
                  <PanelTooltip text={v.tip} align="right">
                    <span className={`${v.color} px-2 py-0.5 rounded text-[10px] font-bold normal-case tracking-normal`}>
                      {v.label}
                    </span>
                  </PanelTooltip>
                );
              })()}
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-2 min-h-[240px]">
              <ImageViewport
                imageSrc={imageSrc}
                depth={depthM}
                cdomFactor={cdomFactor}
                turbidity={turbidity}
                viewMode={2}
              />
            </div>
          </div>
        </div>

        {/* Background Removal */}
        {originalSrc && (
          <div className="bg-light-gray rounded-lg p-4">
            <div className="flex items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={bgRemovalEnabled}
                  onChange={(e) => setBgRemovalEnabled(e.target.checked)}
                  className="w-4 h-4 accent-bayou-lime"
                />
                <span className="text-sm font-bold text-deep-black">Remove Background</span>
              </label>
              {bgRemovalEnabled && (
                <div className="flex-1 flex items-center gap-2 min-w-[200px]">
                  <span className="text-xs text-deep-black whitespace-nowrap">Sensitivity:</span>
                  <input
                    type="range"
                    min={10}
                    max={150}
                    value={bgThreshold}
                    onChange={(e) => setBgThreshold(parseInt(e.target.value))}
                    className="flex-1 accent-bayou-lime"
                  />
                  <span className="text-xs font-mono text-deep-black w-8">{bgThreshold}</span>
                </div>
              )}
            </div>
            {bgRemovalEnabled && (
              <p className="text-xs text-gray-700 mt-1">
                Removes pixels similar to the detected background color. Increase sensitivity to remove more.
              </p>
            )}
          </div>
        )}

        {/* Water Parameters */}
        <div className="bg-light-gray rounded-lg p-4">
          <ControlPanel
            depthFt={depthFt}
            onDepthFtChange={setDepthFt}
            waterPreset={waterPreset}
            onPresetChange={handlePresetChange}
            cdomFactor={cdomFactor}
            onCdomChange={setCdomFactor}
            turbidity={turbidity}
            onTurbidityChange={setTurbidity}
          />
        </div>

        {/* Image Source */}
        <div className="bg-light-gray rounded-lg p-4">
          <h2 className="text-sm font-bold text-deep-black uppercase tracking-wide mb-3">
            Image Source
          </h2>
          <ImageSourcePanel
            onImageSelect={handleImageSelect}
            onColorSelect={handleColorSelect}
          />
        </div>

        {/* Export */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleDownloadLUT}
            className="px-6 py-2.5 bg-bayou-lime text-deep-black rounded font-bold text-sm hover:brightness-90 transition"
          >
            Download .cube LUT
          </button>
          <select
            value={exportMode}
            onChange={(e) => setExportMode(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2.5 text-sm text-deep-black bg-white"
          >
            <option value={0}>Underwater View</option>
            <option value={1}>Bass Color Vision</option>
            <option value={2}>Bass Contrast</option>
          </select>
          <button
            onClick={handleExportImage}
            disabled={!imageSrc}
            className="px-6 py-2.5 bg-deep-black text-white rounded font-bold text-sm hover:bg-gray-800 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Export Image
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
