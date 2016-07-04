import React from 'react';
import { Router, Route, browserHistory } from 'react-router';

// route components
import AppContainer from '../../client/containers/AppContainer.jsx';
import ListContainer from '../../client/containers/ListContainer.jsx';
import AuthPageSignIn from '../../client/pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../../client/pages/AuthPageJoin.jsx';
import NotFoundPage from '../../client/pages/NotFoundPage.jsx';

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="lists/:id" component={ListContainer}/>
      <Route path="signin" component={AuthPageSignIn}/>
      <Route path="join" component={AuthPageJoin}/>
      <Route path="*" component={NotFoundPage}/>
    </Route>
  </Router>
);
