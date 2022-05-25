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
//i.e. api/task/?uid=1
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
            
            //create the taskTable
            db.createTaskTable()

            //obtain the current date
            let date = new Date()


            //create the new data to store in the sqlite db
            let data = {
                uid: db.getMaxUid() == -1 ? 1 : db.getMaxUid() + 1 ,
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
router.put('/updateTask',(req,res)=>{
    try {
        // TODO use package joi here instead of the db to validate data
        let {uid,title,priority,status,steps} = req.body
        //counter to track the modified rows
        let rowsCounter = 0
        if(uid != '' && title != '' && priority != '' && status != ''){
            //obtain the current date
            let date = new Date()
    
            //update data rows with new the new info
            rowsCounter += db.updateTask({
                uid:uid,
                title:title,
                priority: priority,
                status:status
            })
    
            //if steps array is not an empty array,update the necessary step rows
            if(steps != []){
                //for each step in the step array, update it in the database 
                steps.forEach(step => rowsCounter += db.updateStep(uid,step.stepNumber,step.stepValue))
            }
    
            //update the modified date
            rowsCounter += db.updateTask({
                lastModifiedDateToDisplay: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`,
                lastModifiedDateTimeStamp: date.getTime()
            })
            res.status(200).send({'Updated rows':rowsCounter})
        } else {
            res.status(400).send({'Missing parameters':'There are missing parameters to update a task'})
        }
    } catch (error) {
        res.status(500).send({'Error while updating the task':error})
    }


})

module.exports = router