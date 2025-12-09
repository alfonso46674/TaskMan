require('dotenv').config()
const express = require('express')
const cors = require('cors')

//import routes to use
const router = require('./router/index')

const app = express()

const { json, urlencoded } = express

const corsOptions = process.env.CORS_ORIGIN
  ? { origin: process.env.CORS_ORIGIN, optionsSuccessStatus: 200 }
  : {}

//basic parse configuration
app.use(json())
app.use(urlencoded({ extended: false }))
app.use(cors(corsOptions))

app.use(router)

app.get('/test', (req, res) => {
  res.status(200).send({ status: 'ok' })
})

const PORT = process.env.PORT || 4674
const HOST = process.env.HOST || '0.0.0.0'

if (require.main === module) {
  app.listen(PORT, HOST, () => {
    console.log(`Server on port: ${PORT} and host ${HOST}`)
  })
}

module.exports = app
