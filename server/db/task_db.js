//library for obtaining, deleting, updating and writing tasks in the SQLite or PostgreSQL database
const db = require('./helpers/db')

//container for the functions
let lib = {}

//create the Task Table
lib.createTaskTable = async function () {
  await db.run(`CREATE TABLE IF NOT EXISTS Tasks (
        uid INTEGER NOT NULL,
        title TEXT NOT NULL,
        priority INTEGER NOT NULL,
        stepNumber INTEGER NOT NULL,
        stepValue TEXT NOT NULL,
        status TEXT NOT NULL,
        dateToDisplay TEXT,
        dateTimeStamp INTEGER,
        lastModifiedDateToDisplay TEXT,
        lastModifiedDateTimeStamp INTEGER)`, {})
}

//add a task to the database
lib.addTaskToDB = async function (task) {
  try {
    //TODO Create function to validate if those parameters are valid, use package joi from npm
    const {
      uid,
      title,
      priority,
      steps,
      status,
      dateToDisplay,
      dateTimeStamp,
      lastModifiedDateToDisplay,
      lastModifiedDateTimeStamp
    } = task

    for (const step of steps) {
      const stepNumber = step.id ?? step.stepNumber
      const stepValue = step.value ?? step.stepValue

      const result = await db.run(
        `INSERT INTO Tasks (
                uid, title, priority, stepNumber, stepValue,
                status, dateToDisplay, dateTimeStamp,
                lastModifiedDateToDisplay, lastModifiedDateTimeStamp
                ) VALUES (
                @uid, @title, @priority, @stepNumber, @stepValue,
                @status, @dateToDisplay, @dateTimeStamp,
                @lastModifiedDateToDisplay, @lastModifiedDateTimeStamp
                )`,
        {
          uid,
          title,
          priority,
          stepNumber,
          stepValue,
          status,
          dateToDisplay,
          dateTimeStamp,
          lastModifiedDateToDisplay,
          lastModifiedDateTimeStamp
        }
      )

      let message = 'Error in creating task'
      if (result.changes) {
        message = 'Task created successfully'
      }
      return message
    }
    return true
  } catch (e) {
    console.log({ 'Error on adding task to database': e })
    return false
  }
}

//return a task by its uid
lib.getTask = async function (uid) {
  const tableColumns =
    'uid, title, priority, status, dateToDisplay, dateTimeStamp, lastModifiedDateToDisplay, lastModifiedDateTimeStamp'
  const task = await db.queryOne(`SELECT ${tableColumns} FROM Tasks WHERE uid = @uid`, { uid })
  if (!task) {
    return null
  }
  const steps = await db.queryAll(`SELECT stepNumber, stepValue FROM Tasks WHERE uid = @uid`, { uid })
  task.steps = steps
  return task
}

//return all the tasks
lib.getAllTasks = async function () {
  const tasks = await db.queryAll(
    'SELECT uid,title,priority, status, dateToDisplay, dateTimeStamp,lastModifiedDateToDisplay,lastModifiedDateTimeStamp FROM Tasks ',
    {}
  )

  //The previous query will return an array of tasks with repeated ids. We need to obtain an array with unique tasks.
  //JavaScript comes with the Set constructor to let us create sets, which are data structures that don’t have duplicate items
  //We can use it with JSON.stringify to create a set of stringified JavaScript objects
  //Then we can convert the sets back to an array with the spread operator.
  //Then we can convert the array of strings back to an array of objects with JSON.parse .
  let uniqueTasks = [...new Set(tasks.map((task) => JSON.stringify(task)))].map((task) => JSON.parse(task))

  const steps = await db.queryAll('SELECT uid,stepNumber,stepValue FROM Tasks ', {})

  //for each unique task, find their steps and add them as a new property in the unique task object
  uniqueTasks.forEach((task) => {
    const taskSteps = steps.filter((step) => step.uid === task.uid)
    task.steps = taskSteps
  })

  return uniqueTasks
}

//return the max uid in the database
lib.getMaxUid = async function () {
  const data = await db.queryOne('SELECT MAX(uid) as maxUid from Tasks', {})
  if (data?.maxUid !== undefined && data?.maxUid !== null) {
    return data.maxUid
  }
  if (data?.maxuid !== undefined && data?.maxuid !== null) {
    return data.maxuid
  }
  return -1
}

//update a tasks setp information by its uid and stepNumbe
//@Data should be an object as follows:
// {uid: '', stepNumber: '', stepValue: ''}
lib.updateStep = async function (uid, stepNumber, stepValue) {
  //TODO use package joi to validate the structure of the object
  const res = await db.run(
    `UPDATE Tasks
            SET stepValue = @stepValue
            WHERE uid = @uid AND stepNumber = @stepNumber`,
    {
      uid,
      stepValue,
      stepNumber
    }
  )
  //return the number of rows that were updated
  return res.changes
}

//updates tasks general and simple attributes: title, priority, status, lastModifiedDateToDisplay and lastModifiedDateTimeStamp
lib.updateTask = async function (data) {
  //TODO use package joi to validate the structure of the object
  const res = await db.run(
    `UPDATE Tasks
            SET title = @title, priority = @priority, status = @status, lastModifiedDateToDisplay = @dateDisplay, lastModifiedDateTimeStamp = @dateTimestamp
            WHERE uid = @uid`,
    {
      uid: data.uid,
      title: data.title,
      priority: data.priority,
      status: data.status,
      dateDisplay: data.lastModifiedDateToDisplay,
      dateTimestamp: data.lastModifiedDateTimeStamp
    }
  )
  //return the number of rows that were updated
  return res.changes
}

//obtain name of the columns in the database
lib.getDatabaseColumns = async function (tableName) {
  if (db.adapter === 'postgresql') {
    const columnsObject = await db.queryAll(
      `SELECT column_name as name FROM information_schema.columns WHERE table_name = @tableName`,
      { tableName: tableName.toLowerCase() }
    )
    return columnsObject.map((column) => column.name)
  }

  const columnsObject = await db.queryAll(`PRAGMA table_info(${tableName})`, {})
  //return only the name of the columns
  return columnsObject.map((column) => column.name)
}

module.exports = lib
