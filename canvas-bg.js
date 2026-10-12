// canvas-bg.js - Chỉ kích hoạt hiệu ứng khi trang có thẻ <canvas id="bg-canvas">
document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return; // Nếu trang không có canvas -> Tắt luôn, không tốn tài nguyên GPU

    const ctx = canvas.getContext('2d');
    let width, height;

    function resizeCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Gió tương tác khi di chuyển chuột (dành cho hoa bồ công anh)
    let mouseWind = { x: 0, y: 0, active: 0 };
    window.addEventListener('mousemove', (e) => {
        mouseWind.x = (e.movementX || 0) * 0.08;
        mouseWind.y = (e.movementY || 0) * 0.08;
        mouseWind.active = 20;
    });

    // --- Dark Mode Data (Bầu trời sao & Sao băng) ---
    const STARS_COUNT = 110;
    let stars = [];
    for (let i = 0; i < STARS_COUNT; i++) {
        stars.push({
            x: (Math.random() - 0.5) * 1900,
            y: (Math.random() - 0.5) * 1900,
            radius: Math.random() * 1.5 + 0.4,
            alpha: Math.random() * 0.7 + 0.3,
            flicker: Math.random() * 0.02 + 0.005
        });
    }
    let skyRotation = 0;

    let shootingStars = [];
    function createShootingStar() {
        shootingStars.push({
            x: Math.random() * width * 0.8,
            y: Math.random() * (height * 0.4),
            length: Math.random() * 80 + 50,
            speed: Math.random() * 8 + 10,
            angle: Math.PI / 4 + (Math.random() * 0.2 - 0.1),
            opacity: 1
        });
    }

    // --- Light Mode Data (Hoa bồ công anh bay) ---
    const DANDELION_COUNT = 45;
    let dandelions = [];
    function resetDandelion(p, fromBottom = false) {
        p.x = Math.random() * (width + 200) - 100;
        p.y = fromBottom ? height + Math.random() * 50 : Math.random() * height;
        p.size = Math.random() * 6 + 4;
        p.speedY = -(Math.random() * 0.8 + 0.4);
        p.baseWindX = Math.random() * 0.5 + 0.3;
        p.angle = Math.random() * Math.PI * 2;
        p.spin = (Math.random() - 0.5) * 0.02;
        p.opacity = Math.random() * 0.5 + 0.25;
    }
    for (let i = 0; i < DANDELION_COUNT; i++) {
        let p = {};
        resetDandelion(p);
        dandelions.push(p);
    }

    // --- Vòng lặp render (60 FPS) ---
    function animate() {
        ctx.clearRect(0, 0, width, height);
        const isDark = document.body.classList.contains('dark-mode');

        if (isDark) {
            // === VẼ BẦU TRỜI SAO & SAO BĂNG ===
            skyRotation += 0.0003;
            ctx.save();
            ctx.translate(width / 2, height / 2);
            ctx.rotate(skyRotation);

            stars.forEach(s => {
                s.alpha += s.flicker;
                if (s.alpha > 1 || s.alpha < 0.2) s.flicker = -s.flicker;
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(192, 132, 252, ${s.alpha})`;
                ctx.fill();
            });
            ctx.restore();

            if (Math.random() < 0.012 && shootingStars.length < 3) {
                createShootingStar();
            }

            for (let i = shootingStars.length - 1; i >= 0; i--) {
                let ss = shootingStars[i];
                let endX = ss.x + Math.cos(ss.angle) * ss.length;
                let endY = ss.y + Math.sin(ss.angle) * ss.length;

                let grad = ctx.createLinearGradient(ss.x, ss.y, endX, endY);
                grad.addColorStop(0, `rgba(132, 204, 22, ${ss.opacity})`);
                grad.addColorStop(1, `rgba(168, 85, 247, 0)`);

                ctx.strokeStyle = grad;
                ctx.lineWidth = 1.6;
                ctx.beginPath();
                ctx.moveTo(ss.x, ss.y);
                ctx.lineTo(endX, endY);
                ctx.stroke();

                ss.x += Math.cos(ss.angle) * ss.speed;
                ss.y += Math.sin(ss.angle) * ss.speed;
                ss.opacity -= 0.018;

                if (ss.opacity <= 0 || ss.x > width || ss.y > height) {
                    shootingStars.splice(i, 1);
                }
            }
        } else {
            // === VẼ HOA BỒ CÔNG ANH BAY ===
            if (mouseWind.active > 0) mouseWind.active--;

            dandelions.forEach(p => {
                p.angle += p.spin;
                let currentWindX = p.baseWindX + (mouseWind.active > 0 ? mouseWind.x : 0);
                let currentWindY = p.speedY + (mouseWind.active > 0 ? mouseWind.y : 0);

                p.x += currentWindX;
                p.y += currentWindY;

                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.angle);
                ctx.strokeStyle = `rgba(140, 45, 25, ${p.opacity * 0.7})`;
                ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.9})`;

                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, p.size * 1.6);
                ctx.stroke();

                for (let j = 0; j < 5; j++) {
                    let featherAngle = (j - 2) * 0.35;
                    ctx.beginPath();
                    ctx.moveTo(0, 0);
                    ctx.lineTo(Math.sin(featherAngle) * p.size, -Math.cos(featherAngle) * p.size);
                    ctx.stroke();
                }

                ctx.beginPath();
                ctx.arc(0, 0, 1.2, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();

                if (p.y < -30 || p.x > width + 50) {
                    resetDandelion(p, true);
                }
            });
        }

        requestAnimationFrame(animate);
    }

    animate();
});