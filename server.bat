@echo off

if not exist node_modules (
    echo Установка зависимостей...
    npm install  // Установка зависимостей Node.js
)

if not exist build\Release\addon.node (
    echo Сборка проекта...
    node-gyp configure build  // Конфигурация и сборка проекта с помощью node-gyp
)

echo starting server
start http://localhost:3000
node index.js
pause
