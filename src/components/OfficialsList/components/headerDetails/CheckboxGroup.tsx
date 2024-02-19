import React from 'react';

const CheckboxGroup = ({ showReferees, handleRefereeCheckboxChange, showLinesmen, handleLinesmanCheckboxChange }) => (
    <div className="flex flex-row gap-3 mr-16">
        <div className="flex flex-row gap-1 items-center">
            <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                checked={showReferees}
                onChange={handleRefereeCheckboxChange}
            />
            <label className="text-xs font-medium text-black">R</label>
        </div>
        <div className="flex flex-row gap-1 items-center">
            <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                checked={showLinesmen}
                onChange={handleLinesmanCheckboxChange}
            />
            <label className="text-xs font-medium text-black">L</label>
        </div>
    </div>
);

export default CheckboxGroup;