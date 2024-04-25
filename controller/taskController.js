const Task = require("../model/taskModel.js")
// const AppError = require("../utilities/AppError.js")
// const catchError = require("../utilities/catchError.js")


exports.addTask =async (req,res)=>{
    try{
        
        const task = await Task.create(req.body)
            res.status(201).json({
                status:true,
                message:"new task is added",
                Task :task
                
            })
    }
        catch(err){
            res.status(401).json({
                status:false,
                error:err ,
                
            })
        }
}

exports.getTasks = async (req, res) => {
    const tasks = await Task.find();
    if (!tasks || tasks.length === 0) {
        res.status(200).json({
            status: false,
            message: "Tasks not found",
            
        });
    }

    res.status(200).json({
        status: true,
        message: "Tasks found",
        tasks: tasks,
    });
};

exports.getTaskbyId =async (req,res)=>{
    
     const id = req.params.id
     const task = await Task.find({_id:id, 
        user: req.user.token
    }
    ) 
     if (task){
        res.status(201).json({
            status:true,
            task :task      
        })
     }else {
        res.status(404).json ({
            status:false ,
            message :"task not found  "
        })
     }

    }
    
exports.updateTask = async (req,res) =>{
    try{
        const id = req.params.id
     const task = await Task.findByIdAndUpdate({_id:id},{$set:req.body},{new:true}) 

     if (task){
        res.status(201).json({
            status:true,
            message :"task is updated " ,
            updated_Task :task
        })
    }
 } catch(err){
        res.status(401).json({
            status:false,
            message : "task not found"
            // error:err ,   
        })
    }
}
 
exports.deleteTask = async (req,res) =>{
    try{
        const id = req.params.id
        const task = await Task.findByIdAndDelete({id, user: req.user.token},{new:true}) 
   
        if (!item){
           res.status(404).json({
               status:true,
               message :"task isnot found " ,
            
           })
        }
       res.json ({message : "task id deleted"}) 
       
    }
    catch(err){
        res.status(401).json({
            status:false,
            message : "task not found err : the length of id is incorrect" ,
            // error:err ,   
        })
    }
}

// exports.deleteAllTasks = async (req,res)=>{
//     try{
//         const task =  await Task.find({ user: req.user.token})
//         .deleteMany({ user: req.user.token})
//         if(!task){
//             res.status(404).json({
//                 status:false,
//                 message :"tasks Not found"
//             })
//         }
//         res.status(201).json({
//           status:true,
//           message:"tasks deleted",
//       })
//       }
//       catch(err){
//           res.status(401).json({
//               status:false,
//               error:err ,
              
//           })
//       }
// }

exports.completedTask = async (req, res) => {
    try {
        const id = req.params.id;
        // Find the task by its ID and user token
        const existingTask = await Task.findOne({ _id: id, user: req.user.token });

        // If the task doesn't exist, return a 404 error
        if (!existingTask) {
            return res.status(404).json({
                msg: "Task not found"
            });
        }

        // Update the completed field of the found task to true
        existingTask.isComplete = true;
        await existingTask.save();

        // Respond with success message and updated task details
        res.status(202).json({
            msg: "Task is updated to be completed",
            result: existingTask
        });
    } catch (error) {
        console.error('Error updating task by ID:', error);
        res.status(500).send('Internal Server Error');
    }
};