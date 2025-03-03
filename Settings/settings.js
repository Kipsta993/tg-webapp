// Функция для инициализации страницы настроек
function initSettingsPage() {
    console.log('Страница настроек инициализирована');
    
    // Получаем элементы DOM
    const darkThemeToggle = document.getElementById('dark-theme-toggle');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const increaseFontBtn = document.getElementById('increase-font');
    const currentFontSize = document.getElementById('current-font-size');
    const logoutButton = document.getElementById('logout-button');
    
    // Загружаем сохраненные настройки
    loadSettings();
    
    // Обработчик для переключателя темной темы
    darkThemeToggle.addEventListener('change', function() {
        toggleDarkTheme(this.checked);
        saveSettings();
    });
    
    // Обработчики для кнопок изменения размера шрифта
    decreaseFontBtn.addEventListener('click', function() {
        changeFontSize(-10);
        saveSettings();
    });
    
    increaseFontBtn.addEventListener('click', function() {
        changeFontSize(10);
        saveSettings();
    });
    
    // Обработчик для кнопки выхода
    logoutButton.addEventListener('click', function() {
        logout();
    });
    
    // Обработчики для других переключателей
    document.getElementById('new-chapters-toggle').addEventListener('change', saveSettings);
    document.getElementById('app-updates-toggle').addEventListener('change', saveSettings);
}

// Функция для загрузки сохраненных настроек
function loadSettings() {
    // В реальном приложении здесь будет загрузка из localStorage или API
    console.log('Загрузка настроек...');
    
    // Пример загрузки настроек из localStorage
    const settings = JSON.parse(localStorage.getItem('mangaAppSettings')) || {
        darkTheme: false,
        fontSize: 100,
        notifications: {
            newChapters: true,
            appUpdates: true
        }
    };
    
    // Применяем загруженные настройки
    document.getElementById('dark-theme-toggle').checked = settings.darkTheme;
    document.getElementById('current-font-size').textContent = settings.fontSize + '%';
    document.getElementById('new-chapters-toggle').checked = settings.notifications.newChapters;
    document.getElementById('app-updates-toggle').checked = settings.notifications.appUpdates;
    
    // Применяем темную тему, если она была включена
    if (settings.darkTheme) {
        toggleDarkTheme(true);
    }
    
    // Применяем размер шрифта
    document.documentElement.style.fontSize = settings.fontSize + '%';
}

// Функция для сохранения настроек
function saveSettings() {
    // В реальном приложении здесь будет сохранение в localStorage или API
    console.log('Сохранение настроек...');
    
    const settings = {
        darkTheme: document.getElementById('dark-theme-toggle').checked,
        fontSize: parseInt(document.getElementById('current-font-size').textContent),
        notifications: {
            newChapters: document.getElementById('new-chapters-toggle').checked,
            appUpdates: document.getElementById('app-updates-toggle').checked
        }
    };
    
    // Сохраняем настройки в localStorage
    localStorage.setItem('mangaAppSettings', JSON.stringify(settings));
}

// Функция для переключения темной темы
function toggleDarkTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
}

// Функция для изменения размера шрифта
function changeFontSize(change) {
    const currentSize = parseInt(document.getElementById('current-font-size').textContent);
    const newSize = Math.max(70, Math.min(150, currentSize + change)); // Ограничиваем размер от 70% до 150%
    
    document.getElementById('current-font-size').textContent = newSize + '%';
    document.documentElement.style.fontSize = newSize + '%';
}

// Функция для выхода из аккаунта
function logout() {
    console.log('Выход из аккаунта...');
    // В реальном приложении здесь будет логика выхода из аккаунта
    
    // Пример: показываем подтверждение
    if (confirm('Вы уверены, что хотите выйти из аккаунта?')) {
        // Очищаем данные пользователя и перенаправляем на страницу входа
        // localStorage.removeItem('userToken');
        // window.location.href = '../login.html';
        alert('Выход выполнен!');
    }
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', initSettingsPage); 