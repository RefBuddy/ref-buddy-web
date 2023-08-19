import React, { PropsWithChildren } from 'react';
// import { XCircleIcon } from '@heroicons/react/24/solid';

const Modal: React.FC<PropsWithChildren<any>> = ({ children, onClose }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-10 flex items-center justify-center"
      onClick={handleClose}
    >
      <div
        className="bg-white rounded-md relative mx-48 my-4 border border-gray-300 p-4 overflow-y-auto max-h-[96vh] modal w-full min-h-[50vh]"
        onClick={stopPropagation}
      >
        {/* <button onClick={() => handleClose()} className="absolute top-2 left-2">
          <XCircleIcon
            className="w-6 h-6 text-gray-500 hover:text-red-500"
            aria-hidden="true"
          />
        </button> */}
        {children}
      </div>
    </div>
  );
};

export default Modal;
