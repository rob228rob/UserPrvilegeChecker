@echo off

if not exist node_modules (
    echo Установка зависимостей...
    npm install
)

if not exist build\Release\addon.node (
    echo Сборка проекта...
    node-gyp configure build
)

if not exist build (
    npm run build
    timeout /t 12
)

echo Server starting
start http://localhost:3000
npm start
node index.js

pause
