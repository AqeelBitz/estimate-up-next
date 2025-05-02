'use client'; // This is needed since we're using client-side features like useState and useEffect

import { useEffect, useState } from 'react';
import CreateTask from '../components/CreateTask'; // Renamed to CreateTaskPopup in import below? Using CreateTask here.
import Card from '../components/Card';
import Header from '../components/Header';
import ProtectedRoute from '../components/ProtectedRoute';
import '../styles/Delphi.css'; 


const Delphi = () => {
    const [modal, setModal] = useState(false);
    const [taskList, setTaskList] = useState([]);

    useEffect(() => {
        // In Next.js, localStorage is only available on the client side
        if (typeof window !== 'undefined') {
            let arr = localStorage.getItem("modules");
            if (arr) {
                try { // Added try-catch for safer JSON parsing
                    let obj = JSON.parse(arr);
                    setTaskList(obj);
                } catch (e) {
                    console.error("Failed to parse tasks from localStorage", e);
                    // Handle error, maybe clear localStorage or show a message
                }
            }
        }
    }, []);

    const deleteTask = (index) => {
        let tempList = [...taskList];
        tempList.splice(index, 1);
        localStorage.setItem("modules", JSON.stringify(tempList));
        setTaskList(tempList);
        // Avoid window.location.reload() in React/Next.js if possible.
        // State update should trigger re-render.
        // window.location.reload();
    };

    const updateListArray = (obj, index) => {
        let tempList = [...taskList];
        tempList[index] = obj;
        localStorage.setItem("modules", JSON.stringify(tempList));
        setTaskList(tempList);
        setModal(false);
        // Avoid window.location.reload()
        // window.location.reload();
    };

    const toggle = () => {
        setModal(!modal);
    };

    const saveTask = (taskObj) => {
        let tempList = [...taskList];
        tempList.push(taskObj);
        localStorage.setItem("modules", JSON.stringify(tempList));
        setTaskList(tempList);
        setModal(false);
    };

    return (
        <ProtectedRoute>
        <div className='delphi-container'>
            <Header />
            {/* moduleContainer might be redundant if dtask-container has grid */}
            <div className='moduleContainer'>
                {/* Apply pixel-button styles to the Create Module button */}
                {/* Removed inline styles and old classes */}
                <div className='d-flex' style={{ justifyContent: 'center', paddingTop: '5px' }}>
                    <button
                        className="pixel-button primary" // Use pixel primary button style
                        onClick={() => setModal(true)}
                    >
                         {/* Add span for button content structure */}
                         <span className="button-content">Create Module</span>
                         {/* Optional: Add ripple span if you added the CSS for it */}
                         {/* <span className="button-ripple"></span> */}
                    </button>
                </div>
                {/* dtask-container now has grid styles defined in CSS */}
                <div className="dtask-container">
                    {/* Ensure taskList is an array before mapping */}
                    {Array.isArray(taskList) && taskList.map((obj, index) => (
                        <Card
                            key={index}
                            taskObj={obj}
                            index={index}
                            deleteTask={deleteTask}
                            updateListArray={updateListArray}
                        />
                    ))}
                </div>
            </div>
             {/* Ensure CreateTask is the correct component name */}
            <CreateTask toggle={toggle} modal={modal} save={saveTask} />
        </div>
        </ProtectedRoute>
    );
};

export default Delphi;