const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const fileInput = document.getElementById('file-input');
const textInput = document.getElementById('text-input');
const brushSizeInput = document.getElementById('brush-size');
const sizeDisplay = document.getElementById('size-display');
const strokeStyleSelect = document.getElementById('stroke-style');
const fillStyleSelect = document.getElementById('fill-style');
const primaryColorBox = document.getElementById('primary-color');
const secondaryColorBox = document.getElementById('secondary-color');
const statusCoord = document.getElementById('status-coord');
const statusSize = document.getElementById('status-size');
const statusZoom = document.getElementById('status-zoom');
const colorsContainer = document.getElementById('colors');

let currentTool = 'pencil';
let primaryColor = '#000000';
let secondaryColor = '#ffffff';
let brushSize = 5;
let isDrawing = false;
let startX, startY;
let undoStack = [];
let redoStack = [];
let selection = null;
let selectionData = null;

const colors = [
  '#000000', '#808080', '#800000', '#808000', '#008000', '#008080', '#000080', '#800080',
  '#808040', '#004040', '#0080ff', '#004080', '#8000ff', '#804000',
  '#ffffff', '#c0c0c0', '#ff0000', '#ffff00', '#00ff00', '#00ffff', '#0000ff', '#ff00ff',
  '#ffff80', '#00ff80', '#80ffff', '#8080ff', '#ff0080', '#ff8040'
];

function init() {
  canvas.width = 813;
  canvas.height = 600;
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  renderColors();
  saveState();
  updateStatusSize();
}

function renderColors() {
  colorsContainer.innerHTML = '';
  colors.forEach(color => {
    const cell = document.createElement('div');
    cell.className = 'color-cell';
    cell.style.background = color;
    cell.onclick = (e) => {
      if (e.button === 0) {
        primaryColor = color;
        primaryColorBox.style.background = color;
      } else {
        secondaryColor = color;
        secondaryColorBox.style.background = color;
      }
    };
    cell.oncontextmenu = (e) => {
      e.preventDefault();
      secondaryColor = color;
      secondaryColorBox.style.background = color;
    };
    colorsContainer.appendChild(cell);
  });
  primaryColorBox.style.background = primaryColor;
  secondaryColorBox.style.background = secondaryColor;
}

function saveState() {
  undoStack.push(canvas.toDataURL());
  if (undoStack.length > 50) undoStack.shift();
  redoStack = [];
}

function undo() {
  if (undoStack.length > 1) {
    redoStack.push(undoStack.pop());
    loadState(undoStack[undoStack.length - 1]);
  }
}

function redo() {
  if (redoStack.length > 0) {
    const state = redoStack.pop();
    undoStack.push(state);
    loadState(state);
  }
}

function loadState(dataUrl) {
  const img = new Image();
  img.onload = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  };
  img.src = dataUrl;
}

function getPos(e) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.floor(e.clientX - rect.left),
    y: Math.floor(e.clientY - rect.top)
  };
}

function updateStatusSize() {
  statusSize.textContent = `${canvas.width} × ${canvas.height} 像素`;
}

function applyStrokeStyle() {
  const style = strokeStyleSelect.value;
  if (style === 'dashed') ctx.setLineDash([10, 5]);
  else if (style === 'dotted') ctx.setLineDash([2, 3]);
  else ctx.setLineDash([]);
}

function clearStrokeStyle() {
  ctx.setLineDash([]);
}

canvas.addEventListener('mousedown', (e) => {
  const pos = getPos(e);
  startX = pos.x;
  startY = pos.y;
  isDrawing = true;
  const color = e.button === 2 ? secondaryColor : primaryColor;

  if (currentTool === 'pencil' || currentTool === 'brush') {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.strokeStyle = color;
    ctx.lineWidth = currentTool === 'brush' ? brushSize * 2 : brushSize;
  } else if (currentTool === 'eraser') {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.strokeStyle = secondaryColor;
    ctx.lineWidth = brushSize * 3;
  } else if (currentTool === 'fill') {
    floodFill(startX, startY, color);
    saveState();
    isDrawing = false;
  } else if (currentTool === 'text') {
    showTextInput(startX, startY, color);
    isDrawing = false;
  } else if (currentTool === 'select') {
    selection = null;
  }
});

canvas.addEventListener('mousemove', (e) => {
  const pos = getPos(e);
  statusCoord.textContent = `X: ${pos.x}, Y: ${pos.y}`;

  if (!isDrawing) return;

  const color = e.buttons === 2 ? secondaryColor : primaryColor;

  if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  } else if (['line', 'rect', 'ellipse', 'roundrect'].includes(currentTool)) {
    loadState(undoStack[undoStack.length - 1]);
    applyStrokeStyle();
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    if (fillStyleSelect.value === 'fill') {
      ctx.fillStyle = secondaryColor;
    }
    drawShape(currentTool, startX, startY, pos.x, pos.y);
    clearStrokeStyle();
  } else if (currentTool === 'select') {
    loadState(undoStack[undoStack.length - 1]);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    const w = pos.x - startX;
    const h = pos.y - startY;
    ctx.strokeRect(startX, startY, w, h);
    ctx.setLineDash([]);
    selection = { x: startX, y: startY, w, h };
  }
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawing) return;
  isDrawing = false;
  const pos = getPos(e);
  const color = e.button === 2 ? secondaryColor : primaryColor;

  if (currentTool === 'pencil' || currentTool === 'brush' || currentTool === 'eraser') {
    saveState();
  } else if (['line', 'rect', 'ellipse', 'roundrect'].includes(currentTool)) {
    saveState();
  } else if (currentTool === 'select' && selection) {
    selectionData = ctx.getImageData(selection.x, selection.y, selection.w, selection.h);
  }
});

canvas.addEventListener('mouseleave', () => {
  if (isDrawing && ['pencil', 'brush', 'eraser'].includes(currentTool)) {
    isDrawing = false;
    saveState();
  }
});

canvas.addEventListener('contextmenu', (e) => e.preventDefault());

function drawShape(tool, x1, y1, x2, y2) {
  const w = x2 - x1;
  const h = y2 - y1;
  const shouldFill = fillStyleSelect.value === 'fill';

  if (tool === 'line') {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  } else if (tool === 'rect') {
    if (shouldFill) ctx.fillRect(x1, y1, w, h);
    ctx.strokeRect(x1, y1, w, h);
  } else if (tool === 'roundrect') {
    const r = Math.min(Math.abs(w), Math.abs(h)) * 0.2;
    ctx.beginPath();
    ctx.roundRect(x1, y1, w, h, r);
    if (shouldFill) ctx.fill();
    ctx.stroke();
  } else if (tool === 'ellipse') {
    ctx.beginPath();
    ctx.ellipse(x1 + w/2, y1 + h/2, Math.abs(w/2), Math.abs(h/2), 0, 0, Math.PI * 2);
    if (shouldFill) ctx.fill();
    ctx.stroke();
  }
}

function floodFill(x, y, fillColor) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;
  const target = getPixel(data, x, y);
  const fill = hexToRgb(fillColor);

  if (target[0] === fill.r && target[1] === fill.g && target[2] === fill.b) return;

  const stack = [[x, y]];
  const visited = new Set();

  while (stack.length > 0) {
    const [cx, cy] = stack.pop();
    const key = `${cx},${cy}`;
    if (visited.has(key)) continue;
    if (cx < 0 || cx >= canvas.width || cy < 0 || cy >= canvas.height) continue;

    const current = getPixel(data, cx, cy);
    if (Math.abs(current[0] - target[0]) > 30 ||
        Math.abs(current[1] - target[1]) > 30 ||
        Math.abs(current[2] - target[2]) > 30) continue;

    visited.add(key);
    setPixel(data, cx, cy, fill);

    stack.push([cx+1, cy], [cx-1, cy], [cx, cy+1], [cx, cy-1]);
  }

  ctx.putImageData(imageData, 0, 0);
}

function getPixel(data, x, y) {
  const i = (y * canvas.width + x) * 4;
  return [data[i], data[i+1], data[i+2], data[i+3]];
}

function setPixel(data, x, y, color) {
  const i = (y * canvas.width + x) * 4;
  data[i] = color.r;
  data[i+1] = color.g;
  data[i+2] = color.b;
  data[i+3] = 255;
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

function showTextInput(x, y, color) {
  textInput.classList.remove('hidden');
  textInput.style.left = canvas.getBoundingClientRect().left + x + 'px';
  textInput.style.top = canvas.getBoundingClientRect().top + y + 'px';
  textInput.style.color = color;
  textInput.value = '';
  textInput.focus();

  textInput.onblur = () => {
    if (textInput.value.trim()) {
      ctx.font = `${brushSize * 3 + 12}px "Microsoft JhengHei", sans-serif`;
      ctx.fillStyle = color;
      ctx.fillText(textInput.value, x, y + brushSize * 3 + 12);
      saveState();
    }
    textInput.classList.add('hidden');
  };

  textInput.onkeydown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      textInput.blur();
    }
    if (e.key === 'Escape') {
      textInput.value = '';
      textInput.blur();
    }
  };
}

document.querySelectorAll('.tool').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tool').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentTool = btn.dataset.tool;
    canvas.style.cursor = currentTool === 'text' ? 'text' :
                          currentTool === 'fill' ? 'crosshair' :
                          currentTool === 'select' ? 'crosshair' : 'crosshair';
  });
});

brushSizeInput.addEventListener('input', () => {
  brushSize = parseInt(brushSizeInput.value);
  sizeDisplay.textContent = brushSize;
});

document.getElementById('btn-new').addEventListener('click', () => {
  if (confirm('確定要新建畫布嗎？未儲存的內容將會遺失。')) {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    undoStack = [];
    redoStack = [];
    saveState();
  }
});

document.getElementById('btn-open').addEventListener('click', () => {
  fileInput.click();
});

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      updateStatusSize();
      saveState();
    };
    img.src = URL.createObjectURL(file);
  }
  fileInput.value = '';
});

document.getElementById('btn-save').addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = '未命名.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});

document.getElementById('btn-undo').addEventListener('click', undo);
document.getElementById('btn-redo').addEventListener('click', redo);

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.key === 'z') { e.preventDefault(); undo(); }
  if (e.ctrlKey && e.key === 'y') { e.preventDefault(); redo(); }
  if (e.ctrlKey && e.key === 's') { e.preventDefault(); document.getElementById('btn-save').click(); }
  if (e.key === 'Delete' && selection && selectionData) {
    ctx.clearRect(selection.x, selection.y, selection.w, selection.h);
    saveState();
  }
  if (e.ctrlKey && e.key === 'c' && selection && selectionData) {
    navigator.clipboard.write(selectionData);
  }
  if (e.ctrlKey && e.key === 'v' && selectionData) {
    ctx.putImageData(selectionData, selection.x, selection.y);
    saveState();
  }
});

init();
