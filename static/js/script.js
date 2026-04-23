document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const lyricDisplay = document.getElementById('lyric-text');
    const startBtn = document.getElementById('start-btn');
    const card = document.getElementById('card');
    
    let lyrics = [];
    let lastIndex = -1;

    // Сразу загружаем данные и твоё сообщение
    fetch('/get_lyrics').then(r => r.json()).then(data => lyrics = data);
    
    checkAdminMsg(); 
    setInterval(checkAdminMsg, 4000); // Проверяем сообщения каждые 4 сек

    // Кнопка Пауза / Плей
    startBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play();
            startBtn.innerText = "Пауза ⏸";
            startBtn.classList.add('playing');
        } else {
            music.pause();
            startBtn.innerText = "Продолжить ▶️";
            startBtn.classList.remove('playing');
        }
    });

    // Синхронизация текста
    music.addEventListener('timeupdate', () => {
        const curTime = music.currentTime;
        const index = lyrics.findIndex((line, i) => {
            const next = lyrics[i+1];
            return curTime >= line.time && (!next || curTime < next.time);
        });

        if (index !== -1 && index !== lastIndex) {
            lastIndex = index;
            lyricDisplay.style.opacity = 0;
            lyricDisplay.style.transform = 'translateY(5px)';
            setTimeout(() => {
                lyricDisplay.innerText = lyrics[index].text;
                lyricDisplay.style.opacity = 1;
                lyricDisplay.style.transform = 'translateY(0)';
            }, 300);
        }
    });

    function checkAdminMsg() {
        fetch('/get_admin_msg').then(r => r.json()).then(data => {
            const container = document.getElementById('admin-reply-container');
            if (data.message && data.message.trim() !== "") {
                container.style.display = 'block';
                document.getElementById('admin-text').innerText = data.message;
            } else {
                container.style.display = 'none';
            }
        });
    }

    // 3D эффект
    document.addEventListener('mousemove', (e) => {
        let x = (window.innerWidth / 2 - e.pageX) / 25;
        let y = (window.innerHeight / 2 - e.pageY) / 25;
        card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    });

    // Сердечки
    setInterval(() => {
        const h = document.createElement('div');
        h.className = 'heart'; h.innerHTML = '❤️';
        h.style.left = Math.random() * 100 + 'vw';
        h.style.animationDuration = (Math.random() * 2 + 3) + 's';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 5000);
    }, 450);

    // Отправка ей сообщения тебе
    document.getElementById('send-btn').addEventListener('click', () => {
        const val = document.getElementById('user-msg').value;
        if(!val) return;
        fetch('/save', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({message: val})
        }).then(() => {
            document.getElementById('user-msg').value = '';
            const tick = document.getElementById('ok-tick');
            tick.style.display = 'block';
            setTimeout(() => tick.style.display = 'none', 3000);
        });
    });
});