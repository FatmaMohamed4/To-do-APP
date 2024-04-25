const express=require('express');
const router=express.Router();

const authController = require('../controller/authController.js');
const { addTask, updateTask, deleteTask, getTasks, getTaskbyId, completedTask } = require('../controller/taskController.js');

  
//for any user 
router.post('/add',
authController.protect ,addTask)

router.patch('/:id',authController.protect,updateTask)

router.delete('/:id',authController.protect ,deleteTask)

// router.delete('/delete/all',authController.protect,deleteAllTasks)

router.get('/all',authController.protect,getTasks)

router.get('/:id',authController.protect,getTaskbyId)

router.post('/done/:id',authController.protect ,completedTask)


module.exports=router;

