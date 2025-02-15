import os
import logging
from telegram import Update
from telegram.ext import Application, CommandHandler, ContextTypes

# Настройка логирования
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Токен из переменных окружения
TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text('Привет! Я бот.')

async def main():
    try:
        # Инициализация бота
        application = Application.builder().token(TOKEN).build()
        
        # Добавляем команды
        application.add_handler(CommandHandler("start", start))
        
        # Запускаем бота
        logger.info("Бот запускается...")
        await application.initialize()
        await application.start()
        await application.run_polling(allowed_updates=Update.ALL_TYPES)
        
    except Exception as e:
        logger.error(f"Ошибка: {e}")
        
    finally:
        # Корректное завершение
        await application.stop()
        await application.shutdown()

if __name__ == '__main__':
    import asyncio
    
    try:
        # Запускаем главную функцию
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Бот остановлен пользователем")
    except Exception as e:
        logger.error(f"Критическая ошибка: {e}")
