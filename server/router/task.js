const router = require('express').Router()
const db = require('../db/task_db')

//returns all tasks in the db
router.get('/all', async (req, res) => {
  try {
    //read database for tasks
    const data = await db.getAllTasks()

    res.status(200).send(data)
  } catch (error) {
    res.status(400).send({ 'Error while obtaining the data': error })
  }
})

//return a specific task by its uid
//i.e. api/task/?uid=1
router.get('', async (req, res) => {
  try {
    const data = await db.getTask(parseInt(req.query.uid, 10))
    if (!data) {
      res.status(404).send({ error: 'Task not found' })
      return
    }
    res.status(200).send(data)
  } catch (error) {
    res.status(400).send({ 'Error while obtaining the task data': error })
  }
})

//create a new task
router.post('/new', async (req, res) => {
  try {
    //TODO Create function to validate if those parameters are valid, use package joi from npm
    const { title, priority, steps } = req.body
    if (title !== undefined && priority !== undefined && steps !== undefined) {
      //create the taskTable
      await db.createTaskTable()

      //obtain the current date
      const date = new Date()

      const currentMax = await db.getMaxUid()

      //create the new data to store in the database
      const data = {
        uid: currentMax === -1 ? 1 : currentMax + 1,
        title: title,
        priority: priority,
        steps: steps,
        status: 'Active',
        dateToDisplay: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        dateTimeStamp: date.getTime(),
        lastModifiedDateToDisplay: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        lastModifiedDateTimeStamp: date.getTime()
      }

      //append the data object to the db
      if (await db.addTaskToDB(data)) {
        res.status(201).send({ Success: 'New task created' })
      } else {
        res.status(500).send('Error while uploading the new task')
      }
    } else {
      res.status(400).send({ 'Missing parameters': 'There are missing parameters to create a new task' })
    }
  } catch (e) {
    res.status(500).send({ 'Error while uploading the new task': e })
  }
})

//update a task by its uid
router.put('/updateTask', async (req, res) => {
  try {
    // TODO use package joi here instead of the db to validate data
    const { uid, title, priority, status, steps } = req.body
    //counter to track the modified rows
    let rowsCounter = 0
    if (uid != '' && title != '' && priority != '' && status != '') {
      //obtain the current date
      const date = new Date()

      //update data rows with new the new info
      rowsCounter += await db.updateTask({
        uid: uid,
        title: title,
        priority: priority,
        status: status
      })

      //if steps array is not an empty array,update the necessary step rows
      if (Array.isArray(steps) && steps.length > 0) {
        for (const step of steps) {
          rowsCounter += await db.updateStep(uid, step.stepNumber, step.stepValue)
        }
      }

      //update the modified date
      rowsCounter += await db.updateTask({
        uid: uid,
        lastModifiedDateToDisplay: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
        lastModifiedDateTimeStamp: date.getTime()
      })
      res.status(200).send({ 'Updated rows': rowsCounter })
    } else {
      res.status(400).send({ 'Missing parameters': 'There are missing parameters to update a task' })
    }
  } catch (error) {
    res.status(500).send({ 'Error while updating the task': error })
  }
})

module.exports = router
