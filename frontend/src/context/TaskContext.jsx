import { createContext, useState, useCallback } from 'react';
import { taskAPI } from '../services/api';

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAllTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.getAll();
      if (response.data.success) {
        setTasks(response.data.data || []);
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addTask = useCallback(async (taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.create(taskData);
      if (response.data.success) {
        // Refresh tasks list
        await fetchAllTasks();
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllTasks]);

  const updateTask = useCallback(async (id, taskData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.update(id, taskData);
      if (response.data.success) {
        // Refresh tasks list
        await fetchAllTasks();
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchAllTasks]);

  const deleteTask = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.delete(id);
      if (response.data.success) {
        // Update local state
        setTasks((prev) => prev.filter((task) => task._id !== id));
        return response.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTask = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await taskAPI.getOne(id);
      if (response.data.success) {
        return response.data.data;
      }
    } catch (err) {
      const message = err.response?.data?.message || err.message;
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        error,
        fetchAllTasks,
        addTask,
        updateTask,
        deleteTask,
        getTask,
        setError,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export default TaskContext;
