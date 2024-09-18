console.log('Script cargado')

const cards = document.querySelectorAll('.memory-card')
let hasFlippedCard = false
let lockBoard = false
let firstCard, secondCard
let moveCount = 0
let timer
let timeLeft = 300 // 5 minutos en segundos

function flipCard() {
  if (lockBoard || this === firstCard) return

  this.classList.add('flip')

  if (!hasFlippedCard) {
    // Primera carta clicada
    hasFlippedCard = true
    firstCard = this
    return
  }

  // Segunda carta clicada
  secondCard = this
  checkForMatch()
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework
  isMatch ? disableCards() : unflipCards()
  moveCount++
  updateMoveCount()
  checkForWin()
}

function disableCards() {
  firstCard.removeEventListener('click', flipCard)
  secondCard.removeEventListener('click', flipCard)
  resetBoard()
}

function unflipCards() {
  lockBoard = true
  setTimeout(() => {
    firstCard.classList.remove('flip')
    secondCard.classList.remove('flip')
    resetBoard()
  }, 1500)
}

function resetBoard() {
  ;[hasFlippedCard, lockBoard] = [false, false]
  ;[firstCard, secondCard] = [null, null]
}

function shuffleCards() {
  cards.forEach((card) => {
    let randomPos = Math.floor(Math.random() * cards.length)
    card.style.order = randomPos
  })
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--
    updateTimer()
    saveGameState() // Guarda el estado del juego en localStorage
    if (timeLeft <= 0) {
      clearInterval(timer)
      endGame('¡Se acabó el tiempo!')
    }
  }, 1000)
}

function updateTimer() {
  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  document.getElementById('timer').textContent = `Tiempo: ${String(
    minutes
  ).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function updateMoveCount() {
  document.getElementById('moves').textContent = `Movimientos: ${moveCount}`
  saveGameState() // Guarda el estado del juego en localStorage
}

function checkForWin() {
  if (document.querySelectorAll('.memory-card.flip').length === cards.length) {
    clearInterval(timer)
    setTimeout(() => endGame('¡Ganaste!'), 500)
  }
}

function endGame(message) {
  alert(message)
  document.getElementById('restart-button').style.display = 'block'
  cards.forEach((card) => card.removeEventListener('click', flipCard))
}

function restartGame() {
  moveCount = 0
  timeLeft = 300 // Reiniciar tiempo a 5 minutos
  document.getElementById('restart-button').style.display = 'none'
  cards.forEach((card) => {
    card.classList.remove('flip')
    card.addEventListener('click', flipCard)
  })
  shuffleCards()
  startTimer()
  saveGameState() // Guarda el estado del juego al reiniciar
}

function saveGameState() {
  const gameState = {
    moveCount: moveCount,
    timeLeft: timeLeft
  }
  localStorage.setItem('memoryGameState', JSON.stringify(gameState))
}

function loadGameState() {
  const storedState = localStorage.getItem('memoryGameState')
  if (storedState) {
    const gameState = JSON.parse(storedState)
    moveCount = gameState.moveCount
    timeLeft = gameState.timeLeft
    updateMoveCount()
    updateTimer()
  }
}

// Evento del botón de reinicio
document.getElementById('restart-button').addEventListener('click', restartGame)

// Mezclar cartas y comenzar temporizador cuando el juego inicie
document.addEventListener('DOMContentLoaded', () => {
  loadGameState() // Cargar el estado del juego
  cards.forEach((card) => card.addEventListener('click', flipCard))
  shuffleCards()
  startTimer()
})
