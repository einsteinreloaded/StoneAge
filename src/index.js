const db = require('./services/redis.js')
const jwt = require('jsonwebtoken')
const express = require('express')
const winston = require('winston')
const bodyParser = require('body-parser')
const path = require('path')
const cookieParser = require('cookie-parser')
const Promise = require('bluebird')

const PORT = process.env.PORT || 1337
const app = express()
const secret = 'redPikachu'

app.use(bodyParser.json()) // for parsing application/json
app.use(cookieParser())

// serve the website
app.use('/', express.static(path.join(__dirname, 'public')))

app.post('/user', (req, res) => {
  let { username } = req.body

  if(!username) {
    res.statusCode = 400
    return res.send({success: false, message: 'invalid username'})
  }
  Promise.coroutine(function * () {
    let nameExists = yield db.checkUser(username)
    if (!!nameExists) {
      return res.send({success: false, message: 'user already exists'})
    }

    let token = jwt.sign({ username }, secret, {expiresIn: '1day'})
    yield db.addUser(username, token)
    res.cookie('session', token, {maxAge: 86400})
    res.send({success: true, token})
  }) ()
})

app.listen(PORT, () => {
  winston.info(`Server started listening on ${PORT}`)
})
