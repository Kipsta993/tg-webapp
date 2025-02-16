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

// Функция для фильтрации по жанрам
function filterByGenres(genres) {
    const mangaCards = document.querySelectorAll('.manga-card');
    
    mangaCards.forEach(card => {
        if (genres.length === 0) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            return;
        }
        
        const cardType = card.querySelector('.manga-type').textContent;
        const shouldShow = genres.every(genre => cardType.includes(genre));
        
        if (shouldShow) {
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

document.addEventListener('DOMContentLoaded', () => {
    const filterBtn = document.querySelector('.filter-btn');
    const filterScreen = document.querySelector('.filter-screen');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const resetBtn = document.querySelector('.reset-btn');
    const genreTags = document.querySelectorAll('.genre-tag input');
    const searchInput = document.querySelector('.search-input');

    // Поиск
    searchInput.addEventListener('input', (e) => {
        if (e.target.value === '') {
            // Показываем все карточки, если поле пустое
            document.querySelectorAll('.manga-card').forEach(card => {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'scale(1)';
            });
        } else {
            filterManga(e.target.value);
        }
    });

    // Открытие фильтра
    filterBtn.addEventListener('click', () => {
        filterScreen.classList.add('show');
        overlay.classList.add('show');
    });

    // Закрытие фильтра
    closeBtn.addEventListener('click', () => {
        filterScreen.classList.remove('show');
        overlay.classList.remove('show');
    });

    // Закрытие при клике на оверлей
    overlay.addEventListener('click', () => {
        filterScreen.classList.remove('show');
        overlay.classList.remove('show');
    });

    // Сброс фильтров
    resetBtn.addEventListener('click', () => {
        genreTags.forEach(tag => tag.checked = false);
        searchInput.value = '';
        filterManga('');
    });

    // Обработка жанров
    genreTags.forEach(tag => {
        tag.addEventListener('change', () => {
            const selectedGenres = Array.from(genreTags)
                .filter(t => t.checked)
                .map(t => t.nextElementSibling.textContent);
            filterByGenres(selectedGenres);
        });
    });
});

// Поддержка Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    document.addEventListener('touchmove', function(e) {
        e.stopPropagation();
    }, { passive: true });
}

// Фикс высоты для iOS
function setViewportHeight() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}

window.addEventListener('resize', setViewportHeight);
setViewportHeight();
