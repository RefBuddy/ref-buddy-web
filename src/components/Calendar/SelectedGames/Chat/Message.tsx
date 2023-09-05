import React from 'react';
import { Timestamp } from 'firebase/firestore'; // Import the Timestamp type

type MessageProps = {
  message: string;
  sender: string;
  timestamp: Timestamp; // Use the imported Timestamp type
  isUserMessage: boolean;
};

const Message: React.FC<MessageProps> = ({
  message,
  sender,
  timestamp,
  isUserMessage,
}) => {
  return (
    <div className={`p-2 ${isUserMessage ? 'text-right' : 'text-left'}`}>
      {!isUserMessage && <div className="font-bold">{sender}</div>}
      <div
        className={`inline-block p-4 rounded-lg mt-2 ${
          isUserMessage ? 'bg-orange-400' : 'bg-gray-300'
        }`}
      >
        {message}
      </div>
      <div className="text-xs mt-1">
        {timestamp.toDate().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;
