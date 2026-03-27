import { transformColor, ViewMode, type WaterParams } from '../spectral/transform-engine';

export function generateCubeLUT(
  water: WaterParams,
  mode: ViewMode,
  title: string,
  gridSize: number = 33
): string {
  const lines: string[] = [];
  lines.push(`TITLE "${title}"`);
  lines.push(`LUT_3D_SIZE ${gridSize}`);
  lines.push('');

  for (let bi = 0; bi < gridSize; bi++) {
    for (let gi = 0; gi < gridSize; gi++) {
      for (let ri = 0; ri < gridSize; ri++) {
        const inputR = Math.round((ri / (gridSize - 1)) * 255);
        const inputG = Math.round((gi / (gridSize - 1)) * 255);
        const inputB = Math.round((bi / (gridSize - 1)) * 255);
        const result = transformColor({ r: inputR, g: inputG, b: inputB }, water, mode);
        lines.push(
          `${(result.r / 255).toFixed(6)} ${(result.g / 255).toFixed(6)} ${(result.b / 255).toFixed(6)}`
        );
      }
    }
  }
  return lines.join('\n');
}

export function downloadCubeLUT(content: string, filename: string): void {
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
