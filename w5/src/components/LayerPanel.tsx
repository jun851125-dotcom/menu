import React, { useState } from 'react';
import { Plus, Trash2, Eye, EyeOff, ChevronUp, ChevronDown, Layers, Edit2, Check } from 'lucide-react';
import type { LayerState } from '../types';

interface LayerPanelProps {
  layers: LayerState[];
  activeLayerId: string;
  setActiveLayerId: (id: string) => void;
  onAddLayer: () => void;
  onDeleteLayer: (id: string) => void;
  onUpdateLayer: (id: string, updates: Partial<LayerState>) => void;
  onMoveLayer: (id: string, direction: 'up' | 'down') => void;
  onMergeLayer: (id: string) => void; // Merge active layer down
}

export const LayerPanel: React.FC<LayerPanelProps> = ({
  layers,
  activeLayerId,
  setActiveLayerId,
  onAddLayer,
  onDeleteLayer,
  onUpdateLayer,
  onMoveLayer,
  onMergeLayer,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const startRename = (layer: LayerState) => {
    setEditingId(layer.id);
    setEditName(layer.name);
  };

  const finishRename = (id: string) => {
    if (editName.trim()) {
      onUpdateLayer(id, { name: editName.trim() });
    }
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter') {
      finishRename(id);
    } else if (e.key === 'Escape') {
      setEditingId(null);
    }
  };

  // Find index of active layer to know if it can be merged down or moved
  const activeIndex = layers.findIndex(l => l.id === activeLayerId);
  const canMoveUp = activeIndex > 0;
  const canMoveDown = activeIndex < layers.length - 1;
  const canMergeDown = activeIndex < layers.length - 1; // Merge with the one below (index + 1)

  return (
    <div className="layer-panel">
      <div className="panel-header">
        <Layers size={16} />
        <span className="panel-title">圖層</span>
        <button className="panel-header-btn" onClick={onAddLayer} title="新增圖層">
          <Plus size={16} />
        </button>
      </div>

      <div className="layers-list">
        {/* Render layers (we render top layer first, so we reverse the array order or index check) */}
        {[...layers].reverse().map((layer) => {
          const isActive = layer.id === activeLayerId;
          const isEditing = layer.id === editingId;

          return (
            <div 
              key={layer.id} 
              className={`layer-item ${isActive ? 'active' : ''} ${!layer.visible ? 'hidden-layer' : ''}`}
              onClick={() => setActiveLayerId(layer.id)}
            >
              {/* Visibility eye toggle */}
              <button 
                className="layer-visibility-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateLayer(layer.id, { visible: !layer.visible });
                }}
                title={layer.visible ? '隱藏圖層' : '顯示圖層'}
              >
                {layer.visible ? <Eye size={15} /> : <EyeOff size={15} style={{ opacity: 0.5 }} />}
              </button>

              {/* Layer Thumbnail Placeholder / Preview */}
              <div className="layer-thumbnail">
                {layer.dataUrl ? (
                  <img src={layer.dataUrl} alt="thumbnail" className="thumbnail-img" />
                ) : (
                  <div className="thumbnail-empty"></div>
                )}
              </div>

              {/* Layer Name / Rename input */}
              <div className="layer-details">
                {isEditing ? (
                  <input
                    type="text"
                    className="layer-name-input"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={() => finishRename(layer.id)}
                    onKeyDown={(e) => handleKeyDown(e, layer.id)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <span className="layer-name" onDoubleClick={() => startRename(layer)}>
                    {layer.name}
                  </span>
                )}
              </div>

              {/* Actions group */}
              <div className="layer-actions" onClick={(e) => e.stopPropagation()}>
                {isEditing ? (
                  <button className="layer-action-btn check" onClick={() => finishRename(layer.id)}>
                    <Check size={14} />
                  </button>
                ) : (
                  <button className="layer-action-btn edit" onClick={() => startRename(layer)} title="重新命名">
                    <Edit2 size={13} />
                  </button>
                )}
                <button 
                  className="layer-action-btn delete" 
                  onClick={() => onDeleteLayer(layer.id)}
                  disabled={layers.length <= 1}
                  title="刪除圖層"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Layer Operations Footer */}
      {layers.length > 0 && (
        <div className="layer-footer">
          {/* Opacity control for the active layer */}
          <div className="opacity-slider-container">
            <span className="opacity-label">不透明度:</span>
            <input 
              type="range"
              min="0"
              max="100"
              value={Math.round((layers.find(l => l.id === activeLayerId)?.opacity || 1) * 100)}
              onChange={(e) => {
                const opacityVal = parseFloat(e.target.value) / 100;
                onUpdateLayer(activeLayerId, { opacity: opacityVal });
              }}
              className="opacity-slider"
            />
            <span className="opacity-val">
              {Math.round((layers.find(l => l.id === activeLayerId)?.opacity || 1) * 100)}%
            </span>
          </div>

          <div className="layer-order-btns">
            <button 
              className="layer-order-btn" 
              onClick={() => onMoveLayer(activeLayerId, 'up')}
              disabled={!canMoveUp}
              title="向上移動圖層"
            >
              <ChevronUp size={16} />
              <span>上移</span>
            </button>
            <button 
              className="layer-order-btn" 
              onClick={() => onMoveLayer(activeLayerId, 'down')}
              disabled={!canMoveDown}
              title="向下移動圖層"
            >
              <ChevronDown size={16} />
              <span>下移</span>
            </button>
            <button 
              className="layer-order-btn merge" 
              onClick={() => onMergeLayer(activeLayerId)}
              disabled={!canMergeDown}
              title="向下合併圖層"
            >
              🥞
              <span>向下合併</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
