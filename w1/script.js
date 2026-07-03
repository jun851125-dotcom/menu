document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const card = document.getElementById('profile-card');
    const avatar = document.getElementById('avatar');
    const fileInput = document.getElementById('file-input');
    const openModalBtn = document.getElementById('open-modal-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const contactModal = document.getElementById('contact-modal');
    const toast = document.getElementById('toast');
    const copyButtons = document.querySelectorAll('.copy-btn');

    /* ==========================================================================
       1. 3D Float/Tilt Effect for Personal Card
       ========================================================================== */
    const MAX_TILT = 12; // Maximum tilt angle in degrees

    card.addEventListener('mousemove', (e) => {
        const box = card.getBoundingClientRect();
        
        // Calculate normalized mouse positions relative to card center (-1 to 1)
        const x = e.clientX - box.left - (box.width / 2);
        const y = e.clientY - box.top - (box.height / 2);
        
        const xNorm = x / (box.width / 2);
        const yNorm = y / (box.height / 2);
        
        // Calculate tilt angles (rotateY depends on X offset, rotateX depends on Y offset)
        const rotateX = -yNorm * MAX_TILT;
        const rotateY = xNorm * MAX_TILT;

        // Apply fast transition during mousemove for responsiveness
        card.style.transition = 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.3s ease';
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    // Reset card translation smoothly when mouse leaves
    card.addEventListener('mouseleave', () => {
        card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.6s ease';
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });


    /* ==========================================================================
       2. Click & Upload Profile Picture Replacement
       ========================================================================== */
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        
        if (file) {
            // Verify if the file is an image
            if (!file.type.startsWith('image/')) {
                showToast('請上傳圖檔格式！', true);
                return;
            }

            // FileReader to convert file to data URL
            const reader = new FileReader();
            reader.onload = (event) => {
                avatar.src = event.target.result;
                showToast('大頭貼已成功更新！');
            };
            reader.readAsDataURL(file);
        }
    });


    /* ==========================================================================
       3. Interactive Contact Modal & Copy Clipboard
       ========================================================================== */
    // Open Modal
    openModalBtn.addEventListener('click', () => {
        contactModal.classList.add('active');
        // Quick visual scaling effect inside elements
        document.body.style.overflow = 'hidden';
    });

    // Close Modal by Close Button
    closeModalBtn.addEventListener('click', closeModal);

    // Close Modal by Clicking Backdrop
    contactModal.addEventListener('click', (e) => {
        if (e.target === contactModal) {
            closeModal();
        }
    });

    // Escape Key to Close Modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.classList.contains('active')) {
            closeModal();
        }
    });

    function closeModal() {
        contactModal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Copy to Clipboard Action
    copyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-copy-target');
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const textToCopy = targetElement.textContent.trim();
                
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        const labelName = targetId === 'phone-number' ? '電話號碼' : '電子信箱';
                        showToast(`已成功複製${labelName}！`);
                    })
                    .catch((err) => {
                        console.error('無法複製文字: ', err);
                        showToast('複製失敗，請手動複製！', true);
                    });
            }
        });
    });


    /* ==========================================================================
       4. Visual Toast Helper
       ========================================================================== */
    let toastTimeout;
    function showToast(message, isError = false) {
        // Clear existing timeout
        clearTimeout(toastTimeout);
        
        toast.textContent = message;
        if (isError) {
            toast.style.borderColor = 'rgba(239, 68, 68, 0.4)';
            toast.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 30px rgba(239, 68, 68, 0.15)';
        } else {
            toast.style.borderColor = 'rgba(111, 203, 194, 0.3)';
            toast.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 30px rgba(111, 203, 194, 0.1)';
        }

        toast.classList.add('show');
        
        // Hide after 3 seconds
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }
});
