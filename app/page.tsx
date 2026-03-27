'use client';

import { useState, useCallback, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ViewModeSelector from '@/components/ViewModeSelector';
import ControlPanel, { type WaterPreset } from '@/components/ControlPanel';
import ImageSourcePanel from '@/components/ImageSourcePanel';
import ImageViewport from '@/components/ImageViewport';
import { generateCubeLUT, downloadCubeLUT } from '@/lib/lut/cube-generator';
import { ViewMode } from '@/lib/spectral/transform-engine';
import type { SpectralRenderer } from '@/lib/webgl/renderer';

const VIEW_MODE_MAP: Record<number, ViewMode> = {
  0: ViewMode.Underwater,
  1: ViewMode.BassDichromatic,
  2: ViewMode.BassContrast,
};

export default function Home() {
  // Image state
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);

  // Parameters
  const [depthFt, setDepthFt] = useState(5);
  const [waterPreset, setWaterPreset] = useState<WaterPreset>('clear');
  const [cdomFactor, setCdomFactor] = useState(0.15);
  const [turbidity, setTurbidity] = useState(0.05);
  const [viewMode, setViewMode] = useState(0);

  const rendererRef = useRef<SpectralRenderer | null>(null);

  const depthM = depthFt * 0.3048;

  // Handlers
  const handleImageSelect = useCallback((src: string) => {
    setOriginalSrc(src);
    setImageSrc(src);
  }, []);

  const handleColorSelect = useCallback((hex: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = hex;
    ctx.fillRect(0, 0, 256, 256);
    const dataUrl = canvas.toDataURL('image/png');
    setOriginalSrc(dataUrl);
    setImageSrc(dataUrl);
  }, []);

  const handlePresetChange = useCallback((preset: WaterPreset, cdom: number, turb: number) => {
    setWaterPreset(preset);
    setCdomFactor(cdom);
    setTurbidity(turb);
  }, []);

  const handleDownloadLUT = useCallback(() => {
    const mode = VIEW_MODE_MAP[viewMode];
    const water = { depth: depthM, cdomFactor, turbidityFactor: turbidity };
    const title = `BassVision_${mode}_d${depthFt.toFixed(0)}ft`;
    const content = generateCubeLUT(water, mode, title);
    downloadCubeLUT(content, `${title}.cube`);
  }, [viewMode, depthM, depthFt, cdomFactor, turbidity]);

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

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-6 space-y-6">
        {/* View Mode Selector -- centered */}
        <div className="flex justify-center">
          <ViewModeSelector viewMode={viewMode} onChange={setViewMode} />
        </div>

        {/* Side-by-side image comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Original image */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-light-gray px-3 py-2 text-xs font-bold text-deep-black uppercase tracking-wide">
              Original
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-2 min-h-[280px]">
              {originalSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={originalSrc}
                  alt="Original"
                  className="max-w-full max-h-[400px] object-contain"
                />
              ) : (
                <span className="text-gray-400 text-sm">Select an image below</span>
              )}
            </div>
          </div>

          {/* Transformed image (WebGL canvas) */}
          <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden">
            <div className="bg-light-gray px-3 py-2 text-xs font-bold text-deep-black uppercase tracking-wide">
              {viewMode === 0 ? 'Underwater View' : viewMode === 1 ? 'Bass Color Vision' : 'Bass Contrast'}
            </div>
            <div className="flex-1 flex items-center justify-center bg-gray-50 p-2 min-h-[280px]">
              <ImageViewport
                imageSrc={imageSrc}
                depth={depthM}
                cdomFactor={cdomFactor}
                turbidity={turbidity}
                viewMode={viewMode}
                onRendererReady={handleRendererReady}
              />
            </div>
          </div>
        </div>

        {/* Controls */}
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

        {/* Export Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleDownloadLUT}
            className="px-6 py-2.5 bg-bayou-lime text-deep-black rounded font-bold text-sm hover:brightness-90 transition"
          >
            Download .cube LUT
          </button>
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
