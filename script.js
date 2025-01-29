document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fireworks');
    const ctx = canvas.getContext('2d');
    const countdownEl = document.getElementById('countdown');
    const messageEl = document.getElementById('new-year-message');
    const audio = document.getElementById('background-music');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let fireworks = [];

    // 🎆 Đếm ngược 5 giây
    let countdown = 5;
    countdownEl.innerHTML = `Đếm ngược: ${countdown} giây`;

    // Thay đổi màu nền khi đếm ngược
    document.body.style.background = "#000"; // Đặt nền đen

    // Đếm ngược
    const countdownInterval = setInterval(() => {
        countdown--;
        countdownEl.innerHTML = `Đếm ngược: ${countdown} giây`;
        countdownEl.style.opacity = 0; // Tắt hiệu ứng mờ

        setTimeout(() => {
            countdownEl.style.opacity = 1; // Mở lại hiệu ứng mờ
        }, 500);

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            showFireworks();
        }
    }, 1000);

    function showFireworks() {
        countdownEl.style.display = "none";
        messageEl.style.display = "block";
        canvas.style.display = "block";
        startFireworks();

        // Phát nhạc khi kết thúc đếm ngược
        audio.play().catch(() => {
            console.log("Trình duyệt chặn autoplay. Đợi người dùng tương tác...");
        });
    }

    // 🔥 Pháo hoa animation
    class Firework {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            this.particles = [];
            this.init();
        }

        init() {
            for (let i = 0; i < 80; i++) {
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    radius: Math.random() * 3 + 1,
                    angle: Math.random() * Math.PI * 2,
                    speed: Math.random() * 5 + 2,
                    alpha: 1,
                    decay: Math.random() * 0.02 + 0.01
                });
            }
        }

        update() {
            this.particles.forEach(p => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.alpha -= p.decay;
            });

            this.particles = this.particles.filter(p => p.alpha > 0);
        }

        draw() {
            this.particles.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${p.alpha})`;
                ctx.shadowBlur = 15;
                ctx.shadowColor = `rgba(${this.color.r}, ${this.color.g}, ${this.color.b}, ${p.alpha})`;
                ctx.fill();
            });
        }
    }

    function randomColor() {
        return {
            r: Math.floor(Math.random() * 255),
            g: Math.floor(Math.random() * 255),
            b: Math.floor(Math.random() * 255)
        };
    }

    function createFirework() {
        if (fireworks.length > 10) return; // Giới hạn số lượng pháo hoa trên màn hình
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height / 2);
        fireworks.push(new Firework(x, y, randomColor()));
    }

    function startFireworks() {
        function animate() {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            fireworks.forEach(firework => {
                firework.update();
                firework.draw();
            });

            fireworks = fireworks.filter(firework => firework.particles.length > 0);

            requestAnimationFrame(animate);
        }

        setInterval(createFirework, 700);
        animate();
    }
});
