import React from 'react';
import { ZoomIn, ZoomOut } from 'lucide-react';
import type { Point } from '../types';

interface StatusBarProps {
  mousePos: Point | null;
  canvasWidth: number;
  canvasHeight: number;
  zoom: number;
  setZoom: (zoom: number) => void;
  currentTool: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  mousePos,
  canvasWidth,
  canvasHeight,
  zoom,
  setZoom,
  currentTool,
}) => {
  const zoomPercent = Math.round(zoom * 100);

  const handleZoomSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setZoom(value / 100);
  };

  const incrementZoom = () => {
    setZoom(Math.min(zoom + 0.1, 8.0));
  };

  const decrementZoom = () => {
    setZoom(Math.max(zoom - 0.1, 0.1));
  };

  const getToolDescription = () => {
    switch (currentTool) {
      case 'pencil': return '鉛筆：按住滑鼠左鍵自由繪圖';
      case 'eraser': return '橡皮擦：擦除當前圖層的內容';
      case 'fill': return '油漆桶：填充封閉區域';
      case 'picker': return '色彩滴管：在畫布上吸取顏色';
      case 'text': return '文字：點擊畫布以輸入文字';
      case 'select': return '選取：框選一個區域以移動、變形或剪切';
      case 'brush': return '畫筆：使用具有豐富質感的筆觸繪圖';
      case 'shape': return '形狀：拖曳繪製幾何形狀';
      default: return '就緒';
    }
  };

  return (
    <div className="status-bar">
      {/* Tool status / Hint */}
      <div className="status-section tool-status">
        <span className="status-icon">💡</span>
        <span className="status-text">{getToolDescription()}</span>
      </div>

      <div className="status-separator"></div>

      {/* Mouse position tracker */}
      <div className="status-section mouse-coords">
        <span className="status-icon">📍</span>
        <span className="status-text font-mono">
          {mousePos ? `${Math.round(mousePos.x)}, ${Math.round(mousePos.y)} 像素` : '—, —'}
        </span>
      </div>

      <div className="status-separator"></div>

      {/* Canvas dimensions */}
      <div className="status-section canvas-dimensions">
        <span className="status-icon">📏</span>
        <span className="status-text font-mono">
          {canvasWidth} × {canvasHeight} 像素
        </span>
      </div>

      <div className="status-separator"></div>

      {/* Zoom controls */}
      <div className="status-section zoom-controls">
        <button 
          className="zoom-btn" 
          onClick={decrementZoom} 
          disabled={zoom <= 0.1}
          title="縮小"
        >
          <ZoomOut size={14} />
        </button>
        
        <input 
          type="range"
          min="10"
          max="800"
          value={zoomPercent}
          onChange={handleZoomSliderChange}
          className="zoom-slider"
          title="調整縮放比例"
        />

        <button 
          className="zoom-btn" 
          onClick={incrementZoom} 
          disabled={zoom >= 8.0}
          title="放大"
        >
          <ZoomIn size={14} />
        </button>
        
        <span 
          className="zoom-text font-mono"
          onClick={() => setZoom(1.0)}
          title="重設為 100%"
          style={{ cursor: 'pointer' }}
        >
          {zoomPercent}%
        </span>
      </div>
    </div>
  );
};
