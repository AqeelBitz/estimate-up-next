'use client';

import React, { useState, useEffect } from 'react';
import EditTask from '../components/EditTask';

const Card = ({ taskObj, index, deleteTask, updateListArray }) => {
    const [modal, setModal] = useState(false);
    const [storedEstimationData, setStoredEstimationData] = useState([]);

    useEffect(() => {
        const data = localStorage.getItem("estimationData");
        if (data) {
            try { 
                setStoredEstimationData(JSON.parse(data));
                console.log("Stored ", JSON.parse(data));
            } catch(e) {
                 console.error("Failed to parse estimation data from localStorage", e);
            }
        }
    }, []);

    // Pixel-like color palette based on your examples
    const colors = [
        { primaryColor: "#1a73e8", secondaryColor: "#e8f0fe" }, // Google Blue like
        { primaryColor: "#fbbc04", secondaryColor: "#fef7e0" }, // Google Yellow like
        { primaryColor: "#34a853", secondaryColor: "#e6f4ea" }, // Google Green like
        { primaryColor: "#ea4335", secondaryColor: "#fdeded" }, // Google Red like
        { primaryColor: "#9334e6", secondaryColor: "#f4e8fd" }  // Google Purple like (example)
    ];

    const toggle = () => setModal(!modal);

    const updateTask = (obj) => updateListArray(obj, index);

    const handleDelete = () => {
        // Added confirmation before deleting
        if (window.confirm("Are you sure you want to delete this module?")) {
             deleteTask(index);
             // localStorage.removeItem(index); // This removes by key name '0', '1', etc. Check if this is intended.
             // If tasks are stored as an array under "modules", deleting from taskList and re-saving is sufficient.
             // This line might be redundant or incorrect depending on localStorage structure.
        }
    };

    return (
        // Use card-wrapper class, remove mr-5 if using grid gap in dtask-container
        <div className="card-wrapper">
            <div
                className="card-top" // Use card-top class
                style={{ backgroundColor: colors[index % colors.length].primaryColor }} // Use pixel-like colors, handle index out of bounds
            ></div>

            <div className="task-holder "> {/* Use task-holder and mb-2 classes */}
                {/* Use card-header class */}
                <span
                    className="card-header"
                    style={{ backgroundColor: colors[index % colors.length].secondaryColor }} // Use pixel-like colors
                >
                    {taskObj.Name}
                </span>
                <div className="card-text"> {/* Use card-text class */}
                    <p className="mt-2" >{taskObj.Description}</p> {/* Use mt-2 class */}
                </div>

                {/* Wrap icons in card-icons div */}
                 {/* Removed inline style positioning */}
                <div className="card-icons">
                    <div>
                        <i
                            className="far fa-edit mr-3" // Keep Font Awesome classes, use mr-3
                            style={{
                                color: colors[index % colors.length].primaryColor, // Use pixel-like color
                                cursor: 'pointer',
                                // Removed textShadow
                            }}
                            onClick={() => setModal(true)}
                        ></i>
                    </div>
                    <div>
                        <i
                            className="fas fa-trash-alt" // Keep Font Awesome classes
                            style={{
                                color: colors[index % colors.length].primaryColor, // Use pixel-like color
                                cursor: 'pointer',
                                // Removed textShadow
                            }}
                            onClick={handleDelete}
                        ></i>
                    </div>
                </div>
            </div>

            <EditTask
                modal={modal}
                toggle={toggle}
                updateTask={updateTask}
                taskObj={taskObj}
            />
        </div>
    );
};

export default Card;