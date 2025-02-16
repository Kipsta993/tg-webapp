// Добавляем функцию для расчета расстояния Левенштейна
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j] + 1
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

// Добавляем пороговое значение для расстояния
const MAX_LEVENSHTEIN_DISTANCE = 3;

// Функция для фильтрации манги
function filterManga(searchText) {
    const mangaCards = document.querySelectorAll('.manga-card');
    const searchQuery = searchText.trim().toLowerCase();
    const noResults = document.querySelector('.no-results');
    let hasResults = false;
    let closestMatch = null;
    let minDistance = Infinity;
    
    // Если поиск пустой, показываем все карточки
    if (searchQuery === '') {
        mangaCards.forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
        noResults.classList.remove('show');
        noResults.style.display = 'none';
        return;
    }

    // Сначала ищем точные совпадения
    mangaCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        
        if (title.includes(searchQuery)) {
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

    // Если точных совпадений нет, ищем ближайшее
    if (!hasResults) {
        mangaCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const distance = levenshteinDistance(searchQuery, title);
            
            // Ищем ближайшее совпадение, если расстояние меньше порога
            if (distance < minDistance && distance <= MAX_LEVENSHTEIN_DISTANCE) {
                minDistance = distance;
                closestMatch = card;
            }
        });

        if (closestMatch) {
            closestMatch.style.display = 'block';
            closestMatch.style.opacity = '1';
            closestMatch.style.transform = 'scale(1)';
            hasResults = true;
        }
    }

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
        const shouldShow = genres.some(genre => cardType.includes(genre));
        
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
