import { rgbToSpectrum } from './rgb-to-spectrum';
import { attenuateSpectrum, type WaterParams } from './attenuation';
import { calculateBassResponse } from './bass-vision';
import { spectrumToRgb, type RGB } from './spectrum-to-rgb';

export { type RGB } from './spectrum-to-rgb';
export { type WaterParams } from './attenuation';

export enum ViewMode {
  Underwater = 'underwater',
  BassDichromatic = 'bass-dichromatic',
  BassContrast = 'bass-contrast',
}

export function transformColor(input: RGB, water: WaterParams, mode: ViewMode): RGB {
  const spectrum = rgbToSpectrum(input.r, input.g, input.b);
  const attenuated = attenuateSpectrum(spectrum, water);

  switch (mode) {
    case ViewMode.Underwater:
      return spectrumToRgb(attenuated);
    case ViewMode.BassDichromatic: {
      const response = calculateBassResponse(attenuated);
      const maxResponse = Math.max(response.mws, response.lws, 0.001);
      const scale = 1.0 / maxResponse;
      return {
        r: Math.round(Math.min(1, response.lws * scale) * 255),
        g: Math.round(Math.min(1, response.mws * scale) * 255),
        b: 0,
      };
    }
    case ViewMode.BassContrast: {
      const response = calculateBassResponse(attenuated);
      const luminance = response.mws * 0.37 + response.lws * 0.63;
      const gray = Math.round(Math.min(255, Math.max(0, luminance * 255)));
      return { r: gray, g: gray, b: gray };
    }
  }
}
