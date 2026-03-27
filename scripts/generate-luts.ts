import * as fs from 'fs';
import * as path from 'path';
import { generateCubeLUT } from '../lib/lut/cube-generator';
import { ViewMode } from '../lib/spectral/transform-engine';

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'luts');
const DEPTHS_FT = [5, 10, 15, 20, 30, 50];
const FT_TO_M = 0.3048;
const WATER_TYPES: [string, number, number][] = [
  ['Clear', 0.15, 0.05],
  ['Stained', 1.2, 0.3],
  ['Muddy', 3.0, 2.0],
];
const GRID_SIZE = 33;

async function main() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  console.log('Generating LUTs...');
  let count = 0;

  for (const [waterName, cdom, turbidity] of WATER_TYPES) {
    for (const depthFt of DEPTHS_FT) {
      const depthM = depthFt * FT_TO_M;
      const title = `WM Bayou - ${waterName} Water @ ${depthFt}ft`;
      const filename = `WMBayou_Water_${waterName}_${depthFt}ft.cube`;
      console.log(`  Generating ${filename}...`);
      const cube = generateCubeLUT(
        { depth: depthM, cdomFactor: cdom, turbidityFactor: turbidity },
        ViewMode.Underwater, title, GRID_SIZE
      );
      fs.writeFileSync(path.join(OUTPUT_DIR, filename), cube);
      count++;
    }
  }

  for (const [mode, name] of [
    [ViewMode.BassDichromatic, 'Dichromatic'],
    [ViewMode.BassContrast, 'Contrast'],
  ] as const) {
    const title = `WM Bayou - Bass Vision ${name}`;
    const filename = `WMBayou_BassVision_${name}.cube`;
    console.log(`  Generating ${filename}...`);
    const cube = generateCubeLUT(
      { depth: 0, cdomFactor: 0, turbidityFactor: 0 },
      mode, title, GRID_SIZE
    );
    fs.writeFileSync(path.join(OUTPUT_DIR, filename), cube);
    count++;
  }

  console.log(`\nDone! Generated ${count} LUT files in ${OUTPUT_DIR}`);
}

main().catch(console.error);
