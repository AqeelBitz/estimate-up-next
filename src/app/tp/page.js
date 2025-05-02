'use client';

import { useState } from 'react';
import Head from 'next/head';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Threep.css';
import { ErrorModal } from '../components/ErrorModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

export default function ThreeP() {
  const { isLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalEstimation, setTotalEstimation] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: '',
    messages: []
  });
  if (isLoading) {
    return <LoadingSpinner />;
  }
  const validateTask = (task) => {
    const errors = [];

    if (!task.name.trim()) {
      errors.push('Task name is required');
    }

    task.subtasks.forEach((subtask, index) => {
      if (!subtask.optimistic || isNaN(subtask.optimistic) || subtask.optimistic <= 0) {
        errors.push(`Subtask ${index + 1}: Optimistic estimate must be a positive number`);
      }
      if (!subtask.mostLikely || isNaN(subtask.mostLikely) || subtask.mostLikely <= 0) {
        errors.push(`Subtask ${index + 1}: Most likely estimate must be a positive number`);
      }
      if (!subtask.pessimistic || isNaN(subtask.pessimistic) || subtask.pessimistic <= 0) {
        errors.push(`Subtask ${index + 1}: Pessimistic estimate must be a positive number`);
      }
      if (subtask.optimistic && subtask.pessimistic &&
        parseFloat(subtask.optimistic) > parseFloat(subtask.pessimistic)) {
        errors.push(`Subtask ${index + 1}: Pessimistic must be greater than optimistic`);
      }
    });

    return errors;
  };

  const validateAllTasks = () => {
    const allErrors = [];

    tasks.forEach((task, index) => {
      const taskErrors = validateTask(task);
      if (taskErrors.length > 0) {
        allErrors.push(`Task ${index + 1}:`);
        allErrors.push(...taskErrors);
      }
    });

    if (allErrors.length > 0) {
      setModalState({
        isOpen: true,
        title: 'Validation Errors',
        messages: allErrors
      });
      return false;
    }
    return true;
  };

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  const addTask = () => {
    setTasks([...tasks, { name: '', subtasks: [] }]);
    setFormSubmitted(false);
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);

    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const addSubtask = (taskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks.push({
      optimistic: '',
      pessimistic: '',
      mostLikely: ''
    });
    setTasks(updatedTasks);
    setFormSubmitted(false);
  };

  const deleteSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
    setTasks(updatedTasks);

    const newErrors = { ...errors };
    if (newErrors[taskIndex]?.subtasks) {
      newErrors[taskIndex].subtasks.splice(subtaskIndex, 1);
      if (newErrors[taskIndex].subtasks.length === 0) {
        delete newErrors[taskIndex].subtasks;
      }
      if (Object.keys(newErrors[taskIndex]).length === 0) {
        delete newErrors[taskIndex];
      }
    }
    setErrors(newErrors);
  };

  const handleTaskChange = (index, event) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].name = event.target.value;
    setTasks(updatedTasks);

    if (formSubmitted) {
      const taskErrors = validateTask(updatedTasks[index]);
      setErrors(prev => ({
        ...prev,
        [index]: {
          ...prev[index],
          name: taskErrors.name
        }
      }));
    }
  };

  const handleSubtaskChange = (taskIndex, subtaskIndex, field, event) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks[subtaskIndex][field] = event.target.value;
    setTasks(updatedTasks);

    if (formSubmitted) {
      const taskErrors = validateTask(updatedTasks[taskIndex]);
      setErrors(prev => ({
        ...prev,
        [taskIndex]: {
          ...prev[taskIndex],
          subtasks: taskErrors.subtasks || []
        }
      }));
    }
  };

  const calculateEstimation = () => {
    if (!validateAllTasks()) return;

    let totalEstimation = 0;
    let totalTasks = 0;

    tasks.forEach((task) => {
      let taskEstimation = 0;
      task.subtasks.forEach((subtask) => {
        const o = parseFloat(subtask.optimistic);
        const m = parseFloat(subtask.mostLikely);
        const p = parseFloat(subtask.pessimistic);
        const estimation = (o + 4 * m + p) / 6;
        taskEstimation += estimation;
        totalEstimation += estimation;
      });
      if (taskEstimation > 0) totalTasks += 1;
    });

    setTotalTasks(totalTasks);
    setTotalEstimation(totalEstimation);
  };

  const resetData = () => {
    setTasks([]);
    setTotalTasks(0);
    setTotalEstimation(0);
    setErrors({});
    setFormSubmitted(false);
  };

  const getError = (taskIndex, subtaskIndex, field) => {
    return errors[taskIndex]?.subtasks?.[subtaskIndex]?.[field];
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="pixel-theme pixel-container">
        <Head>
          <title>Three-Point Estimation | EstimateUp</title>
          <meta
            name="description"
            content="Use the Three-Point Estimation technique to accurately estimate your software project timelines with optimism, pessimism, and realistic values."
          />
          <meta name="keywords" content="Three-Point Estimation, Software Estimation, Project Planning, EstimateUp" />
          <meta property="og:title" content="Three-Point Estimation | EstimateUp" />
          <meta
            property="og:description"
            content="Use the Three-Point Estimation technique to accurately estimate your software project timelines with optimism, pessimism, and realistic values."
          />
          <meta property="og:image" content="https://estimate-up.vercel.app/images/preview-image.png" />
          <meta property="og:url" content="https://estimate-up.vercel.app/tp" />
          <meta property="og:type" content="website" />
          <link rel="canonical" href="https://estimate-up.vercel.app/tp" />
        </Head>

        <main className="pixel-main">
          <ErrorModal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            title={modalState.title}
            messages={modalState.messages}
          />
          <section className="pixel-header">
            <h1 className="pixel-title">Three-Point Estimation (PERT)</h1>
            <p className="pixel-subtitle">
              Estimate your project's duration by entering optimistic, pessimistic, and most likely values.
              This tool helps you calculate expected effort using the PERT formula.
            </p>
          </section>

          <section className="pixel-estimation">
            <div className="pixel-task-container">
              {tasks.map((task, taskIndex) => (
                <div key={taskIndex} className="pixel-card">
                  <div className="pixel-task-header">
                    <div className="pixel-input-group">
                      <input
                        type="text"
                        className={`pixel-text-input ${errors[taskIndex]?.name ? 'pixel-input-error' : ''}`}
                        placeholder="Enter task name (e.g., Develop Login UI)"
                        value={task.name}
                        onChange={(e) => handleTaskChange(taskIndex, e)}
                        aria-label={`Task ${taskIndex + 1} name`}
                        aria-invalid={!!errors[taskIndex]?.name}
                      />
                      {errors[taskIndex]?.name && (
                        <p className="pixel-error-message" role="alert">
                          {errors[taskIndex].name}
                        </p>
                      )}
                    </div>
                    <button
                      className="pixel-button-text pixel-button-error"
                      onClick={() => deleteTask(taskIndex)}
                      aria-label="Delete task"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="pixel-subtask-container">
                    {task.subtasks.map((subtask, subtaskIndex) => (
                      <div key={subtaskIndex} className="pixel-subtask">
                        <div className="pixel-input-group">
                          <input
                            type="number"
                            className={`pixel-number-input ${getError(taskIndex, subtaskIndex, 'optimistic') ? 'pixel-input-error' : ''}`}
                            placeholder="Optimistic"
                            value={subtask.optimistic}
                            onChange={(e) => handleSubtaskChange(taskIndex, subtaskIndex, 'optimistic', e)}
                            aria-label="Optimistic estimate"
                            aria-invalid={!!getError(taskIndex, subtaskIndex, 'optimistic')}
                            min="0"
                            step="0.1"
                          />
                          {getError(taskIndex, subtaskIndex, 'optimistic') && (
                            <p className="pixel-error-message" role="alert">
                              {getError(taskIndex, subtaskIndex, 'optimistic')}
                            </p>
                          )}
                        </div>

                        <div className="pixel-input-group">
                          <input
                            type="number"
                            className={`pixel-number-input ${getError(taskIndex, subtaskIndex, 'mostLikely') ? 'pixel-input-error' : ''}`}
                            placeholder="Most likely"
                            value={subtask.mostLikely}
                            onChange={(e) => handleSubtaskChange(taskIndex, subtaskIndex, 'mostLikely', e)}
                            aria-label="Most likely estimate"
                            aria-invalid={!!getError(taskIndex, subtaskIndex, 'mostLikely')}
                            min="0"
                            step="0.1"
                          />
                          {getError(taskIndex, subtaskIndex, 'mostLikely') && (
                            <p className="pixel-error-message" role="alert">
                              {getError(taskIndex, subtaskIndex, 'mostLikely')}
                            </p>
                          )}
                        </div>

                        <div className="pixel-input-group">
                          <input
                            type="number"
                            className={`pixel-number-input ${getError(taskIndex, subtaskIndex, 'pessimistic') ? 'pixel-input-error' : ''}`}
                            placeholder="Pessimistic"
                            value={subtask.pessimistic}
                            onChange={(e) => handleSubtaskChange(taskIndex, subtaskIndex, 'pessimistic', e)}
                            aria-label="Pessimistic estimate"
                            aria-invalid={!!getError(taskIndex, subtaskIndex, 'pessimistic')}
                            min="0"
                            step="0.1"
                          />
                          {getError(taskIndex, subtaskIndex, 'pessimistic') && (
                            <p className="pixel-error-message" role="alert">
                              {getError(taskIndex, subtaskIndex, 'pessimistic')}
                            </p>
                          )}
                        </div>

                        <button
                          className="pixel-icon-button"
                          onClick={() => deleteSubtask(taskIndex, subtaskIndex)}
                          aria-label="Delete subtask"
                        >
                          <svg className="pixel-icon" xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 -960 960 960" width="20">
                            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                          </svg>
                        </button>
                      </div>
                    ))}
                    <button
                      className="pixel-button-contained pixel-button-secondary"
                      onClick={() => addSubtask(taskIndex)}
                    >
                      Add Subtask
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="pixel-button-contained"
                onClick={addTask}
              >
                Add Task
              </button>
            </div>

            {tasks.length > 0 && (
              <>
                <div className="pixel-results-card">
                  <div className="pixel-result-item">
                    <span className="pixel-result-label">Total Tasks:</span>
                    <span className="pixel-result-value">{totalTasks}</span>
                  </div>
                  <div className="pixel-result-item">
                    <span className="pixel-result-label">Total Estimated Time:</span>
                    <span className="pixel-result-value">{totalEstimation.toFixed(2)} hrs</span>
                  </div>
                </div>

                <div className="pixel-button-group">
                  <button
                    className="pixel-button-contained"
                    onClick={calculateEstimation}
                  >
                    Calculate Estimation
                  </button>
                  <button
                    className="pixel-button-text"
                    onClick={resetData}
                  >
                    Reset Data
                  </button>
                </div>
              </>
            )}
          </section>
        </main>
      </div>
    </ProtectedRoute>
  );
}
