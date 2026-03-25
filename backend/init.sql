-- Создание пользователя root с правами суперпользователя
CREATE USER root WITH SUPERUSER PASSWORD 'root';

-- Предоставление прав на базу данных
GRANT ALL PRIVILEGES ON DATABASE olimpiyec TO root;
