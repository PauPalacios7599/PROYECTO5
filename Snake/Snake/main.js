console.log('Script cargado') // Verificar que el script se carga correctamente

const canvas = document.getElementById('gameCanvas')
const ctx = canvas.getContext('2d')
const timeDisplay = document.getElementById('time')
const restartButton = document.getElementById('restartButton')
const difficulty = document.getElementById('difficulty')

const box = 20
let snake = [{ x: 9 * box, y: 10 * box }]
let direction = null
let food = {
  x: Math.floor(Math.random() * 19) * box,
  y: Math.floor(Math.random() * 19) * box
}
let score = 0
let gameTime = 0
let gameInterval, timeInterval
let speed = 100 // Valor por defecto

// Controlar la dirección de la serpiente
document.addEventListener('keydown', changeDirection)

function changeDirection(event) {
  if (event.keyCode === 37 && direction !== 'RIGHT') direction = 'LEFT'
  else if (event.keyCode === 38 && direction !== 'DOWN') direction = 'UP'
  else if (event.keyCode === 39 && direction !== 'LEFT') direction = 'RIGHT'
  else if (event.keyCode === 40 && direction !== 'UP') direction = 'DOWN'
}

// Dibujar la serpiente y la comida
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < snake.length; i++) {
    ctx.fillStyle = i === 0 ? 'green' : 'white'
    ctx.fillRect(snake[i].x, snake[i].y, box, box)
    ctx.strokeStyle = 'black'
    ctx.strokeRect(snake[i].x, snake[i].y, box, box)
  }

  ctx.fillStyle = 'red'
  ctx.fillRect(food.x, food.y, box, box)

  let snakeX = snake[0].x
  let snakeY = snake[0].y

  if (direction === 'LEFT') snakeX -= box
  if (direction === 'UP') snakeY -= box
  if (direction === 'RIGHT') snakeX += box
  if (direction === 'DOWN') snakeY += box

  if (snakeX === food.x && snakeY === food.y) {
    score++
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box
    }
  } else {
    snake.pop()
  }

  let newHead = {
    x: snakeX,
    y: snakeY
  }

  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(gameInterval)
    clearInterval(timeInterval) // Detener el contador de tiempo
    alert('Juego Terminado')
  }

  snake.unshift(newHead)
}

// Comprobar colisión
function collision(head, array) {
  for (let i = 1; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true
    }
  }
  return false
}

// Actualizar el tiempo
function updateTime() {
  gameTime++
  updateScoreAndTime()
  saveGameState() // Guarda el estado del juego en localStorage
}

// Actualizar el puntaje y el tiempo en pantalla
function updateScoreAndTime() {
  timeDisplay.textContent = gameTime
  console.log('Tiempo actualizado: ' + gameTime) // Verificar si el tiempo se actualiza
}

// Guardar el estado del juego en localStorage
function saveGameState() {
  const gameState = {
    score: score,
    gameTime: gameTime
  }
  localStorage.setItem('snakeGameState', JSON.stringify(gameState))
}

// Cargar el estado del juego desde localStorage
function loadGameState() {
  const storedState = localStorage.getItem('snakeGameState')
  if (storedState) {
    const gameState = JSON.parse(storedState)
    score = gameState.score
    gameTime = gameState.gameTime
    updateScoreAndTime()
  }
}

// Iniciar el juego
function startGame() {
  direction = null
  snake = [{ x: 9 * box, y: 10 * box }]
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box
  }
  gameTime = 0
  updateScoreAndTime()
  clearInterval(gameInterval)
  clearInterval(timeInterval)
  gameInterval = setInterval(draw, speed)
  timeInterval = setInterval(updateTime, 1000) // Actualizar el tiempo cada segundo
}

// Evento del botón de reinicio
restartButton.addEventListener('click', startGame)

// Evento de cambio de dificultad
difficulty.addEventListener('change', function () {
  if (difficulty.value === 'easy') speed = 150
  else if (difficulty.value === 'medium') speed = 100
  else if (difficulty.value === 'hard') speed = 50
  clearInterval(gameInterval)
  gameInterval = setInterval(draw, speed)
  saveGameState() // Guarda el estado del juego con la nueva velocidad
})

// Ejecutar el juego por primera vez
document.addEventListener('DOMContentLoaded', () => {
  loadGameState() // Cargar el estado del juego
  startGame() // Iniciar el juego
})
