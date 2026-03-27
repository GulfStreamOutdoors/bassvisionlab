import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';

const LUTS_DIR = path.join(process.cwd(), 'public', 'luts');
const OUTPUT = path.join(LUTS_DIR, 'WMBayou_BassVisionLab_LUTs.zip');

const files = fs.readdirSync(LUTS_DIR)
  .filter(f => f.endsWith('.cube') || f === 'README.txt')
  .join(' ');

if (!files) {
  console.error('No .cube files or README.txt found in', LUTS_DIR);
  console.error('Run "npm run generate-luts" first.');
  process.exit(1);
}

execSync(`cd "${LUTS_DIR}" && zip -j "${OUTPUT}" ${files}`);
console.log(`Bundle created: ${OUTPUT}`);
