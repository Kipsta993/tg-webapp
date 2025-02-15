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
