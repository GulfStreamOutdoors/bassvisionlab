/**
 * Remove background from an image by making pixels close to a target color transparent.
 * Uses a simple color distance threshold approach.
 */
export function removeBackground(
  image: HTMLImageElement,
  options: {
    /** Color to treat as background (defaults to auto-detect from corners) */
    bgColor?: { r: number; g: number; b: number };
    /** Distance threshold 0-255. Higher = more aggressive removal. Default 50 */
    threshold?: number;
    /** Edge feathering in pixels. Default 2 */
    feather?: number;
  } = {}
): HTMLCanvasElement {
  const { threshold = 50, feather = 2 } = options;

  const canvas = document.createElement('canvas');
  canvas.width = image.naturalWidth || image.width;
  canvas.height = image.naturalHeight || image.height;
  const ctx = canvas.getContext('2d')!;

  ctx.drawImage(image, 0, 0);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  // Auto-detect background color from corners if not provided
  const bgColor = options.bgColor || detectBackgroundColor(data, canvas.width, canvas.height);

  // Remove background pixels
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const distance = Math.sqrt(
      (r - bgColor.r) ** 2 +
      (g - bgColor.g) ** 2 +
      (b - bgColor.b) ** 2
    );

    if (distance < threshold) {
      // Fully transparent
      data[i + 3] = 0;
    } else if (distance < threshold + feather * 10) {
      // Feather the edge
      const alpha = Math.round(((distance - threshold) / (feather * 10)) * 255);
      data[i + 3] = Math.min(data[i + 3], alpha);
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
}

function detectBackgroundColor(
  data: Uint8ClampedArray,
  width: number,
  height: number
): { r: number; g: number; b: number } {
  // Sample corners (top-left, top-right, bottom-left, bottom-right)
  const samples: { r: number; g: number; b: number }[] = [];
  const cornerPositions = [
    [0, 0], [width - 1, 0],
    [0, height - 1], [width - 1, height - 1],
    // Also sample a few pixels in from corners for robustness
    [5, 5], [width - 6, 5],
    [5, height - 6], [width - 6, height - 6],
  ];

  for (const [x, y] of cornerPositions) {
    const idx = (y * width + x) * 4;
    if (idx >= 0 && idx < data.length - 3) {
      samples.push({ r: data[idx], g: data[idx + 1], b: data[idx + 2] });
    }
  }

  // Average the corner samples
  const avg = samples.reduce(
    (acc, s) => ({ r: acc.r + s.r, g: acc.g + s.g, b: acc.b + s.b }),
    { r: 0, g: 0, b: 0 }
  );

  return {
    r: Math.round(avg.r / samples.length),
    g: Math.round(avg.g / samples.length),
    b: Math.round(avg.b / samples.length),
  };
}
