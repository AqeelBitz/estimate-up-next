"use client";

import { useState } from "react";
import Head from "next/head";
import ProtectedRoute from "../components/ProtectedRoute";
import "../styles/Threep.css";
import { ErrorModal } from "../components/ErrorModal";
import LoadingSpinner from "../components/LoadingSpinner"; // Assuming this is the component used initially
import { useAuth } from "../context/AuthContext";

export default function ThreeP() {
  const { isLoading } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [totalEstimation, setTotalEstimation] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  // While 'errors' state is defined, it's not fully used in the provided validation logic to store granular errors per input.
  // The validation populates the modalState instead. It might be intended for inline error display later.
  const [errors, setErrors] = useState({});

  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    messages: [],
  });

  // Handle initial loading state
  if (isLoading) {
    return <LoadingSpinner />; // Render spinner while loading auth status
  }

  const validateTask = (task) => {
    const taskErrors = []; // Use a local array for collecting errors for this task

    if (!task.name.trim()) {
      taskErrors.push("Task name is required");
    }

    task.subtasks.forEach((subtask, index) => {
      const o = parseFloat(subtask.optimistic);
      const m = parseFloat(subtask.mostLikely);
      const p = parseFloat(subtask.pessimistic);

      if (isNaN(o) || o <= 0) {
        taskErrors.push(
          `Subtask ${index + 1}: Optimistic estimate must be a positive number`
        );
      }
      if (isNaN(m) || m <= 0) {
        taskErrors.push(
          `Subtask ${index + 1}: Most likely estimate must be a positive number`
        );
      }
      if (isNaN(p) || p <= 0) {
        taskErrors.push(
          `Subtask ${index + 1}: Pessimistic estimate must be a positive number`
        );
      }
      if (!isNaN(o) && !isNaN(p) && o > p) {
        taskErrors.push(
          `Subtask ${
            index + 1
          }: Pessimistic must be greater than or equal to optimistic`
        );
      }
      // Optional: Check most likely is between optimistic and pessimistic
      if (!isNaN(o) && !isNaN(m) && !isNaN(p) && (m < o || m > p)) {
        taskErrors.push(
          `Subtask ${
            index + 1
          }: Most likely estimate should typically be between optimistic and pessimistic`
        );
      }
    });

    return taskErrors; // Return the collected errors for this task
  };

  const validateAllTasks = () => {
    const allErrors = [];
    let hasErrors = false; // Flag to check if any errors were found

    if (tasks.length === 0) {
      allErrors.push("Please add at least one task.");
      hasErrors = true;
    } else {
      tasks.forEach((task, index) => {
        const taskErrors = validateTask(task);
        if (taskErrors.length > 0) {
          allErrors.push(`Task ${index + 1}:`);
          allErrors.push(...taskErrors);
          hasErrors = true; // Mark that errors were found
        }
      });
    }

    if (hasErrors) {
      setModalState({
        isOpen: true,
        title: "Validation Errors",
        messages: allErrors,
      });
      // Note: The 'errors' state is not being updated here based on validation results, only the modal.
      // If you intend to use 'errors' for inline display, the validation logic would need to be refactored
      // to store errors in that state object.
      return false;
    }

    // Clear previous errors if validation passes (assuming 'errors' state is for something else or not needed for this validation)
    // If 'errors' state *was* intended for validation errors, you'd update it here.
    // setErrors({});

    return true;
  };

  const closeModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const addTask = () => {
    setTasks([...tasks, { name: "", subtasks: [] }]);
    setFormSubmitted(false);
    // When adding a task, clear any potential validation errors related to deleted tasks/subtasks
    // Although current validation clears modal, not 'errors' state
    setErrors({}); // Clear errors on adding new task
  };

  const deleteTask = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTasks(newTasks);

    // When deleting a task, remove any errors associated with its index
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      delete updatedErrors[index];
      return updatedErrors;
    });
    setFormSubmitted(false); // Reset form submitted state
  };

  const addSubtask = (taskIndex) => {
    const updatedTasks = [...tasks];
    updatedTasks[taskIndex].subtasks.push({
      optimistic: "",
      pessimistic: "",
      mostLikely: "",
    });
    setTasks(updatedTasks);
    setFormSubmitted(false);
    // When adding a subtask, clear any potential validation errors related to deleted subtasks
    // Although current validation clears modal, not 'errors' state
    setErrors((prev) => {
      const updatedErrors = { ...prev };
      if (updatedErrors[taskIndex]?.subtasks) {
        delete updatedErrors[taskIndex].subtasks; // Clear subtask errors for this task
      }
      return updatedErrors;
    });
  };

  const deleteSubtask = (taskIndex, subtaskIndex) => {
    const updatedTasks = [...tasks];
    // Ensure subtasks array exists before trying to splice
    if (updatedTasks[taskIndex]?.subtasks) {
      updatedTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
      setTasks(updatedTasks);

      // When deleting a subtask, remove any errors associated with it
      setErrors((prev) => {
        const updatedErrors = { ...prev };
        if (updatedErrors[taskIndex]?.subtasks) {
          const newSubtaskErrors = [...updatedErrors[taskIndex].subtasks];
          newSubtaskErrors.splice(subtaskIndex, 1);
          if (newSubtaskErrors.length === 0) {
            // If no subtask errors remain for this task, remove the subtasks key
            const { subtasks, ...restOfTaskErrors } = updatedErrors[taskIndex];
            updatedErrors[taskIndex] = restOfTaskErrors;
            if (Object.keys(updatedErrors[taskIndex]).length === 0) {
              // If no errors remain for this task at all, delete the task index key
              delete updatedErrors[taskIndex];
            }
          } else {
            updatedErrors[taskIndex].subtasks = newSubtaskErrors;
          }
        }
        return updatedErrors;
      });
      setFormSubmitted(false); // Reset form submitted state
    }
  };

  // Note: The current handleTaskChange and handleSubtaskChange attempt to update the 'errors' state
  // but the validation logic populates the modal state instead.
  // To use 'errors' for inline validation display, the validation logic would need to be tightly coupled
  // with these handlers and the 'errors' state structure needs to match the input structure.
  // Keeping them as is for now, but noting the potential discrepancy.

  const handleTaskChange = (index, event) => {
    const updatedTasks = [...tasks];
    // Ensure task object exists before updating name
    if (updatedTasks[index]) {
      updatedTasks[index].name = event.target.value;
      setTasks(updatedTasks);

      // Optionally re-validate this specific task on change if form was already submitted
      // This requires a more sophisticated error state structure
      // if (formSubmitted) {
      //     const taskErrors = validateTask(updatedTasks[index]);
      //     setErrors(prev => ({ ...prev, [index]: taskErrors })); // Example: update 'errors' state
      // }
    }
  };

  const handleSubtaskChange = (taskIndex, subtaskIndex, field, event) => {
    const updatedTasks = [...tasks];
    // Ensure task and subtask objects exist before updating
    if (updatedTasks[taskIndex]?.subtasks?.[subtaskIndex]) {
      updatedTasks[taskIndex].subtasks[subtaskIndex][field] =
        event.target.value;
      setTasks(updatedTasks);

      // Optionally re-validate this specific task on change if form was already submitted
      // This requires a more sophisticated error state structure
      // if (formSubmitted) {
      //     const taskErrors = validateTask(updatedTasks[taskIndex]);
      //     setErrors(prev => ({ ...prev, [taskIndex]: taskErrors })); // Example: update 'errors' state
      // }
    }
  };

  const calculateEstimation = () => {
    setFormSubmitted(true); // Mark form as submitted to potentially trigger validation styling

    if (!validateAllTasks()) {
      setTotalTasks(0);
      setTotalEstimation(0); // Clear results if validation fails
      return;
    }

    let totalEstimation = 0;
    let completedTasks = 0; // Count tasks that have at least one subtask with valid estimates

    tasks.forEach((task) => {
      let taskEstimation = 0;
      let hasValidSubtask = false;
      task.subtasks.forEach((subtask) => {
        const o = parseFloat(subtask.optimistic);
        const m = parseFloat(subtask.mostLikely);
        const p = parseFloat(subtask.pessimistic);

        // Check if all required inputs are valid numbers before calculating for this subtask
        if (!isNaN(o) && !isNaN(m) && !isNaN(p) && o > 0 && m > 0 && p > 0) {
          const estimation = (o + 4 * m + p) / 6;
          taskEstimation += estimation;
          hasValidSubtask = true; // This task has at least one estimable subtask
        } else {
          // Log or handle cases where a subtask's estimates are invalid after passing overall validation?
          // The validateAllTasks already handles invalid numbers and missing fields.
        }
      });
      // Only count the task if it had at least one valid subtask estimate
      if (hasValidSubtask) {
        completedTasks += 1;
        totalEstimation += taskEstimation; // Add the sum of its valid subtasks to overall total
      }
    });

    setTotalTasks(completedTasks); // Update total tasks based on those with valid estimates
    // Ensure totalEstimation is a number before setting and using toFixed in render
    setTotalEstimation(isNaN(totalEstimation) ? 0 : totalEstimation);
  };

  const resetData = () => {
    setTasks([]);
    setTotalTasks(0);
    setTotalEstimation(0);
    setErrors({}); // Clear any inline errors
    setModalState({ isOpen: false, title: "", messages: [] }); // Close and clear modal
    setFormSubmitted(false); // Reset form submitted state
  };

  // Helper function to get validation errors for specific inputs
  // Note: This currently relies on the 'errors' state structure aligning with input fields,
  // which is not fully implemented by validateTask/validateAllTasks as they populate the modal.
  // To enable inline error display, the validation logic needs to be updated to store errors in
  // the 'errors' state keyed by taskIndex, subtaskIndex, and field.
  const getError = (taskIndex, subtaskIndex, field) => {
    // Example: This would work if errors state was structured like { taskIndex: { subtasks: { subtaskIndex: { field: 'error message' } } } }
    // The current validate logic doesn't build this structure.
    // For now, this function might not return expected results unless you refactor validation.
    // It's kept here assuming future inline validation implementation.
    return errors?.[taskIndex]?.subtasks?.[subtaskIndex]?.[field];
  };

  return (
    <ProtectedRoute>
      <div className="pixel-theme pixel-container">
        <Head>
          <title>Three-Point Estimation | EstimateUp</title>
          <meta
            name="description"
            content="Use the Three-Point Estimation technique to accurately estimate your software project timelines with optimism, pessimism, and realistic values."
          />
          <meta
            name="keywords"
            content="Three-Point Estimation, Software Estimation, Project Planning, EstimateUp"
          />
          <meta
            property="og:title"
            content="Three-Point Estimation | EstimateUp"
          />
          <meta
            property="og:description"
            content="Use the Three-Point Estimation technique to accurately estimate your software project timelines with optimism, pessimism, and realistic values."
          />
          <meta
            property="og:image"
            content="https://estimate-up.vercel.app/images/preview-image.png"
          />
          <meta property="og:url" content="https://estimate-up.vercel.app/tp" />
          <meta property="og:type" content="website" />
          <link rel="canonical" href="https://estimate-up.vercel.app/tp" />
        </Head>

        <main className="pixel-main">
          {/* Error Modal */}
          <ErrorModal
            isOpen={modalState.isOpen}
            onClose={closeModal}
            title={modalState.title}
            messages={modalState.messages}
          />

          {/* Header Section */}
          <section className="pixel-header">
            <h1 className="pixel-title">Three-Point Estimation (PERT)</h1>
            <p className="pixel-subtitle">
              Estimate your project&apos;s duration by entering optimistic,
              pessimistic, and most likely values. This tool helps you calculate
              expected effort using the PERT formula.
            </p>
          </section>

          {/* Estimation Input Section */}
          <section className="pixel-estimation">
            <div className="pixel-task-container">
              {/* Ensure tasks is an array before mapping */}
              {Array.isArray(tasks) &&
                tasks.map((task, taskIndex) => (
                  <div key={taskIndex} className="pixel-card">
                    <div className="pixel-task-header">
                      <div className="pixel-input-group">
                        <input
                          type="text"
                          // Apply error class based on 'errors' state (needs validation refactor for this to work fully)
                          className={`pixel-text-input ${
                            formSubmitted && !task.name.trim()
                              ? "pixel-input-error"
                              : ""
                          }`}
                          placeholder="Enter task name (e.g., Develop Login UI)"
                          value={task.name}
                          onChange={(e) => handleTaskChange(taskIndex, e)}
                          aria-label={`Task ${taskIndex + 1} name`}
                          aria-invalid={formSubmitted && !task.name.trim()}
                        />
                        {/* Display inline error if needed (needs validation refactor) */}
                        {formSubmitted && !task.name.trim() && (
                          <p className="pixel-error-message" role="alert">
                            Task name is required
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
                      {/* Ensure subtasks is an array before mapping */}
                      {Array.isArray(task.subtasks) &&
                        task.subtasks.map((subtask, subtaskIndex) => (
                          <div key={subtaskIndex} className="pixel-subtask">
                            <div className="pixel-input-group">
                              <input
                                type="number"
                                // Apply error class based on validation rules and form submission
                                className={`pixel-number-input ${
                                  formSubmitted &&
                                  (isNaN(parseFloat(subtask.optimistic)) ||
                                    parseFloat(subtask.optimistic) <= 0)
                                    ? "pixel-input-error"
                                    : ""
                                }`}
                                placeholder="Optimistic"
                                value={subtask.optimistic}
                                onChange={(e) =>
                                  handleSubtaskChange(
                                    taskIndex,
                                    subtaskIndex,
                                    "optimistic",
                                    e
                                  )
                                }
                                aria-label="Optimistic estimate"
                                aria-invalid={
                                  formSubmitted &&
                                  (isNaN(parseFloat(subtask.optimistic)) ||
                                    parseFloat(subtask.optimistic) <= 0)
                                }
                                min="0"
                                step="0.1"
                              />
                              {/* Display inline error */}
                              {formSubmitted &&
                                (isNaN(parseFloat(subtask.optimistic)) ||
                                  parseFloat(subtask.optimistic) <= 0) && (
                                  <p
                                    className="pixel-error-message"
                                    role="alert"
                                  >
                                    Must be positive number
                                  </p>
                                )}
                            </div>

                            <div className="pixel-input-group">
                              <input
                                type="number"
                                className={`pixel-number-input ${
                                  formSubmitted &&
                                  (isNaN(parseFloat(subtask.mostLikely)) ||
                                    parseFloat(subtask.mostLikely) <= 0)
                                    ? "pixel-input-error"
                                    : ""
                                }`}
                                placeholder="Most likely"
                                value={subtask.mostLikely}
                                onChange={(e) =>
                                  handleSubtaskChange(
                                    taskIndex,
                                    subtaskIndex,
                                    "mostLikely",
                                    e
                                  )
                                }
                                aria-label="Most likely estimate"
                                aria-invalid={
                                  formSubmitted &&
                                  (isNaN(parseFloat(subtask.mostLikely)) ||
                                    parseFloat(subtask.mostLikely) <= 0)
                                }
                                min="0"
                                step="0.1"
                              />
                              {/* Display inline error */}
                              {formSubmitted &&
                                (isNaN(parseFloat(subtask.mostLikely)) ||
                                  parseFloat(subtask.mostLikely) <= 0) && (
                                  <p
                                    className="pixel-error-message"
                                    role="alert"
                                  >
                                    Must be positive number
                                  </p>
                                )}
                            </div>

                            <div className="pixel-input-group">
                              <input
                                type="number"
                                className={`pixel-number-input ${
                                  formSubmitted &&
                                  (isNaN(parseFloat(subtask.pessimistic)) ||
                                    parseFloat(subtask.pessimistic) <= 0 ||
                                    (parseFloat(subtask.optimistic) > 0 &&
                                      parseFloat(subtask.pessimistic) > 0 &&
                                      parseFloat(subtask.optimistic) >
                                        parseFloat(subtask.pessimistic)))
                                    ? "pixel-input-error"
                                    : ""
                                }`}
                                placeholder="Pessimistic"
                                value={subtask.pessimistic}
                                onChange={(e) =>
                                  handleSubtaskChange(
                                    taskIndex,
                                    subtaskIndex,
                                    "pessimistic",
                                    e
                                  )
                                }
                                aria-label="Pessimistic estimate"
                                aria-invalid={
                                  formSubmitted &&
                                  (isNaN(parseFloat(subtask.pessimistic)) ||
                                    parseFloat(subtask.pessimistic) <= 0 ||
                                    (parseFloat(subtask.optimistic) > 0 &&
                                      parseFloat(subtask.pessimistic) > 0 &&
                                      parseFloat(subtask.optimistic) >
                                        parseFloat(subtask.pessimistic)))
                                }
                                min="0"
                                step="0.1"
                              />
                              {/* Display inline error */}
                              {formSubmitted &&
                                (isNaN(parseFloat(subtask.pessimistic)) ||
                                  parseFloat(subtask.pessimistic) <= 0) && (
                                  <p
                                    className="pixel-error-message"
                                    role="alert"
                                  >
                                    Must be positive number
                                  </p>
                                )}
                              {formSubmitted &&
                                parseFloat(subtask.optimistic) > 0 &&
                                parseFloat(subtask.pessimistic) > 0 &&
                                parseFloat(subtask.optimistic) >
                                  parseFloat(subtask.pessimistic) && (
                                  <p
                                    className="pixel-error-message"
                                    role="alert"
                                  >
                                    Pessimistic must be {">"}= Optimistic
                                  </p>
                                )}
                            </div>

                            <button
                              className="pixel-icon-button"
                              onClick={() =>
                                deleteSubtask(taskIndex, subtaskIndex)
                              }
                              aria-label="Delete subtask"
                            >
                              <svg
                                className="pixel-icon"
                                xmlns="http://www.w3.org/2000/svg"
                                height="20"
                                viewBox="0 -960 960 960"
                                width="20"
                              >
                                <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      <button
                        className="pixel-button-contained pixel-button-secondary"
                        onClick={() => addSubtask(taskIndex)}
                        disabled={!tasks[taskIndex]?.name.trim()} // Disable if task name is empty
                      >
                        Add Subtask
                      </button>
                    </div>
                  </div>
                ))}
              <button className="pixel-button-contained" onClick={addTask}>
                Add Task
              </button>
            </div>

            {/* Results and Action Buttons Section */}
            {/* Only show results and action buttons if there are tasks */}
            {Array.isArray(tasks) && tasks.length > 0 && (
              <>
                <div className="pixel-results-card">
                  <div className="pixel-result-item">
                    <span className="pixel-result-label">
                      Total Tasks with Estimates:
                    </span>{" "}
                    {/* Clarified label */}
                    <span className="pixel-result-value">{totalTasks}</span>
                  </div>
                  <div className="pixel-result-item">
                    <span className="pixel-result-label">
                      Total Estimated Time:
                    </span>
                    {/* Ensure totalEstimation is a number before formatting */}
                    <span className="pixel-result-value">
                      {typeof totalEstimation === "number"
                        ? totalEstimation.toFixed(2)
                        : "0.00"}{" "}
                      hrs
                    </span>
                  </div>
                </div>

                <div className="pixel-button-group">
                  <button
                    className="pixel-button-contained"
                    onClick={calculateEstimation}
                    // Disable if there are no tasks or no subtasks with valid inputs (optional based on desired behavior)
                    disabled={
                      !Array.isArray(tasks) ||
                      tasks.length === 0 ||
                      tasks.every(
                        (task) =>
                          !Array.isArray(task.subtasks) ||
                          task.subtasks.length === 0
                      )
                    }
                  >
                    Calculate Estimation
                  </button>
                  <button className="pixel-button-text" onClick={resetData}>
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
