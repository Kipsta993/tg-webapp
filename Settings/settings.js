// Функция для инициализации страницы настроек
function initSettingsPage() {
    console.log('Страница настроек инициализирована');
    
    // Получаем элементы DOM
    const themeOptions = document.querySelectorAll('.theme-option');
    const decreaseFontBtn = document.getElementById('decrease-font');
    const increaseFontBtn = document.getElementById('increase-font');
    const currentFontSize = document.getElementById('current-font-size');
    
    // Загружаем сохраненные настройки
    loadSettings();
    
    // Обработчик для выбора темы
    themeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            setTheme(theme);
            
            // Убираем активный класс у всех опций
            themeOptions.forEach(opt => opt.classList.remove('active'));
            
            // Добавляем активный класс к выбранной опции
            this.classList.add('active');
            
            // Сохраняем настройки
            saveSettings();
        });
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
}

// Функция для загрузки сохраненных настроек
function loadSettings() {
    // В реальном приложении здесь будет загрузка из localStorage или API
    console.log('Загрузка настроек...');
    
    // Пример загрузки настроек из localStorage
    const settings = JSON.parse(localStorage.getItem('mangaAppSettings')) || {
        theme: 'light',
        fontSize: 100
    };
    
    // Применяем загруженные настройки
    setTheme(settings.theme);
    
    // Устанавливаем активный класс для выбранной темы
    const activeThemeOption = document.querySelector(`.theme-option[data-theme="${settings.theme}"]`);
    if (activeThemeOption) {
        activeThemeOption.classList.add('active');
    }
    
    // Устанавливаем размер шрифта
    document.getElementById('current-font-size').textContent = settings.fontSize + '%';
    document.documentElement.style.fontSize = settings.fontSize + '%';
}

// Функция для сохранения настроек
function saveSettings() {
    // В реальном приложении здесь будет сохранение в localStorage или API
    console.log('Сохранение настроек...');
    
    // Получаем текущую тему
    const activeTheme = document.querySelector('.theme-option.active');
    const theme = activeTheme ? activeTheme.getAttribute('data-theme') : 'light';
    
    const settings = {
        theme: theme,
        fontSize: parseInt(document.getElementById('current-font-size').textContent)
    };
    
    // Сохраняем настройки в localStorage
    localStorage.setItem('mangaAppSettings', JSON.stringify(settings));
}

// Функция для установки темы
function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
    } else {
        document.body.classList.remove('dark-theme');
    }
    
    // Применяем тему ко всем фреймам (если они есть)
    try {
        const frames = document.querySelectorAll('iframe');
        frames.forEach(frame => {
            try {
                if (theme === 'dark') {
                    frame.contentDocument.body.classList.add('dark-theme');
                } else {
                    frame.contentDocument.body.classList.remove('dark-theme');
                }
            } catch (e) {
                console.log('Не удалось применить тему к фрейму:', e);
            }
        });
    } catch (e) {
        console.log('Ошибка при работе с фреймами:', e);
    }
}

// Функция для изменения размера шрифта
function changeFontSize(change) {
    const currentSize = parseInt(document.getElementById('current-font-size').textContent);
    const newSize = Math.max(70, Math.min(150, currentSize + change)); // Ограничиваем размер от 70% до 150%
    
    document.getElementById('current-font-size').textContent = newSize + '%';
    document.documentElement.style.fontSize = newSize + '%';
}

// Запуск инициализации после загрузки DOM
document.addEventListener('DOMContentLoaded', initSettingsPage);