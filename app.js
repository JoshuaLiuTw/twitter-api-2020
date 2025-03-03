if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())

const methodOverride = require('method-override')
const passport = require('./config/passport')

const router = require('./routes')

const port = process.env.PORT || 3000
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(passport.initialize())
app.use(methodOverride('_method'))

app.use('/api', router)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
