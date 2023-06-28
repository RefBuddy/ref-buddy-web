import React, { PropsWithChildren, useEffect } from 'react';
import { XCircleIcon } from '@heroicons/react/24/solid';
import { useAppDispatch } from '../../store';
import { setModalState } from '../../store/Modal/reducer';

const Modal: React.FC<PropsWithChildren<any>> = ({ children, onClose }) => {
  const dispatch = useAppDispatch();
  const handleClose = () => {
    dispatch(setModalState({ open: false, modalType: '' }));
    if(onClose) onClose();
  }
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-10 flex items-center justify-center">
      <div 
        className="bg-white rounded-md relative mx-auto my-auto border border-gray-300 p-4 overflow-y-auto max-h-screen w-4/5 h-4/5 min-w-[900px] min-h-[400px] max-w-[1100px] modal"
      >
        <button onClick={handleClose} className="absolute top-2 right-2">
          <XCircleIcon className="w-6 h-6 text-gray-500 hover:text-red-500" aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;