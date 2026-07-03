export type Tool = 'pencil' | 'eraser' | 'fill' | 'picker' | 'text' | 'select' | 'brush' | 'shape';

export type BrushType = 'normal' | 'airbrush' | 'watercolor' | 'crayon' | 'marker' | 'calligraphy';

export type ShapeType = 
  | 'line' 
  | 'curve' 
  | 'rect' 
  | 'ellipse' 
  | 'triangle' 
  | 'rightTriangle' 
  | 'diamond' 
  | 'pentagon' 
  | 'hexagon' 
  | 'star' 
  | 'arrow';

export type FillStyle = 'transparent' | 'solid';

export interface LayerState {
  id: string;
  name: string;
  visible: boolean;
  opacity: number; // 0 to 1
  dataUrl: string; // Base64 png data of the layer content
}

export interface SelectionState {
  active: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
  dataUrl: string; // The selected region image data url
  startX: number; // Original position when cut/copied
  startY: number;
  originalX: number; // Track current translation during drag
  originalY: number;
  isDragging: boolean;
  dragStartX: number;
  dragStartY: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface HistoryStep {
  layers: LayerState[];
  activeLayerId: string;
  canvasWidth: number;
  canvasHeight: number;
}
