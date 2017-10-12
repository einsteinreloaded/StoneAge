import io from 'socket.io-client'
export let canvas = document.getElementById('boardCanvas')
export let ctx = canvas && canvas.getContext('2d')
export let ballRadius = 10
export let x = canvas && canvas.width / 2
export let y = canvas && canvas.height - 100
export let dx = 2
export let dy = -2
export let paddleHeight = 10
export let paddleWidth = 75
export let paddleX = canvas && (canvas.width - paddleWidth) / 2
export let paddleTwoX = canvas && (canvas.width - paddleWidth) / 2
export let rightPressed = false
export let leftPressed = false
export let brickRowCount = 3
export let brickColumnCount = 5
export let brickWidth = 75
export let brickHeight = 20
export let brickPadding = 10
export let brickOffsetTop = 30
export let brickOffsetLeft = 30
export let bricks = []
export let score = 0

const socket = io.connect()

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = []
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}
function setPaddleListeners (token) {
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)
  // document.addEventListener('mousemove', mouseMoveHandler, false)

  function keyDownHandler (e) {
    if (e.keyCode === 39) {
      rightPressed = true
    } else if (e.keyCode === 37) {
      leftPressed = true
    }
  }

  function keyUpHandler (e) {
    if (e.keyCode === 39) {
      rightPressed = false
    } else if (e.keyCode === 37) {
      leftPressed = false
    }
  }

  function mouseMoveHandler (e) {
    let relativeX = e.clientX - canvas.offsetLeft
    if (relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth / 2
      //socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: paddleX })
    }
  }
}

function drawBall (ctx) {
  ctx.beginPath()
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle (ctx) {
  ctx.beginPath()
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function drawSecondPaddle (ctx) {
  ctx.beginPath()
  ctx.rect(paddleTwoX, 0, paddleWidth, paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function clearBoard () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  alert('Game Over!!')
  document.location.reload()
}

export function setPaddleTwoPosition (x, index) {
  if (index === 2) {
    paddleTwoX = x
  } else {
    paddleX = x
  }
}

export function startAnimation (token, index) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  // drawBoardCanvas(ctx)
  drawBall(ctx)
  drawSecondPaddle(ctx)// to draw top paddle
  drawPaddle(ctx)// to draw bottom paddle
  // drawBricks(ctx)
  // drawScore(ctx)
 // collisionDetection(ctx)
  setPaddleListeners(token)
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
  if (y + dy < ballRadius) {
    if (x > paddleTwoX && x < paddleTwoX + paddleWidth) {
      dy = -dy
    } else {
      dy = -dy
      clearBoard()
    }
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy
    } else {
      dy = -dy
      clearBoard()
    }
  }

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    if (index === 2) {
      paddleTwoX += 7
      socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: paddleTwoX, index: index })
    } else {
      paddleX += 7
      socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: paddleX, index: index })
    }
  } else if (leftPressed && paddleX > 0) {
    if (index === 2) {
      paddleTwoX -= 7
      socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: paddleTwoX, index: index })
    } else {
      paddleX -= 7
      socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: paddleX, index: index })
    }
  }
  x += dx
  y += dy
}

function drawBricks (ctx) {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
        let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
        bricks[c][r].x = brickX
        bricks[c][r].y = brickY
        ctx.beginPath()
        ctx.rect(brickX, brickY, brickWidth, brickHeight)
        ctx.fillStyle = '#0095DD'
        ctx.fill()
        ctx.closePath()
      }
    }
  }
}

function collisionDetection (ctx) {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      let b = bricks[c][r]
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy
          b.status = 0
          score++
          if (score === brickRowCount * brickColumnCount) {
            alert('YOU WIN, CONGRATULATIONS!')
            document.location.reload()
          }
        }
      }
    }
  }
}
function drawScore (ctx) {
  ctx.font = '16px Arial'
  ctx.fillStyle = '#0095DD'
  ctx.fillText('Score: ' + score, 8, 20)
}
function drawBoardCanvas (ctx) { // draw game board
  let offset = 0
  ctx.strokeRect(offset, offset, canvas.width - 2 * offset, canvas.height - 2 * offset)
  ctx.beginPath()
  ctx.moveTo((canvas.width) / 2, offset)
  ctx.lineTo((canvas.width) / 2, canvas.height - offset)
  ctx.moveTo(offset, (canvas.height) / 2)
  ctx.lineTo(canvas.width - offset, (canvas.height) / 2)
  ctx.stroke()
  ctx.closePath()
}

// export default function startRotation () {
//   let canvas = document.getElementById('boardCanvas')
//   let ctx = canvas.getContext('2d')
//   ctx.globalCompositeOperation = 'destination-over'
//   // ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
//   ctx.restore()
//   drawBoardCanvas()
//   ctx.translate(250, 250)
//   let time = new Date()
//   ctx.rotate(((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds())
//   ctx.translate(20, 20)
//   ctx.drawImage(earth, 50, 50)
//   ctx.save()
//   ctx.restore()
//   window.requestAnimationFrame(startRotation)
// }
