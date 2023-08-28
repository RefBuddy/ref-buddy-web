import React from 'react';
import './LoadingSmall.scss';

const LoadingSmall = ({ color = '#ffffff' }) => (
  <div className="loader" style={{ borderTop: `3px solid ${color}` }} />
);

export default LoadingSmall;
