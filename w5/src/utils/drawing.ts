import type { Point } from '../types';

// Interpolate points between lastPoint and currentPoint for smooth brush strokes
export function getInterpolatedPoints(p1: Point, p2: Point, step = 2): Point[] {
  const points: Point[] = [];
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.max(Math.floor(distance / step), 1);

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push({
      x: p1.x + dx * t,
      y: p1.y + dy * t,
    });
  }
  return points;
}

// Draw custom brush effects
export function drawBrush(
  ctx: CanvasRenderingContext2D,
  type: string,
  p1: Point,
  p2: Point,
  size: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const interpolated = getInterpolatedPoints(p1, p2, Math.max(1, size / 8));

  switch (type) {
    case 'normal':
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      break;

    case 'airbrush':
      // Spray random dots around the cursor
      interpolated.forEach((p) => {
        const density = size * 1.5;
        for (let i = 0; i < density; i++) {
          const r = Math.random() * (size / 2);
          const angle = Math.random() * 2 * Math.PI;
          const px = p.x + r * Math.cos(angle);
          const py = p.y + r * Math.sin(angle);
          ctx.globalAlpha = Math.random() * 0.5 + 0.2;
          ctx.fillRect(px, py, 1.5, 1.5);
        }
      });
      break;

    case 'watercolor':
      // Large soft bleeding circles
      ctx.globalAlpha = 0.08;
      interpolated.forEach((p) => {
        const grad = ctx.createRadialGradient(p.x, p.y, size * 0.1, p.x, p.y, size);
        grad.addColorStop(0, color);
        grad.addColorStop(0.5, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fill();
      });
      break;

    case 'crayon':
      // Textured rough crayon
      interpolated.forEach((p) => {
        const density = size * 2;
        ctx.lineWidth = 1;
        ctx.globalAlpha = 0.45;
        for (let i = 0; i < density; i++) {
          // Add micro jitter to draw lines
          const r = Math.random() * (size / 2);
          const angle = Math.random() * 2 * Math.PI;
          const px = p.x + r * Math.cos(angle);
          const py = p.y + r * Math.sin(angle);
          ctx.beginPath();
          ctx.arc(px, py, 0.5 + Math.random() * 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
      });
      break;

    case 'marker':
      // Translucent flat marker style
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = size;
      ctx.lineCap = 'square';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      break;

    case 'calligraphy':
      // Flat angled nib (draw multiple angled lines)
      ctx.globalAlpha = 1.0;
      interpolated.forEach((p) => {
        ctx.beginPath();
        // Nib angle 45 degrees
        const angle = Math.PI / 4;
        const dx = Math.cos(angle) * (size / 2);
        const dy = Math.sin(angle) * (size / 2);
        ctx.moveTo(p.x - dx, p.y - dy);
        ctx.lineTo(p.x + dx, p.y + dy);
        ctx.lineWidth = Math.max(1, size / 4);
        ctx.stroke();
      });
      break;

    default:
      ctx.lineWidth = size;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
      break;
  }
  ctx.restore();
}

// Draw Shapes
export function drawShape(
  ctx: CanvasRenderingContext2D,
  type: string,
  start: Point,
  end: Point,
  size: number,
  strokeColor: string,
  fillColor: string,
  fillStyle: 'transparent' | 'solid',
  curveControl?: Point // for curve drawing
) {
  ctx.save();
  ctx.strokeStyle = strokeColor;
  ctx.fillStyle = fillColor;
  ctx.lineWidth = size;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const x = Math.min(start.x, end.x);
  const y = Math.min(start.y, end.y);
  const w = Math.abs(end.x - start.x);
  const h = Math.abs(end.y - start.y);

  ctx.beginPath();

  switch (type) {
    case 'line':
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      break;

    case 'curve':
      ctx.moveTo(start.x, start.y);
      if (curveControl) {
        ctx.quadraticCurveTo(curveControl.x, curveControl.y, end.x, end.y);
      } else {
        // Fallback to straight line if control point is not defined
        ctx.lineTo(end.x, end.y);
      }
      break;

    case 'rect':
      ctx.rect(x, y, w, h);
      break;

    case 'ellipse':
      ctx.ellipse(
        x + w / 2,
        y + h / 2,
        w / 2,
        h / 2,
        0,
        0,
        2 * Math.PI
      );
      break;

    case 'triangle':
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h);
      ctx.lineTo(x, y + h);
      ctx.closePath();
      break;

    case 'rightTriangle':
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(start.x, end.y);
      ctx.lineTo(end.x, end.y);
      ctx.closePath();
      break;

    case 'diamond':
      ctx.moveTo(x + w / 2, y);
      ctx.lineTo(x + w, y + h / 2);
      ctx.lineTo(x + w / 2, y + h);
      ctx.lineTo(x, y + h / 2);
      ctx.closePath();
      break;

    case 'pentagon': {
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const rx = w / 2;
      const ry = h / 2;
      for (let i = 0; i < 5; i++) {
        const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2;
        const px = centerX + rx * Math.cos(angle);
        const py = centerY + ry * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }

    case 'hexagon': {
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const rx = w / 2;
      const ry = h / 2;
      for (let i = 0; i < 6; i++) {
        const angle = (i * 2 * Math.PI) / 6;
        const px = centerX + rx * Math.cos(angle);
        const py = centerY + ry * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }

    case 'star': {
      const centerX = x + w / 2;
      const centerY = y + h / 2;
      const rOuterX = w / 2;
      const rOuterY = h / 2;
      const rInnerX = w / 4;
      const rInnerY = h / 4;
      const points = 5;

      for (let i = 0; i < points * 2; i++) {
        const angle = (i * Math.PI) / points - Math.PI / 2;
        const isOuter = i % 2 === 0;
        const rx = isOuter ? rOuterX : rInnerX;
        const ry = isOuter ? rOuterY : rInnerY;
        const px = centerX + rx * Math.cos(angle);
        const py = centerY + ry * Math.sin(angle);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      break;
    }

    case 'arrow': {
      // Draw arrow shape pointing right or down depending on mouse drag direction
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const length = Math.sqrt(dx * dx + dy * dy);
      const angle = Math.atan2(dy, dx);

      ctx.translate(start.x, start.y);
      ctx.rotate(angle);

      // Arrow path relative to start point (0, 0)
      ctx.moveTo(0, h / 4);
      ctx.lineTo(length * 0.6, h / 4);
      ctx.lineTo(length * 0.6, h / 2);
      ctx.lineTo(length, 0);
      ctx.lineTo(length * 0.6, -h / 2);
      ctx.lineTo(length * 0.6, -h / 4);
      ctx.lineTo(0, -h / 4);
      ctx.closePath();
      break;
    }

    default:
      break;
  }

  if (fillStyle === 'solid' && type !== 'line' && type !== 'curve') {
    ctx.fill();
  }
  ctx.stroke();
  ctx.restore();
}
