import React, { useState } from 'react';
import { 
  Type, Eraser, PaintBucket, Pipette, 
  RotateCw, RotateCcw, FlipHorizontal, FlipVertical, ChevronDown, 
  MousePointer, Paintbrush, Crop
} from 'lucide-react';
import type { Tool, BrushType, ShapeType, FillStyle } from '../types';

interface ToolBarProps {
  currentTool: Tool;
  setTool: (tool: Tool) => void;
  brushType: BrushType;
  setBrushType: (brush: BrushType) => void;
  shapeType: ShapeType;
  setShapeType: (shape: ShapeType) => void;
  strokeWidth: number;
  setStrokeWidth: (width: number) => void;
  fillStyle: FillStyle;
  setFillStyle: (style: FillStyle) => void;
  onRotate: (angle: number) => void;
  onFlip: (direction: 'horizontal' | 'vertical') => void;
  onCrop: () => void;
  onClear: () => void;
}

export const ToolBar: React.FC<ToolBarProps> = ({
  currentTool,
  setTool,
  brushType,
  setBrushType,
  shapeType,
  setShapeType,
  strokeWidth,
  setStrokeWidth,
  fillStyle,
  setFillStyle,
  onRotate,
  onFlip,
  onCrop,
  onClear,
}) => {
  const [showBrushes, setShowBrushes] = useState(false);
  const [showShapes, setShowShapes] = useState(false);

  // Brush list options
  const brushes: { type: BrushType; label: string; desc: string; icon: string }[] = [
    { type: 'normal', label: '一般畫筆', desc: '實心線條', icon: '🖌️' },
    { type: 'airbrush', label: '噴槍', desc: '噴砂顆粒', icon: '💨' },
    { type: 'watercolor', label: '水彩筆', desc: '透明暈染效果', icon: '🎨' },
    { type: 'crayon', label: '蠟筆', desc: '粗糙蠟筆紋理', icon: '🖍️' },
    { type: 'marker', label: '麥克筆', desc: '半透明扁平筆跡', icon: '🖊️' },
    { type: 'calligraphy', label: '書法筆', desc: '傾斜扁平筆觸', icon: '✒️' },
  ];

  // Shape list options
  const shapes: { type: ShapeType; label: string; icon: string }[] = [
    { type: 'line', label: '直線', icon: '╱' },
    { type: 'curve', label: '曲線', icon: '〰' },
    { type: 'rect', label: '矩形', icon: '▭' },
    { type: 'ellipse', label: '橢圓', icon: '◯' },
    { type: 'triangle', label: '等腰三角形', icon: '△' },
    { type: 'rightTriangle', label: '直角三角形', icon: '⊿' },
    { type: 'diamond', label: '菱形', icon: '♢' },
    { type: 'pentagon', label: '五邊形', icon: '⬠' },
    { type: 'hexagon', label: '六邊形', icon: '⬡' },
    { type: 'star', label: '五角星', icon: '⭐' },
    { type: 'arrow', label: '箭頭', icon: '➔' },
  ];

  const handleBrushSelect = (type: BrushType) => {
    setBrushType(type);
    setTool('brush');
    setShowBrushes(false);
  };

  const handleShapeSelect = (type: ShapeType) => {
    setShapeType(type);
    setTool('shape');
    setShowShapes(false);
  };

  const activeBrushLabel = brushes.find(b => b.type === brushType)?.label || '畫筆';
  const activeShapeLabel = shapes.find(s => s.type === shapeType)?.label || '形狀';

  return (
    <div className="tool-bar">
      {/* 影像區 (Image actions) */}
      <div className="tool-group">
        <span className="group-label">影像</span>
        <div className="group-buttons">
          <button 
            className={`tool-btn ${currentTool === 'select' ? 'active' : ''}`}
            onClick={() => setTool('select')}
            title="選取範圍 (剪切/移動)"
          >
            <MousePointer size={18} />
            <span className="btn-text">選取</span>
          </button>
          
          <button className="tool-btn-sm" onClick={onCrop} title="裁剪至選區">
            <Crop size={16} />
          </button>
          
          <button className="tool-btn-sm" onClick={onClear} title="清除全部內容" style={{ color: '#e81123' }}>
            🗑️
          </button>
        </div>
      </div>

      <div className="tool-separator"></div>

      {/* 旋轉/翻轉區 */}
      <div className="tool-group">
        <span className="group-label">旋轉 & 翻轉</span>
        <div className="group-buttons-grid">
          <button className="tool-btn-icon" onClick={() => onRotate(90)} title="順時針旋轉 90°">
            <RotateCw size={15} />
          </button>
          <button className="tool-btn-icon" onClick={() => onRotate(-90)} title="逆時針旋轉 90°">
            <RotateCcw size={15} />
          </button>
          <button className="tool-btn-icon" onClick={() => onFlip('horizontal')} title="水平翻轉">
            <FlipHorizontal size={15} />
          </button>
          <button className="tool-btn-icon" onClick={() => onFlip('vertical')} title="垂直翻轉">
            <FlipVertical size={15} />
          </button>
        </div>
      </div>

      <div className="tool-separator"></div>

      {/* 工具區 (Basic Tools) */}
      <div className="tool-group">
        <span className="group-label">工具</span>
        <div className="group-buttons">
          <button 
            className={`tool-btn-icon-large ${currentTool === 'pencil' ? 'active' : ''}`}
            onClick={() => setTool('pencil')}
            title="鉛筆"
          >
            ✏️
          </button>
          <button 
            className={`tool-btn-icon-large ${currentTool === 'eraser' ? 'active' : ''}`}
            onClick={() => setTool('eraser')}
            title="橡皮擦"
          >
            <Eraser size={18} />
          </button>
          <button 
            className={`tool-btn-icon-large ${currentTool === 'fill' ? 'active' : ''}`}
            onClick={() => setTool('fill')}
            title="油漆桶 (填色)"
          >
            <PaintBucket size={18} />
          </button>
          <button 
            className={`tool-btn-icon-large ${currentTool === 'picker' ? 'active' : ''}`}
            onClick={() => setTool('picker')}
            title="色彩滴管"
          >
            <Pipette size={18} />
          </button>
          <button 
            className={`tool-btn-icon-large ${currentTool === 'text' ? 'active' : ''}`}
            onClick={() => setTool('text')}
            title="文字工具"
          >
            <Type size={18} />
          </button>
        </div>
      </div>

      <div className="tool-separator"></div>

      {/* 筆刷選單 (Brushes Dropdown) */}
      <div className="tool-group relative">
        <span className="group-label">筆刷</span>
        <div className="group-buttons">
          <button 
            className={`tool-btn-dropdown ${currentTool === 'brush' ? 'active' : ''}`}
            onClick={() => {
              setShowBrushes(!showBrushes);
              setShowShapes(false);
            }}
          >
            <Paintbrush size={18} />
            <div className="dropdown-label">
              <span className="btn-label">{activeBrushLabel}</span>
              <ChevronDown size={12} />
            </div>
          </button>
          
          {showBrushes && (
            <div className="brushes-popover">
              {brushes.map((brush) => (
                <button 
                  key={brush.type}
                  className={`brush-item ${brushType === brush.type && currentTool === 'brush' ? 'selected' : ''}`}
                  onClick={() => handleBrushSelect(brush.type)}
                >
                  <span className="brush-item-icon">{brush.icon}</span>
                  <div className="brush-item-text">
                    <div className="brush-item-name">{brush.label}</div>
                    <div className="brush-item-desc">{brush.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="tool-separator"></div>

      {/* 形狀選單 (Shapes Dropdown) */}
      <div className="tool-group relative">
        <span className="group-label">形狀</span>
        <div className="group-buttons">
          <button 
            className={`tool-btn-dropdown ${currentTool === 'shape' ? 'active' : ''}`}
            onClick={() => {
              setShowShapes(!showShapes);
              setShowBrushes(false);
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>⬡</span>
            <div className="dropdown-label">
              <span className="btn-label">{activeShapeLabel}</span>
              <ChevronDown size={12} />
            </div>
          </button>

          {showShapes && (
            <div className="shapes-popover">
              <div className="shapes-grid">
                {shapes.map((shape) => (
                  <button 
                    key={shape.type}
                    className={`shape-grid-item ${shapeType === shape.type && currentTool === 'shape' ? 'selected' : ''}`}
                    onClick={() => handleShapeSelect(shape.type)}
                    title={shape.label}
                  >
                    <span className="shape-icon">{shape.icon}</span>
                    <span className="shape-text">{shape.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Fill mode toggle in shapes menu */}
              <div className="shape-fill-option">
                <span className="option-title">填滿樣式:</span>
                <div className="fill-btn-group">
                  <button 
                    className={`fill-btn-opt ${fillStyle === 'transparent' ? 'selected' : ''}`}
                    onClick={() => setFillStyle('transparent')}
                  >
                    🫙 無填滿 (透明)
                  </button>
                  <button 
                    className={`fill-btn-opt ${fillStyle === 'solid' ? 'selected' : ''}`}
                    onClick={() => setFillStyle('solid')}
                  >
                    🎨 實心填滿
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="tool-separator"></div>

      {/* 粗細設定 (Stroke width slider) */}
      <div className="tool-group px-2">
        <span className="group-label">粗細: {strokeWidth}px</span>
        <div className="group-slider-container">
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={strokeWidth} 
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))} 
            className="stroke-width-slider"
          />
          <div className="preset-sizes">
            <button className={`size-dot-btn ${strokeWidth === 2 ? 'active' : ''}`} onClick={() => setStrokeWidth(2)} title="極細 (2px)">
              <div className="dot" style={{ width: '3px', height: '3px' }}></div>
            </button>
            <button className={`size-dot-btn ${strokeWidth === 8 ? 'active' : ''}`} onClick={() => setStrokeWidth(8)} title="中 (8px)">
              <div className="dot" style={{ width: '6px', height: '6px' }}></div>
            </button>
            <button className={`size-dot-btn ${strokeWidth === 24 ? 'active' : ''}`} onClick={() => setStrokeWidth(24)} title="粗 (24px)">
              <div className="dot" style={{ width: '10px', height: '10px' }}></div>
            </button>
            <button className={`size-dot-btn ${strokeWidth === 60 ? 'active' : ''}`} onClick={() => setStrokeWidth(60)} title="特粗 (60px)">
              <div className="dot" style={{ width: '14px', height: '14px' }}></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
