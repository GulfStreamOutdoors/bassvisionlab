'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ControlPanel, { type WaterPreset } from '@/components/ControlPanel';
import ImageSourcePanel from '@/components/ImageSourcePanel';
import ImageViewport from '@/components/ImageViewport';
import { generateCubeLUT, downloadCubeLUT } from '@/lib/lut/cube-generator';
import { ViewMode } from '@/lib/spectral/transform-engine';
import { removeBackground } from '@/lib/image/background-removal';
import type { SpectralRenderer } from '@/lib/webgl/renderer';

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
              Original
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
                <span className="text-gray-400 text-sm">Select an image below</span>
              )}
            </div>
          </div>

          {/* Underwater Human View */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-deep-black px-3 py-2 text-xs font-bold text-bayou-lime uppercase tracking-wide">
              Underwater (Human View)
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
              Bass Color Vision
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
            <div className="bg-deep-black px-3 py-2 text-xs font-bold text-bayou-lime uppercase tracking-wide">
              Bass Contrast (Visibility)
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
                  <span className="text-xs text-gray-500 whitespace-nowrap">Sensitivity:</span>
                  <input
                    type="range"
                    min={10}
                    max={150}
                    value={bgThreshold}
                    onChange={(e) => setBgThreshold(parseInt(e.target.value))}
                    className="flex-1 accent-bayou-lime"
                  />
                  <span className="text-xs font-mono text-gray-500 w-8">{bgThreshold}</span>
                </div>
              )}
            </div>
            {bgRemovalEnabled && (
              <p className="text-xs text-gray-500 mt-1">
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
