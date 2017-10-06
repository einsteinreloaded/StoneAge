let sun = new Image()
sun.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png'

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
  startRotation()
}

function drawBoardCanvas () { // draw game board
  let canvas = document.getElementById('boardCanvas')
  let ctx = canvas.getContext('2d')
  let offset = 10
  ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
  ctx.strokeRect(offset, offset, canvas.width - 2 * offset, canvas.height - 2 * offset)
  ctx.beginPath()
  ctx.moveTo((canvas.width) / 2, offset)
  ctx.lineTo((canvas.width) / 2, canvas.width - offset)
  ctx.moveTo(offset, (canvas.width) / 2)
  ctx.lineTo(canvas.width - offset, (canvas.width) / 2)
  ctx.closePath()
  ctx.stroke()
  ctx.moveTo(0, 0)
  ctx.save()
}

function startRotation () {
  let canvas = document.getElementById('boardCanvas')
  let ctx = canvas.getContext('2d')
  ctx.globalCompositeOperation = 'destination-over'
  //ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
  ctx.restore()
  drawBoardCanvas()
  ctx.translate(250, 250)
  let time = new Date()
  ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds())
  ctx.translate(20, 20)
  ctx.drawImage(sun, 50, 50)
  ctx.save()
  ctx.restore()
  requestAnimationFrame(startRotation)
}
Object.assign(window, { requestSession, startGame })
