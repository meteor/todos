import React from 'react';
import { Router, Route, browserHistory } from 'react-router';
import i18n from 'meteor/universe:i18n';

// route components
import AppContainer from '../../ui/containers/AppContainer.jsx';

i18n.setLocale('en');

export const renderRoutes = () => (
  <Router history={browserHistory}>
    <Route path="/" component={AppContainer}>
      <Route path="lists/:id" getComponent={ async (nextState, cb) => {
        const { default: ListPageContainer } = await import('../../ui/containers/ListPageContainer.jsx');
        cb(null, ListPageContainer);
      }} />
      <Route path="signin" getComponent={ async (nextState, cb) => {
        const { default: AuthPageSignIn } = await import('../../ui/pages/AuthPageSignIn.jsx');
        cb(null, AuthPageSignIn);
      }} />
      <Route path="join" getComponent={ async (nextState, cb) => {
        const { default: AuthPageJoin } = await import('../../ui/pages/AuthPageJoin.jsx');
        cb(null, AuthPageJoin);
      }} />
      <Route path="*" getComponent={ async (nextState, cb) => {
        const { default: NotFoundPage } = await import('../../ui/pages/NotFoundPage.jsx');
        cb(null, NotFoundPage);
      }} />
    </Route>
  </Router>
);
