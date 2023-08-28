import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
// import { addMessage } from "./redux/actions"; // Assuming you have an action to add a message

const Chat: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const messages = useAppSelector(
    (state) => state.games.selectedGames['1'].messages,
  );
  const dispatch = useAppDispatch();

  const handleSendMessage = () => {
    // if (message.trim() !== "") {
    //   dispatch(addMessage(message)); // Adjust based on your Redux actions
    //   setMessage("");
    // }
  };

  return (
    <div className="p-4">
      <div className="border rounded-md p-4 h-64 overflow-y-scroll mb-4">
        {/* {messages.map((msg: string, index: number) => (
          <div key={index} className="p-2 border-b mb-2">
            {msg}
          </div>
        ))} */}
      </div>
      <div className="flex items-center">
        <input
          type="text"
          className="flex-grow p-2 border rounded-md mr-2"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white p-2 rounded-md"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
