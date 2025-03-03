// Функция для инициализации главной страницы
function initMainPage() {
    console.log('Главная страница инициализирована');
    
    // Обработчик для навигационных ссылок
    const navLinks = document.querySelectorAll('.bottom-nav a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Если нужно добавить какую-то логику при переключении вкладок
            console.log('Переход на страницу:', this.getAttribute('href'));
        });
    });

    // Пример загрузки данных манги (в реальном приложении здесь будет запрос к API)
    loadMangaData();
}

// Функция для загрузки данных манги
function loadMangaData() {
    // В реальном приложении здесь будет запрос к API или базе данных
    console.log('Загрузка данных манги...');
    
    // Пример данных манги
    const mangaData = [
        {
            title: 'Название манги 1',
            description: 'Краткое описание манги 1',
            image: 'https://via.placeholder.com/150x200'
        },
        {
            title: 'Название манги 2',
            description: 'Краткое описание манги 2',
            image: 'https://via.placeholder.com/150x200'
        }
        // Здесь можно добавить больше элементов
    ];
    
    // В будущем здесь можно динамически создавать элементы манги
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', initMainPage); 