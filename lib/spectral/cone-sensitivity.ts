import { createSpectralArray, NUM_BANDS, wavelengthAt } from './spectral-types';

/**
 * Govardovskii et al. (2000) visual pigment template.
 * Generates a normalized absorbance spectrum for a visual pigment with given lambda_max.
 */
export function getConeSensitivity(lambdaMax: number): Float64Array {
  const result = createSpectralArray();
  const A = 69.7;
  const a = 0.8795 + 0.0459 * Math.exp(-((lambdaMax - 300) ** 2) / 11940);
  const B = 28;
  const b = 0.922;
  const C = -14.9;
  const c = 1.104;
  const D = 0.674;
  const lambdaMaxBeta = 189 + 0.315 * lambdaMax;
  const Abeta = 0.26;
  const bandwidthBeta = -40.5 + 0.195 * lambdaMax;

  for (let i = 0; i < NUM_BANDS; i++) {
    const lambda = wavelengthAt(i);
    const x = lambdaMax / lambda;
    const alpha = 1.0 / (
      Math.exp(A * (a - x)) + Math.exp(B * (b - x)) + Math.exp(C * (c - x)) + D
    );
    const betaArg = (lambda - lambdaMaxBeta) / bandwidthBeta;
    const beta = Abeta * Math.exp(-(betaArg ** 2));
    result[i] = alpha + beta;
  }
  return result;
}

let _mws: Float64Array | null = null;
let _lws: Float64Array | null = null;

/** Bass MWS (medium-wavelength sensitive) cone: lambda_max = 535nm */
export function getBassMWS(): Float64Array {
  if (!_mws) _mws = getConeSensitivity(535.0);
  return _mws;
}

/** Bass LWS (long-wavelength sensitive) cone: lambda_max = 614.5nm */
export function getBassLWS(): Float64Array {
  if (!_lws) _lws = getConeSensitivity(614.5);
  return _lws;
}
