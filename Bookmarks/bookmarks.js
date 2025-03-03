// Функция для инициализации страницы закладок
function initBookmarksPage() {
    console.log('Страница закладок инициализирована');
    
    // Получаем элементы DOM для вкладок
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Обработчик для кнопок вкладок
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Удаляем активный класс у всех кнопок и контента
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Добавляем активный класс к выбранной кнопке
            this.classList.add('active');
            
            // Получаем id вкладки и активируем соответствующий контент
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Загружаем и применяем тему
    loadTheme();
    
    // Загрузка данных закладок
    loadBookmarksData();
}

// Функция для загрузки данных закладок
function loadBookmarksData() {
    console.log('Загрузка данных закладок...');
    // В реальном приложении здесь будет запрос к API или базе данных
    
    // Пример данных закладок
    const bookmarksData = {
        reading: [
            {
                title: 'Название манги 1',
                chaptersRead: 24,
                totalChapters: 45,
                progress: 53,
                image: 'https://via.placeholder.com/150x200'
            },
            {
                title: 'Название манги 2',
                chaptersRead: 10,
                totalChapters: 30,
                progress: 33,
                image: 'https://via.placeholder.com/150x200'
            }
        ],
        completed: [
            {
                title: 'Название манги 3',
                chaptersRead: 50,
                totalChapters: 50,
                progress: 100,
                image: 'https://via.placeholder.com/150x200'
            }
        ],
        planned: [
            {
                title: 'Название манги 4',
                status: 'Запланировано',
                image: 'https://via.placeholder.com/150x200'
            },
            {
                title: 'Название манги 5',
                status: 'Запланировано',
                image: 'https://via.placeholder.com/150x200'
            }
        ]
    };
    
    // В будущем здесь можно динамически создавать элементы закладок
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