const { default: mongoose } = require("mongoose");

const taskSchema = new mongoose.Schema({
    title:{
    type:String,
    minlength:[3,"task name at least have 3 letters"],
    maxlength:[400,"task name maxiumum have 400 letters"],
    required :[true,"you must enter task name "] 
    }  ,
    isComplete :
    {
        type : Boolean ,
        default : false 
    }

})

const Task  = mongoose.model('Task',taskSchema)

module.exports=Task;