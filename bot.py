import os
import sys
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes
from telegram.error import Conflict

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Получаем токен из переменных окружения
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('Привет! Я бот.')

async def main():
    # Создаем файл для проверки запущенных экземпляров
    pid_file = "bot.pid"
    
    # Проверяем, не запущен ли уже бот
    if os.path.exists(pid_file):
        try:
            with open(pid_file, 'r') as f:
                old_pid = int(f.read())
            # Проверяем, жив ли процесс
            os.kill(old_pid, 0)
            logger.error("Бот уже запущен в другом процессе!")
            sys.exit(1)
        except OSError:
            # Если процесс мертв, удаляем файл
            os.remove(pid_file)
    
    # Записываем текущий PID
    with open(pid_file, 'w') as f:
        f.write(str(os.getpid()))

    try:
        # Создаем приложение с обработкой ошибок
        application = Application.builder().token(TOKEN).build()
        
        # Добавляем обработчики
        application.add_handler(CommandHandler("start", start))
        
        # Запускаем бота
        logger.info("Бот запущен...")
        await application.run_polling(allowed_updates=Update.ALL_TYPES)

    except Conflict:
        logger.error("Обнаружен конфликт с другим экземпляром бота")
        if os.path.exists(pid_file):
            os.remove(pid_file)
        sys.exit(1)
    except Exception as e:
        logger.error(f"Произошла ошибка: {e}")
        if os.path.exists(pid_file):
            os.remove(pid_file)
        sys.exit(1)
    finally:
        # Удаляем PID файл при выходе
        if os.path.exists(pid_file):
            os.remove(pid_file)

if __name__ == '__main__':
    try:
        import asyncio
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Бот остановлен пользователем")
    except Exception as e:
        logger.error(f"Критическая ошибка: {e}")
