import { createSpectralArray, NUM_BANDS, wavelengthAt } from './spectral-types';

/** Pope & Fry (1997) pure water absorption coefficients (m^-1) */
const POPE_FRY_DATA: [number, number][] = [
  [380, 0.01137], [390, 0.00851], [400, 0.00663], [410, 0.00473],
  [420, 0.00454], [430, 0.00495], [440, 0.00635], [450, 0.00922],
  [460, 0.00979], [470, 0.01060], [480, 0.01270], [490, 0.01500],
  [500, 0.02040], [510, 0.03250], [520, 0.04090], [530, 0.04340],
  [540, 0.04740], [550, 0.05650], [560, 0.06190], [570, 0.06950],
  [580, 0.08960], [590, 0.13510], [600, 0.22240], [610, 0.26440],
  [620, 0.27550], [630, 0.29160], [640, 0.31080], [650, 0.34000],
  [660, 0.41000], [670, 0.43900], [680, 0.46500], [690, 0.51600],
  [700, 0.62400], [710, 0.82700], [720, 1.23100], [730, 1.67800],
];

let _cached: Float64Array | null = null;

/** Returns pure water absorption coefficients interpolated to standard spectral bands */
export function getWaterAbsorption(): Float64Array {
  if (_cached) return _cached;
  const result = createSpectralArray();
  for (let i = 0; i < NUM_BANDS; i++) {
    const wl = wavelengthAt(i);
    result[i] = interpolate(POPE_FRY_DATA, wl);
  }
  _cached = result;
  return result;
}

function interpolate(data: [number, number][], wl: number): number {
  if (wl <= data[0][0]) return data[0][1];
  if (wl >= data[data.length - 1][0]) return data[data.length - 1][1];
  for (let i = 0; i < data.length - 1; i++) {
    if (wl >= data[i][0] && wl <= data[i + 1][0]) {
      const t = (wl - data[i][0]) / (data[i + 1][0] - data[i][0]);
      return data[i][1] + t * (data[i + 1][1] - data[i][1]);
    }
  }
  return data[data.length - 1][1];
}
