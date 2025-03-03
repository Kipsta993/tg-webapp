// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand(); // Расширяем на всю высоту

// Функция для инициализации страницы каталога
function initCatalogPage() {
    console.log('Страница каталога инициализирована');
    
    // Получаем элементы DOM
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResults = document.getElementById('search-results');
    const mangaGrid = document.getElementById('manga-grid');
    
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
    
    // Загрузка данных каталога
    loadCatalogData();
}

// Функция для выполнения поиска
function performSearch(query) {
    if (!query || query.trim() === '') {
        hideSearchResults();
        return;
    }
    
    console.log('Поиск манги:', query);
    
    // Получаем элементы DOM
    const searchResults = document.getElementById('search-results');
    
    // Очищаем результаты поиска
    searchResults.innerHTML = '';
    
    // Показываем блок результатов
    searchResults.classList.add('active');
    
    // В реальном приложении здесь будет запрос к API
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

// Функция для загрузки данных каталога
function loadCatalogData() {
    console.log('Загрузка данных каталога...');
    // В реальном приложении здесь будет запрос к API или базе данных
    
    // Пример данных манги
    const catalogData = [
        {
            title: 'Название манги 1',
            genres: ['Боевик', 'Фэнтези'],
            rating: 4.8,
            image: 'https://via.placeholder.com/150x200'
        },
        {
            title: 'Название манги 2',
            genres: ['Романтика', 'Комедия'],
            rating: 4.6,
            image: 'https://via.placeholder.com/150x200'
        },
        {
            title: 'Название манги 3',
            genres: ['Фэнтези'],
            rating: 4.5,
            image: 'https://via.placeholder.com/150x200'
        },
        {
            title: 'Название манги 4',
            genres: ['Боевик', 'Комедия'],
            rating: 4.3,
            image: 'https://via.placeholder.com/150x200'
        }
        // Здесь можно добавить больше элементов
    ];
    
    // В будущем здесь можно динамически создавать элементы манги
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
document.addEventListener('DOMContentLoaded', initCatalogPage); 