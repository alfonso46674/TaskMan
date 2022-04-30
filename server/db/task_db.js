//library for obtaining, deleting, updating and writing tasks in the SQLite database
const db = require('./helpers/db')

//container for the functions
let lib = {}

//create the Task Table
lib.createTaskTable = function(){
    db.run(`CREATE TABLE IF NOT EXISTS Tasks (
        uid, title, priority, stepNumber, stepValue, status,
        dateToDisplay, dateTimeStamp, lastModifiedDateToDisplay,
        lastModifiedDateTimeStamp)`,{})
}

//add a task to the database
lib.addTaskToDB = async function(task){
    try{
        //TODO no recibir el uid, sino crearlo aqui. Hacer una peticion para encontrar el id maximo
        //TODO Create function to validate if those parameters are valid, use package joi from npm
        let {uid, title, priority, steps, status, dateToDisplay, 
            dateTimeStamp, lastModifiedDateToDisplay,
            lastModifiedDateTimeStamp} = task
        
        steps.forEach(step => {
            let stepNumber = step.id
            let stepValue = step.value 

            const result = db.run(`INSERT INTO Tasks VALUES (
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
            })

            let message = 'Error in creating task'
            if(result.changes){
                message = 'Task created successfully'
            }
            return message
        })
        return true
    }catch(e){
        console.log({'Error on adding task to database':e})
        return false
    }
}


//return a task by its uid
lib.getTask = function(uid){
    let tableColumns = ' uid,title,priority, stepNumber, stepValue, status, dateToDisplay, dateTimeStamp,lastModifiedDateToDisplay,lastModifiedDateTimeStamp'
    let task = db.queryOne(`SELECT ${tableColumns} FROM Tasks WHERE uid = ?`, [uid])
    let steps = db.queryAll(`SELECT ${tableColumns} stepNumber,stepValue FROM Tasks WHERE uid = ?`, [uid])
    task.steps = steps
    return task
}

//return all the tasks
lib.getAllTasks = function(){
    let tasks = db.queryAll('SELECT uid,title,priority, status, dateToDisplay, dateTimeStamp,lastModifiedDateToDisplay,lastModifiedDateTimeStamp FROM Tasks ', {})

    //The previous query will return an array of tasks with repeated ids. We need to obtain an array with unique tasks. 
  //JavaScript comes with the Set constructor to let us create sets, which are data structures that don’t have duplicate items
  //We can use it with JSON.stringify to create a set of stringified JavaScript objects
  //Then we can convert the sets back to an array with the spread operator.
  //Then we can convert the array of strings back to an array of objects with JSON.parse .
  let uniqueTasks = [...new Set(tasks.map(task => JSON.stringify(task)))].map(task => JSON.parse(task))

  let steps = db.queryAll('SELECT uid,stepNumber,stepValue FROM Tasks ', {})

    //for each unique task, find their steps and add them as a new property in the unique task object
    uniqueTasks.forEach(task => {
        let taskSteps = steps.filter(step => step.uid === task.uid)
        task.steps = taskSteps
        })
    
   return uniqueTasks
}

module.exports = lib
