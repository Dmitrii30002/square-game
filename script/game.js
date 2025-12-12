const levels = {
    easy: {
        name: "easy",
        size: 3,
        colors: 3,
        //time: 60,
        time: 15,
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
window.onload = function(){
    gameRatings = JSON.parse(localStorage.getItem('squareGameRatings')) 
    if(gameRatings == null) {
        gameRatings = {
            easy: [],
            medium: [],
            hard: [],
            expert: []
        }
    }
}

function addToRating() {
    const newEntry = {
        name: username,
        points: points,
    };

    gameRatings[level.name].push(newEntry);
    localStorage.setItem('squareGameRatings', JSON.stringify(gameRatings));
}

function showRating(id) {
    const element = document.getElementById(id)
    element.style.display = 'none'
    const ratingBlock = document.getElementById('ratingBlock')
    ratingBlock.style.display = 'inline'
    const data = JSON.parse(localStorage.getItem('squareGameRatings'));
    for (let mode in data) {
        const easyMode = document.getElementById(mode + 'Mode')
        data[mode].sort((a, b) => b.points - a.points);
        data[mode].forEach((player) => {
            const score = document.createElement('p')
            score.innerHTML = `${player.name}: ${player.points}`
            easyMode.appendChild(score)
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
    timer = setInterval(() => {
        timeLeft--;
        const progress = timeLeft / totalTime;
        timerLine.style.width = `${progress * 100}%`;

        if(timeLeft <= 10){
            for(let i=0; i<level.squares; i++) {
                let stopShake = createTimePressureShake(
                    document.getElementById('sq' + (i + 1)),
                    10
                );
            }
        }
        
        if (timeLeft <= -1) {
            timerLine.style.width = '0%';
            showResult()
        }
    }, 1000);
    switch(mode) {
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
    angle = 0
    const exampleBlock = document.getElementById('exampleBlock')
    exampleBlock.innerHTML = ''
    let square = document.createElement('div')
    square.className = 'square'
    for(let i=0; i < level.size*level.size; i++) {
        let block = document.createElement('div')
        block.className = 'squareBlock'
        let randomIndex = Math.floor(Math.random() * level.colors);
        block.style.background = colors[randomIndex]
        block.style.height = (200/level.size - 2) + 'px'
        block.style.width = (200/level.size - 2) + 'px'
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
    for(let i=0; i<level.squares; i++) {
        let square = document.createElement('div')
        square.className = 'square'
        for(let i=0; i < level.size*level.size; i++) {
            let block = document.createElement('div')
            block.className = 'squareBlock'
            let randomIndex = Math.floor(Math.random() * level.colors);
            block.style.background = colors[randomIndex]
            block.style.height = (200/level.size - 2) + 'px'
            block.style.width = (200/level.size - 2) + 'px'
            square.appendChild(block)
        }
        square.id = 'sq' + (i + 1)
        arr.push('sq' + (i+1))
        square.addEventListener('click', () => {
            if(square.id == rightInd) {
                points+=10
                runClassicGame()
            }
            else{
                points-=5
            }
        })
        options.appendChild(square)
    }

    let randomIndex = Math.floor(Math.random() * arr.length);
    let rightSquare = document.getElementById(arr[randomIndex])
    rightInd = arr[randomIndex]
    rightSquare.innerHTML = square.innerHTML
    let angles = [0, 90, 180, 270]
    randomIndex = Math.floor(Math.random() * angles.length);
    rightSquare.style.transform = `rotate(${angles[randomIndex]}deg)`
}

function runNonStandartGame() {
    const exampleBlock = document.getElementById('exampleBlock')
    exampleBlock.innerHTML = ''
    let square = document.createElement('div')
    square.className = 'square'
    for(let i=0; i < level.size*level.size; i++) {
        let block = document.createElement('div')
        block.className = 'squareBlock'
        let randomIndex = Math.floor(Math.random() * level.colors);
        block.style.background = colors[randomIndex]
        block.style.height = (200/level.size - 2) + 'px'
        block.style.width = (200/level.size - 2) + 'px'
        square.appendChild(block)
    }
    square.onmousedown = e => {
        rotating = true;
        const rect = square.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        startAngle = Math.atan2(e.clientY-cy, e.clientX-cx) * 180/Math.PI - angle;
    };

    document.onmousemove = e => {
        if (!rotating) return;
        const rect = square.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        angle = Math.atan2(e.clientY-cy, e.clientX-cx) * 180/Math.PI - startAngle;
        square.style.transform = `rotate(${angle}deg)`;
    };

    document.onmouseup = () => rotating = false;
    exampleBlock.appendChild(square)

    var arr = []
    const options = document.getElementById('options')
    options.style.display = 'flex'
    options.style.gap = '70px'
    options.innerHTML = ''
    for(let i=0; i<level.squares; i++) {
        let square = document.createElement('div')
        square.className = 'square'
        for(let i=0; i < level.size*level.size; i++) {
            let block = document.createElement('div')
            block.className = 'squareBlock'
            let randomIndex = Math.floor(Math.random() * level.colors);
            block.style.background = colors[randomIndex]
            block.style.height = (200/level.size - 2) + 'px'
            block.style.width = (200/level.size - 2) + 'px'
            square.appendChild(block)
        }
        square.id = 'sq' + (i + 1)
        arr.push('sq' + (i+1))
        randomAngle = Math.floor(Math.random() * 360);
        square.style.transform = `rotate(${randomAngle}deg)`
        square.addEventListener('click', () => {
            if(square.id == rightInd) {
                points+=10
                runNonStandartGame()
            }
            else{
                points-=5
            }
        })
        options.appendChild(square)
    }

    let randomIndex = Math.floor(Math.random() * arr.length);
    let rightSquare = document.getElementById(arr[randomIndex])
    rightInd = arr[randomIndex]
    rightSquare.innerHTML = square.innerHTML
    randomAngle= Math.floor(Math.random() * 360);
    rightSquare.style.transform = `rotate(${randomAngle}deg)`
}

function runCrazyGame() {
    const exampleBlock = document.getElementById('exampleBlock')
    exampleBlock.innerHTML = ''
    let square = document.createElement('div')
    square.className = 'square'
    for(let i=0; i < level.size*level.size; i++) {
        let block = document.createElement('div')
        block.className = 'squareBlock'
        let randomIndex = Math.floor(Math.random() * level.colors);
        block.style.background = colors[randomIndex]
        block.style.height = (200/level.size - 2) + 'px'
        block.style.width = (200/level.size - 2) + 'px'
        square.appendChild(block)
    }
    let rotating
    square.onmousedown = e => {
        rotating = true;
        const rect = square.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        startAngle = Math.atan2(e.clientY-cy, e.clientX-cx) * 180/Math.PI - angle;
    };

    document.onmousemove = e => {  
        if (!rotating){
            return
        } 
        const rect = square.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        angle = Math.atan2(e.clientY-cy, e.clientX-cx) * 180/Math.PI - startAngle;
        square.style.transform = `rotate(${angle}deg)`;
    };

    document.onmouseup = () => rotating = false;
    exampleBlock.appendChild(square)

    var arr = []
    const options = document.getElementById('options')
    options.style.display = 'inline'
    options.innerHTML = ''
    for(let i=0; i<level.squares; i++) {
        let square = document.createElement('div')
        square.className = 'square'
        for(let i=0; i < level.size*level.size; i++) {
            let block = document.createElement('div')
            block.className = 'squareBlock'
            let randomIndex = Math.floor(Math.random() * level.colors);
            block.style.background = colors[randomIndex]
            block.style.height = (200/level.size - 2) + 'px'
            block.style.width = (200/level.size - 2) + 'px'
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
        arr.push('sq' + (i+1))
        randomAngle = Math.floor(Math.random() * 360);
        square.style.transform = `rotate(${randomAngle}deg)`
        square.addEventListener('mousedown', dragStart);
        square.addEventListener('contextmenu', function(event) {
            event.preventDefault();
            if(square.id == rightInd) {
                points+=10
                runCrazyGame()
            }
            else{
                points-=5
            }
        })
        options.appendChild(square)
    }

    let randomIndex = Math.floor(Math.random() * arr.length);
    let rightSquare = document.getElementById(arr[randomIndex])
    rightInd = arr[randomIndex]
    rightSquare.innerHTML = square.innerHTML
    randomAngle = Math.floor(Math.random() * 360);
    rightSquare.style.transform = `rotate(${randomAngle}deg)`
}



let dragged = null;
let offsetX = 0, offsetY = 0;

// 5. Начало перетаскивания
function dragStart(e) {
    dragged = this;
    dragged.style.cursor = 'grabbing';
    
    // Смещение курсора относительно квадрата
    offsetX = e.clientX - dragged.getBoundingClientRect().left;
    offsetY = e.clientY - dragged.getBoundingClientRect().top;
    
    // Вешаем события на документ
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
}

// 6. Движение перетаскивания
function dragMove(e) {
    const area = document.getElementById('options');
    const w = area.offsetWidth, h = area.offsetHeight;
    if (!dragged) return;
    
    // Новые координаты
    let newX = e.clientX - offsetX - area.getBoundingClientRect().left;
    let newY = e.clientY - offsetY - area.getBoundingClientRect().top;
    
    // Не выходим за границы
    newX = Math.max(0, Math.min(newX, w - 60));
    newY = Math.max(0, Math.min(newY, h - 60));
    
    dragged.style.left = newX + 'px';
    dragged.style.top = newY + 'px';
}

// 7. Завершение перетаскивания
function dragEnd() {
    if (dragged) {
        dragged.style.cursor = 'move';
        dragged = null;
    }
    
    // Убираем обработчики
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
}

function createTimePressureShake(element, totalTime) {
  let startTime = Date.now();
  let animationId = null;
  
  function update() {
    const elapsed = (Date.now() - startTime) / 1000;
    const timeLeft = totalTime - elapsed;
    
    if (timeLeft <= 30 && timeLeft > 0) {
      // Рассчитать интенсивность
      let intensity = 0;
      if (timeLeft <= 5) intensity = 15;
      else if (timeLeft <= 10) intensity = 10;
      else if (timeLeft <= 20) intensity = 6;
      else intensity = 3;
      
      // Применить тряску
      const shakeX = Math.sin(Date.now() / 100) * intensity;
      const shakeY = Math.cos(Date.now() / 130) * intensity * 0.7;
      
      element.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
      
      // Мигание при критическом времени
      if (timeLeft <= 10) {
        element.style.opacity = 0.7 + 0.3 * Math.sin(Date.now() / 200);
      }
    } else if (timeLeft <= 0) {
      // Остановить анимацию
      cancelAnimationFrame(animationId);
      element.style.transform = '';
      element.style.opacity = '';
      return;
    } else {
      element.style.transform = '';
      element.style.opacity = '';
    }
    
    animationId = requestAnimationFrame(update);
  }
  
  animationId = requestAnimationFrame(update);
  
  // Функция для остановки
  return function stop() {
    cancelAnimationFrame(animationId);
    element.style.transform = '';
    element.style.opacity = '';
  };
}
