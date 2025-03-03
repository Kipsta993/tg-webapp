// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand(); // Расширяем на всю высоту

// Функция для инициализации страницы закладок
function initBookmarksPage() {
    console.log('Страница закладок инициализирована');
    
    // Получаем элементы DOM
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const sortBtn = document.getElementById('sort-btn');
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const emptyBookmarks = document.getElementById('empty-bookmarks');
    
    // Обработчик для кнопки поиска
    searchButton.addEventListener('click', function() {
        performSearch(searchInput.value);
    });
    
    // Обработчик для поля поиска (поиск при нажатии Enter)
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch(searchInput.value);
        }
    });
    
    // Обработчик для поля поиска (поиск при вводе текста с задержкой)
    let searchTimeout;
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        if (this.value.length > 2) {
            searchTimeout = setTimeout(() => {
                performSearch(this.value);
            }, 500);
        } else if (this.value.length === 0) {
            hideSearchResults();
        }
    });
    
    // Обработчик для кнопки "Очистить все"
    clearAllBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите удалить все закладки?')) {
            clearAllBookmarks();
        }
    });
    
    // Обработчик для кнопки "Сортировать"
    sortBtn.addEventListener('click', function() {
        toggleSortMenu();
    });
    
    // Добавляем обработчики для кнопок удаления закладок
    const removeButtons = document.querySelectorAll('.remove-bookmark');
    removeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Предотвращаем всплытие события
            const mangaCard = this.closest('.manga-card');
            const title = mangaCard.querySelector('h3').textContent;
            
            if (confirm(`Удалить "${title}" из закладок?`)) {
                removeBookmark(mangaCard);
            }
        });
    });
    
    // Добавляем обработчики для карточек манги
    const mangaCards = document.querySelectorAll('.manga-card');
    mangaCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            console.log('Выбрана манга:', title);
            // Здесь будет переход на страницу манги
            // window.location.href = `../manga-details.html?title=${encodeURIComponent(title)}`;
            alert(`Выбрана манга: ${title}`);
        });
    });
    
    // Загружаем и применяем тему
    loadTheme();
    
    // Загрузка данных закладок
    loadBookmarksData();
    
    // Проверяем, есть ли закладки
    checkIfEmpty();
}

// Функция для выполнения поиска
function performSearch(query) {
    if (!query || query.trim() === '') {
        hideSearchResults();
        return;
    }
    
    console.log('Поиск в закладках:', query);
    
    // Получаем элементы DOM
    const searchResults = document.getElementById('search-results');
    
    // Очищаем результаты поиска
    searchResults.innerHTML = '';
    
    // Показываем блок результатов
    searchResults.classList.add('active');
    
    // В реальном приложении здесь будет запрос к API или фильтрация данных
    // Пример имитации поиска
    const allMangaCards = document.querySelectorAll('.manga-card');
    let foundResults = false;
    
    // Создаем заголовок результатов поиска
    const searchTitle = document.createElement('h3');
    searchTitle.textContent = `Результаты поиска: "${query}"`;
    searchTitle.style.marginBottom = '15px';
    searchResults.appendChild(searchTitle);
    
    // Создаем контейнер для результатов
    const resultsGrid = document.createElement('div');
    resultsGrid.className = 'manga-grid';
    searchResults.appendChild(resultsGrid);
    
    // Ищем совпадения
    allMangaCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query.toLowerCase())) {
            foundResults = true;
            // Клонируем карточку и добавляем в результаты
            const clonedCard = card.cloneNode(true);
            resultsGrid.appendChild(clonedCard);
            
            // Добавляем обработчик клика для клонированной карточки
            clonedCard.addEventListener('click', function() {
                const title = this.querySelector('h3').textContent;
                console.log('Выбрана манга из результатов поиска:', title);
                // Здесь будет переход на страницу манги
                alert(`Выбрана манга: ${title}`);
            });
            
            // Добавляем обработчик для кнопки удаления
            const removeButton = clonedCard.querySelector('.remove-bookmark');
            removeButton.addEventListener('click', function(e) {
                e.stopPropagation(); // Предотвращаем всплытие события
                const mangaCard = this.closest('.manga-card');
                const title = mangaCard.querySelector('h3').textContent;
                
                if (confirm(`Удалить "${title}" из закладок?`)) {
                    // Находим оригинальную карточку и удаляем её
                    const originalCard = findOriginalCard(title);
                    if (originalCard) {
                        removeBookmark(originalCard);
                    }
                    // Удаляем клонированную карточку из результатов
                    mangaCard.remove();
                    
                    // Проверяем, остались ли результаты
                    if (resultsGrid.children.length === 0) {
                        const noResults = document.createElement('p');
                        noResults.className = 'search-info';
                        noResults.textContent = 'По вашему запросу ничего не найдено';
                        searchResults.appendChild(noResults);
                    }
                }
            });
        }
    });
    
    // Если ничего не найдено
    if (!foundResults) {
        const noResults = document.createElement('p');
        noResults.className = 'search-info';
        noResults.textContent = 'По вашему запросу ничего не найдено';
        searchResults.appendChild(noResults);
    }
}

// Функция для скрытия результатов поиска
function hideSearchResults() {
    const searchResults = document.getElementById('search-results');
    searchResults.classList.remove('active');
    setTimeout(() => {
        if (!searchResults.classList.contains('active')) {
            searchResults.innerHTML = '<p class="search-info">Введите название манги для поиска</p>';
        }
    }, 300);
}

// Функция для поиска оригинальной карточки по названию
function findOriginalCard(title) {
    const allMangaCards = document.querySelectorAll('#bookmarks-container .manga-card');
    for (let card of allMangaCards) {
        const cardTitle = card.querySelector('h3').textContent;
        if (cardTitle === title) {
            return card;
        }
    }
    return null;
}

// Функция для удаления закладки
function removeBookmark(mangaCard) {
    // Анимация удаления
    mangaCard.style.opacity = '0';
    mangaCard.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        mangaCard.remove();
        
        // В реальном приложении здесь будет сохранение изменений в localStorage или на сервере
        saveBookmarks();
        
        // Проверяем, остались ли закладки
        checkIfEmpty();
    }, 300);
}

// Функция для очистки всех закладок
function clearAllBookmarks() {
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const mangaCards = bookmarksContainer.querySelectorAll('.manga-card');
    
    // Анимация удаления всех карточек
    mangaCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                card.remove();
                
                // Проверяем, была ли удалена последняя карточка
                if (index === mangaCards.length - 1) {
                    // В реальном приложении здесь будет сохранение изменений в localStorage или на сервере
                    saveBookmarks();
                    
                    // Показываем сообщение о пустых закладках
                    checkIfEmpty();
                }
            }, 300);
        }, index * 100); // Задержка для каждой карточки
    });
}

// Функция для проверки, пусты ли закладки
function checkIfEmpty() {
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const emptyBookmarks = document.getElementById('empty-bookmarks');
    
    if (bookmarksContainer.children.length === 0) {
        emptyBookmarks.style.display = 'block';
    } else {
        emptyBookmarks.style.display = 'none';
    }
}

// Функция для отображения меню сортировки
function toggleSortMenu() {
    // В реальном приложении здесь будет логика отображения меню сортировки
    const sortOptions = ['По дате добавления', 'По алфавиту', 'По рейтингу'];
    const selectedOption = prompt('Выберите способ сортировки:\n1. По дате добавления\n2. По алфавиту\n3. По рейтингу');
    
    if (selectedOption) {
        const option = parseInt(selectedOption);
        if (option >= 1 && option <= 3) {
            sortBookmarks(option);
        }
    }
}

// Функция для сортировки закладок
function sortBookmarks(sortType) {
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const mangaCards = Array.from(bookmarksContainer.querySelectorAll('.manga-card'));
    
    // Сортировка карточек
    mangaCards.sort((a, b) => {
        if (sortType === 1) {
            // По дате добавления (в обратном порядке - новые сверху)
            const dateA = a.querySelector('.manga-status').textContent.split(': ')[1];
            const dateB = b.querySelector('.manga-status').textContent.split(': ')[1];
            return new Date(dateB.split('.').reverse().join('-')) - new Date(dateA.split('.').reverse().join('-'));
        } else if (sortType === 2) {
            // По алфавиту
            const titleA = a.querySelector('h3').textContent;
            const titleB = b.querySelector('h3').textContent;
            return titleA.localeCompare(titleB);
        } else if (sortType === 3) {
            // По рейтингу (в порядке убывания)
            const ratingA = parseFloat(a.querySelector('.manga-rating').textContent);
            const ratingB = parseFloat(b.querySelector('.manga-rating').textContent);
            return ratingB - ratingA;
        }
    });
    
    // Очищаем контейнер
    bookmarksContainer.innerHTML = '';
    
    // Добавляем отсортированные карточки обратно
    mangaCards.forEach(card => {
        bookmarksContainer.appendChild(card);
    });
    
    // В реальном приложении здесь будет сохранение порядка в localStorage или на сервере
    saveBookmarks();
}

// Функция для сохранения закладок
function saveBookmarks() {
    console.log('Сохранение закладок...');
    // В реальном приложении здесь будет сохранение в localStorage или на сервере
    // Пример сохранения в localStorage:
    /*
    const bookmarksContainer = document.getElementById('bookmarks-container');
    const mangaCards = bookmarksContainer.querySelectorAll('.manga-card');
    const bookmarks = [];
    
    mangaCards.forEach(card => {
        bookmarks.push({
            title: card.querySelector('h3').textContent,
            genres: card.querySelector('.manga-genres').textContent,
            date: card.querySelector('.manga-status').textContent.split(': ')[1],
            rating: card.querySelector('.manga-rating').textContent,
            image: card.querySelector('img').src
        });
    });
    
    localStorage.setItem('mangaBookmarks', JSON.stringify(bookmarks));
    */
}

// Функция для загрузки данных закладок
function loadBookmarksData() {
    console.log('Загрузка данных закладок...');
    // В реальном приложении здесь будет загрузка из localStorage или с сервера
    // Пример загрузки из localStorage:
    /*
    const savedBookmarks = localStorage.getItem('mangaBookmarks');
    if (savedBookmarks) {
        const bookmarks = JSON.parse(savedBookmarks);
        const bookmarksContainer = document.getElementById('bookmarks-container');
        
        // Очищаем контейнер
        bookmarksContainer.innerHTML = '';
        
        // Добавляем закладки
        bookmarks.forEach(bookmark => {
            // Создаем карточку манги
            const mangaCard = document.createElement('div');
            mangaCard.className = 'manga-card';
            
            // Добавляем содержимое карточки
            mangaCard.innerHTML = `
                <div class="manga-image">
                    <img src="${bookmark.image}" alt="Обложка манги">
                    <div class="manga-rating">${bookmark.rating}</div>
                    <button class="remove-bookmark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                        </svg>
                    </button>
                </div>
                <div class="manga-info">
                    <h3>${bookmark.title}</h3>
                    <p class="manga-genres">${bookmark.genres}</p>
                    <p class="manga-status">Добавлено: ${bookmark.date}</p>
                </div>
            `;
            
            // Добавляем карточку в контейнер
            bookmarksContainer.appendChild(mangaCard);
            
            // Добавляем обработчики событий
            const removeButton = mangaCard.querySelector('.remove-bookmark');
            removeButton.addEventListener('click', function(e) {
                e.stopPropagation();
                const title = mangaCard.querySelector('h3').textContent;
                
                if (confirm(`Удалить "${title}" из закладок?`)) {
                    removeBookmark(mangaCard);
                }
            });
            
            mangaCard.addEventListener('click', function() {
                const title = this.querySelector('h3').textContent;
                console.log('Выбрана манга:', title);
                alert(`Выбрана манга: ${title}`);
            });
        });
    }
    */
}

// Функция для загрузки и применения темы
function loadTheme() {
    const settings = JSON.parse(localStorage.getItem('mangaAppSettings')) || {
        theme: 'light',
        fontSize: 100
    };
    
    // Применяем тему
    if (settings.theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Применяем размер шрифта
    document.documentElement.style.fontSize = settings.fontSize + '%';
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', initBookmarksPage); 