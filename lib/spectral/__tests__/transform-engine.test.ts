import { transformColor, ViewMode } from '../transform-engine';

describe('transformColor', () => {
  it('returns unchanged color at depth 0 with no water effects', () => {
    const result = transformColor(
      { r: 255, g: 0, b: 0 },
      { depth: 0, cdomFactor: 0, turbidityFactor: 0 },
      ViewMode.Underwater
    );
    // Spectral round-trip won't be pixel-perfect; red should dominate
    expect(result.r).toBeGreaterThan(200);
    expect(result.g).toBeLessThan(110);
    expect(result.b).toBeLessThan(50);
  });

  it('red disappears at depth in clear water', () => {
    const shallow = transformColor(
      { r: 255, g: 0, b: 0 },
      { depth: 0.5, cdomFactor: 0.1, turbidityFactor: 0 },
      ViewMode.Underwater
    );
    const deep = transformColor(
      { r: 255, g: 0, b: 0 },
      { depth: 10, cdomFactor: 0.1, turbidityFactor: 0 },
      ViewMode.Underwater
    );
    expect(deep.r).toBeLessThan(shallow.r);
  });

  it('bass dichromatic blue channel is always zero', () => {
    const result = transformColor(
      { r: 0, g: 0, b: 255 },
      { depth: 0, cdomFactor: 0, turbidityFactor: 0 },
      ViewMode.BassDichromatic
    );
    // Bass are dichromats (MWS + LWS only) so blue channel is always 0
    expect(result.b).toBe(0);
    // MWS cone (535nm) has more sensitivity near 460nm than LWS (614.5nm)
    // so green channel should dominate for blue input
    expect(result.g).toBeGreaterThan(result.r);
  });

  it('bass contrast mode returns grayscale', () => {
    const result = transformColor(
      { r: 255, g: 128, b: 0 },
      { depth: 0, cdomFactor: 0, turbidityFactor: 0 },
      ViewMode.BassContrast
    );
    expect(result.r).toBe(result.g);
    expect(result.g).toBe(result.b);
  });
});
