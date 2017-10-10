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
export let rightPressed = false
export let leftPressed = false

function setPaddleListeners () {
  document.addEventListener('keydown', keyDownHandler, false)
  document.addEventListener('keyup', keyUpHandler, false)

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
function clearBoard () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  alert('Game Over!!')
  document.location.reload()
}
export function startAnimation () {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  drawBall(ctx)
  drawPaddle(ctx)
  setPaddleListeners()
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx
  }
  if (y + dy < ballRadius) {
    dy = -dy
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -(2 * dy)
    } else {
      dy = -dy
      clearBoard()
    }
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7
  }
  x += dx
  y += dy
}

// function drawBoardCanvas () { // draw game board
//   let canvas = document.getElementById('boardCanvas')
//   let ctx = canvas.getContext('2d')
//   let offset = 10
//   ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
//   ctx.strokeRect(offset, offset, canvas.width - 2 * offset, canvas.height - 2 * offset)
//   ctx.beginPath()
//   ctx.moveTo((canvas.width) / 2, offset)
//   ctx.lineTo((canvas.width) / 2, canvas.width - offset)
//   ctx.moveTo(offset, (canvas.width) / 2)
//   ctx.lineTo(canvas.width - offset, (canvas.width) / 2)
//   ctx.closePath()
//   ctx.stroke()
//   ctx.moveTo(0, 0)
//   ctx.save()
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
