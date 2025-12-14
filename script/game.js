const levels = {
    easy: {
        name: "easy",
        size: 3,
        colors: 3,
        time: 60,
        squares: 3,
        description: "Начальный уровень"
    },
    medium: {
        name: "medium",
        size: 4,
        colors: 4,
        time: 90,
        squares: 4,
        description: "Для опытных игроков"
    },
    hard: {
        name: "hard",
        size: 5,
        colors: 5,
        time: 120,
        squares: 5,
        description: "Настоящий вызов"
    },
    expert: {
        name: "expert",
        size: 6,
        colors: 6,
        time: 150,
        squares: 6,
        description: "Только для мастеров!"
    }
};

var username
var level

const colors = [
    '#FF0000',
    '#FF7F00',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#4B0082',
    '#8B00FF'
];

var gameRatings

window.onload = function () {
    const saved = localStorage.getItem('squareGameRatings');

    if (saved) {
        const parsed = JSON.parse(saved);
        gameRatings = {
            easy: {},
            medium: {},
            hard: {},
            expert: {}
        };

        ['easy', 'medium', 'hard', 'expert'].forEach(level => {
            if (parsed[level]) {
                if (Array.isArray(parsed[level])) {
                    parsed[level].forEach(entry => {
                        if (!gameRatings[level][entry.name] || entry.points > gameRatings[level][entry.name].points) {
                            gameRatings[level][entry.name] = entry;
                        }
                    });
                } else {
                    Object.keys(parsed[level]).forEach(playerName => {
                        gameRatings[level][playerName] = parsed[level][playerName];
                    });
                }
            }
        });
    } else {
        gameRatings = {
            easy: {},
            medium: {},
            hard: {},
            expert: {}
        };
    }
}

function addToRating() {
    const current = gameRatings[level.name][username];

    if (!current || points > current.points) {
        gameRatings[level.name][username] = {
            name: username,
            points: points
        };
        localStorage.setItem('squareGameRatings', JSON.stringify(gameRatings));
    }
}

function showRating(id) {
    const element = document.getElementById(id)
    element.style.display = 'none'
    const ratingBlock = document.getElementById('ratingBlock')
    ratingBlock.style.display = 'inline'
    const data = JSON.parse(localStorage.getItem('squareGameRatings'));

    for (let mode in data) {
        const modeElement = document.getElementById(mode + 'Mode');
        if (!modeElement) continue;

        modeElement.innerHTML = '';

        const players = Object.values(data[mode] || {});

        players.sort((a, b) => b.points - a.points);

        players.forEach((player, index) => {
            const score = document.createElement('p');
            score.textContent = `${index + 1}. ${player.name}: ${player.points}`;
            modeElement.appendChild(score);
        });
    }
}

function exitToMenu() {
    const res = document.getElementById('result')
    res.style.display = 'none'
    const menu = document.getElementById('menu')
    menu.style.display = 'inline'
}

function exitToAuth(id) {
    const authBlock = document.getElementById('authBlock')
    const element = document.getElementById(id)
    element.style.display = 'none'
    authBlock.style.display = 'inline'
}

function showResult() {
    addToRating()
    clearInterval(timer);
    const gameBlock = document.getElementById('gameBlock')
    gameBlock.style.display = 'none'
    const res = document.getElementById('result')
    res.style.display = 'block'
    res.innerHTML = `
        <p>Конец игры</p>
        <p>Вы набрали:</p>
        <p>${points}</p>
        <p>Уровень: ${level.name}</p>
        <button class="gameRateBtn" onclick="showRating('result')">
            <span>Рейтинг</span>
        </button>
        <button class="gameExitBtn" onclick="exitToMenu()">
            <span>Выйти</span>
        </button>
    `
}

let angle = 0
var rightInd
var points = 0
var timer

function setupLevel(str, mode) {
    const menu = document.getElementById('menu')
    const gameBlock = document.getElementById('gameBlock')
    menu.style.display = 'none'
    gameBlock.style.display = 'inline'
    level = levels[str]
    points = 0
    let timeLeft = level.time
    const totalTime = level.time;
    const timerLine = document.getElementById('timer-line');
    const timeleftSound = document.getElementById('timeleftSound');
    timer = setInterval(() => {
        timeLeft--;
        const progress = timeLeft / totalTime;
        timerLine.style.width = `${progress * 100}%`;

        if (timeLeft <= 10) {
            if(timeLeft==10) {
                timeleftSound.currentTime = 0;
                timeleftSound.play();
            }
            shakeElements()
        }

        if (timeLeft <= -1) {
            timerLine.style.width = '0%';
            timeleftSound.pause()
            showResult()
        }
    }, 1000);
    switch (mode) {
        case 'classic':
            runClassicGame();
            break;
        case 'nonStandart':
            runNonStandartGame();
            break;
        case 'crazy':
            runCrazyGame();
    }
}

function runClassicGame() {
    const instruction = document.getElementById('instruction')
    instruction.innerHTML = `
        <p>Для поворота примера нажмите на него левой кнопком мыши</p>
        <p>Для выбора ответа наведитесь на вариант и нажмите левой кнопкой мыши</p>
    `
    angle = 0
    const exampleBlock = document.getElementById('exampleBlock')
    exampleBlock.innerHTML = ''
    let square = document.createElement('div')
    square.className = 'square'
    square.id = 'exampleSquare'
    for (let i = 0; i < level.size * level.size; i++) {
        let block = document.createElement('div')
        block.className = 'squareBlock'
        let randomIndex = Math.floor(Math.random() * level.colors);
        block.style.background = colors[randomIndex]
        block.style.height = (200 / level.size - 2) + 'px'
        block.style.width = (200 / level.size - 2) + 'px'
        square.appendChild(block)
    }
    square.addEventListener('click', () => {
        angle += 90
        square.style.transition = "transform 0.5s ease";
        square.style.transform = `rotate(${angle}deg)`;
    })
    exampleBlock.appendChild(square)

    var arr = []
    const options = document.getElementById('options')
    options.style.display = 'flex'
    options.innerHTML = ''
    for (let i = 0; i < level.squares; i++) {
        let square = document.createElement('div')
        square.className = 'square'
        for (let i = 0; i < level.size * level.size; i++) {
            let block = document.createElement('div')
            block.className = 'squareBlock'
            let randomIndex = Math.floor(Math.random() * level.colors);
            block.style.background = colors[randomIndex]
            block.style.height = (200 / level.size - 2) + 'px'
            block.style.width = (200 / level.size - 2) + 'px'
            square.appendChild(block)
        }
        square.id = 'sq' + (i + 1)
        arr.push('sq' + (i + 1))
        square.addEventListener('click', () => {
            if (square.id == 'rightSquare') {
                const correctSound = document.getElementById('correctSound');
                correctSound.currentTime = 0;
                correctSound.play();
                points += 10
                document.querySelectorAll('.square').forEach(sq => {
                    if (sq.id != 'exampleSquare' && sq.id != 'rightSquare') {
                        sq.style.display = 'none'
                    }
                });
                let choice = document.createElement('div')
                choice.className = 'choice'
                choice.id = 'choice'
                choice.innerHTML = `
                    <p>Верно!!!  +10</p>
                `
                options.appendChild(choice)
                setTimeout(() => {
                    options.innerHTML = ''
                    runClassicGame()
                }, 1500);
            }
            else {
                const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.currentTime = 0;
                incorrectSound.play();
                points -= 5
                square.style.boxShadow = '0 0 20px 5px red';
                
                setTimeout(() => {
                    square.style.boxShadow = '';
                }, 200);
            }
        })
        options.appendChild(square)
    }

    let randomIndex = Math.floor(Math.random() * arr.length);
    let rightSquare = document.getElementById(arr[randomIndex])
    rightSquare.id = 'rightSquare'
    rightInd = arr[randomIndex]
    rightSquare.innerHTML = square.innerHTML
    let angles = [0, 90, 180, 270]
    randomIndex = Math.floor(Math.random() * angles.length);
    rightSquare.style.transform = `rotate(${angles[randomIndex]}deg)`
}

function runNonStandartGame() {
    const instruction = document.getElementById('instruction')
    instruction.innerHTML = `
        <p>Для поворота примера наведитесь на него, зажмите лкм и двигайте мышь</p>
        <p>Для выбора ответа наведитесь на вариант и нажмите левой кнопкой мыши</p>
    `
    const exampleBlock = document.getElementById('exampleBlock')
    exampleBlock.innerHTML = ''
    let square = document.createElement('div')
    square.className = 'square'
    square.id = 'exampleSquare'
    for (let i = 0; i < level.size * level.size; i++) {
        let block = document.createElement('div')
        block.className = 'squareBlock'
        let randomIndex = Math.floor(Math.random() * level.colors);
        block.style.background = colors[randomIndex]
        block.style.height = (200 / level.size - 2) + 'px'
        block.style.width = (200 / level.size - 2) + 'px'
        square.appendChild(block)
    }
    let rotating = false
    square.onmousedown = e => {
        rotating = true;
        const rect = square.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI - angle;
    };

    document.onmousemove = e => {
        if (!rotating) return;
        const rect = square.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        angle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI - startAngle;
        square.style.transform = `rotate(${angle}deg)`;
    };

    document.onmouseup = () => rotating = false;
    exampleBlock.appendChild(square)

    var arr = []
    const options = document.getElementById('options')
    options.style.display = 'flex'
    options.innerHTML = ''
    for (let i = 0; i < level.squares; i++) {
        let square = document.createElement('div')
        square.className = 'square'
        for (let i = 0; i < level.size * level.size; i++) {
            let block = document.createElement('div')
            block.className = 'squareBlock'
            let randomIndex = Math.floor(Math.random() * level.colors);
            block.style.background = colors[randomIndex]
            block.style.height = (200 / level.size - 2) + 'px'
            block.style.width = (200 / level.size - 2) + 'px'
            square.appendChild(block)
        }
        square.id = 'sq' + (i + 1)
        arr.push('sq' + (i + 1))
        randomAngle = Math.floor(Math.random() * 360);
        square.style.transform = `rotate(${randomAngle}deg)`
        square.addEventListener('click', () => {
            if (square.id == 'rightSquare') {
                const correctSound = document.getElementById('correctSound');
                correctSound.currentTime = 0;
                correctSound.play();
                points += 10
                document.querySelectorAll('.square').forEach(sq => {
                    if (sq.id != 'exampleSquare' && sq.id != 'rightSquare') {
                        sq.style.display = 'none'
                    }
                });
                let choice = document.createElement('div')
                choice.className = 'choice'
                choice.id = 'choice'
                choice.innerHTML = `
                    <p>Верно!!!  +10</p>
                `
                options.appendChild(choice)
                setTimeout(() => {
                    options.innerHTML = ''
                    runNonStandartGame()
                }, 1500);
            }
            else {
                const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.currentTime = 0;
                incorrectSound.play();
                points -= 5
                square.style.boxShadow = '0 0 20px 5px red';
                
                setTimeout(() => {
                    square.style.boxShadow = '';
                }, 200);
            }
        })
        options.appendChild(square)
    }
    let randomIndex = Math.floor(Math.random() * arr.length);
    let rightSquare = document.getElementById(arr[randomIndex])
    rightSquare.id = 'rightSquare'
    rightInd = arr[randomIndex]
    rightSquare.innerHTML = square.innerHTML
    randomAngle = Math.floor(Math.random() * 360);
    rightSquare.style.transform = `rotate(${randomAngle}deg)`
}

function runCrazyGame() {
    const instruction = document.getElementById('instruction')
    instruction.innerHTML = `
        <p>Для поворота примера наведитесь на него, зажмите лкм и двигайте мышь</p>
        <p>Для выбора ответа наведитесь на вариант и нажмите правой кнопкой мыши</p>
        <p>Чтобы двигать варианты ответа, наведитесь на один из них и перетащите с помощью зажатия лкм</p>
    `
    const exampleBlock = document.getElementById('exampleBlock')
    exampleBlock.innerHTML = ''
    let square = document.createElement('div')
    square.className = 'square'
    square.id = 'exampleSquare'
    for (let i = 0; i < level.size * level.size; i++) {
        let block = document.createElement('div')
        block.className = 'squareBlock'
        let randomIndex = Math.floor(Math.random() * level.colors);
        block.style.background = colors[randomIndex]
        block.style.height = (200 / level.size - 2) + 'px'
        block.style.width = (200 / level.size - 2) + 'px'
        square.appendChild(block)
    }
    let rotating
    square.onmousedown = e => {
        rotating = true;
        const rect = square.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI - angle;
    };

    document.onmousemove = e => {
        if (!rotating) {
            return
        }
        const rect = square.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        angle = Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI - startAngle;
        square.style.transform = `rotate(${angle}deg)`;
    };

    document.onmouseup = () => rotating = false;
    exampleBlock.appendChild(square)

    var arr = []
    const options = document.getElementById('options')
    options.style.display = 'inline'
    options.innerHTML = ''
    for (let i = 0; i < level.squares; i++) {
        let square = document.createElement('div')
        square.className = 'square'
        for (let i = 0; i < level.size * level.size; i++) {
            let block = document.createElement('div')
            block.className = 'squareBlock'
            let randomIndex = Math.floor(Math.random() * level.colors);
            block.style.background = colors[randomIndex]
            block.style.height = (200 / level.size - 2) + 'px'
            block.style.width = (200 / level.size - 2) + 'px'
            square.appendChild(block)
        }
        options.style.display = 'inline'
        square.style.position = 'absolute'
        const maxX = options.offsetWidth - 200;
        const maxY = options.offsetHeight - 200;
        const x = Math.floor(Math.random() * maxX);
        const y = Math.floor(Math.random() * maxY);
        square.style.left = `${x}px`;
        square.style.top = `${y}px`;

        square.id = 'sq' + (i + 1)
        arr.push('sq' + (i + 1))
        randomAngle = Math.floor(Math.random() * 360);
        square.style.transform = `rotate(${randomAngle}deg)`
        square.addEventListener('mousedown', dragStart);
        square.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            if (square.id == 'rightSquare') {
                const correctSound = document.getElementById('correctSound');
                correctSound.currentTime = 0;
                correctSound.play();
                points += 10
                document.querySelectorAll('.square').forEach(sq => {
                    if (sq.id != 'exampleSquare' && sq.id != 'rightSquare') {
                        sq.style.display = 'none'
                    }
                });
                square.style.position = 'static'
                let choice = document.createElement('div')
                options.style.display = 'flex'
                choice.className = 'choice'
                choice.id = 'choice'
                choice.innerHTML = `
                    <p>Верно!!!  +10</p>
                `
                options.appendChild(choice)
                setTimeout(() => {
                    options.innerHTML = ''
                    runCrazyGame()
                }, 1500);
            }
            else {
                const incorrectSound = document.getElementById('incorrectSound');
                incorrectSound.currentTime = 0;
                incorrectSound.play();
                points -= 5
                square.style.boxShadow = '0 0 20px 5px red';
                
                setTimeout(() => {
                    square.style.boxShadow = '';
                }, 200);
            }
        })
        options.appendChild(square)
    }

    let randomIndex = Math.floor(Math.random() * arr.length);
    let rightSquare = document.getElementById(arr[randomIndex])
    rightSquare.id = 'rightSquare'
    rightInd = arr[randomIndex]
    rightSquare.innerHTML = square.innerHTML
    randomAngle = Math.floor(Math.random() * 360);
    rightSquare.style.transform = `rotate(${randomAngle}deg)`
}



let dragged = null;
let offsetX = 0, offsetY = 0;

function dragStart(e) {
    dragged = this;
    dragged.style.cursor = 'grabbing';

    offsetX = e.clientX - dragged.getBoundingClientRect().left;
    offsetY = e.clientY - dragged.getBoundingClientRect().top;

    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
}

function dragMove(e) {
    const area = document.getElementById('options');
    const w = area.offsetWidth, h = area.offsetHeight;
    if (!dragged) return;

    let newX = e.clientX - offsetX - area.getBoundingClientRect().left;
    let newY = e.clientY - offsetY - area.getBoundingClientRect().top;

    newX = Math.max(0, Math.min(newX, w - 60));
    newY = Math.max(0, Math.min(newY, h - 60));

    dragged.style.left = newX + 'px';
    dragged.style.top = newY + 'px';
}

function dragEnd() {
    if (dragged) {
        dragged.style.cursor = 'move';
        dragged = null;
    }

    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
}

function shakeElements() {
    document.querySelectorAll('.square').forEach(square => {
        if (square.id != 'exampleSquare') {
            const rotateMatch = square.style.transform.match(/rotate\(([-\d.]+)deg\)/);
            const currentRotate = rotateMatch ? rotateMatch[1] : '0';

            const originalTransform = square.style.transform;

            let count = 0;
            const interval = setInterval(() => {
                if (count >= 20) {
                    clearInterval(interval);
                    square.style.transform = originalTransform;
                    return;
                }

                const x = (Math.random() - 0.5) * 8;
                const y = (Math.random() - 0.5) * 8;

                square.style.transform =
                    `translate(${x}px, ${y}px) rotate(${currentRotate}deg)`;
                count++;
            }, 50);
        }
    });
}
