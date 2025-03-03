// Функция для инициализации страницы каталога
function initCatalogPage() {
    console.log('Страница каталога инициализирована');
    
    // Получаем элементы DOM
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const genreFilter = document.getElementById('genre-filter');
    const sortFilter = document.getElementById('sort-filter');
    
    // Обработчик для кнопки поиска
    searchButton.addEventListener('click', function() {
        searchManga(searchInput.value);
    });
    
    // Обработчик для поля поиска (поиск при нажатии Enter)
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchManga(searchInput.value);
        }
    });
    
    // Обработчики для фильтров
    genreFilter.addEventListener('change', applyFilters);
    sortFilter.addEventListener('change', applyFilters);
    
    // Загрузка данных манги
    loadCatalogData();
}

// Функция для поиска манги
function searchManga(query) {
    console.log('Поиск манги:', query);
    // В реальном приложении здесь будет запрос к API или фильтрация данных
    
    if (query.trim() === '') {
        // Если запрос пустой, показываем все
        loadCatalogData();
        return;
    }
    
    // Пример фильтрации (в реальном приложении будет другая логика)
    const mangaCards = document.querySelectorAll('.manga-card');
    
    mangaCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(query.toLowerCase())) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Функция для применения фильтров
function applyFilters() {
    const genreFilter = document.getElementById('genre-filter').value;
    const sortFilter = document.getElementById('sort-filter').value;
    
    console.log('Применение фильтров:', { жанр: genreFilter, сортировка: sortFilter });
    
    // В реальном приложении здесь будет логика фильтрации и сортировки
    // Пример простой фильтрации по жанру
    const mangaCards = document.querySelectorAll('.manga-card');
    
    mangaCards.forEach(card => {
        if (genreFilter === '') {
            // Если фильтр не выбран, показываем все
            card.style.display = 'block';
        } else {
            const genre = card.querySelector('.genre').textContent.toLowerCase();
            if (genre.includes(genreFilter.toLowerCase())) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        }
    });
    
    // Пример сортировки (в реальном приложении будет другая логика)
    // ...
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
            image: 'https://via.placeholder.com/150x200'
        },
        {
            title: 'Название манги 2',
            genres: ['Романтика', 'Комедия'],
            image: 'https://via.placeholder.com/150x200'
        },
        {
            title: 'Название манги 3',
            genres: ['Фэнтези'],
            image: 'https://via.placeholder.com/150x200'
        },
        {
            title: 'Название манги 4',
            genres: ['Боевик', 'Комедия'],
            image: 'https://via.placeholder.com/150x200'
        }
        // Здесь можно добавить больше элементов
    ];
    
    // В будущем здесь можно динамически создавать элементы манги
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', initCatalogPage); 