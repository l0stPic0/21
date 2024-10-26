const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
const cardValues = {
    '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'В': 2, 'Д': 3, 'К': 4, 'Т': [1, 11]
};

const cardImages = {
    '6': {
        'hearts': 'img/6_cherve.jpg',
        'diamonds': 'img/6_b.png',
        'clubs': 'img/6_kres.jpg',
        'spades': 'img/6_pik.jpg'
    },
    '7': {
        'hearts': 'img/7_cherve.jpg',
        'diamonds': 'img/7_b.png',
        'clubs': 'img/7_kres.jpg',
        'spades': 'img/7_pik.jpg'
    },
    '8': {
        'hearts': 'img/8_cherve.jpg',
        'diamonds': 'img/8_b.jpg',
        'clubs': 'img/8_kres.png',
        'spades': 'img/8_pik.jpg'
    },
    '9': {
        'hearts': 'img/9_cherve.jpg',
        'diamonds': 'img/9_b.png',
        'clubs': 'img/9_kres.jpg',
        'spades': 'img/9_pik.jpg'
    },
    '10': {
        'hearts': 'img/10_cherve.png',
        'diamonds': 'img/10_b.jpg',
        'clubs': 'img/10_kres.jpg',
        'spades': 'img/10_pik.jpg'
    },
    'В': {
        'hearts': 'img/J_cherve.jpg',
        'diamonds': 'img/J_b.jpg',
        'clubs': 'img/J_kres.jpg',
        'spades': 'img/J_pik.png'
    },
    'Д': {
        'hearts': 'img/Q_cherve.jpg',
        'diamonds': 'img/Q_b.jpg',
        'clubs': 'img/Q_kres.jpg',
        'spades': 'img/Q_pik.jpg'
    },
    'К': {
        'hearts': 'img/K_cherve.png',
        'diamonds': 'img/K_b.jpg',
        'clubs': 'img/K_kres.jpg',
        'spades': 'img/K_pik.jpg'
    },
    'Т': {
        'hearts': 'img/A_Cherve.png',
        'diamonds': 'img/A_b.png',
        'clubs': 'img/A_kres.png',
        'spades': 'img/A_pik.png'
    }
};

let deck = [];
let currentScore = 0;
let botCurrentScore = 0;
let moves = 0;
let playerName = '';
const recordList = JSON.parse(localStorage.getItem('records')) || [];

// Создание колоды
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let value in cardValues) {
            deck.push({ value, suit });
        }
    }
    shuffleDeck();
}

// Перемешивание колоды
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Обновление счета
function updateScore() {
    document.getElementById('score').innerText = `Очки: ${currentScore}`;
    document.getElementById('bot-score').innerText = `Очки бота: ${botCurrentScore}`;
}

// Обновление записей
function updateRecords() {
    const resultsBody = document.getElementById('resultsBody');
    resultsBody.innerHTML = '';

    if (recordList.length > 0) {
        recordList.forEach(record => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${record.name}</td><td>${record.moves}</td><td>${record.result}</td>`;
            resultsBody.insertBefore(tr, resultsBody.firstChild);
        });
    }
}

function updateDeckCount() {
    const deckCountElement = document.querySelector('.deck-count > span');
    deckCountElement.textContent = deck.length.toString();
}

// Отрисовка карты
function drawCard() {
    if (currentScore >= 21 || deck.length === 0) {
        return; // Игра завершена или колода пуста
    }

    document.getElementById('stop').disabled = false;

    const card = deck.pop();
    const cardElement = document.createElement('img');
    cardElement.className = 'card';
    cardElement.src = cardImages[card.value][card.suit];
    cardElement.alt = `${card.value} of ${card.suit}`;

    document.getElementById('cards').appendChild(cardElement);

    setTimeout(() => {
        cardElement.classList.add('animate');
    }, 10);

    let cardScore = cardValues[card.value];

    if (Array.isArray(cardScore)) {
        cardScore = (currentScore + 11 <= 21) ? 11 : 1;
    }

    currentScore += cardScore;
    moves++;
    updateScore();
    updateDeckCount();

    setTimeout(() => {
        if (botCurrentScore <= 17) botDrawCard();

        winCheck();
    }, 500);
}

let intervalId = null;
document.getElementById('stop').addEventListener("click", () => {
    intervalId = setInterval(() => {
        botDrawCard();
        winCheck();
    }, 500);
});

function winCheck() {
    if (currentScore === 21 || (botCurrentScore > 21 && currentScore <= 21) || (currentScore > botCurrentScore && botCurrentScore > 17 && currentScore <= 21)) {
        showModal(`Вы выиграли за ${moves} ходов!`);
        recordList.push({ name: playerName, moves, result: 'Вы выиграли' });
        localStorage.setItem('records', JSON.stringify(recordList));
        updateRecords();
        clearInterval(intervalId);
    } else if (currentScore > 21 || botCurrentScore === 21 || (botCurrentScore > currentScore && intervalId !== null)) {
        showModal('Вы проиграли!');
        recordList.push({ name: playerName, moves, result: 'Вы проиграли :(' });
        localStorage.setItem('records', JSON.stringify(recordList));
        updateRecords();
        clearInterval(intervalId);
    }
}

function botDrawCard() {
    if (deck.length === 0) return;

    const card = deck.pop();
    const cardElement = document.createElement('img');
    cardElement.className = 'card';
    cardElement.src = cardImages[card.value][card.suit];
    cardElement.alt = `${card.value} of ${card.suit}`;

    document.getElementById('bot-cards').appendChild(cardElement);

    setTimeout(() => {
        cardElement.classList.add('animate');
    }, 10);

    let cardScore = cardValues[card.value];

    if (Array.isArray(cardScore)) {
        cardScore = (botCurrentScore + 11 <= 21) ? 11 : 1;
    }

    moves++;
    botCurrentScore += cardScore;
    updateScore();
    updateDeckCount();
}

// Показ модального окна
function showModal(message) {
    const modal = document.getElementById('modal');
    const messageElement = document.getElementById('message');
    messageElement.textContent = message;

    modal.style.display = 'block';
}

// Закрытие модального окна при нажатии на крестик
document.getElementById('closeBtn').onclick = function () {
    document.getElementById('modal').style.display = 'none';
    resetGame();
}

// Закрытие модального окна при клике вне его содержимого
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        resetGame();
        modal.style.display = 'none';
    }
}

// Сброс игры
function resetGame() {
    currentScore = 0;
    botCurrentScore = 0;
    moves = 0;
    createDeck();
    updateDeckCount();
    document.getElementById('cards').innerHTML = '';
    document.getElementById('bot-cards').innerHTML = '';
    updateScore();
}

// Очистка записей
function clearRecords() {
    localStorage.removeItem('records');
    recordList.length = 0;
    updateRecords();
}

// Начало игры
document.getElementById('startGame').addEventListener('click', function () {
    playerName = document.getElementById('playerName').value.trim();
    if (playerName === '') {
        return; // Если имя пустое, не продолжаем
    }

    // Включаем кнопку "Тянуть карту"

    document.getElementById('drawCard').disabled = false;

    // Закрываем модальное окно после ввода имени
    document.getElementById('nameModal').style.display = 'none';

    // Очищаем поле ввода имени
    document.getElementById('playerName').value = '';
});

// Открытие модального окна при загрузке страницы
window.onload = function () {
    document.getElementById('nameModal').style.display = 'block';
    createDeck();
};

// События для кнопок
document.getElementById('drawCard').addEventListener('click', drawCard);
document.getElementById('clearRecords').addEventListener('click', clearRecords);
updateRecords();

const toggleTableButton = document.getElementById('toggleTable');
const resultsTableContainer = document.querySelector('.score__table');

// Обработчик события для кнопки показа/скрытия таблицы
toggleTableButton.addEventListener('click', () => {
    resultsTableContainer.style.display = resultsTableContainer.style.display === "none" ? "block" : "none";
});