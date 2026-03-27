'use client';

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';

type Tab = 'upload' | 'url' | 'gallery' | 'picker';

const LURE_COLORS = [
  { name: 'Green Pumpkin', hex: '#8B7D3C' },
  { name: 'Watermelon',    hex: '#6B8E4E' },
  { name: 'Junebug',       hex: '#4A0E4E' },
  { name: 'Black/Blue',    hex: '#1A1A3E' },
  { name: 'Pearl White',   hex: '#F5F0E8' },
  { name: 'Morning Dawn',  hex: '#E8C8A0' },
  { name: 'Chartreuse',    hex: '#DFFF00' },
  { name: 'Red Craw',      hex: '#8B2500' },
  { name: 'White',         hex: '#FFFFFF' },
  { name: 'Black',         hex: '#000000' },
] as const;

interface ImageSourcePanelProps {
  onImageSelect: (dataUrl: string) => void;
  onColorSelect: (hex: string) => void;
}

export default function ImageSourcePanel({ onImageSelect, onColorSelect }: ImageSourcePanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [pickerColor, setPickerColor] = useState('#00FF00');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onImageSelect(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleFileInput = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleUrlLoad = useCallback(() => {
    if (!urlInput.trim()) return;
    onImageSelect(urlInput.trim());
  }, [urlInput, onImageSelect]);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'upload',  label: 'Upload' },
    { key: 'url',     label: 'Paste URL' },
    { key: 'gallery', label: 'Lure Gallery' },
    { key: 'picker',  label: 'Color Picker' },
  ];

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-t transition-colors ${
              activeTab === t.key
                ? 'bg-bayou-lime text-deep-black'
                : 'text-deep-black hover:bg-light-gray'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Upload */}
      {activeTab === 'upload' && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-bayou-lime bg-green-50' : 'border-gray-300 hover:border-bayou-lime'
          }`}
        >
          <p className="text-sm text-gray-600">
            Drag &amp; drop an image here, or click to browse
          </p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, or WebP</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      )}

      {/* URL */}
      {activeTab === 'url' && (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm text-deep-black bg-white"
          />
          <button
            onClick={handleUrlLoad}
            className="bg-bayou-lime text-deep-black px-4 py-2 rounded font-semibold text-sm hover:opacity-90"
          >
            Load
          </button>
        </div>
      )}

      {/* Gallery */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-5 gap-2">
          {LURE_COLORS.map((c) => (
            <button
              key={c.name}
              onClick={() => onColorSelect(c.hex)}
              className="flex flex-col items-center gap-1 p-2 rounded hover:bg-light-gray transition-colors"
              title={c.name}
            >
              <span
                className="w-10 h-10 rounded border border-gray-300 block"
                style={{ backgroundColor: c.hex }}
              />
              <span className="text-[10px] text-gray-600 leading-tight text-center">
                {c.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Color Picker */}
      {activeTab === 'picker' && (
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={pickerColor}
            onChange={(e) => setPickerColor(e.target.value)}
            className="w-12 h-12 border-0 p-0 cursor-pointer"
          />
          <span
            className="w-16 h-16 rounded border border-gray-300"
            style={{ backgroundColor: pickerColor }}
          />
          <button
            onClick={() => onColorSelect(pickerColor)}
            className="bg-bayou-lime text-deep-black px-4 py-2 rounded font-semibold text-sm hover:opacity-90"
          >
            Apply Color
          </button>
        </div>
      )}
    </div>
  );
}
