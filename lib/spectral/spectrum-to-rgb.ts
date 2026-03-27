import { NUM_BANDS, wavelengthAt, type SpectralArray } from './spectral-types';

function cieX(wl: number): number {
  const t1 = (wl - 442.0) * (wl < 442.0 ? 0.0624 : 0.0374);
  const t2 = (wl - 599.8) * (wl < 599.8 ? 0.0264 : 0.0323);
  const t3 = (wl - 501.1) * (wl < 501.1 ? 0.0490 : 0.0382);
  return 0.362 * Math.exp(-0.5 * t1 * t1) + 1.056 * Math.exp(-0.5 * t2 * t2) - 0.065 * Math.exp(-0.5 * t3 * t3);
}

function cieY(wl: number): number {
  const t1 = (wl - 568.8) * (wl < 568.8 ? 0.0213 : 0.0247);
  const t2 = (wl - 530.9) * (wl < 530.9 ? 0.0613 : 0.0322);
  return 0.821 * Math.exp(-0.5 * t1 * t1) + 0.286 * Math.exp(-0.5 * t2 * t2);
}

function cieZ(wl: number): number {
  const t1 = (wl - 437.0) * (wl < 437.0 ? 0.0845 : 0.0278);
  const t2 = (wl - 459.0) * (wl < 459.0 ? 0.0385 : 0.0725);
  return 1.217 * Math.exp(-0.5 * t1 * t1) + 0.681 * Math.exp(-0.5 * t2 * t2);
}

export interface RGB { r: number; g: number; b: number; }

function linearToSrgb(c: number): number {
  const clamped = Math.max(0, Math.min(1, c));
  return clamped <= 0.0031308 ? clamped * 12.92 : 1.055 * Math.pow(clamped, 1.0 / 2.4) - 0.055;
}

export function spectrumToRgb(spectrum: SpectralArray): RGB {
  let X = 0, Y = 0, Z = 0, normY = 0;
  for (let i = 0; i < NUM_BANDS; i++) {
    const wl = wavelengthAt(i);
    const xBar = cieX(wl); const yBar = cieY(wl); const zBar = cieZ(wl);
    X += spectrum[i] * xBar; Y += spectrum[i] * yBar; Z += spectrum[i] * zBar;
    normY += yBar;
  }
  if (normY > 0) { X /= normY; Y /= normY; Z /= normY; }
  const rLin = 3.2406 * X - 1.5372 * Y - 0.4986 * Z;
  const gLin = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
  const bLin = 0.0557 * X - 0.2040 * Y + 1.0570 * Z;
  return {
    r: Math.round(linearToSrgb(rLin) * 255),
    g: Math.round(linearToSrgb(gLin) * 255),
    b: Math.round(linearToSrgb(bLin) * 255),
  };
}
