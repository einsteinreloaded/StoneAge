const express = require('express')
const winston = require('winston')
const bodyParser = require('body-parser')
const path = require('path')

const PORT = process.env.PORT || 1337
const app = express()

app.use(bodyParser.json()) // for parsing application/json

// serve the website
app.use('/', express.static(path.join(__dirname, 'public')))

app.post('/user', (request, response) => {
  var username = request.body.username
  response.end(username)
})

app.listen(PORT, () => {
  winston.info(`Server started listening on ${PORT}`)
})
