import io from 'socket.io-client'
export let boardVars = {
  canvas: document.getElementById('boardCanvas'),
  ctx: null,
  ballRadius: 10,
  x: 0,
  y: 0,
  dx: 2,
  dy: -1,
  paddleHeight: 10,
  paddleWidth: 75,
  paddleX: 0,
  paddleTwoX: 0,
  rightPressed: false,
  leftPressed: false,
  brickRowCount: 3,
  brickColumnCount: 5,
  brickWidth: 75,
  brickHeight: 20,
  brickPadding: 10,
  brickOffsetTop: 30,
  brickOffsetLeft: 30,
  bricks: [],
  score: 0,
  hitcount: 0
}
const socket = io.connect()
boardVars.ctx = boardVars.canvas && boardVars.canvas.getContext('2d')
boardVars.paddleX = boardVars.canvas && (boardVars.canvas.width - boardVars.paddleWidth) / 2
boardVars.paddleTwoX = boardVars.canvas && (boardVars.canvas.width - boardVars.paddleWidth) / 2
boardVars.x = boardVars.canvas && boardVars.canvas.width / 2
boardVars.y = boardVars.canvas && boardVars.canvas.height - 100

for (let c = 0; c < boardVars.brickColumnCount; c++) {
  boardVars.bricks[c] = []
  for (let r = 0; r < boardVars.brickRowCount; r++) {
    boardVars.bricks[c][r] = { x: 0, y: 0, status: 1 }
  }
}
function setPaddleListeners (token) {
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)
}

function keyDownHandler (e) {
  if (e.keyCode === 39) {
    boardVars.rightPressed = true
  } else if (e.keyCode === 37) {
    boardVars.leftPressed = true
  }
}

function keyUpHandler (e) {
  if (e.keyCode === 39) {
    boardVars.rightPressed = false
  } else if (e.keyCode === 37) {
    boardVars.leftPressed = false
  }
}
function drawBall (ctx) {
  ctx.beginPath()
  ctx.arc(boardVars.x, boardVars.y, boardVars.ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function drawPaddle (ctx) {
  ctx.beginPath()
  ctx.rect(boardVars.paddleX, boardVars.canvas.height - boardVars.paddleHeight, boardVars.paddleWidth, boardVars.paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function drawSecondPaddle (ctx) {
  ctx.beginPath()
  ctx.rect(boardVars.paddleTwoX, 0, boardVars.paddleWidth, boardVars.paddleHeight)
  ctx.fillStyle = '#0095DD'
  ctx.fill()
  ctx.closePath()
}

function clearBoard () {
  boardVars.ctx.clearRect(0, 0, boardVars.canvas.width, boardVars.canvas.height)
  alert('Game Over!!')
  document.location.reload()
}

export function setPaddleTwoPosition (x, index) {
  if (index === 2) {
    boardVars.paddleTwoX = x
  } else {
    boardVars.paddleX = x
  }
}

export function startAnimation (token, index) {
  boardVars.ctx.clearRect(0, 0, boardVars.canvas.width, boardVars.canvas.height)
  // drawBoardCanvas(ctx)
  drawBall(boardVars.ctx)
  drawSecondPaddle(boardVars.ctx)// to draw top paddle
  drawPaddle(boardVars.ctx)// to draw bottom paddle
  // drawBricks(ctx)
  // drawScore(ctx)
 // collisionDetection(ctx)
  setPaddleListeners(token)
  if (boardVars.x + boardVars.dx > boardVars.canvas.width - boardVars.ballRadius || boardVars.x + boardVars.dx < boardVars.ballRadius) {
    boardVars.dx = -boardVars.dx
  }
  if (boardVars.y + boardVars.dy < boardVars.ballRadius) {
    if (boardVars.x > boardVars.paddleTwoX && boardVars.x < boardVars.paddleTwoX + boardVars.paddleWidth) {
      boardVars.hitcount++
      boardVars.dy = (boardVars.hitcount % 10) === 0 ? -boardVars.dy : -(boardVars.dy / Math.abs(boardVars.dy)) * (Math.abs(boardVars.dy) + 1)
    } else {
      boardVars.dy = -boardVars.dy
      clearBoard()
    }
  } else if (boardVars.y + boardVars.dy > boardVars.canvas.height - boardVars.ballRadius) {
    if (boardVars.x > boardVars.paddleX && boardVars.x < boardVars.paddleX + boardVars.paddleWidth) {
      boardVars.hitcount++
      boardVars.dy = (boardVars.hitcount % 10) === 0 ? -(boardVars.dy / Math.abs(boardVars.dy)) * (Math.abs(boardVars.dy) + 1) : -boardVars.dy
    } else {
      boardVars.dy = -boardVars.dy
      clearBoard()
    }
  }
  if (index === 1) {
    if (boardVars.rightPressed && boardVars.paddleX < boardVars.canvas.width - boardVars.paddleWidth) {
      boardVars.paddleX += 7
      socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: boardVars.paddleX, index: index })
    } else if (boardVars.leftPressed && boardVars.paddleX > 0) {
      boardVars.paddleX -= 7
      socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: boardVars.paddleX, index: index })
    }
  } else {
    if (boardVars.rightPressed && boardVars.paddleTwoX < boardVars.canvas.width - boardVars.paddleWidth) {
      boardVars.paddleTwoX += 7
      socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: boardVars.paddleTwoX, index: index })
    } else if (boardVars.leftPressed && boardVars.paddleTwoX > 0) {
      boardVars.paddleTwoX -= 7
      socket.emit('PlayersPaddlePositionChangeRequest', { token: token, x: boardVars.paddleTwoX, index: index })
    }
  }
  boardVars.x += boardVars.dx
  boardVars.y += boardVars.dy
}

// function drawBricks (ctx) {
//   for (let c = 0; c < brickColumnCount; c++) {
//     for (let r = 0; r < brickRowCount; r++) {
//       if (bricks[c][r].status === 1) {
//         let brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
//         let brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop
//         bricks[c][r].x = brickX
//         bricks[c][r].y = brickY
//         ctx.beginPath()
//         ctx.rect(brickX, brickY, brickWidth, brickHeight)
//         ctx.fillStyle = '#0095DD'
//         ctx.fill()
//         ctx.closePath()
//       }
//     }
//   }
// }

// function collisionDetection (ctx) {
//   for (let c = 0; c < brickColumnCount; c++) {
//     for (let r = 0; r < brickRowCount; r++) {
//       let b = bricks[c][r]
//       if (b.status === 1) {
//         if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
//           dy = -dy
//           b.status = 0
//           score++
//           if (score === brickRowCount * brickColumnCount) {
//             alert('YOU WIN, CONGRATULATIONS!')
//             document.location.reload()
//           }
//         }
//       }
//     }
//   }
// }
// function drawScore (ctx) {
//   ctx.font = '16px Arial'
//   ctx.fillStyle = '#0095DD'
//   ctx.fillText('Score: ' + score, 8, 20)
// }
// function drawBoardCanvas (ctx) { // draw game board
//   let offset = 0
//   ctx.strokeRect(offset, offset, canvas.width - 2 * offset, canvas.height - 2 * offset)
//   ctx.beginPath()
//   ctx.moveTo((canvas.width) / 2, offset)
//   ctx.lineTo((canvas.width) / 2, canvas.height - offset)
//   ctx.moveTo(offset, (canvas.height) / 2)
//   ctx.lineTo(canvas.width - offset, (canvas.height) / 2)
//   ctx.stroke()
//   ctx.closePath()
// }

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
