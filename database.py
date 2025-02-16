import sqlite3
from sqlite3 import Error

class Database:
    def __init__(self, db_file="manga_bot.db"):
        self.db_file = db_file
        self.create_tables()
    
    def get_connection(self):
        try:
            conn = sqlite3.connect(self.db_file)
            return conn
        except Error as e:
            print(f"Ошибка подключения к БД: {e}")
            return None
    
    def create_tables(self):
        conn = self.get_connection()
        if conn is not None:
            try:
                c = conn.cursor()
                # Создаем таблицу пользователей
                c.execute('''
                    CREATE TABLE IF NOT EXISTS users (
                        user_id TEXT PRIMARY KEY,
                        player_id INTEGER,
                        username TEXT,
                        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                    )
                ''')
                conn.commit()
            except Error as e:
                print(f"Ошибка создания таблицы: {e}")
            finally:
                conn.close()
    
    def add_user(self, user_id, username):
        conn = self.get_connection()
        if conn is not None:
            try:
                c = conn.cursor()
                # Получаем максимальный player_id
                c.execute('SELECT MAX(player_id) FROM users')
                max_id = c.fetchone()[0]
                new_player_id = 1 if max_id is None else max_id + 1
                
                # Добавляем пользователя
                c.execute('''
                    INSERT OR IGNORE INTO users (user_id, player_id, username)
                    VALUES (?, ?, ?)
                ''', (user_id, new_player_id, username))
                conn.commit()
                return new_player_id
            except Error as e:
                print(f"Ошибка добавления пользователя: {e}")
                return None
            finally:
                conn.close()
    
    def get_user(self, user_id):
        conn = self.get_connection()
        if conn is not None:
            try:
                c = conn.cursor()
                c.execute('SELECT * FROM users WHERE user_id = ?', (user_id,))
                user = c.fetchone()
                if user:
                    return {
                        'user_id': user[0],
                        'player_id': user[1],
                        'username': user[2],
                        'created_at': user[3]
                    }
                return None
            except Error as e:
                print(f"Ошибка получения пользователя: {e}")
                return None
            finally:
                conn.close()
    
    def get_total_users(self):
        conn = self.get_connection()
        if conn is not None:
            try:
                c = conn.cursor()
                c.execute('SELECT COUNT(*) FROM users')
                return c.fetchone()[0]
            except Error as e:
                print(f"Ошибка подсчета пользователей: {e}")
                return 0
            finally:
                conn.close() 
