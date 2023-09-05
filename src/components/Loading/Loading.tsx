import React from 'react';
import LoadingSmall from './LoadingSmall';

const Loading = () => (
  <div className="fixed inset-0 flex justify-center h-full items-center z-50 bg-black bg-opacity-80">
    <LoadingSmall color="white" />
  </div>
);

export default Loading;
