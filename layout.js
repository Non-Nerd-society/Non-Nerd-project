// layout.js - Nạp tự động Header, Navigation, Drawer, Footer và quản lý Theme
document.addEventListener("DOMContentLoaded", () => {
    // 1. Chèn Nút Theme & Header
    const headerHTML = `
        <div class="corner-toggle-container">
            <div class="theme-switch-slider" id="corner-theme-switch" title="Chuyển chế độ Sáng / Tối">
                <div class="switch-circle">
                    <i class="fa-solid fa-sun" id="theme-icon"></i>
                </div>
            </div>
        </div>

        <header>
            <a href="index.html" class="brand-container">
                <img src="logo.png" alt="Non-Nerd Logo" class="brand-logo-img">
                <span class="brand-title brand-logo-text">Non-Nerd</span>
            </a>

            <nav class="nav-pill">
                <a href="index.html" class="nav-link" data-page="index">Trang chủ</a>
                <a href="gioi-thieu.html" class="nav-link" data-page="gioi-thieu">Giới thiệu</a>
                <a href="request.html" class="nav-link" data-page="request">Đặt lịch</a>
                <a href="memory.html" class="nav-link" data-page="memory">Memories</a>
                <a href="apply.html" class="nav-link" data-page="apply">Tuyển thành viên</a>
                <a href="gop-y.html" class="nav-link" data-page="gop-y">Góp ý</a>
            </nav>

            <div class="nav-actions">
                <button class="mobile-menu-btn" onclick="toggleMobileMenu()" title="Mở menu">
                    <i class="fa-solid fa-bars"></i>
                </button>
            </div>
        </header>

        <!-- Khung Drawer Điện thoại -->
        <div class="mobile-drawer-overlay" id="drawer-overlay" onclick="toggleMobileMenu()"></div>
        <div class="mobile-drawer" id="mobile-drawer">
            <div class="drawer-header">
                <span class="brand-logo-text" style="font-size: 1.25rem; font-weight: 800;">Non-Nerd</span>
                <button onclick="toggleMobileMenu()" style="background: none; border: none; font-size: 1.5rem; color: var(--text-muted); cursor: pointer; padding: 4px 8px;">&times;</button>
            </div>
            
            <a href="index.html" class="mobile-nav-link" data-page="index"><i class="fa-solid fa-house" style="width: 20px;"></i> Trang chủ</a>
            <a href="gioi-thieu.html" class="mobile-nav-link" data-page="gioi-thieu"><i class="fa-regular fa-compass" style="width: 20px;"></i> Giới thiệu</a>
            <a href="request.html" class="mobile-nav-link" data-page="request"><i class="fa-regular fa-calendar-plus" style="width: 20px;"></i> Đặt lịch</a>
            <a href="memory.html" class="mobile-nav-link" data-page="memory"><i class="fa-regular fa-images" style="width: 20px;"></i> Memories</a>
            <a href="apply.html" class="mobile-nav-link" data-page="apply"><i class="fa-solid fa-user-plus" style="width: 20px;"></i> Tuyển thành viên</a>
            <a href="gop-y.html" class="mobile-nav-link" data-page="gop-y"><i class="fa-regular fa-comment-dots" style="width: 20px;"></i> Góp ý</a>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', headerHTML);

    // 2. Chèn Footer
    const footerHTML = `
        <footer style="width: 100%; padding: 40px 20px; border-top: 1px solid var(--border-line); background-color: var(--bg-navbar); margin-top: auto; position: relative; z-index: 10; text-align: center;">
            <div style="max-width: 800px; margin: 0 auto; display: flex; flex-direction: column; align-items: center; gap: 12px; font-size: 0.92rem; color: var(--text-muted);">
                <p style="font-weight: 800; font-size: 1.1rem; color: var(--text-main); letter-spacing: -0.3px;">Non-Nerd Society</p>
                
                <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 18px;">
                    <span><i class="fa-regular fa-envelope" style="color: var(--tagline-color); margin-right: 6px;"></i> Email: <a href="mailto:nonnerd2026@gmail.com" style="color: var(--text-main); text-decoration: none; font-weight: 600;">nonnerd2026@gmail.com</a></span>
                    <span><i class="fa-brands fa-facebook" style="color: #1877F2; margin-right: 6px;"></i> Fanpage: <a href="https://www.facebook.com/profile.php?id=61593837347815" target="_blank" rel="noopener noreferrer" style="color: var(--text-main); text-decoration: none; font-weight: 600;">Non-Nerd Society</a></span>
                </div>

                <p style="font-size: 0.82rem; margin-top: 8px; opacity: 0.85;">
                    © 2026 Non-Nerd Society. All rights reserved. • Tác giả: <strong style="color: var(--text-main);">BoyfromHCMUT</strong>
                </p>
            </div>
        </footer>
    `;

    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // 3. Highlight tab active tương ứng với trang hiện tại
    let currentPath = window.location.pathname.split("/").pop().replace(".html", "");
    if (!currentPath) currentPath = "index";
    document.querySelectorAll(`[data-page="${currentPath}"]`).forEach(el => el.classList.add('active'));

    // 4. Khởi tạo theme switcher
    initThemeSwitcher();
});

function toggleMobileMenu() {
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    if (drawer && overlay) {
        drawer.classList.toggle('open');
        overlay.classList.toggle('active');
    }
}

function initThemeSwitcher() {
    const themeSwitch = document.getElementById('corner-theme-switch');
    const themeIcon = document.getElementById('theme-icon');
    if (!themeSwitch || !themeIcon) return;

    function applyTheme(isDark) {
        if (isDark) {
            document.body.classList.add('dark-mode');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        } else {
            document.body.classList.remove('dark-mode');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        }
    }

    themeSwitch.addEventListener('click', () => {
        const isDark = !document.body.classList.contains('dark-mode');
        applyTheme(isDark);
    });

    if (localStorage.getItem('theme') === 'dark') {
        applyTheme(true);
    } else {
        applyTheme(false);
    }
}