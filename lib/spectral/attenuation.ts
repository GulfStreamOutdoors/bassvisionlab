import { createSpectralArray, NUM_BANDS, wavelengthAt, type SpectralArray } from './spectral-types';
import { getWaterAbsorption } from './water-absorption';

export interface WaterParams {
  depth: number;           // meters
  cdomFactor: number;      // m^-1 at 440nm
  turbidityFactor: number; // m^-1 wavelength-flat
}

const CDOM_SLOPE = 0.014;
const CDOM_REF_WL = 440;

export function calculateKd(params: WaterParams): Float64Array {
  const waterAbs = getWaterAbsorption();
  const kd = createSpectralArray();
  for (let i = 0; i < NUM_BANDS; i++) {
    const wl = wavelengthAt(i);
    const cdom = params.cdomFactor * Math.exp(-CDOM_SLOPE * (wl - CDOM_REF_WL));
    kd[i] = waterAbs[i] + cdom + params.turbidityFactor;
  }
  return kd;
}

export function attenuateSpectrum(spectrum: SpectralArray, params: WaterParams): Float64Array {
  const kd = calculateKd(params);
  const result = createSpectralArray();
  for (let i = 0; i < NUM_BANDS; i++) {
    result[i] = spectrum[i] * Math.exp(-kd[i] * params.depth);
  }
  return result;
}
