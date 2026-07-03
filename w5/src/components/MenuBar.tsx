import React, { useState, useRef, useEffect } from 'react';
import { FolderOpen, FilePlus, Save, Undo2, Redo2, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

interface MenuBarProps {
  onNew: () => void;
  onOpen: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  zoom: number;
  setZoom: (zoom: number) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
}

export const MenuBar: React.FC<MenuBarProps> = ({
  onNew,
  onOpen,
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  zoom,
  setZoom,
  isDarkMode,
  setIsDarkMode,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = (menuName: string) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const handleOpenClick = () => {
    fileInputRef.current?.click();
    setActiveMenu(null);
  };

  return (
    <div className="menu-bar" ref={menuRef}>
      <div className="menu-items">
        {/* Logo and title */}
        <div className="app-logo">
          <div className="logo-icon">🎨</div>
          <span className="app-name">未命名 - 小畫家</span>
        </div>

        {/* File Menu */}
        <div className={`menu-item-container ${activeMenu === 'file' ? 'active' : ''}`}>
          <button className="menu-btn" onClick={() => toggleMenu('file')}>
            檔案
          </button>
          {activeMenu === 'file' && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => { onNew(); setActiveMenu(null); }}>
                <FilePlus size={16} />
                <span>開新檔案</span>
                <span className="shortcut">Ctrl+N</span>
              </button>
              <button className="dropdown-item" onClick={handleOpenClick}>
                <FolderOpen size={16} />
                <span>開啟舊檔...</span>
                <span className="shortcut">Ctrl+O</span>
              </button>
              <button className="dropdown-item" onClick={() => { onSave(); setActiveMenu(null); }}>
                <Save size={16} />
                <span>儲存檔案</span>
                <span className="shortcut">Ctrl+S</span>
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={onOpen}
              />
            </div>
          )}
        </div>

        {/* Edit Menu */}
        <div className={`menu-item-container ${activeMenu === 'edit' ? 'active' : ''}`}>
          <button className="menu-btn" onClick={() => toggleMenu('edit')}>
            編輯
          </button>
          {activeMenu === 'edit' && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => { onUndo(); setActiveMenu(null); }} disabled={!canUndo}>
                <Undo2 size={16} />
                <span>復原</span>
                <span className="shortcut">Ctrl+Z</span>
              </button>
              <button className="dropdown-item" onClick={() => { onRedo(); setActiveMenu(null); }} disabled={!canRedo}>
                <Redo2 size={16} />
                <span>重做</span>
                <span className="shortcut">Ctrl+Y</span>
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className={`menu-item-container ${activeMenu === 'view' ? 'active' : ''}`}>
          <button className="menu-btn" onClick={() => toggleMenu('view')}>
            檢視
          </button>
          {activeMenu === 'view' && (
            <div className="dropdown-menu">
              <button className="dropdown-item" onClick={() => { setZoom(Math.min(zoom + 0.25, 8.0)); setActiveMenu(null); }}>
                <ZoomIn size={16} />
                <span>放大</span>
                <span className="shortcut">Ctrl +</span>
              </button>
              <button className="dropdown-item" onClick={() => { setZoom(Math.max(zoom - 0.25, 0.1)); setActiveMenu(null); }}>
                <ZoomOut size={16} />
                <span>縮小</span>
                <span className="shortcut">Ctrl -</span>
              </button>
              <button className="dropdown-item" onClick={() => { setZoom(1.0); setActiveMenu(null); }}>
                <Maximize size={16} />
                <span>實際大小 (100%)</span>
                <span className="shortcut">Ctrl+0</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Quick Action Buttons */}
      <div className="quick-actions">
        <button 
          className="action-icon-btn" 
          onClick={onUndo} 
          disabled={!canUndo} 
          title="復原 (Ctrl+Z)"
        >
          <Undo2 size={16} />
        </button>
        <button 
          className="action-icon-btn" 
          onClick={onRedo} 
          disabled={!canRedo} 
          title="重做 (Ctrl+Y)"
        >
          <Redo2 size={16} />
        </button>
        <div className="divider"></div>
        <button 
          className="theme-toggle-btn"
          onClick={() => setIsDarkMode(!isDarkMode)}
          title={isDarkMode ? '切換為亮色模式' : '切換為暗色模式'}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </div>
  );
};
