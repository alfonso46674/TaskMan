const express = require('express')
const cors = require('cors')

//import routes to use
const router = require('./router/index')

const app = express()

const {json, urlencoded} = express

//basic parse configuration
app.use(json())
app.use(urlencoded({extended:false}))
app.use(cors())

app.use(router)

app.get('/test',(req,res)=>{
    res.send({'Test':'Hello world'})
})


if(process.env.NODE_ENV == 'serverTest'){
    app.listen(process.env.PORT || 4674,'0.0.0.0',()=>{console.log(`Server on port: 4674 and host 0.0.0.0`)});
}



module.exports = app