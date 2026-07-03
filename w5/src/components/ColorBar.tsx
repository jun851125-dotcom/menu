import React, { useRef } from 'react';

interface ColorBarProps {
  strokeColor: string;
  setStrokeColor: (color: string) => void;
  fillColor: string;
  setFillColor: (color: string) => void;
  activeColorType: 'stroke' | 'fill';
  setActiveColorType: (type: 'stroke' | 'fill') => void;
}

export const ColorBar: React.FC<ColorBarProps> = ({
  strokeColor,
  setStrokeColor,
  fillColor,
  setFillColor,
  activeColorType,
  setActiveColorType,
}) => {
  const customColorInputRef = useRef<HTMLInputElement>(null);

  // Standard Windows-style preset colors
  const presetColors = [
    // Row 1: Classic Dark / Strong Colors
    '#000000', '#7f7f7f', '#880015', '#ed1c24', '#ff7f27', '#fff200', '#22b14c', '#00a2e8', '#3f48cc', '#a349a4',
    // Row 2: Classic Light / Pastel Colors
    '#ffffff', '#c3c3c3', '#b5e61d', '#ffaec9', '#ffc90e', '#efe4b0', '#b5e61d', '#99d9ea', '#7092be', '#c8bfe7',
    // Row 3: Modern curated vibrant colors
    '#107c41', '#0078d4', '#e81123', '#f7630c', '#fff100', '#10c056', '#00b7c3', '#0063b1', '#8764b8', '#e3008c',
  ];

  const handleColorClick = (color: string) => {
    if (activeColorType === 'stroke') {
      setStrokeColor(color);
    } else {
      setFillColor(color);
    }
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    if (activeColorType === 'stroke') {
      setStrokeColor(color);
    } else {
      setFillColor(color);
    }
  };

  const currentColorValue = activeColorType === 'stroke' ? strokeColor : fillColor;

  return (
    <div className="color-bar">
      {/* Active Color Indicators */}
      <div className="active-colors-container">
        <span className="group-label">色彩</span>
        
        <div className="indicators-wrapper">
          {/* Stroke color button */}
          <button 
            className={`color-indicator-btn stroke-indicator ${activeColorType === 'stroke' ? 'active' : ''}`}
            onClick={() => setActiveColorType('stroke')}
            title="編輯前景色 (外框/線條)"
          >
            <div className="color-preview" style={{ backgroundColor: strokeColor }}></div>
            <span className="indicator-label">前景色</span>
          </button>

          {/* Fill color button */}
          <button 
            className={`color-indicator-btn fill-indicator ${activeColorType === 'fill' ? 'active' : ''}`}
            onClick={() => setActiveColorType('fill')}
            title="編輯背景色 (填滿)"
          >
            <div className="color-preview" style={{ backgroundColor: fillColor }}></div>
            <span className="indicator-label">背景色</span>
          </button>
        </div>
      </div>

      <div className="tool-separator"></div>

      {/* Preset Palettes */}
      <div className="palettes-container">
        <div className="preset-colors-grid">
          {presetColors.map((color, index) => (
            <button
              key={`${color}-${index}`}
              className={`color-swatch ${currentColorValue.toLowerCase() === color.toLowerCase() ? 'selected' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorClick(color)}
              title={color}
            />
          ))}
        </div>
      </div>

      <div className="tool-separator"></div>

      {/* Custom Color Selector */}
      <div className="custom-color-container">
        <button 
          className="custom-color-btn"
          onClick={() => customColorInputRef.current?.click()}
          title="選擇自訂色彩"
        >
          <div className="rainbow-wheel">🌈</div>
          <span>自訂色彩</span>
        </button>
        <input 
          type="color" 
          ref={customColorInputRef}
          value={currentColorValue}
          onChange={handleCustomColorChange}
          style={{ display: 'none' }}
        />
        
        <div className="hex-input-wrapper">
          <span className="hex-prefix">#</span>
          <input 
            type="text" 
            className="hex-text-input" 
            value={currentColorValue.replace('#', '').toUpperCase()}
            onChange={(e) => {
              const val = e.target.value;
              if (/^[0-9A-Fa-f]{0,6}$/.test(val)) {
                const color = `#${val.padEnd(6, '0')}`;
                if (activeColorType === 'stroke') setStrokeColor(color);
                else setFillColor(color);
              }
            }}
            maxLength={6}
          />
        </div>
      </div>
    </div>
  );
};
