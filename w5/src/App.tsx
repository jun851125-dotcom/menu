import React, { useState, useEffect } from 'react';
import { MenuBar } from './components/MenuBar';
import { ToolBar } from './components/ToolBar';
import { ColorBar } from './components/ColorBar';
import { CanvasArea } from './components/CanvasArea';
import { LayerPanel } from './components/LayerPanel';
import { StatusBar } from './components/StatusBar';
import type { LayerState, Tool, BrushType, ShapeType, FillStyle, Point, HistoryStep } from './types';

const DEFAULT_WIDTH = 800;
const DEFAULT_HEIGHT = 600;

export const App: React.FC = () => {
  // Application settings & configurations
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [canvasWidth, setCanvasWidth] = useState<number>(DEFAULT_WIDTH);
  const [canvasHeight, setCanvasHeight] = useState<number>(DEFAULT_HEIGHT);
  const [zoom, setZoom] = useState<number>(1.0);
  const [mousePos, setMousePos] = useState<Point | null>(null);

  // Colors
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [fillColor, setFillColor] = useState<string>('#ffffff');
  const [activeColorType, setActiveColorType] = useState<'stroke' | 'fill'>('stroke');

  // Drawing Tools
  const [currentTool, setCurrentTool] = useState<Tool>('pencil');
  const [brushType, setBrushType] = useState<BrushType>('normal');
  const [shapeType, setShapeType] = useState<ShapeType>('line');
  const [strokeWidth, setStrokeWidth] = useState<number>(4);
  const [fillStyle, setFillStyle] = useState<FillStyle>('transparent');

  // Layers state
  const [layers, setLayers] = useState<LayerState[]>([
    {
      id: 'layer-1',
      name: '圖層 1',
      visible: true,
      opacity: 1.0,
      dataUrl: '', // Initialized empty
    },
  ]);
  const [activeLayerId, setActiveLayerId] = useState<string>('layer-1');

  // History stacks
  const [undoStack, setUndoStack] = useState<HistoryStep[]>([]);
  const [redoStack, setRedoStack] = useState<HistoryStep[]>([]);

  // Listen for the custom color picker event from the canvas eyedropper tool
  useEffect(() => {
    const handleColorPicked = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      if (activeColorType === 'stroke') {
        setStrokeColor(customEvent.detail);
      } else {
        setFillColor(customEvent.detail);
      }
      // Revert tool back to pencil or brush
      setCurrentTool('pencil');
    };
    window.addEventListener('color-picked', handleColorPicked);
    return () => window.removeEventListener('color-picked', handleColorPicked);
  }, [activeColorType]);

  // Keep theme dark-mode CSS class updated on body element
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [isDarkMode]);

  // Push a state onto the history stack
  const saveHistoryState = (
    currentLayers: LayerState[] = layers,
    activeId: string = activeLayerId,
    w: number = canvasWidth,
    h: number = canvasHeight
  ) => {
    // Deep clone the layers structure
    const clonedLayers = currentLayers.map(l => ({ ...l }));
    const step: HistoryStep = {
      layers: clonedLayers,
      activeLayerId: activeId,
      canvasWidth: w,
      canvasHeight: h,
    };
    
    setUndoStack((prev) => {
      const newStack = [...prev, step];
      if (newStack.length > 30) {
        newStack.shift(); // Keep limit to 30 states
      }
      return newStack;
    });
    setRedoStack([]); // Clear redo stack on new action
  };

  // Capture the initial blank canvas state in history once initialized
  useEffect(() => {
    if (undoStack.length === 0) {
      saveHistoryState(layers, activeLayerId, canvasWidth, canvasHeight);
    }
  }, []);

  // Undo operation
  const handleUndo = () => {
    if (undoStack.length <= 1) return; // Need to keep the first state

    // Pop the current state and put it on redo stack
    const currentStep: HistoryStep = {
      layers: layers.map(l => ({ ...l })),
      activeLayerId,
      canvasWidth,
      canvasHeight,
    };

    const newUndoStack = [...undoStack];
    newUndoStack.pop(); // This was the current state
    const targetStep = newUndoStack[newUndoStack.length - 1]; // This is the state to restore

    if (targetStep) {
      setLayers(targetStep.layers);
      setActiveLayerId(targetStep.activeLayerId);
      setCanvasWidth(targetStep.canvasWidth);
      setCanvasHeight(targetStep.canvasHeight);
      setUndoStack(newUndoStack);
      setRedoStack(prev => [...prev, currentStep]);
    }
  };

  // Redo operation
  const handleRedo = () => {
    if (redoStack.length === 0) return;

    const newRedoStack = [...redoStack];
    const nextStep = newRedoStack.pop();

    if (nextStep) {
      // Put current state on undo stack
      const currentStep: HistoryStep = {
        layers: layers.map(l => ({ ...l })),
        activeLayerId,
        canvasWidth,
        canvasHeight,
      };

      setUndoStack(prev => [...prev, currentStep]);
      setLayers(nextStep.layers);
      setActiveLayerId(nextStep.activeLayerId);
      setCanvasWidth(nextStep.canvasWidth);
      setCanvasHeight(nextStep.canvasHeight);
      setRedoStack(newRedoStack);
    }
  };

  // Update canvas size from settings/resize actions
  const handleCanvasResize = (newW: number, newH: number) => {
    // When resizing, we do not wipe content. CanvasArea will redraw existing layers.
    setCanvasWidth(newW);
    setCanvasHeight(newH);
    // Commit to history after resize finishes
    saveHistoryState(layers, activeLayerId, newW, newH);
  };

  // Handle Layer Canvas drawing commit
  const handleDrawEnd = (layerId: string, dataUrl: string) => {
    const updatedLayers = layers.map(l => l.id === layerId ? { ...l, dataUrl } : l);
    setLayers(updatedLayers);
    saveHistoryState(updatedLayers, activeLayerId, canvasWidth, canvasHeight);
  };

  // 1. Create a New Document
  const handleNew = () => {
    if (window.confirm('確定要開新檔案嗎？未儲存的工作將會遺失。')) {
      const initialLayers: LayerState[] = [
        {
          id: 'layer-1',
          name: '圖層 1',
          visible: true,
          opacity: 1.0,
          dataUrl: '',
        },
      ];
      setLayers(initialLayers);
      setActiveLayerId('layer-1');
      setCanvasWidth(DEFAULT_WIDTH);
      setCanvasHeight(DEFAULT_HEIGHT);
      setZoom(1.0);
      setUndoStack([]);
      setRedoStack([]);
      
      // Save initial state in new stack
      const step: HistoryStep = {
        layers: initialLayers.map(l => ({ ...l })),
        activeLayerId: 'layer-1',
        canvasWidth: DEFAULT_WIDTH,
        canvasHeight: DEFAULT_HEIGHT,
      };
      setUndoStack([step]);
    }
  };

  // 2. Open File
  const handleOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Set canvas to the image's dimensions
        const newW = img.width;
        const newH = img.height;
        
        // We create a new layer with this image loaded
        const newLayerId = `layer-${Date.now()}`;
        const newLayers: LayerState[] = [
          {
            id: newLayerId,
            name: file.name.split('.')[0] || '匯入圖層',
            visible: true,
            opacity: 1.0,
            dataUrl: img.src,
          },
        ];

        setCanvasWidth(newW);
        setCanvasHeight(newH);
        setLayers(newLayers);
        setActiveLayerId(newLayerId);
        setZoom(1.0);
        
        saveHistoryState(newLayers, newLayerId, newW, newH);
      };
    };
    reader.readAsDataURL(file);
  };

  // 3. Export PNG / JPG File
  const handleSave = () => {
    // Merge all visible layers into a single canvas for download
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = canvasWidth;
    exportCanvas.height = canvasHeight;
    const ctx = exportCanvas.getContext('2d');
    if (!ctx) return;

    // Fill white background for exports
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    let drawPromises = layers.map((layer) => {
      return new Promise<void>((resolve) => {
        if (!layer.visible || !layer.dataUrl) {
          resolve();
          return;
        }

        const img = new Image();
        img.src = layer.dataUrl;
        img.onload = () => {
          ctx.save();
          ctx.globalAlpha = layer.opacity;
          ctx.drawImage(img, 0, 0);
          ctx.restore();
          resolve();
        };
        img.onerror = () => resolve();
      });
    });

    Promise.all(drawPromises).then(() => {
      const link = document.createElement('a');
      link.download = 'my-drawing.png';
      link.href = exportCanvas.toDataURL('image/png');
      link.click();
    });
  };

  // 4. Rotate Canvas (90 or -90 deg)
  const handleRotate = (angle: number) => {
    // Rotation interchanges width and height
    const newW = canvasHeight;
    const newH = canvasWidth;

    const rotatedPromises = layers.map((layer) => {
      return new Promise<LayerState>((resolve) => {
        if (!layer.dataUrl) {
          resolve({ ...layer });
          return;
        }

        const img = new Image();
        img.src = layer.dataUrl;
        img.onload = () => {
          const rotCanvas = document.createElement('canvas');
          rotCanvas.width = newW;
          rotCanvas.height = newH;
          const rotCtx = rotCanvas.getContext('2d');
          if (rotCtx) {
            rotCtx.translate(newW / 2, newH / 2);
            rotCtx.rotate((angle * Math.PI) / 180);
            rotCtx.drawImage(img, -canvasWidth / 2, -canvasHeight / 2);
            resolve({ ...layer, dataUrl: rotCanvas.toDataURL() });
          } else {
            resolve({ ...layer });
          }
        };
        img.onerror = () => resolve({ ...layer });
      });
    });

    Promise.all(rotatedPromises).then((newLayers) => {
      setCanvasWidth(newW);
      setCanvasHeight(newH);
      setLayers(newLayers);
      saveHistoryState(newLayers, activeLayerId, newW, newH);
    });
  };

  // 5. Flip Image horizontally or vertically
  const handleFlip = (direction: 'horizontal' | 'vertical') => {
    const flippedPromises = layers.map((layer) => {
      return new Promise<LayerState>((resolve) => {
        if (!layer.dataUrl) {
          resolve({ ...layer });
          return;
        }

        const img = new Image();
        img.src = layer.dataUrl;
        img.onload = () => {
          const flipCanvas = document.createElement('canvas');
          flipCanvas.width = canvasWidth;
          flipCanvas.height = canvasHeight;
          const flipCtx = flipCanvas.getContext('2d');
          if (flipCtx) {
            if (direction === 'horizontal') {
              flipCtx.scale(-1, 1);
              flipCtx.drawImage(img, -canvasWidth, 0);
            } else {
              flipCtx.scale(1, -1);
              flipCtx.drawImage(img, 0, -canvasHeight);
            }
            resolve({ ...layer, dataUrl: flipCanvas.toDataURL() });
          } else {
            resolve({ ...layer });
          }
        };
        img.onerror = () => resolve({ ...layer });
      });
    });

    Promise.all(flippedPromises).then((newLayers) => {
      setLayers(newLayers);
      saveHistoryState(newLayers, activeLayerId, canvasWidth, canvasHeight);
    });
  };

  // 6. Crop Canvas: Crop canvas size to active selection coordinates
  const handleCrop = () => {
    alert('提示：小畫家選區裁剪會以當前選區大小為基礎調整畫布。請使用「選取工具」選取畫布內容後，點擊此按鈕裁剪畫布。');
  };

  // 7. Clear canvas content
  const handleClear = () => {
    if (window.confirm('確定要清除當前圖層的全部內容嗎？')) {
      const updatedLayers = layers.map((l) =>
        l.id === activeLayerId ? { ...l, dataUrl: '' } : l
      );
      setLayers(updatedLayers);
      saveHistoryState(updatedLayers, activeLayerId, canvasWidth, canvasHeight);
    }
  };

  // Layers panel callbacks
  const handleAddLayer = () => {
    const newId = `layer-${Date.now()}`;
    const newLayers = [
      ...layers,
      {
        id: newId,
        name: `圖層 ${layers.length + 1}`,
        visible: true,
        opacity: 1.0,
        dataUrl: '',
      },
    ];
    setLayers(newLayers);
    setActiveLayerId(newId);
    saveHistoryState(newLayers, newId, canvasWidth, canvasHeight);
  };

  const handleDeleteLayer = (id: string) => {
    if (layers.length <= 1) return; // Keep at least one layer
    const newLayers = layers.filter(l => l.id !== id);
    let newActiveId = activeLayerId;
    if (activeLayerId === id) {
      // Set to adjacent layer
      const deletedIndex = layers.findIndex(l => l.id === id);
      const fallbackIndex = deletedIndex > 0 ? deletedIndex - 1 : 0;
      newActiveId = newLayers[fallbackIndex].id;
    }
    setLayers(newLayers);
    setActiveLayerId(newActiveId);
    saveHistoryState(newLayers, newActiveId, canvasWidth, canvasHeight);
  };

  const handleUpdateLayer = (id: string, updates: Partial<LayerState>) => {
    const updated = layers.map(l => l.id === id ? { ...l, ...updates } : l);
    setLayers(updated);
    // Don't save history state on slider slide to avoid dragging pollution,
    // but do save on toggling visibility or finished adjustments.
    if (updates.visible !== undefined || updates.name !== undefined) {
      saveHistoryState(updated, activeLayerId, canvasWidth, canvasHeight);
    }
  };

  const handleMoveLayer = (id: string, direction: 'up' | 'down') => {
    const index = layers.findIndex(l => l.id === id);
    if (index === -1) return;
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === layers.length - 1) return;

    const newLayers = [...layers];
    const swapWithIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap layers
    const temp = newLayers[index];
    newLayers[index] = newLayers[swapWithIndex];
    newLayers[swapWithIndex] = temp;

    setLayers(newLayers);
    saveHistoryState(newLayers, activeLayerId, canvasWidth, canvasHeight);
  };

  const handleMergeLayer = (id: string) => {
    const index = layers.findIndex(l => l.id === id);
    if (index === layers.length - 1) return; // Can't merge down bottom layer

    const targetLayer = layers[index + 1]; // The layer underneath

    // Load active layer image and target layer image, draw them together
    const mergeCanvas = document.createElement('canvas');
    mergeCanvas.width = canvasWidth;
    mergeCanvas.height = canvasHeight;
    const mergeCtx = mergeCanvas.getContext('2d');
    if (!mergeCtx) return;

    const imgTarget = new Image();
    const imgActive = new Image();

    // Promises sequence to merge properly
    const loadTarget = () => new Promise<void>((res) => {
      if (!targetLayer.dataUrl) {
        res();
        return;
      }
      imgTarget.src = targetLayer.dataUrl;
      imgTarget.onload = () => {
        mergeCtx.save();
        mergeCtx.globalAlpha = targetLayer.opacity;
        mergeCtx.drawImage(imgTarget, 0, 0);
        mergeCtx.restore();
        res();
      };
      imgTarget.onerror = () => res();
    });

    const loadActive = () => new Promise<void>((res) => {
      const activeLayer = layers[index];
      if (!activeLayer.dataUrl) {
        res();
        return;
      }
      imgActive.src = activeLayer.dataUrl;
      imgActive.onload = () => {
        mergeCtx.save();
        mergeCtx.globalAlpha = activeLayer.opacity;
        mergeCtx.drawImage(imgActive, 0, 0);
        mergeCtx.restore();
        res();
      };
      imgActive.onerror = () => res();
    });

    Promise.all([loadTarget(), loadActive()]).then(() => {
      const mergedDataUrl = mergeCanvas.toDataURL();
      
      // Update target layer with merged data, and delete current active layer
      const newLayers = layers.filter(l => l.id !== id).map(l => 
        l.id === targetLayer.id ? { ...l, dataUrl: mergedDataUrl, opacity: 1.0 } : l
      );

      setLayers(newLayers);
      setActiveLayerId(targetLayer.id);
      saveHistoryState(newLayers, targetLayer.id, canvasWidth, canvasHeight);
    });
  };

  return (
    <div className={`app-shell ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      {/* 1. Menu Bar */}
      <MenuBar
        onNew={handleNew}
        onOpen={handleOpen}
        onSave={handleSave}
        onUndo={handleUndo}
        onRedo={handleRedo}
        canUndo={undoStack.length > 1}
        canRedo={redoStack.length > 0}
        zoom={zoom}
        setZoom={setZoom}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
      />

      {/* Ribbon Panels Wrapper */}
      <div className="ribbon-panels">
        {/* 2. Ribbon Tool Bar */}
        <ToolBar
          currentTool={currentTool}
          setTool={setCurrentTool}
          brushType={brushType}
          setBrushType={setBrushType}
          shapeType={shapeType}
          setShapeType={setShapeType}
          strokeWidth={strokeWidth}
          setStrokeWidth={setStrokeWidth}
          fillStyle={fillStyle}
          setFillStyle={setFillStyle}
          onRotate={handleRotate}
          onFlip={handleFlip}
          onCrop={handleCrop}
          onClear={handleClear}
        />

        {/* 3. Color Selection Bar */}
        <ColorBar
          strokeColor={strokeColor}
          setStrokeColor={setStrokeColor}
          fillColor={fillColor}
          setFillColor={setFillColor}
          activeColorType={activeColorType}
          setActiveColorType={setActiveColorType}
        />
      </div>

      {/* Main Workspace (Canvas area & Sidebar Panels) */}
      <div className="workspace-container">
        <div className="workspace-main">
          {/* 4. Canvas Viewport */}
          <CanvasArea
            layers={layers}
            activeLayerId={activeLayerId}
            currentTool={currentTool}
            brushType={brushType}
            shapeType={shapeType}
            strokeWidth={strokeWidth}
            strokeColor={strokeColor}
            fillColor={fillColor}
            fillStyle={fillStyle}
            canvasWidth={canvasWidth}
            canvasHeight={canvasHeight}
            zoom={zoom}
            setZoom={setZoom}
            onCanvasResize={handleCanvasResize}
            onDrawEnd={handleDrawEnd}
            onLayersChange={setLayers}
            setMousePos={setMousePos}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* 5. Right Sidebar (Layers panel) */}
        <div className="workspace-sidebar">
          <LayerPanel
            layers={layers}
            activeLayerId={activeLayerId}
            setActiveLayerId={setActiveLayerId}
            onAddLayer={handleAddLayer}
            onDeleteLayer={handleDeleteLayer}
            onUpdateLayer={handleUpdateLayer}
            onMoveLayer={handleMoveLayer}
            onMergeLayer={handleMergeLayer}
          />
        </div>
      </div>

      {/* 6. Footer Status Bar */}
      <StatusBar
        mousePos={mousePos}
        canvasWidth={canvasWidth}
        canvasHeight={canvasHeight}
        zoom={zoom}
        setZoom={setZoom}
        currentTool={currentTool}
      />
    </div>
  );
};

export default App;
