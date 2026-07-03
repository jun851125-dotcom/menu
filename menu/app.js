const PROJECTS = [
  {
    id: 'w1',
    title: '蕭福星 | 資訊組長 - 個人介紹',
    category: '個人履歷',
    icon: '👔',
    path: '../w1/index.html',
    desc: '資訊組長的專業個人簡歷網頁，展現個人資歷、專業技能與教學成果。擁有現代化的排版與清晰流暢的資訊架構。',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    color: '#3b82f6' // Blue
  },
  {
    id: 'w2',
    title: 'AURA CAFÉ - 極致奢華黑金咖啡沙龍',
    category: '網頁設計',
    icon: '☕',
    path: '../w2/index.html',
    desc: '奢華風格的黑金咖啡廳品牌登陸頁面。採用極致黑金美學、精緻卡片排版與優雅的懸停微動畫，烘托高端沙龍的奢華感。',
    tech: ['HTML5', 'CSS Grid', 'Custom Properties', 'Micro-Animations'],
    color: '#a855f7' // Purple
  },
  {
    id: 'w3',
    title: 'AI 指揮官教室助手',
    category: '實用工具',
    icon: '🤖',
    path: '../w3/index.html',
    desc: '專為課堂設計的 AI 工具箱，整合語音朗讀、隨機抽籤、課堂計時等實用教學輔助功能，介面直觀且富含科技感。',
    tech: ['Web Speech API', 'HTML5 Canvas', 'CSS Glassmorphism', 'JavaScript'],
    color: '#06b6d4' // Cyan
  },
  {
    id: 'w4',
    title: 'AIGravity MV - 頂級 AI MV 影像製作平台',
    category: '網頁設計',
    icon: '🎬',
    path: '../w4/index.html',
    desc: '高端 AI MV 影像製作與招商合作推廣平台。使用暗色調與極富質感的玻璃擬物化風格，展現前沿人工智慧視覺技術。',
    tech: ['HTML5', 'CSS Glassmorphism', 'Dynamic Sliders', 'Interactions'],
    color: '#a855f7' // Purple
  },
  {
    id: 'w5',
    title: 'React 專業圖層畫板',
    category: '實用工具',
    icon: '🖌️',
    path: '../w5/dist/index.html',
    desc: '基於 React 開發的專業繪圖工具。支援多圖層管理、混色、多種畫筆形狀與歷史紀錄 (撤銷/重做)，堪比網頁版 Photoshop。',
    tech: ['React 18', 'TypeScript', 'Vite', 'HTML5 Canvas', 'Layer Logic'],
    color: '#06b6d4' // Cyan
  },
  {
    id: 'w6',
    title: '小畫家',
    category: '實用工具',
    icon: '🎨',
    path: '../w6/index.html',
    desc: '經典簡潔的 Canvas 繪圖工具。支援自由畫筆、粗細調整、調色盤選擇以及清除畫布等基礎創作功能，載入迅速、操作直覺。',
    tech: ['HTML5 Canvas', 'CSS Variables', 'JavaScript Events'],
    color: '#06b6d4' // Cyan
  },
  {
    id: 'w7',
    title: 'Lo-Fi 音樂動畫產生器 - FUSHING',
    category: '視覺藝術',
    icon: '🎵',
    path: '../w7/index.html',
    desc: '結合視覺與聽覺的 Lo-Fi 動畫氛圍產生器。可在播放悠閒 Lo-Fi 背景音樂的同時，在 Canvas 上渲染出動態變化的像素雨景。',
    tech: ['HTML5 Canvas', 'Audio Engine', 'Particle Physics', 'CSS Animations'],
    color: '#10b981' // Green
  },
  {
    id: 'w8',
    title: 'Papagaio - 巴西葡萄牙語學習遊戲',
    category: '學習教育',
    icon: '🦜',
    path: '../w8/index.html',
    desc: '以可愛巴西鸚鵡為主角的葡萄牙語單字闖關遊戲。將學習融入活潑的卡通問答與音效互動中，讓語文學習趣味十足。',
    tech: ['Web Audio API', 'Game Logic', 'CSS Animations', 'Local State'],
    color: '#eab308' // Yellow
  },
  {
    id: 'w9',
    title: 'Aprender! 巴西葡萄牙語學習樂園',
    category: '學習教育',
    icon: '🗣️',
    path: '../w9/index.html',
    desc: '互動式葡萄牙語學習平台。內建核心字彙卡片、發音示範、以及互動測驗，幫助學習者打下扎實的聽說基礎。',
    tech: ['Speech Synthesis', 'Dynamic Audio', 'Quiz Engine', 'Vocabulary Store'],
    color: '#eab308' // Yellow
  },
  {
    id: 'w10',
    title: 'Learn! 英語學習樂園 (PWA)',
    category: '學習教育',
    icon: '🇬🇧',
    path: '../w10/index.html',
    desc: '支持離線使用的 Progressive Web App (PWA) 英語字彙學習樂園。具備 Service Worker 快取，讓你在無網路環境下也能學習。',
    tech: ['PWA Spec', 'Service Worker', 'Cache Storage', 'Manifest.json'],
    color: '#eab308' // Yellow
  },
  {
    id: 'w11',
    title: 'NEON TYPE SHOOTER - 打字射擊遊戲',
    category: '遊戲娛樂',
    icon: '⚡',
    path: '../w11/index.html',
    desc: '炫酷霓虹風格的打字射擊遊戲。玩家需快速輸入落下的英文單字發射光束消滅障礙物，結合音效與震動回饋，爽度爆表。',
    tech: ['HTML5 Canvas', 'Game Loop', 'Collision Detection', 'Keyboard Events'],
    color: '#ec4899' // Pink
  },
  {
    id: 'w12',
    title: 'CyberBreak - 霓虹打磚塊',
    category: '遊戲娛樂',
    icon: '🧱',
    path: '../w12/index.html',
    desc: '賽博朋克復古霓虹打磚塊遊戲。擁有多層級碰撞物理計算、炫目的粒子碎裂特效、以及不斷提升的難度關卡與音效。',
    tech: ['Canvas Physics', 'Particle System', 'Level System', 'Retro Audio'],
    color: '#ec4899' // Pink
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('project-grid');
  const filterBtns = document.querySelectorAll('.filter-btn');
  const sandbox = document.getElementById('sandbox');
  const sandboxIframe = document.getElementById('sandbox-iframe');
  const sandboxSidebar = document.getElementById('sandbox-sidebar');
  const closeSandbox = document.getElementById('close-sandbox');
  const openNewTab = document.getElementById('open-new-tab');
  const deviceBtns = document.querySelectorAll('.device-btn');
  const viewportFrame = document.getElementById('viewport-frame');
  const addressUrl = document.getElementById('address-url');

  let activeProject = null;

  // Render Projects Grid
  function renderProjects(category = 'All') {
    grid.innerHTML = '';
    
    const filtered = category === 'All' 
      ? PROJECTS 
      : PROJECTS.filter(p => p.category === category);

    filtered.forEach(project => {
      const card = document.createElement('div');
      card.className = 'project-card';
      card.style.setProperty('--category-bg', project.color);
      
      const techBadges = project.tech.map(t => `<span class="tech-badge">${t}</span>`).join('');

      card.innerHTML = `
        <div class="card-header-visual" style="background: linear-gradient(135deg, ${project.color}15, ${project.color}35)">
          <span class="folder-badge">${project.id}</span>
          <span class="category-tag" style="background: ${project.color}">${project.category}</span>
          <div class="project-icon-wrapper">${project.icon}</div>
        </div>
        <div class="card-body">
          <h3 class="project-title">${project.title}</h3>
          <p class="project-desc">${project.desc}</p>
          <div class="tech-list">${techBadges}</div>
          <div class="card-actions">
            <button class="btn btn-primary btn-preview-trigger" data-id="${project.id}">
              <span class="btn-icon">👁️</span> 預覽功能
            </button>
            <a href="${project.path}" target="_blank" class="btn btn-secondary">
              <span class="btn-icon">🔗</span> 新分頁開啟
            </a>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Add event listeners to preview buttons
    document.querySelectorAll('.btn-preview-trigger').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        openPreview(id);
      });
    });
  }

  // Handle Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      renderProjects(cat);
    });
  });

  // Open Sandbox Preview
  function openPreview(id) {
    const project = PROJECTS.find(p => p.id === id);
    if (!project) return;
    
    activeProject = project;
    
    // Set Sidebar Details
    sandboxSidebar.style.setProperty('--category-bg', project.color);
    sandboxSidebar.innerHTML = `
      <div class="sidebar-header">
        <span class="sidebar-folder">${project.id.toUpperCase()} 資料夾</span>
        <h2 class="sidebar-title">${project.title}</h2>
        <span class="sidebar-cat" style="background: ${project.color}">${project.category}</span>
      </div>
      <div class="sidebar-body">
        <span class="sidebar-section-title">功能簡介</span>
        <p class="sidebar-desc">${project.desc}</p>
        
        <span class="sidebar-section-title">核心技術</span>
        <div class="sidebar-tech-list">
          ${project.tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
        </div>
      </div>
      <div class="sidebar-footer">
        <a href="${project.path}" target="_blank" class="btn btn-primary" style="background: linear-gradient(135deg, ${project.color}, ${project.color}dd); box-shadow: 0 0 15px ${project.color}35;">
          在新分頁滿版開啟 ↗
        </a>
      </div>
    `;

    // Set Iframe Source
    sandboxIframe.src = project.path;
    
    // Format Display URL
    // e.g. http://localhost:3000/w1/index.html
    const absoluteUrl = new URL(project.path, window.location.href).href;
    addressUrl.textContent = absoluteUrl;
    openNewTab.href = project.path;

    // Reset default view mode to Desktop
    setDeviceMode('desktop');

    // Show Sandbox Overlay
    sandbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // Lock main scroll
  }

  // Close Sandbox Preview
  function closePreview() {
    sandbox.classList.remove('active');
    sandboxIframe.src = 'about:blank'; // Clear iframe memory
    activeProject = null;
    document.body.style.overflow = ''; // Unlock main scroll
  }

  closeSandbox.addEventListener('click', closePreview);
  
  // Close on Escape key press
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sandbox.classList.contains('active')) {
      closePreview();
    }
  });

  // Device Mode Toggle Logic
  function setDeviceMode(mode) {
    deviceBtns.forEach(btn => {
      if (btn.getAttribute('data-device') === mode) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    // Remove old classes
    viewportFrame.classList.remove('device-desktop', 'device-tablet', 'device-mobile');
    // Add new class
    viewportFrame.classList.add(`device-${mode}`);
  }

  deviceBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const mode = btn.getAttribute('data-device');
      setDeviceMode(mode);
    });
  });

  // Initial Render
  renderProjects();
});
