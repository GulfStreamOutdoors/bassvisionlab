'use client';

import { useRef, useEffect, useCallback } from 'react';
import { SpectralRenderer } from '@/lib/webgl/renderer';

export interface ImageViewportProps {
  imageSrc: string | null;
  depth: number;
  cdomFactor: number;
  turbidity: number;
  viewMode: number;
  onRendererReady?: (renderer: SpectralRenderer) => void;
}

export default function ImageViewport({
  imageSrc,
  depth,
  cdomFactor,
  turbidity,
  viewMode,
  onRendererReady,
}: ImageViewportProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<SpectralRenderer | null>(null);
  const imageLoadedRef = useRef(false);

  // Initialize renderer
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    try {
      const renderer = new SpectralRenderer(canvas);
      rendererRef.current = renderer;
      onRendererReady?.(renderer);
    } catch (e) {
      console.error('Failed to initialize WebGL renderer:', e);
    }

    return () => {
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
    // onRendererReady is intentionally excluded to avoid re-init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load image when imageSrc changes
  const loadImage = useCallback((src: string) => {
    const renderer = rendererRef.current;
    if (!renderer) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      renderer.setImage(img);
      imageLoadedRef.current = true;
      renderer.render(depth, cdomFactor, turbidity, viewMode);
    };
    img.src = src;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (imageSrc) {
      loadImage(imageSrc);
    } else {
      imageLoadedRef.current = false;
    }
  }, [imageSrc, loadImage]);

  // Re-render when params change
  useEffect(() => {
    if (rendererRef.current && imageLoadedRef.current) {
      rendererRef.current.render(depth, cdomFactor, turbidity, viewMode);
    }
  }, [depth, cdomFactor, turbidity, viewMode]);

  return (
    <canvas
      ref={canvasRef}
      className="max-w-full max-h-full object-contain"
      style={{ imageRendering: 'auto' }}
    />
  );
}
