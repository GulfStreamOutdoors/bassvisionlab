/** Wavelength range and sampling for all spectral calculations */
export const LAMBDA_MIN = 380;
export const LAMBDA_MAX = 730;
export const LAMBDA_STEP = 5;
export const NUM_BANDS = Math.floor((LAMBDA_MAX - LAMBDA_MIN) / LAMBDA_STEP) + 1; // 71

/** A spectral power distribution: array of values sampled at LAMBDA_STEP intervals from LAMBDA_MIN to LAMBDA_MAX */
export type SpectralArray = Float64Array;

/** Create a new spectral array initialized to zeros */
export function createSpectralArray(): SpectralArray {
  return new Float64Array(NUM_BANDS);
}

/** Get the wavelength for a given index */
export function wavelengthAt(index: number): number {
  return LAMBDA_MIN + index * LAMBDA_STEP;
}

/** Get the index for a given wavelength (nearest band) */
export function indexAt(wavelength: number): number {
  return Math.round((wavelength - LAMBDA_MIN) / LAMBDA_STEP);
}
