(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startAnimation = startAnimation;
var canvas = exports.canvas = document.getElementById('boardCanvas');
var ctx = exports.ctx = canvas && canvas.getContext('2d');
var ballRadius = exports.ballRadius = 10;
var x = exports.x = canvas && canvas.width / 2;
var y = exports.y = canvas && canvas.height - 100;
var dx = exports.dx = 2;
var dy = exports.dy = -2;
var paddleHeight = exports.paddleHeight = 10;
var paddleWidth = exports.paddleWidth = 75;
var paddleX = exports.paddleX = canvas && (canvas.width - paddleWidth) / 2;
var rightPressed = exports.rightPressed = false;
var leftPressed = exports.leftPressed = false;

function setPaddleListeners() {
  document.addEventListener('keydown', keyDownHandler, false);
  document.addEventListener('keyup', keyUpHandler, false);

  function keyDownHandler(e) {
    if (e.keyCode === 39) {
      exports.rightPressed = rightPressed = true;
    } else if (e.keyCode === 37) {
      exports.leftPressed = leftPressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.keyCode === 39) {
      exports.rightPressed = rightPressed = false;
    } else if (e.keyCode === 37) {
      exports.leftPressed = leftPressed = false;
    }
  }
}

function drawBall(ctx) {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle(ctx) {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = '#0095DD';
  ctx.fill();
  ctx.closePath();
}
function clearBoard() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  alert('Game Over!!');
  document.location.reload();
}
function startAnimation() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall(ctx);
  drawPaddle(ctx);
  setPaddleListeners();
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    exports.dx = dx = -dx;
  }
  if (y + dy < ballRadius) {
    exports.dy = dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      exports.dy = dy = -(2 * dy);
    } else {
      exports.dy = dy = -dy;
      clearBoard();
    }
  }
  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    exports.paddleX = paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    exports.paddleX = paddleX -= 7;
  }
  exports.x = x += dx;
  exports.y = y += dy;
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

},{}],2:[function(require,module,exports){
'use strict';

var _drawBoard = require('./drawBoard.js');

function requestSession() {
  var username = document.getElementById('username').value;
  UserAction(username).then(setSession).catch(handleError);
}

function UserAction(username) {
  var url = '/user';

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ username: username }),
    credentials: 'include',
    headers: new Headers({ 'Content-Type': 'application/json' })
  }).then(function (response) {
    return response.text();
  });
}

function handleError() {
  console.log('Game Initialisation Failed!! Please try again');
}

function setSession(data) {
  data = JSON.parse(data);
  if (!data.success) {
    document.querySelector('#status').textContent = data.message;
  } else {
    window.location.href = '/board.html';
  }
}

function startGame() {
  //  initialise board game
  document.querySelector('#gameManageBtn').textContent = 'Forfeit Game';
  setInterval(function () {
    (0, _drawBoard.startAnimation)(_drawBoard.ctx);
  }, 10);
}

Object.assign(window, { requestSession: requestSession, startGame: startGame });

},{"./drawBoard.js":1}]},{},[2]);
