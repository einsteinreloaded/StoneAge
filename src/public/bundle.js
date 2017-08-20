(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
console.log('this is working!!')

function submitUsername () {
  var username = document.getElementById('username').value
  UserAction(username).then(setSession).catch(handleError)
}

function UserAction (username) {
  const url = '/user'

  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({ username: username }),
    headers: new Headers({ 'Content-Type': 'application/json' })
  }).then(
    response => response.text()
)
}

function handleError () {
  alert('Game Initialisation Failed!! Please try again')
}

function setSession (data) {
  var sessionId = data
  console.log(sessionId)
  window.location.href = '/board.html'
}

Object.assign(window, {showLogin: submitUsername})

},{}]},{},[1]);
