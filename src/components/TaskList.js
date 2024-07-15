import React, { useEffect, useState } from 'react'
import TaskForm from './TaskForm'
import Task from './Task'
import axios from 'axios'
import {toast} from 'react-toastify'
import { URL } from '../App'
import loaderImg from '../assests/loader.gif'

const TaskList = () => {
  const [task,setTask]=useState([])
  const [taskID,setTaskID]=useState('')
  const [isEditing,setIsEditing]=useState(false)
  const [isLoading,setIsLoading]=useState(false)
  const [markCompletedTask,setMarkCompletedTask]=useState([])
  const [formData,setFormData]=useState({
    name:'',
    completed:false
  })

  const {name}=formData;

  //get total task 
  

  const handleInputChange=(e)=>{
     const {name,value}=e.target;
     setFormData({...formData,[name]:value})
  }

  const handleSubmit=async (e)=>{
    e.preventDefault()
    try {

      if(name === ''){
        return toast.error('Please Add a task')
      }

      await axios.post(`${URL}/api/task`,formData);
      toast.success('Task added successfully')
      setFormData({...formData,name:''})
      getTasks();
    } catch (error) {
      toast.error(error.message)
    }
    
  }

 const getTasks=async ()=>{
     setIsLoading(true)
     try {

      const {data}=await axios.get(`${URL}/api/task`)
      setTask(data)
     setIsLoading(false)
     } catch (error) {
      toast.error(error.message)
     }

 }

  
 useEffect(function (){
  getTasks();
 },[])


const deleteTask=async (id)=>{
  try {
   await axios.delete(`${URL}/api/task/${id}`)
   toast.success('Task Successfully deleted')
    getTasks();
  } catch (error) {
    toast.error(error.message)
  }
}

//get count completed tasks
useEffect(()=>{
  const cTask=task.filter((tasks)=>{ 
    return tasks.completed === true;
  });
  setMarkCompletedTask(cTask)
},[task])

const getSingleTask=async (task) => {
   setFormData({
    name:task.name,
    completed:false
   })
   setIsEditing(true)
   setTaskID(task._id)
}

const updateTask=async (e) => {
  e.preventDefault()
  try {
    await axios.put(`${URL}/api/task/${taskID}`,formData)
    setFormData({...formData,name:''})
    setIsEditing(false)
    getTasks();
    toast.success('Task sucessfully updated')
  } catch (error) {
    toast.error(error.message)
  }
}

const  setCompleteTask=async (task)=>{
    const newFormData=({
      name:task.name,
      completed:true
    })
    try {
      await axios.put(`${URL}/api/task/${task._id}`,newFormData)
      getTasks();
    } catch (error) {
      toast.error(error.message)
    }
   
}


  return (
    <div>
      <h2>Task Manager</h2>
      <TaskForm handleInputChange={handleInputChange} name={name} handleSubmit={handleSubmit} isEditing={isEditing} updateTask={updateTask}/>
   {task.length > 0 &&  <>
    <div className='--flex-between --pd'>
        <p>
          <b>Total Task:</b> {task.length}
        </p>
        <p>
          <b>Completed Task:</b>{markCompletedTask.length}
        </p>
      </div>
      <hr /> </> }
     {isLoading && 
        (
          <div className="--flex-center">
            <img src={loaderImg} alt="loader" />
          </div>
        )
     }
     
     {!isLoading && task.length === 0 ? (
      <p className='--py'>No Task Added. Please add a Task</p>
     ) : (
      task.map((task,index)=><Task task={task} key={task._id} index={index} deleteTask={deleteTask} getSingleTask={getSingleTask} setCompleteTask={setCompleteTask} markCompletedTask={markCompletedTask}/>)
     )}
    </div>

  )
}

export default TaskList
