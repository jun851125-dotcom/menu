export function floodFill(
  canvas: HTMLCanvasElement,
  startX: number,
  startY: number,
  fillColorHex: string,
  tolerance = 20
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const width = canvas.width;
  const height = canvas.height;

  // Convert fill color hex to rgba
  const fillRgba = hexToRgba(fillColorHex);
  
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const buffer = data.buffer;
  const u32Data = new Uint32Array(buffer);

  const targetIdx = (startY * width + startX);
  if (targetIdx < 0 || targetIdx >= u32Data.length) return;
  const targetColorUint = u32Data[targetIdx];
  
  // Extract target RGBA
  const targetR = targetColorUint & 0xff;
  const targetG = (targetColorUint >> 8) & 0xff;
  const targetB = (targetColorUint >> 16) & 0xff;
  const targetA = (targetColorUint >> 24) & 0xff;
  
  const fillR = fillRgba[0];
  const fillG = fillRgba[1];
  const fillB = fillRgba[2];
  const fillA = fillRgba[3];
  
  // Pack to 32bit integer (Little Endian format: ABGR)
  const fillColorUint = (fillA << 24) | (fillB << 16) | (fillG << 8) | fillR;

  // If target color is already same as fill color within tolerance, do nothing
  if (
    Math.abs(targetR - fillR) <= 2 &&
    Math.abs(targetG - fillG) <= 2 &&
    Math.abs(targetB - fillB) <= 2 &&
    Math.abs(targetA - fillA) <= 2
  ) {
    return;
  }

  // Queue for BFS (using flat array to avoid creating objects)
  // We pre-allocate a reasonably sized array or let it grow dynamically
  const queue = new Int32Array(width * height * 2);
  let head = 0;
  let tail = 0;

  queue[tail++] = startX;
  queue[tail++] = startY;

  // Track visited pixels to avoid infinite loop / double processing
  const visited = new Uint8Array(width * height);
  visited[targetIdx] = 1;

  const checkMatch = (idx: number): boolean => {
    const color = u32Data[idx];
    const r = color & 0xff;
    const g = (color >> 8) & 0xff;
    const b = (color >> 16) & 0xff;
    const a = (color >> 24) & 0xff;
    
    return Math.abs(r - targetR) <= tolerance &&
           Math.abs(g - targetG) <= tolerance &&
           Math.abs(b - targetB) <= tolerance &&
           Math.abs(a - targetA) <= tolerance;
  };

  while (head < tail) {
    const cx = queue[head++];
    const cy = queue[head++];
    const idx = cy * width + cx;

    u32Data[idx] = fillColorUint;

    // Check neighbors: Left, Right, Up, Down
    if (cx > 0) {
      const nIdx = idx - 1;
      if (!visited[nIdx]) {
        visited[nIdx] = 1;
        if (checkMatch(nIdx)) {
          queue[tail++] = cx - 1;
          queue[tail++] = cy;
        }
      }
    }
    if (cx < width - 1) {
      const nIdx = idx + 1;
      if (!visited[nIdx]) {
        visited[nIdx] = 1;
        if (checkMatch(nIdx)) {
          queue[tail++] = cx + 1;
          queue[tail++] = cy;
        }
      }
    }
    if (cy > 0) {
      const nIdx = idx - width;
      if (!visited[nIdx]) {
        visited[nIdx] = 1;
        if (checkMatch(nIdx)) {
          queue[tail++] = cx;
          queue[tail++] = cy - 1;
        }
      }
    }
    if (cy < height - 1) {
      const nIdx = idx + width;
      if (!visited[nIdx]) {
        visited[nIdx] = 1;
        if (checkMatch(nIdx)) {
          queue[tail++] = cx;
          queue[tail++] = cy + 1;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

function hexToRgba(hex: string): [number, number, number, number] {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2] + 'ff';
  } else if (cleanHex.length === 6) {
    cleanHex = cleanHex + 'ff';
  } else if (cleanHex.length === 4) {
    cleanHex = cleanHex[0] + cleanHex[0] + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2] + cleanHex[3] + cleanHex[3];
  } else if (cleanHex.length === 8) {
    // Already rrggbbaa
  } else {
    return [0, 0, 0, 255]; // fallback black
  }
  
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  const a = parseInt(cleanHex.substring(6, 8), 16);
  return [r, g, b, a];
}
