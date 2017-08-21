const redis = require('redis')
const Promise = require('bluebird')

Promise.promisifyAll(redis.RedisClient.prototype)
Promise.promisifyAll(redis.Multi.prototype)

class RedisClient {
  constructor () {
    this.client = redis.createClient()
  }

  checkUser (username) {
    return this.client.getAsync(username)
  }

  addUser (username, token) {
    return this.client.setAsync(username, token)
  }
}

module.exports = new RedisClient()
