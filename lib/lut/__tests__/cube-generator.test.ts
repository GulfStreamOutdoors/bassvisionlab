import { generateCubeLUT } from '../cube-generator';
import { ViewMode } from '../../spectral/transform-engine';

describe('generateCubeLUT', () => {
  it('generates valid .cube format string', () => {
    const cube = generateCubeLUT(
      { depth: 3, cdomFactor: 0.1, turbidityFactor: 0 },
      ViewMode.Underwater,
      'Test LUT',
      9
    );
    const lines = cube.split('\n');
    expect(lines[0]).toBe('TITLE "Test LUT"');
    expect(lines.some(l => l.startsWith('LUT_3D_SIZE'))).toBe(true);
  });

  it('has correct number of data lines for grid size', () => {
    const cube = generateCubeLUT(
      { depth: 3, cdomFactor: 0.1, turbidityFactor: 0 },
      ViewMode.Underwater,
      'Test',
      9
    );
    const dataLines = cube.split('\n').filter(l => {
      const parts = l.trim().split(/\s+/);
      return parts.length === 3 && !isNaN(parseFloat(parts[0]));
    });
    expect(dataLines.length).toBe(9 * 9 * 9);
  });

  it('values are between 0 and 1', () => {
    const cube = generateCubeLUT(
      { depth: 3, cdomFactor: 0.1, turbidityFactor: 0 },
      ViewMode.Underwater,
      'Test',
      9
    );
    const dataLines = cube.split('\n').filter(l => {
      const parts = l.trim().split(/\s+/);
      return parts.length === 3 && !isNaN(parseFloat(parts[0]));
    });
    for (const line of dataLines) {
      const [r, g, b] = line.trim().split(/\s+/).map(Number);
      expect(r).toBeGreaterThanOrEqual(0);
      expect(r).toBeLessThanOrEqual(1);
      expect(g).toBeGreaterThanOrEqual(0);
      expect(g).toBeLessThanOrEqual(1);
      expect(b).toBeGreaterThanOrEqual(0);
      expect(b).toBeLessThanOrEqual(1);
    }
  });
});
