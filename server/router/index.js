const router = require('express').Router()

//Route that handles everything related to storing task data in the DB
const taskRoute = require('./task')
router.use('/api/task',taskRoute)

module.exports = router