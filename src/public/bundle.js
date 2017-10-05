(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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
  drawBoardCanvas()
}

function drawBoardCanvas () { // draw game board
  let canvas = document.getElementById('boardCanvas')
  let ctx = canvas.getContext('2d')
  let offset = 10
  ctx.strokeRect(offset, offset, canvas.width - 2 * offset, canvas.height - 2 * offset)
  ctx.beginPath()
  ctx.moveTo((canvas.width) / 2, offset)
  ctx.lineTo((canvas.width) / 2, canvas.width - offset)
  ctx.moveTo(offset, (canvas.width) / 2)
  ctx.lineTo(canvas.width - offset, (canvas.width) / 2)
  ctx.closePath()
  ctx.stroke()
  ctx.save()
}
function startRotation () {
  let canvas = document.getElementById('boardCanvas');
  let ctx = canvas.getContext('2d')

  ctx.globalCompositeOperation = 'destination-over'
  ctx.clearRect(0, 0, canvas.width, canvas.height) // clear canvas
  requestAnimationFrame(startRotation())
}
Object.assign(window, { requestSession, startGame })

},{}]},{},[1]);
