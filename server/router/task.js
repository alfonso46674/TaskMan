const router = require('express').Router()
const db = require('../db/task_db')

//returns all tasks in the db
router.get('/all',(req,res)=>{
    try{    
        //read database for tasks
        let data = db.getAllTasks()

        res.status(200).send(data)
    }catch(error){
        res.status(400).send({'Error while obtaining the data':error})        
    }
})

//return a specific task by its uid
router.get('',(req,res)=>{
    try{
        let data = db.getTask(parseInt(req.query.uid))
        res.status(200).send(data)
    }catch(error){
        res.status(400).send({'Error while obtaining the task data':error})
    }
})

//create a new task 
router.post('/new',(req,res)=>{
    try{
        //TODO Create function to validate if those parameters are valid, use package joi from npm
        let {title, priority, steps} = req.body
        if(title !== undefined && priority !== undefined && steps !== undefined){
            
            db.createTaskTable()

            let date = new Date()
            //create the new data to store in the db.json
            let data = {
                uid: 1,
                // uid: dbJSON.length == 0 ? 1 :  Math.max.apply(Math,dbJSON.map(function(o){return o.uid;})) + 1,
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
            if(db.addTaskToDB(data)){
                res.status(201).send({'Success':'New task created'})
            } else {
                res.status(500).send('Error while uploading the new task')
            }
            

        } else {
            res.status(400).send({'Missing parameters':'There are missing parameters to create a new task'})
        }
    }catch(e){
        res.status(500).send({'Error while uploading the new task':e})
    }
})

//delete a task by its uid

//update a task by its uid

module.exports = router