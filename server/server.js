const express = require('express')

//import routes to use

const app = express()

const {json, urlencoded} = express

//basic parse configuration
app.use(json())
app.use(urlencoded({extended:false}))


app.get('/test',(req,res)=>{
    res.send({'Test':'Hello world'})
})

// app.listen(process.env.PORT || PORT,HOST,()=>{console.log(`Server on port: ${PORT} and host ${HOST}`)});



module.exports = app