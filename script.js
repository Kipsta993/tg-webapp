// Функция для фильтрации манги
function filterManga(searchText) {
    const mangaCards = document.querySelectorAll('.manga-card');
    const searchQuery = searchText.toLowerCase();
    const noResults = document.querySelector('.no-results');
    let hasResults = false;
    
    mangaCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const isVisible = card.style.display !== 'none';
        
        // Проверяем только видимые карточки (прошедшие фильтр по жанрам)
        if (isVisible && title.includes(searchQuery)) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            hasResults = true;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    updateNoResultsMessage(hasResults, searchQuery !== '');
}

// Функция для фильтрации по жанрам
function filterByGenres(genres) {
    const mangaCards = document.querySelectorAll('.manga-card');
    const searchInput = document.querySelector('.search-input');
    let hasResults = false;
    
    mangaCards.forEach(card => {
        if (genres.length === 0) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            hasResults = true;
            return;
        }
        
        const cardType = card.querySelector('.manga-type').textContent;
        const shouldShow = genres.every(genre => cardType.includes(genre));
        
        if (shouldShow) {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
            hasResults = true;
        } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
                card.style.display = 'none';
            }, 300);
        }
    });

    // После фильтрации по жанрам применяем текущий поисковый запрос
    if (searchInput.value) {
        filterManga(searchInput.value);
    } else {
        updateNoResultsMessage(hasResults, genres.length > 0);
    }
}

// Общая функция для обновления сообщения о ненайденных результатах
function updateNoResultsMessage(hasResults, isFiltering) {
    const noResults = document.querySelector('.no-results');
    
    if (!hasResults && isFiltering) {
        noResults.style.display = 'flex';
        setTimeout(() => {
            noResults.classList.add('show');
        }, 10);
    } else {
        noResults.classList.remove('show');
        setTimeout(() => {
            noResults.style.display = 'none';
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const filterBtn = document.querySelector('.filter-btn');
    const filterScreen = document.querySelector('.filter-screen');
    const closeBtn = document.querySelector('.close-btn');
    const overlay = document.querySelector('.overlay');
    const resetBtn = document.querySelector('.reset-btn');
    const genreTags = document.querySelectorAll('.genre-tag input');
    const searchInput = document.querySelector('.search-input');
    const mangaFeed = document.querySelector('.manga-feed');

    // Поиск
    searchInput.addEventListener('input', (e) => {
        filterManga(e.target.value);
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
        filterByGenres([]);
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

    mangaFeed.style.overflowY = 'auto'; // Включаем прокрутку
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

// Функция для открытия просмотра фоток
function openMangaViewer(images) {
    const mangaViewer = document.querySelector('.manga-viewer');
    const mangaViewerImage = document.querySelector('.manga-viewer-image');
    let currentIndex = 0;

    // Показываем первую фотку
    mangaViewerImage.src = images[currentIndex];
    mangaViewer.style.display = 'flex';

    // Функция для листания вперед
    document.querySelector('.next-btn').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % images.length;
        mangaViewerImage.src = images[currentIndex];
    });

    // Функция для листания назад
    document.querySelector('.prev-btn').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        mangaViewerImage.src = images[currentIndex];
    });

    // Закрытие модального окна
    document.querySelector('.close-viewer-btn').addEventListener('click', () => {
        mangaViewer.style.display = 'none';
    });
}

// Обработка клика на обложку Blue Lock
document.querySelector('.manga-card').addEventListener('click', () => {
    const images = [];
    for (let i = 1; i <= 9; i++) {
        images.push(`Ch.001 - Dream/0${i}.jpg`);
    }
    // Добавляем остальные фотки, если они есть
    for (let i = 10; i <= 20; i++) { // Предположим, что фоток до 20
        images.push(`Ch.001 - Dream/${i}.jpg`);
    }
    openMangaViewer(images);
});
