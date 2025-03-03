// Импортируем необходимые библиотеки
const { Telegraf } = require('telegraf');
const fs = require('fs');
const path = require('path');

// Создаем экземпляр бота с использованием токена
const bot = new Telegraf('7787126957:AAG2WvpQHo6cskD45exvD9xe1pXWwrympUs');

// URL веб-приложения
const webAppUrl = 'https://kipsta993.github.io/tg-webapp/';

// Путь к файлу с данными пользователей
const usersDataPath = path.join(__dirname, 'users_data.json');

// Функция для загрузки данных пользователей
function loadUsersData() {
    try {
        if (fs.existsSync(usersDataPath)) {
            const data = fs.readFileSync(usersDataPath, 'utf8');
            return JSON.parse(data);
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных пользователей:', error);
    }
    return { users: {}, lastPlayerId: 0 };
}

// Функция для сохранения данных пользователей
function saveUsersData(data) {
    try {
        fs.writeFileSync(usersDataPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Ошибка при сохранении данных пользователей:', error);
    }
}

// Функция для получения или создания данных пользователя
function getUserData(ctx) {
    const userId = ctx.from.id.toString();
    const userData = loadUsersData();
    
    if (!userData.users[userId]) {
        // Новый пользователь, создаем запись
        userData.lastPlayerId += 1;
        userData.users[userId] = {
            playerId: userData.lastPlayerId,
            username: ctx.from.username || '',
            firstName: ctx.from.first_name || '',
            lastName: ctx.from.last_name || '',
            messageCount: 0,
            joinDate: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };
        saveUsersData(userData);
        console.log(`Новый пользователь: ${userId}, Player ID: ${userData.lastPlayerId}`);
    } else {
        // Обновляем данные существующего пользователя
        userData.users[userId].lastActivity = new Date().toISOString();
        saveUsersData(userData);
    }
    
    return userData.users[userId];
}

// Функция для обновления счетчика сообщений пользователя
function updateMessageCount(userId) {
    const userData = loadUsersData();
    if (userData.users[userId]) {
        userData.users[userId].messageCount += 1;
        userData.users[userId].lastActivity = new Date().toISOString();
        saveUsersData(userData);
    }
}

// Обработчик команды /start
bot.start((ctx) => {
    const userData = getUserData(ctx);
    const userDataParam = encodeURIComponent(JSON.stringify({
        playerId: userData.playerId,
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        messageCount: userData.messageCount,
        joinDate: userData.joinDate
    }));
    
    const webAppUrlWithParams = `${webAppUrl}?user_data=${userDataParam}`;
    
    ctx.reply(`Привет, ${ctx.from.first_name}! Твой Player ID: ${userData.playerId}\nЯ бот для чтения манги. Используй кнопку ниже, чтобы открыть приложение.`, {
        reply_markup: {
            keyboard: [
                [{ text: 'Приложение', web_app: { url: webAppUrlWithParams } }]
            ],
            resize_keyboard: true
        }
    });
});

// Обработчик команды /help
bot.help((ctx) => {
    const userData = getUserData(ctx);
    ctx.reply(`Твой Player ID: ${userData.playerId}\nЯ бот для чтения манги. Используй команду /start, чтобы получить доступ к приложению.`);
});

// Обработчик команды /id для получения Player ID
bot.command('id', (ctx) => {
    const userData = getUserData(ctx);
    ctx.reply(`Твой Player ID: ${userData.playerId}`);
});

// Обработчик для данных из веб-приложения
bot.on('web_app_data', (ctx) => {
    console.log('Получены данные из веб-приложения:', ctx.webAppData.data);
    ctx.reply(`Получены данные: ${ctx.webAppData.data}`);
});

// Обработчик текстовых сообщений
bot.on('text', (ctx) => {
    // Обновляем счетчик сообщений
    updateMessageCount(ctx.from.id.toString());
    
    // Если сообщение не от веб-приложения, предлагаем открыть приложение
    if (!ctx.message.web_app_data) {
        const userData = getUserData(ctx);
        const userDataParam = encodeURIComponent(JSON.stringify({
            playerId: userData.playerId,
            username: userData.username,
            firstName: userData.firstName,
            lastName: userData.lastName,
            messageCount: userData.messageCount,
            joinDate: userData.joinDate
        }));
        
        const webAppUrlWithParams = `${webAppUrl}?user_data=${userDataParam}`;
        
        ctx.reply(`Используй кнопку "Приложение", чтобы открыть приложение для чтения манги.`, {
            reply_markup: {
                keyboard: [
                    [{ text: 'Приложение', web_app: { url: webAppUrlWithParams } }]
                ],
                resize_keyboard: true
            }
        });
    }
});

// Обработка ошибок
bot.catch((err, ctx) => {
    console.error('Ошибка бота:', err);
    ctx.reply('Произошла ошибка при обработке запроса.');
});

// Запускаем бота
bot.launch()
    .then(() => {
        console.log('Бот успешно запущен!');
    })
    .catch((err) => {
        console.error('Ошибка при запуске бота:', err);
    });

// Включаем graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 