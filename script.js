document.querySelector('.search-btn').addEventListener('click', function() {
    document.querySelector('.search-input').focus();
});

// Функция для показа всех карточек
function showAllCards() {
    document.querySelectorAll('.manga-card').forEach(card => {
        card.style.display = 'block';
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
    });
}

// Функция для проверки видимости карточек
function checkCardsVisibility() {
    const cards = document.querySelectorAll('.manga-card');
    const visibleCards = Array.from(cards).filter(card => 
        card.style.display !== 'none' && card.style.opacity !== '0'
    );
    
    // Если нет видимых карточек и поисковая строка пуста
    if (visibleCards.length === 0 && 
        (!document.querySelector('.search-input').value || 
         document.querySelector('.search-input').value.trim() === '')) {
        showAllCards();
    }
}

// Функция для фильтрации манги
function filterManga(searchText) {
    const mangaCards = document.querySelectorAll('.manga-card');
    const searchQuery = searchText.toLowerCase();
    
    mangaCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        
        // Проверяем совпадение только в названии
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
    
    // Если поле поиска пустое, показываем все карточки
    if (e.target.value === '') {
        document.querySelectorAll('.manga-card').forEach(card => {
            card.style.display = 'block';
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
        });
    }
});

function updateMangaGridMargin() {
    const searchContainer = document.querySelector('.search-container');
    const mangaGrid = document.querySelector('.manga-grid');
    const searchHeight = searchContainer.offsetHeight;
    const searchBottom = searchContainer.getBoundingClientRect().bottom;
    
    document.documentElement.style.setProperty('--search-height', `${searchHeight}px`);
    
    const gridTop = mangaGrid.getBoundingClientRect().top;
    if (searchBottom + 25 > gridTop) {
        const newMargin = searchBottom + 50;
        mangaGrid.style.marginTop = `${newMargin}px`;
    }
}

window.addEventListener('load', updateMangaGridMargin);
window.addEventListener('resize', updateMangaGridMargin);

document.querySelector('.search-input').addEventListener('focus', function() {
    setTimeout(updateMangaGridMargin, 300);
});

document.querySelector('.search-input').addEventListener('blur', function() {
    setTimeout(updateMangaGridMargin, 300);
});

// Добавляем поддержку скролла для Telegram WebApp
if (window.Telegram && window.Telegram.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
    
    // Для всех устройств открываем в полный экран
    window.Telegram.WebApp.setViewportHeight(100); // Устанавливаем высоту 100%
    window.Telegram.WebApp.expand(); // Расширяем окно
    
    // Отключаем стандартное поведение скролла
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

// Периодическая проверка видимости карточек
setInterval(checkCardsVisibility, 1000); 
