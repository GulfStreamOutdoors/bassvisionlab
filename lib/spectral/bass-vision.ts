import { NUM_BANDS, type SpectralArray } from './spectral-types';
import { getBassMWS, getBassLWS } from './cone-sensitivity';

export interface BassResponse { mws: number; lws: number; }

export function calculateBassResponse(spectrum: SpectralArray): BassResponse {
  const mwsCone = getBassMWS();
  const lwsCone = getBassLWS();
  let mws = 0, lws = 0;
  for (let i = 0; i < NUM_BANDS; i++) {
    mws += spectrum[i] * mwsCone[i];
    lws += spectrum[i] * lwsCone[i];
  }
  return { mws, lws };
}
