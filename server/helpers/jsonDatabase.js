//library for reading, writing, deleting and updating in the db

let fs = require('fs')

let pathDB = "server/db.json"

//container for the functions
let lib = {}

//return parsed data as an object in the database 
lib.read = function(){
    return JSON.parse(fs.readFileSync(pathDB))
}

//write data to the database
lib.write = function(data){
    try{
        fs.writeFileSync(pathDB,JSON.stringify(data))
    }catch(error){
        console.log({"There was an error writing to the DB":error})
        return false
    }
}

//deletes the object from the db given the property to look, and its value
lib.delete = function(property, propertyValue){
    try{
        let data = lib.read()
        
        //find if the object with the selected property and propertyValue exists
        if(data.find(element => element[property] === propertyValue)){
            //filter the data for element that does not match the given propertyValue,
            //which in turn will return an array with all of the elements except the one with the matching propertyValue
            lib.write( data.filter(element => element[property] !== propertyValue) )
            return true
        } else {
            return false
        }
    } catch(error){
        console.log({'Internal error in lib.delete':error})
    }
    

}

module.exports = lib