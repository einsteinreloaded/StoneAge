const express = require('express')
const winston = require('winston')
const bodyParser = require('body-parser')
const path = require('path')

const PORT = process.env.PORT || 1337
const app = express()

// serve the website
app.use('/', express.static(path.join(__dirname, 'public')))

app.use(bodyParser.json()); // for parsing application/json

app.listen(PORT, () => {
  winston.info(`Server started listening on ${PORT}`)
})

app.post('/user',function(request,response){
    var username=request.body.username;
    response.end(username);
  });
