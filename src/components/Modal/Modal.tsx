import React, { PropsWithChildren } from 'react';
import { useAppDispatch } from '../../store';
import { setModalState } from '../../store/Modal/reducer';

const Modal: React.FC<PropsWithChildren> = ({ children }) => {
  const dispatch = useAppDispatch();
  const onClose = () => {
    dispatch(setModalState({ open: false, modalType: '' }))
  }
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-10" >
      <div className="bg-white rounded-md mx-auto relative top-20 max-w-1/2 w-full">
        <button onClick={onClose} className="absolute top-0 right-0 p-2">
          Close
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;