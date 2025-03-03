// Инициализация Telegram WebApp
let tg = window.Telegram.WebApp;
tg.expand(); // Расширяем на всю высоту

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

    // Загружаем и применяем тему
    loadTheme();
    
    // Загружаем данные пользователя
    loadUserData();

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

// Функция для загрузки данных пользователя
function loadUserData() {
    // Получаем данные из URL параметров
    const urlParams = new URLSearchParams(window.location.search);
    const userDataParam = urlParams.get('user_data');
    
    if (userDataParam) {
        try {
            const userData = JSON.parse(decodeURIComponent(userDataParam));
            displayUserData(userData);
        } catch (error) {
            console.error('Ошибка при разборе данных пользователя:', error);
            displayDefaultUserData();
        }
    } else if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        // Если данные доступны из Telegram WebApp
        const telegramUser = tg.initDataUnsafe.user;
        const userData = {
            playerId: 'N/A', // Telegram WebApp не предоставляет Player ID
            username: telegramUser.username || '',
            firstName: telegramUser.first_name || '',
            lastName: telegramUser.last_name || '',
            messageCount: 0,
            joinDate: new Date().toISOString()
        };
        displayUserData(userData);
    } else {
        // Если данные недоступны, показываем заглушку
        displayDefaultUserData();
    }
}

// Функция для отображения данных пользователя
function displayUserData(userData) {
    // Устанавливаем имя пользователя
    const userNameElement = document.getElementById('user-name');
    const fullName = [userData.firstName, userData.lastName].filter(Boolean).join(' ');
    userNameElement.textContent = fullName || userData.username || 'Пользователь';
    
    // Устанавливаем Player ID
    const playerIdElement = document.getElementById('player-id');
    playerIdElement.textContent = userData.playerId || 'N/A';
    
    // Устанавливаем количество сообщений
    const messageCountElement = document.getElementById('message-count');
    messageCountElement.textContent = userData.messageCount || '0';
    
    // Вычисляем и устанавливаем время в чате
    const timeInChatElement = document.getElementById('time-in-chat');
    if (userData.joinDate) {
        const joinDate = new Date(userData.joinDate);
        const now = new Date();
        const timeInChat = formatTimeInChat(now - joinDate);
        timeInChatElement.textContent = timeInChat;
    } else {
        timeInChatElement.textContent = 'N/A';
    }
    
    // Устанавливаем аватар пользователя (если доступен)
    const avatarElement = document.getElementById('user-avatar');
    if (tg.initDataUnsafe && tg.initDataUnsafe.user && tg.initDataUnsafe.user.photo_url) {
        avatarElement.src = tg.initDataUnsafe.user.photo_url;
    }
}

// Функция для отображения данных пользователя по умолчанию
function displayDefaultUserData() {
    document.getElementById('user-name').textContent = 'Гость';
    document.getElementById('player-id').textContent = 'N/A';
    document.getElementById('message-count').textContent = '0';
    document.getElementById('time-in-chat').textContent = 'N/A';
}

// Функция для форматирования времени в чате
function formatTimeInChat(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);
    
    let result = '';
    
    if (years > 0) {
        result += `${years} ${pluralize(years, 'год', 'года', 'лет')} `;
    }
    
    if (days % 365 > 0) {
        result += `${days % 365} ${pluralize(days % 365, 'день', 'дня', 'дней')} `;
    }
    
    if (hours % 24 > 0) {
        result += `${hours % 24} ${pluralize(hours % 24, 'час', 'часа', 'часов')} `;
    }
    
    if (minutes % 60 > 0) {
        result += `${minutes % 60} ${pluralize(minutes % 60, 'минута', 'минуты', 'минут')} `;
    }
    
    // Если ничего не добавлено, значит меньше минуты
    if (result === '') {
        result = 'менее минуты';
    }
    
    return result.trim();
}

// Функция для правильного склонения слов
function pluralize(number, one, two, five) {
    let n = Math.abs(number);
    n %= 100;
    if (n >= 5 && n <= 20) {
        return five;
    }
    n %= 10;
    if (n === 1) {
        return one;
    }
    if (n >= 2 && n <= 4) {
        return two;
    }
    return five;
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', initMainPage); 