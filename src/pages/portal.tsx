import React from 'react';
import { Router } from '@reach/router';
import { PrivateRoute } from '../components/PrivateRoute';
import { Dashboard, Stats } from '../templates';

// :id corresponds to the users id. This is passed in from the auth gateway once they are logged in you would then navigate to /portal/<user id>/dashboard
const Portal = () => (
  <Router basepath="/portal">
    <PrivateRoute path="/:id/dashboard" component={Dashboard} />
    <PrivateRoute path="/:id/stats" component={Stats} />
  </Router>
);

export default Portal;
