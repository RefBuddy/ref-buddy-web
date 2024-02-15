import React from "react";

const GameCountCard = ({ official }) => (
    <div className="flex flex-col items-start gap-2">
        <div className="flex flex-row items-end gap-2">
        <p className="text-sm border border-green-500 rounded-md px-2 py-1">
            {official.assignedCount
            ? official.assignedCount.toString()
            : '0'}
        </p>
        <p className="text-sm border border-warning-300 rounded-md px-2 py-1">
            {official.queueCount
            ? official.queueCount.toString()
            : '0'}
        </p>
        </div>
    </div>
);

export default GameCountCard;