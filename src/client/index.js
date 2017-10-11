import { canvas, ctx, ballRadius, x, y, dx, dy, paddleHeight, paddleWidth, paddleX, paddleTwoX, rightPressed, leftPressed, brickRowCount, brickColumnCount, brickWidth, brickHeight, brickPadding, brickOffsetTop, brickOffsetLeft, bricks, score, setPaddleTwoPosition, startAnimation } from './drawBoard.js'
import io from 'socket.io-client'
const socket = io.connect()
let token
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
    token = data.token
    window.location.href = '/board.html'
  }
}

socket.on('PlayersPaddlePositionChangeDone', function (data) {
  setPaddleTwoPosition(data.x)
  console.log(data.x)
})

function startGame () {
  //  initialise board game
  document.querySelector('#gameManageBtn').textContent = 'Forfeit Game'
  setInterval(() => { startAnimation(token) }, 10)
}

Object.assign(window, { requestSession, startGame })
