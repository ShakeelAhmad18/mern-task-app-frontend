import React from 'react'

const TaskForm = ({name,handleInputChange,handleSubmit,isEditing,updateTask}) => {
  return (
    <form className='task-form' onSubmit={isEditing ? updateTask : handleSubmit}>
      <input type="text" name='name' placeholder='Add a task' value={name} onChange={handleInputChange}/>
      <button type='submit'>{isEditing ? 'Edit' : 'Add'}</button>
    </form>
  )
}

export default TaskForm
