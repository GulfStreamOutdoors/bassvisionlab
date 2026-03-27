import { getConeSensitivity } from '../cone-sensitivity';
import { wavelengthAt, NUM_BANDS } from '../spectral-types';

describe('getConeSensitivity', () => {
  it('MWS cone peaks near 535nm', () => {
    const mws = getConeSensitivity(535.0);
    let maxIdx = 0;
    for (let i = 1; i < mws.length; i++) {
      if (mws[i] > mws[maxIdx]) maxIdx = i;
    }
    const peakWl = wavelengthAt(maxIdx);
    expect(peakWl).toBeGreaterThanOrEqual(530);
    expect(peakWl).toBeLessThanOrEqual(540);
  });

  it('LWS cone peaks near 614.5nm', () => {
    const lws = getConeSensitivity(614.5);
    let maxIdx = 0;
    for (let i = 1; i < lws.length; i++) {
      if (lws[i] > lws[maxIdx]) maxIdx = i;
    }
    const peakWl = wavelengthAt(maxIdx);
    expect(peakWl).toBeGreaterThanOrEqual(610);
    expect(peakWl).toBeLessThanOrEqual(620);
  });

  it('sensitivity values are between 0 and 1', () => {
    const mws = getConeSensitivity(535.0);
    for (let i = 0; i < mws.length; i++) {
      expect(mws[i]).toBeGreaterThanOrEqual(0);
      expect(mws[i]).toBeLessThanOrEqual(1.01);
    }
  });

  it('returns arrays of NUM_BANDS length', () => {
    expect(getConeSensitivity(535.0).length).toBe(NUM_BANDS);
    expect(getConeSensitivity(614.5).length).toBe(NUM_BANDS);
  });
});
