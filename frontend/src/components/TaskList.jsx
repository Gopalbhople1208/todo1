import { useState } from 'react';
import { useTask } from '../hooks/useAuth';
import '../styles/tasks.css';

export default function TaskList({ tasks, onEdit, onDelete }) {
  const { loading } = useTask();

  if (loading && tasks.length === 0) {
    return <div className="loading">Loading tasks...</div>;
  }

  if (tasks.length === 0) {
    return <div className="no-tasks">No tasks yet. Create one to get started!</div>;
  }

  return (
    <div className="tasks-grid">
      {tasks.map((task) => (
        <div key={task._id} className="task-card">
          <div className="task-header">
            <h3>{task.title}</h3>
            <div className="task-actions">
              <button 
                className="btn-edit" 
                onClick={() => onEdit(task)}
                title="Edit task"
              >
                Update
              </button>
              <button 
                className="btn-delete" 
                onClick={() => onDelete(task._id)}
                title="Delete task"
              >
                Delete
              </button>
            </div>
          </div>
          <p className="task-description">{task.description}</p>
          <small className="task-date">
            {new Date(task.createdAt).toLocaleDateString()}
          </small>
        </div>
      ))}
    </div>
  );
}
