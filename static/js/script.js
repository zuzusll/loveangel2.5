document.addEventListener('DOMContentLoaded', () => {
    const music = document.getElementById('bg-music');
    const lyricDisplay = document.getElementById('lyric-text');
    const startBtn = document.getElementById('start-btn');
    const card = document.getElementById('card');
    
    let lyrics = [];
    let lastIndex = -1;

    // 1. Загружаем текст песни
    fetch('/get_lyrics').then(r => r.json()).then(data => lyrics = data);
    
    // 2. Функция проверки твоих сообщений (Админка)
    function checkAdminMsg() {
        fetch('/get_admin_msg')
            .then(response => response.json())
            .then(data => {
                const container = document.getElementById('admin-reply-container');
                const textElem = document.getElementById('admin-text');
                
                if (data.message && data.message.trim().length > 0) {
                    textElem.innerText = data.message;
                    container.style.display = 'block';
                } else {
                    container.style.display = 'none';
                    textElem.innerText = ''; 
                }
            })
            .catch(err => console.log("Ошибка связи с сервером"));
    }

    // Запускаем проверку сразу и каждые 3 секунды
    checkAdminMsg();
    setInterval(checkAdminMsg, 3000);

    // 3. Кнопка Пауза / Плей
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

    // 4. Синхронизация текста песни
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



    // 6. Анимация падающих сердечек (МЫ ЕЁ ВЕРНУЛИ)
    setInterval(() => {
        const h = document.createElement('div');
        h.className = 'heart'; h.innerHTML = '❤️';
        h.style.left = Math.random() * 100 + 'vw';
        h.style.animationDuration = (Math.random() * 2 + 3) + 's';
        document.body.appendChild(h);
        setTimeout(() => h.remove(), 5000);
    }, 450);

    // 7. Отправка её ответа тебе
    const sendBtn = document.getElementById('send-btn');
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
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
    }
});
