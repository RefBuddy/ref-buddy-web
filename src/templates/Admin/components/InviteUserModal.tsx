import React, { useState } from 'react';

import { useAppDispatch, useAppSelector } from '../../../store';

import { inviteUser } from '../../../store/User/actions';

import { Button } from '../../../components/Button';

interface InviteUserModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const InviteUserModal = ({ onClose, onConfirm }: InviteUserModalProps) => {
  const dispatch = useAppDispatch();
  const league = useAppSelector((state) => state.user.currentLeague);
  const [email, setEmail] = useState('');
  const [isSupervisor, setIsSupervisor] = useState(false);
  const [error, setError] = useState('');

  const handleSend = async () => {
    // Check if email is empty
    if (!email) {
      setError('Email is required');
      return;
    }

    // Check if email is valid
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    const password = Math.random().toString(36).slice(-8);

    await dispatch(
      inviteUser({
        email: email,
        league: league,
        supervisor: isSupervisor,
        password: password,
      }),
    );

    onConfirm();
    onClose();
  };

  const handleContentClick = (e) => {
    e.stopPropagation(); // Prevent click events from bubbling up to the outer div
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white py-4 px-8 rounded-lg w-1/5"
        onClick={handleContentClick}
      >
        <div className="flex flex-col items-start">
          <h5 className="mb-2">Invite Official</h5>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`mb-2 p-2 border ${
              error ? 'border-red-500' : 'border-gray-300'
            } rounded w-full`}
          />
          {error && <p className="text-red-500 mb-1">{error}</p>}
          <label className="mb-2">
            <input
              type="checkbox"
              checked={isSupervisor}
              onChange={(e) => setIsSupervisor(e.target.checked)}
            />
            <span className="ml-2">Supervisor</span>
          </label>
          <Button
            onClick={handleSend}
            className="py-2 px-4 bg-blue-500 text-white rounded self-end"
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InviteUserModal;
