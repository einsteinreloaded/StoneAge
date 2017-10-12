import { canvas, ctx, ballRadius, x, y, dx, dy, paddleHeight, paddleWidth, paddleX, paddleTwoX, rightPressed, leftPressed, brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft, bricks, score, setPaddleTwoPosition, startAnimation } from './drawBoard.js'
import io from 'socket.io-client'
const socket = io.connect()
let token = localStorage.getItem('token')
let index
function requestSession () {
  let username = document.getElementById('username').value
  UserAction(username).then(setSession).catch(handleError)
}

function UserAction (username) {
  const url = '/user'

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ username }),
    credentials: 'include',
    headers: new Headers({ 'Content-Type': 'application/json' })
  }).then(
    response => response.text()
  )
}

function handleError () {
  console.log('Game Initialisation Failed!! Please try again')
}

function setSession (data) {
  data = JSON.parse(data)
  if (!data.success) {
    document.querySelector('#status').textContent = data.message
  } else {
    localStorage.setItem('token', data.token)
    window.location.href = '/board.html'
  }
}
socket.on('PlayersPaddlePositionChangeDone', function (data) {
  if (data.token !== token) {
    setPaddleTwoPosition(data.x, data.index)
  }
  console.log(data.x)
})
socket.on('StartGameClient', function (data) {
  setInterval(() => { startAnimation(token, index) }, 10)
})
function startGame (i) {
  //  initialise board game
  index = i
  document.querySelector('#gameManageBtn').textContent = 'Forfeit Game'
  startAnimation(token, index)
  if (index === 2) {
    socket.emit('StartGame')
  }
}

Object.assign(window, { requestSession, startGame })
