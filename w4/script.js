/* ==========================================================================
   AIGravity Studio - Interactive Scripts
   ========================================================================== */

/* ==========================================================================
   DOM & INTERACTION LOGIC
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

    // 1. 手機選單控制
    const menuToggle = document.getElementById('menuToggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-link, .nav-btn');

    if (menuToggle && navLinksContainer) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('open');
            navLinksContainer.classList.toggle('open');
        });

        // 點擊選單連結後自動關閉選單
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('open');
                navLinksContainer.classList.remove('open');
            });
        });
    }

    // 2. 導覽列滾動效果
    const navbar = document.querySelector('.main-navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal (滾動淡入效果)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // 觸發後即取消監聽，使動畫只執行一次
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' // 稍微提早或延遲觸發
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Scroll Spy (滾動時自動啟動導覽列對應項目)
    const sections = document.querySelectorAll('section');
    const navLinksArray = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // 滾動超過該區塊頂部減去導覽列高度，即判定進入該區塊
            if (pageYOffset >= (sectionTop - 150)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinksArray.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });

    // 5. 核心優勢卡片滑鼠微發光特效 (Spotlight Glow)
    const cards = document.querySelectorAll('.advantage-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // 計算滑鼠在卡片內的相對坐標
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 寫入 CSS 變數以供樣式表渲染
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // 6. 聯絡表單送出模擬與互動
    const inquiryForm = document.getElementById('inquiryForm');
    const successMsg = document.getElementById('successMsg');
    const resetFormBtn = document.getElementById('resetFormBtn');

    if (inquiryForm && successMsg) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault(); // 阻止頁面跳轉
            
            // 取得送出按鈕與顯示載入狀態
            const submitBtn = inquiryForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `
                <span class="btn-text">處理中...</span>
                <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation: spin 1s linear infinite;">
                    <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
                    <path d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
            `;
            
            // 模擬網路傳輸延遲
            setTimeout(() => {
                inquiryForm.classList.add('hidden');
                successMsg.classList.add('active');
                
                // 還原按鈕狀態
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }, 1200);
        });

        // 重新填寫按鈕
        resetFormBtn.addEventListener('click', () => {
            inquiryForm.reset(); // 清空欄位
            successMsg.classList.remove('active');
            inquiryForm.classList.remove('hidden');
        });
    }
});

// CSS 旋轉動畫定義 (用於載入中按鈕圖標)
const styleEl = document.createElement('style');
styleEl.innerHTML = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(styleEl);
