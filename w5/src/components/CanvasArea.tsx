import React, { useRef, useEffect, useState } from 'react';
import type { LayerState, Point, SelectionState, Tool, BrushType, ShapeType, FillStyle } from '../types';
import { drawBrush, drawShape } from '../utils/drawing';

interface CanvasAreaProps {
  layers: LayerState[];
  activeLayerId: string;
  currentTool: Tool;
  brushType: BrushType;
  shapeType: ShapeType;
  strokeWidth: number;
  strokeColor: string;
  fillColor: string;
  fillStyle: FillStyle;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  setZoom: (zoom: number) => void;
  onCanvasResize: (width: number, height: number) => void;
  onDrawEnd: (layerId: string, dataUrl: string) => void;
  onLayersChange: (layers: LayerState[]) => void;
  setMousePos: (pos: Point | null) => void;
  isDarkMode: boolean;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  layers,
  activeLayerId,
  currentTool,
  brushType,
  shapeType,
  strokeWidth,
  strokeColor,
  fillColor,
  fillStyle,
  canvasWidth,
  canvasHeight,
  zoom,
  onCanvasResize,
  onDrawEnd,
  setMousePos,
}) => {
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const tempCanvasRef = useRef<HTMLCanvasElement>(null);
  
  // Refs for each layer canvas
  const canvasRefs = useRef<{ [id: string]: HTMLCanvasElement | null }>({});

  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [lastPoint, setLastPoint] = useState<Point | null>(null);
  const [curveControl, setCurveControl] = useState<Point | null>(null);
  const [curveStep, setCurveStep] = useState<'none' | 'draw' | 'control'>('none');

  // Text tool state
  const [textState, setTextState] = useState<{ x: number; y: number; text: string } | null>(null);
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  // Selection state
  const [selection, setSelection] = useState<SelectionState>({
    active: false,
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    dataUrl: '',
    startX: 0,
    startY: 0,
    originalX: 0,
    originalY: 0,
    isDragging: false,
    dragStartX: 0,
    dragStartY: 0,
  });

  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState<Point>({ x: 0, y: 0 });
  const [panOffset, setPanOffset] = useState<Point>({ x: 0, y: 0 });
  const [spacePressed, setSpacePressed] = useState(false);

  // Canvas Resizing state (mouse dragging edge handles)
  const [isResizing, setIsResizing] = useState(false);
  const [resizeType, setResizeType] = useState<'r' | 'b' | 'br' | null>(null);
  const [resizeStartSize, setResizeStartSize] = useState<{ w: number; h: number }>({ w: 0, h: 0 });
  const [resizeStartPos, setResizeStartPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  // Update canvas sizing and redraw layers when dataUrls change (e.g., Undo/Redo)
  useEffect(() => {
    layers.forEach((layer) => {
      const canvas = canvasRefs.current[layer.id];
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // Keep canvas resolution synced with props
          if (canvas.width !== canvasWidth || canvas.height !== canvasHeight) {
            canvas.width = canvasWidth;
            canvas.height = canvasHeight;
          }
          
          ctx.clearRect(0, 0, canvasWidth, canvasHeight);
          
          if (layer.dataUrl) {
            const img = new Image();
            img.src = layer.dataUrl;
            img.onload = () => {
              ctx.drawImage(img, 0, 0);
            };
          }
        }
      }
    });
  }, [layers, canvasWidth, canvasHeight]);

  // Sync tempCanvas size
  useEffect(() => {
    const tempCanvas = tempCanvasRef.current;
    if (tempCanvas) {
      tempCanvas.width = canvasWidth;
      tempCanvas.height = canvasHeight;
    }
  }, [canvasWidth, canvasHeight]);

  // Listen to spacebar for Panning
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && document.activeElement?.tagName !== 'TEXTAREA') {
        setSpacePressed(true);
        if (viewportRef.current) viewportRef.current.style.cursor = 'grab';
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setSpacePressed(false);
        if (viewportRef.current) viewportRef.current.style.cursor = 'default';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Convert client mouse pos to canvas-local coordinates
  const getCanvasCoords = (clientX: number, clientY: number): Point => {
    const canvasContainer = canvasContainerRef.current;
    if (!canvasContainer) return { x: 0, y: 0 };
    const rect = canvasContainer.getBoundingClientRect();
    
    // Scale by zoom
    const x = (clientX - rect.left) / zoom;
    const y = (clientY - rect.top) / zoom;
    return { x, y };
  };

  // Commit selection to the active layer canvas before clearing or changing tools
  const commitSelection = (overrideSelection?: SelectionState) => {
    const s = overrideSelection || selection;
    if (!s.active || !s.dataUrl) return;

    const activeCanvas = canvasRefs.current[activeLayerId];
    if (activeCanvas) {
      const ctx = activeCanvas.getContext('2d');
      if (ctx) {
        const img = new Image();
        img.src = s.dataUrl;
        img.onload = () => {
          ctx.drawImage(img, s.x, s.y, s.w, s.h);
          onDrawEnd(activeLayerId, activeCanvas.toDataURL());
          setSelection(prev => ({ ...prev, active: false, dataUrl: '' }));
        };
      }
    }
  };

  // Commit text inputs
  const commitText = () => {
    if (!textState || !textState.text.trim()) {
      setTextState(null);
      return;
    }

    const activeCanvas = canvasRefs.current[activeLayerId];
    if (activeCanvas) {
      const ctx = activeCanvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.fillStyle = strokeColor;
        // Text size behaves like strokeWidth
        const fontSize = Math.max(12, strokeWidth);
        ctx.font = `${fontSize}px "Segoe UI", sans-serif`;
        ctx.textBaseline = 'top';

        // Draw multiple lines if any
        const lines = textState.text.split('\n');
        lines.forEach((line, i) => {
          ctx.fillText(line, textState.x, textState.y + i * (fontSize + 4));
        });

        ctx.restore();
        onDrawEnd(activeLayerId, activeCanvas.toDataURL());
      }
    }
    setTextState(null);
  };

  // If tool changes, commit text or selection
  useEffect(() => {
    if (currentTool !== 'select') {
      commitSelection();
    }
    if (currentTool !== 'text') {
      commitText();
    }
  }, [currentTool]);

  // Handle pointer down
  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // If Space is pressed or middle button is clicked -> PAN
    if (spacePressed || e.button === 1) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      if (viewportRef.current) viewportRef.current.style.cursor = 'grabbing';
      return;
    }

    if (e.button !== 0) return; // Left click only

    // Text Tool committing click
    if (textState) {
      commitText();
      return;
    }

    const coords = getCanvasCoords(e.clientX, e.clientY);

    // Color picker
    if (currentTool === 'picker') {
      sampleColor(coords.x, coords.y);
      return;
    }

    // Flood fill
    if (currentTool === 'fill') {
      const activeCanvas = canvasRefs.current[activeLayerId];
      if (activeCanvas) {
        // Dynamically import or run flood fill
        import('../utils/floodFill').then(({ floodFill }) => {
          floodFill(activeCanvas, Math.floor(coords.x), Math.floor(coords.y), strokeColor);
          onDrawEnd(activeLayerId, activeCanvas.toDataURL());
        });
      }
      return;
    }

    // Text tool activation
    if (currentTool === 'text') {
      setTextState({ x: coords.x, y: coords.y, text: '' });
      return;
    }

    // Selection click dragging or drawing a new selection
    if (currentTool === 'select' && selection.active) {
      // Check if clicked inside the selection box to drag it
      if (
        coords.x >= selection.x &&
        coords.x <= selection.x + selection.w &&
        coords.y >= selection.y &&
        coords.y <= selection.y + selection.h
      ) {
        setSelection(prev => ({
          ...prev,
          isDragging: true,
          dragStartX: coords.x - prev.x,
          dragStartY: coords.y - prev.y,
        }));
        return;
      } else {
        // Clicked outside: commit current selection and start drawing a new one
        commitSelection();
      }
    }

    // Curve shape: two clicks interaction
    if (currentTool === 'shape' && shapeType === 'curve' && curveStep === 'draw') {
      // We already drew the line, now we click to place the control point
      setCurveControl(coords);
      setCurveStep('control');
      
      // Render the curve on Temp Canvas
      const tempCanvas = tempCanvasRef.current;
      if (tempCanvas && startPoint) {
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.clearRect(0, 0, canvasWidth, canvasHeight);
          drawShape(tempCtx, 'curve', startPoint, coords, strokeWidth, strokeColor, fillColor, fillStyle, coords);
        }
      }
      return;
    } else if (currentTool === 'shape' && shapeType === 'curve' && curveStep === 'control') {
      // Curve completed
      const activeCanvas = canvasRefs.current[activeLayerId];
      if (activeCanvas && startPoint && lastPoint && curveControl) {
        const ctx = activeCanvas.getContext('2d');
        if (ctx) {
          drawShape(ctx, 'curve', startPoint, lastPoint, strokeWidth, strokeColor, fillColor, fillStyle, coords);
          onDrawEnd(activeLayerId, activeCanvas.toDataURL());
        }
      }
      // Reset
      const tempCanvas = tempCanvasRef.current;
      if (tempCanvas) {
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx?.clearRect(0, 0, canvasWidth, canvasHeight);
      }
      setCurveStep('none');
      setStartPoint(null);
      setLastPoint(null);
      setCurveControl(null);
      return;
    }

    // Normal drawing / select box draw / shape draw
    setIsDrawing(true);
    setStartPoint(coords);
    setLastPoint(coords);

    const activeCanvas = canvasRefs.current[activeLayerId];
    if (activeCanvas && (currentTool === 'pencil' || currentTool === 'eraser' || currentTool === 'brush')) {
      const ctx = activeCanvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
        if (currentTool === 'eraser') {
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          drawBrush(ctx, 'normal', coords, coords, strokeWidth, 'rgba(0,0,0,1)');
          ctx.restore();
        } else if (currentTool === 'pencil') {
          drawBrush(ctx, 'normal', coords, coords, 1.5, strokeColor);
        } else {
          drawBrush(ctx, brushType, coords, coords, strokeWidth, strokeColor);
        }
      }
    }
  };

  // Handle pointer move
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const coords = getCanvasCoords(e.clientX, e.clientY);
    setMousePos(coords);

    // Pan viewport
    if (isPanning) {
      setPanOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    // Move floating selection
    if (currentTool === 'select' && selection.active && selection.isDragging) {
      const newX = coords.x - selection.dragStartX;
      const newY = coords.y - selection.dragStartY;
      setSelection(prev => ({
        ...prev,
        x: newX,
        y: newY,
      }));
      return;
    }

    if (!isDrawing || !startPoint || !lastPoint) return;

    const tempCanvas = tempCanvasRef.current;
    const activeCanvas = canvasRefs.current[activeLayerId];

    if (!activeCanvas) return;

    if (currentTool === 'pencil' || currentTool === 'eraser' || currentTool === 'brush') {
      const ctx = activeCanvas.getContext('2d');
      if (ctx) {
        if (currentTool === 'eraser') {
          ctx.save();
          ctx.globalCompositeOperation = 'destination-out';
          drawBrush(ctx, 'normal', lastPoint, coords, strokeWidth, 'rgba(0,0,0,1)');
          ctx.restore();
        } else if (currentTool === 'pencil') {
          drawBrush(ctx, 'normal', lastPoint, coords, 1.5, strokeColor);
        } else {
          drawBrush(ctx, brushType, lastPoint, coords, strokeWidth, strokeColor);
        }
        setLastPoint(coords);
      }
    } else if (currentTool === 'shape') {
      if (tempCanvas) {
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.clearRect(0, 0, canvasWidth, canvasHeight);
          
          if (shapeType === 'curve') {
            // Draw straight line preview
            drawShape(tempCtx, 'line', startPoint, coords, strokeWidth, strokeColor, fillColor, fillStyle);
          } else {
            drawShape(tempCtx, shapeType, startPoint, coords, strokeWidth, strokeColor, fillColor, fillStyle);
          }
        }
      }
      setLastPoint(coords);
    } else if (currentTool === 'select') {
      if (tempCanvas) {
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.clearRect(0, 0, canvasWidth, canvasHeight);
          // Draw dashed selection rectangle
          tempCtx.save();
          tempCtx.strokeStyle = '#0078d4';
          tempCtx.lineWidth = 1;
          tempCtx.setLineDash([4, 4]);
          const x = Math.min(startPoint.x, coords.x);
          const y = Math.min(startPoint.y, coords.y);
          const w = Math.abs(coords.x - startPoint.x);
          const h = Math.abs(coords.y - startPoint.y);
          tempCtx.strokeRect(x, y, w, h);
          tempCtx.restore();
        }
      }
      setLastPoint(coords);
    }
  };

  // Handle pointer up
  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isPanning) {
      setIsPanning(false);
      return;
    }

    if (currentTool === 'select' && selection.active && selection.isDragging) {
      setSelection(prev => ({ ...prev, isDragging: false }));
      return;
    }

    if (!isDrawing) return;
    setIsDrawing(false);

    const activeCanvas = canvasRefs.current[activeLayerId];
    const tempCanvas = tempCanvasRef.current;
    if (!activeCanvas) return;

    const coords = getCanvasCoords(e.clientX, e.clientY);

    // Clean preview
    if (tempCanvas) {
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx?.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    if (currentTool === 'pencil' || currentTool === 'eraser' || currentTool === 'brush') {
      onDrawEnd(activeLayerId, activeCanvas.toDataURL());
    } else if (currentTool === 'shape') {
      if (shapeType === 'curve') {
        // Curve requires control point selection. Enter curve draw phase.
        setCurveStep('draw');
        setLastPoint(coords);
        // Draw line on temp canvas for control point drag reference
        if (tempCanvas && startPoint) {
          const tempCtx = tempCanvas.getContext('2d');
          if (tempCtx) {
            drawShape(tempCtx, 'line', startPoint, coords, strokeWidth, strokeColor, fillColor, fillStyle);
          }
        }
      } else {
        const ctx = activeCanvas.getContext('2d');
        if (ctx && startPoint) {
          drawShape(ctx, shapeType, startPoint, coords, strokeWidth, strokeColor, fillColor, fillStyle);
          onDrawEnd(activeLayerId, activeCanvas.toDataURL());
        }
        setStartPoint(null);
        setLastPoint(null);
      }
    } else if (currentTool === 'select') {
      if (startPoint) {
        const x = Math.min(startPoint.x, coords.x);
        const y = Math.min(startPoint.y, coords.y);
        const w = Math.abs(coords.x - startPoint.x);
        const h = Math.abs(coords.y - startPoint.y);

        if (w > 2 && h > 2) {
          const ctx = activeCanvas.getContext('2d');
          if (ctx) {
            // Extract the selected image content
            const imgData = ctx.getImageData(x, y, w, h);
            
            // Create selection thumbnail DataURL
            const selCanvas = document.createElement('canvas');
            selCanvas.width = w;
            selCanvas.height = h;
            const selCtx = selCanvas.getContext('2d');
            selCtx?.putImageData(imgData, 0, 0);

            // Clear the selected area in original canvas (cut behavior)
            ctx.clearRect(x, y, w, h);
            onDrawEnd(activeLayerId, activeCanvas.toDataURL());

            setSelection({
              active: true,
              x,
              y,
              w,
              h,
              dataUrl: selCanvas.toDataURL(),
              startX: x,
              startY: y,
              originalX: x,
              originalY: y,
              isDragging: false,
              dragStartX: 0,
              dragStartY: 0,
            });
          }
        }
      }
      setStartPoint(null);
      setLastPoint(null);
    }
  };

  // Color Eyedropper sampling
  const sampleColor = (x: number, y: number) => {
    // Sample color from top-most visible layer
    // Render all visible layers onto a temporary canvas in order
    const sampleCanvas = document.createElement('canvas');
    sampleCanvas.width = canvasWidth;
    sampleCanvas.height = canvasHeight;
    const sampleCtx = sampleCanvas.getContext('2d');
    if (!sampleCtx) return;

    layers.forEach((layer) => {
      if (layer.visible) {
        const canvas = canvasRefs.current[layer.id];
        if (canvas) {
          sampleCtx.save();
          sampleCtx.globalAlpha = layer.opacity;
          sampleCtx.drawImage(canvas, 0, 0);
          sampleCtx.restore();
        }
      }
    });

    const px = Math.min(Math.max(0, Math.floor(x)), canvasWidth - 1);
    const py = Math.min(Math.max(0, Math.floor(y)), canvasHeight - 1);
    const imgData = sampleCtx.getImageData(px, py, 1, 1).data;
    
    // Convert RGB to HEX
    const r = imgData[0].toString(16).padStart(2, '0');
    const g = imgData[1].toString(16).padStart(2, '0');
    const b = imgData[2].toString(16).padStart(2, '0');
    
    // Return sample color to app
    const hexColor = `#${r}${g}${b}`;
    // Set stroke color in app
    // Simulating parent callback via document event or props
    const pickerEvent = new CustomEvent('color-picked', { detail: hexColor });
    window.dispatchEvent(pickerEvent);
  };

  // Handle canvas sizing handles dragging
  const handleResizeStart = (e: React.MouseEvent, type: 'r' | 'b' | 'br') => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeType(type);
    setResizeStartSize({ w: canvasWidth, h: canvasHeight });
    setResizeStartPos({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeType) return;
      const dx = (e.clientX - resizeStartPos.x) / zoom;
      const dy = (e.clientY - resizeStartPos.y) / zoom;

      let newW = resizeStartSize.w;
      let newH = resizeStartSize.h;

      if (resizeType === 'r' || resizeType === 'br') {
        newW = Math.max(50, Math.round(resizeStartSize.w + dx));
      }
      if (resizeType === 'b' || resizeType === 'br') {
        newH = Math.max(50, Math.round(resizeStartSize.h + dy));
      }

      onCanvasResize(newW, newH);
    };

    const handleMouseUp = () => {
      if (isResizing) {
        setIsResizing(false);
        setResizeType(null);
      }
    };

    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeType, resizeStartSize, resizeStartPos, zoom]);

  // Handle Selection keyboard actions (Delete selection)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selection.active && (e.key === 'Delete' || e.key === 'Backspace')) {
        // Just discard selection content
        setSelection(prev => ({ ...prev, active: false, dataUrl: '' }));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selection]);

  return (
    <div className="canvas-viewport" ref={viewportRef}>
      {/* Background grids */}
      <div 
        className="canvas-scroll-container"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
        }}
      >
        <div 
          className="canvas-wrapper-shadow"
          ref={canvasContainerRef}
          style={{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'top left',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        >
          {/* Layer canvases */}
          {layers.map((layer) => (
            <canvas
              key={layer.id}
              ref={(el) => { canvasRefs.current[layer.id] = el; }}
              className={`layer-canvas ${activeLayerId === layer.id ? 'active' : ''}`}
              style={{
                zIndex: layers.findIndex(l => l.id === layer.id) * 10,
                display: layer.visible ? 'block' : 'none',
                opacity: layer.opacity,
                width: `${canvasWidth}px`,
                height: `${canvasHeight}px`,
              }}
            />
          ))}

          {/* Active selection layer overlay */}
          {selection.active && selection.dataUrl && (
            <div
              className={`selection-overlay ${selection.isDragging ? 'dragging' : ''}`}
              style={{
                position: 'absolute',
                left: `${selection.x}px`,
                top: `${selection.y}px`,
                width: `${selection.w}px`,
                height: `${selection.h}px`,
                zIndex: 80,
                border: '1.5px dashed #0078d4',
                boxShadow: '0 0 4px rgba(0,0,0,0.2)',
                cursor: 'move',
                pointerEvents: currentTool === 'select' ? 'auto' : 'none',
              }}
            >
              <img 
                src={selection.dataUrl} 
                alt="selection" 
                style={{ width: '100%', height: '100%', pointerEvents: 'none' }} 
              />
            </div>
          )}

          {/* Temp Preview canvas */}
          <canvas
            ref={tempCanvasRef}
            className="temp-canvas"
            style={{
              zIndex: 90,
              pointerEvents: 'none',
              position: 'absolute',
              top: 0,
              left: 0,
              width: `${canvasWidth}px`,
              height: `${canvasHeight}px`,
            }}
          />

          {/* Floating HTML textarea for Text tool */}
          {textState && (
            <textarea
              ref={textInputRef}
              className="text-tool-textarea"
              style={{
                position: 'absolute',
                left: `${textState.x}px`,
                top: `${textState.y}px`,
                fontSize: `${Math.max(12, strokeWidth)}px`,
                color: strokeColor,
                zIndex: 95,
                backgroundColor: 'transparent',
                border: '1px dashed #0078d4',
                outline: 'none',
                resize: 'both',
                padding: '2px',
                lineHeight: '1.2',
                fontFamily: '"Segoe UI", sans-serif',
                overflow: 'hidden',
                minWidth: '100px',
                minHeight: '2em',
              }}
              value={textState.text}
              onChange={(e) => setTextState(prev => prev ? { ...prev, text: e.target.value } : null)}
              onBlur={commitText}
              autoFocus
            />
          )}

          {/* Canvas resizing edge handles */}
          <div 
            className="resize-handle handle-r"
            onMouseDown={(e) => handleResizeStart(e, 'r')}
            title="調整寬度"
          />
          <div 
            className="resize-handle handle-b"
            onMouseDown={(e) => handleResizeStart(e, 'b')}
            title="調整高度"
          />
          <div 
            className="resize-handle handle-br"
            onMouseDown={(e) => handleResizeStart(e, 'br')}
            title="調整大小"
          />
        </div>
      </div>
    </div>
  );
};
