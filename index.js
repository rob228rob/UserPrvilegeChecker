const express = require('express');
const path = require('path');
const open = require('open');
const addon = require('./build/Release/addon.node');

const app = express();
const PORT = 3000;

// Указываем путь к статическим файлам (CSS, изображения и т.д.)
app.use(express.static(path.join(__dirname, 'public')));

// Разбираем URL-кодированные данные
app.use(express.urlencoded({ extended: true }));

// HTML содержимое для index.html
const indexHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Проверка привилегий пользователя</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <h1>Проверка привилегий пользователя</h1>
    <form action="/check-privilege" method="post">
        <label for="username">Имя пользователя:</label>
        <input type="text" id="username" name="username" required>
        <button type="submit">Проверить</button>
    </form>
</body>
</html>
`;

// HTML содержимое для result.html
const resultHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Результат проверки</title>
    <link rel="stylesheet" href="/style.css">
</head>
<body>
    <h1 id="result"></h1>
    <button onclick="goBack()">Назад</button>

    <script>
        function goBack() {
            window.history.back();
        }

        document.addEventListener('DOMContentLoaded', () => {
            const urlParams = new URLSearchParams(window.location.search);
            const username = urlParams.get('username');
            const privilege = urlParams.get('privilege');
            const resultElement = document.getElementById('result');
            if (privilege === "Пользователь не найден") {
                resultElement.innerText = \`Пользователя \${username} нет\`;
            } else {
                resultElement.innerText = \`Пользователь \${username} имеет привилегию \${privilege}\`;
            }
        });
    </script>
</body>
</html>
`;

app.get('/', (req, res) => {
    res.send(indexHTML);
});

app.post('/check-privilege', (req, res) => {
    const username = req.body.username;
    const privilege = addon.getUserPrivilege(username);

    res.redirect(`/result?username=${username}&privilege=${privilege}`);
});

app.get('/result', (req, res) => {
    const { username, privilege } = req.query;
    res.send(resultHTML);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    open(`http://localhost:${PORT}`);
});
