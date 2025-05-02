import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';

const CreateTaskPopup = ({ modal, toggle, save }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "taskName") {
            setTaskName(value);
        } else {
            setDescription(value);
        }
    };

    const handleSave = (e) => {
        e.preventDefault(); // Prevent default form submission
        const taskObj = {
            Name: taskName,
            Description: description
        };
        save(taskObj);
        // Clear form fields after saving
        setTaskName("");
        setDescription("");
    };

    return (
        // The Modal structure is from reactstrap and styled via CSS overrides
        <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Create Module</ModalHeader>
            <ModalBody>
                {/* Apply pixel-input class to form fields */}
                {/* Using input-row class for layout */}
                <div className="input-row">
                    <label>Module Name</label>
                    <input
                        type="text"
                        // Removed form-control class
                        className="pixel-input" // Use pixel-input class
                        value={taskName}
                        onChange={handleChange}
                        name="taskName"
                    />
                </div>
                {/* Using input-row class for layout */}
                <div className="input-row">
                    <label>Description</label>
                    <textarea
                        rows="5"
                        // Removed form-control class
                        className="pixel-input" // Use pixel-input class
                        value={description}
                        onChange={handleChange}
                        name="description"
                    />
                </div>
            </ModalBody>
            <ModalFooter>
                {/* Apply pixel-button classes to reactstrap Buttons */}
                {/* Ensure your CSS overrides for reactstrap Buttons work */}
                 {/* Or ideally, replace reactstrap Buttons with your own <button> elements */}
                <Button
                    color="primary" // reactstrap prop, might not be needed if fully styled by className
                    onClick={handleSave}
                    className="pixel-button primary" // Use pixel primary button
                >
                    {/* Add span for button content */}
                    <span className="button-content">Create</span>
                    {/* Optional: Add ripple span */}
                    {/* <span className="button-ripple"></span> */}
                </Button>{' '}
                <Button
                    color="secondary" // reactstrap prop
                    onClick={toggle}
                    className="pixel-button outline" // Use pixel outline button (common for cancel)
                >
                    {/* Add span for button content */}
                    <span className="button-content">Cancel</span>
                     {/* Optional: Add ripple span */}
                    {/* <span className="button-ripple"></span> */}
                </Button>
            </ModalFooter>
        </Modal>
    );
};

export default CreateTaskPopup;