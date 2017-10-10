import { canvas, ctx, ballRadius, x, y, dx, dy, paddleHeight, paddleWidth, paddleX, rightPressed, leftPressed, startAnimation } from './drawBoard.js'

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
    window.location.href = '/board.html'
  }
}

function startGame () {
  //  initialise board game
  document.querySelector('#gameManageBtn').textContent = 'Forfeit Game'
  setInterval(() => { startAnimation(ctx) }, 10)
}

Object.assign(window, { requestSession, startGame })
