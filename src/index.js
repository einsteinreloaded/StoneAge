const express = require('express')
const winston = require('winston')
const path = require('path')

const PORT = process.env.PORT || 1337
const app = express()

// serve the website
app.use('/', express.static(path.join(__dirname, 'public')))

app.listen(PORT, () => {
  winston.info(`Server started listening on ${PORT}`)
})
