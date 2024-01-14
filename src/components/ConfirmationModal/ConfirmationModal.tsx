import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title: string;
  mainText: string;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  mainText,
}) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center min-h-screen">
      <div className="fixed inset-0 bg-black bg-opacity-70"></div>

      <div
        className="relative bg-white rounded-lg overflow-hidden shadow-xl transform transition-all sm:my-8 w-1/4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div className="text-left">
            <h3
              className="text-lg font-medium leading-6 text-gray-900"
              id="modal-headline"
            >
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{mainText}</p>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 sm:px-6 flex justify-end">
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mr-4"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-500 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
