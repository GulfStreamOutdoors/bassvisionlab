import { createSpectralArray, NUM_BANDS, wavelengthAt } from './spectral-types';

function gaussianBasis(center: number, sigma: number): Float64Array {
  const basis = createSpectralArray();
  for (let i = 0; i < NUM_BANDS; i++) {
    const wl = wavelengthAt(i);
    basis[i] = Math.exp(-0.5 * ((wl - center) / sigma) ** 2);
  }
  return basis;
}

const basisR = gaussianBasis(630, 40);
const basisG = gaussianBasis(530, 40);
const basisB = gaussianBasis(460, 30);

function srgbToLinear(c: number): number {
  const s = c / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

export function rgbToSpectrum(r: number, g: number, b: number): Float64Array {
  const rLin = srgbToLinear(r);
  const gLin = srgbToLinear(g);
  const bLin = srgbToLinear(b);
  const spectrum = createSpectralArray();
  for (let i = 0; i < NUM_BANDS; i++) {
    spectrum[i] = rLin * basisR[i] + gLin * basisG[i] + bLin * basisB[i];
  }
  return spectrum;
}
