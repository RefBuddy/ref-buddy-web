import React, { PropsWithChildren } from 'react';
import { useAppDispatch } from '../../store';
import { setModalState } from '../../store/Modal/reducer';

const Modal: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(setModalState({ open: false, modalType: '' }))
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-10 flex items-center justify-center">
      <div 
        className="bg-white rounded-md relative mx-auto my-auto border border-gray-300 p-4 overflow-y-auto max-h-screen"
        style={{ 
            width: '70vw',
            height: '90vh',
            minWidth: '900px',
            minHeight: '400px',
            maxWidth: '1100px',
        }}
      >
        <button onClick={onClose} className="absolute top-2 right-2">
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
