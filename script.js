document.querySelector('.search-btn').addEventListener('click', function() {
    document.querySelector('.search-input').focus();
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
