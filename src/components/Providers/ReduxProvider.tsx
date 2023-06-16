import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Provider } from 'react-redux';
import store from '../../store';

function LOReduxProvider({ element }) {
  return (
    <Provider store={store}>
      {element}
      <ToastContainer />
    </Provider>
  );
}

export default LOReduxProvider;
