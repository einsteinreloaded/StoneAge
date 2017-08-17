const express = require('express')
const winston = require('winston')

const PORT = process.env.PORT || 1337
const app = express()

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.listen(PORT, () => {
  winston.info(`Server started listening on ${PORT}`)
})
