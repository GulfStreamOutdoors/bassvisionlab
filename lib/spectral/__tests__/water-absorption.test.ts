import { getWaterAbsorption } from '../water-absorption';
import { wavelengthAt, NUM_BANDS } from '../spectral-types';

describe('getWaterAbsorption', () => {
  it('returns an array of NUM_BANDS values', () => {
    const abs = getWaterAbsorption();
    expect(abs.length).toBe(NUM_BANDS);
  });

  it('has minimum absorption near 418nm (blue)', () => {
    const abs = getWaterAbsorption();
    const minVal = Math.min(...abs);
    const minIdx = abs.indexOf(minVal);
    const minWavelength = wavelengthAt(minIdx);
    expect(minWavelength).toBeGreaterThanOrEqual(410);
    expect(minWavelength).toBeLessThanOrEqual(430);
  });

  it('absorbs red ~100x more than blue', () => {
    const abs = getWaterAbsorption();
    const red700 = abs[Math.round((700 - 380) / 5)];
    const blue420 = abs[Math.round((420 - 380) / 5)];
    const ratio = red700 / blue420;
    expect(ratio).toBeGreaterThan(50);
    expect(ratio).toBeLessThan(200);
  });
});
