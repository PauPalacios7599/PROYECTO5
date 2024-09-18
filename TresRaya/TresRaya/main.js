const board = document.getElementById('gameBoard')
const cells = document.querySelectorAll('#gameBoard td')
const restartButton = document.getElementById('restartButton')
const difficultySelect = document.getElementById('difficulty')
const statusDisplay = document.getElementById('status')
const scoreDisplay = document.getElementById('score')

let currentPlayer = 'X' // X empieza el juego
let boardState = ['', '', '', '', '', '', '', '', ''] // Estado del tablero
let gameMode = 'player' // Modo de juego: 'player' o 'ai'
let score = { X: 0, O: 0 } // Puntaje

function updateStatus(message) {
  statusDisplay.textContent = message
}

function updateScore() {
  scoreDisplay.textContent = `X: ${score.X} - O: ${score.O}`
  saveScore() // Guarda el puntaje en localStorage
}

function saveScore() {
  localStorage.setItem('score', JSON.stringify(score))
}

function loadScore() {
  const storedScore = localStorage.getItem('score')
  if (storedScore) {
    score = JSON.parse(storedScore)
    updateScore()
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Filas
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columnas
    [0, 4, 8],
    [2, 4, 6] // Diagonales
  ]

  for (let combination of winningCombinations) {
    const [a, b, c] = combination
    if (
      boardState[a] &&
      boardState[a] === boardState[b] &&
      boardState[a] === boardState[c]
    ) {
      updateStatus(`¡Jugador ${currentPlayer} gana!`)
      score[currentPlayer]++
      updateScore()
      return true
    }
  }
  if (!boardState.includes('')) {
    updateStatus('Empate!')
    return true
  }
  return false
}

function handleClick(event) {
  if (currentPlayer === 'O' || gameMode === 'player') {
    const index = event.target.dataset.index
    if (boardState[index] === '') {
      boardState[index] = currentPlayer
      event.target.textContent = currentPlayer
      event.target.classList.add(currentPlayer.toLowerCase()) // Añade la clase 'x' o 'o'
      if (checkWinner()) {
        cells.forEach((cell) => cell.removeEventListener('click', handleClick))
      } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X' // Cambiar jugador
        updateStatus(`Jugador ${currentPlayer}, es tu turno`)
        if (currentPlayer === 'O' && gameMode === 'ai') {
          setTimeout(aiMove, 500) // Esperar un poco antes de hacer el movimiento de la IA
        }
      }
    }
  }
}

function aiMove() {
  let availableMoves = boardState
    .map((state, index) => (state === '' ? index : null))
    .filter((index) => index !== null)

  if (availableMoves.length === 0) return

  let move
  if (difficultySelect.value === 'easy') {
    move = availableMoves[Math.floor(Math.random() * availableMoves.length)]
  } else if (difficultySelect.value === 'medium') {
    move = bestMoveMedium(availableMoves)
  } else if (difficultySelect.value === 'hard') {
    move = bestMoveHard(availableMoves)
  }

  boardState[move] = 'O'
  cells[move].textContent = 'O'
  cells[move].classList.add('o') // Añade la clase 'o'
  if (checkWinner()) {
    cells.forEach((cell) => cell.removeEventListener('click', handleClick))
  } else {
    currentPlayer = 'X' // Cambiar de vuelta al jugador humano
    updateStatus(`Jugador ${currentPlayer}, es tu turno`)
  }
}

function bestMoveMedium(availableMoves) {
  return availableMoves[Math.floor(Math.random() * availableMoves.length)]
}

function bestMoveHard(availableMoves) {
  return minimax(boardState, 'O').index
}

function minimax(boardState, player) {
  const opponent = player === 'O' ? 'X' : 'O'
  let bestScore = player === 'O' ? -Infinity : Infinity
  let bestMove

  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] === '') {
      boardState[i] = player
      const score = minimaxScore(boardState, player)
      boardState[i] = ''
      if (
        (player === 'O' && score > bestScore) ||
        (player === 'X' && score < bestScore)
      ) {
        bestScore = score
        bestMove = i
      }
    }
  }

  return { index: bestMove, score: bestScore }
}

function minimaxScore(boardState, player) {
  if (checkWinner()) {
    return player === 'O' ? 10 : -10
  }

  if (!boardState.includes('')) {
    return 0
  }

  const scores = []
  const opponent = player === 'O' ? 'X' : 'O'

  for (let i = 0; i < boardState.length; i++) {
    if (boardState[i] === '') {
      boardState[i] = player
      scores.push(minimaxScore(boardState, opponent))
      boardState[i] = ''
    }
  }

  return player === 'O' ? Math.max(...scores) : Math.min(...scores)
}

function restartGame() {
  boardState = ['', '', '', '', '', '', '', '', '']
  cells.forEach((cell) => {
    cell.textContent = ''
    cell.classList.remove('x', 'o') // Elimina las clases 'x' y 'o'
    cell.addEventListener('click', handleClick)
  })
  currentPlayer = 'X' // Resetear el jugador a X
  gameMode = 'player' // Reiniciar el modo de juego
  updateStatus(`Jugador ${currentPlayer}, es tu turno`)
}

document.addEventListener('DOMContentLoaded', () => {
  loadScore()
  restartGame() // Inicializar el juego
})

cells.forEach((cell) => cell.addEventListener('click', handleClick))
restartButton.addEventListener('click', restartGame)
