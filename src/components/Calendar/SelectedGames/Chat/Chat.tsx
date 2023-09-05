import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { useGameMessagesHook } from './useGameMessages';
import { auth } from '../../../../firebaseOptions';
import Message from './Message';
// import { sendGameMessage } from './redux/actions'; // adjust based on your Redux action

type GameChatProps = {
  league: string;
  season: string;
  date: string;
  gameNumber: string;
  officials: any;
};

const GameChat: React.FC<GameChatProps> = ({
  league,
  season,
  date,
  gameNumber,
  officials,
}) => {
  const [messageText, setMessageText] = useState('');
  const messages = useGameMessagesHook(league, season, date, gameNumber);
  const uid = auth.currentUser?.uid;
  const dispatch = useAppDispatch();

  const handleSendMessage = () => {
    // if (messageText) {
    //   dispatch(sendGameMessage(league, season, date, gameNumber, messageText)); // adjust based on your Redux action
    //   setMessageText('');
    // }
  };

  return (
    <div className="p-4">
      <div className="overflow-y-scroll h-64 mb-4">
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            message={msg.message}
            sender={officials[msg.uid]?.displayName || 'Admin'}
            timestamp={msg.timestamp}
            isUserMessage={msg.uid === uid}
          />
        ))}
      </div>
      <div className="flex">
        <input
          type="text"
          className="flex-grow p-2 border rounded-l-md"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Enter message"
        />
        <button
          className="bg-orange-500 text-white p-2 rounded-r-md"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default GameChat;
