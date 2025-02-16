document.querySelector('.search-btn').addEventListener('click', function() {
    document.querySelector('.search-input').focus();
});

// Функция для фильтрации манги
function filterManga(searchText) {
    const mangaCards = document.querySelectorAll('.manga-card');
    const searchQuery = searchText.toLowerCase();
    
    mangaCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        
        if (title.includes(searchQuery)) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });
}

// Обработчик ввода в поисковую строку
document.querySelector('.search-input').addEventListener('input', function(e) {
    filterManga(e.target.value);
    
    if (e.target.value === '') {
        document.querySelectorAll('.manga-card').forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
    }
});

// Добавляем поддержку скролла для Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    document.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: true });
}

// Фиксим высоту для iOS
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setViewportHeight);
setViewportHeight(); 
