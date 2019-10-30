import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Meteor } from 'meteor/meteor';

import { Lists } from '../../api/lists/lists.js';
import { GlobalStateProvider } from '../state/GlobalStateProvider.jsx';
import AppContent from './AppContent.jsx';

const CONNECTION_ISSUE_TIMEOUT = 5000;

const App = ({
  // current meteor user
  user,
  // server connection status
  connected,
  // subscription status
  loading,
  // all lists visible to the current user
  lists,
}) => {
  const [showConnectionIssue, setShowConnectionIssue] = useState(false);
  const [defaultList, setDefaultList] = useState(null);
  const [redirectTo, setRedirectTo] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setShowConnectionIssue(true);
    }, CONNECTION_ISSUE_TIMEOUT);
  }, []);

  useEffect(() => {
    if (!loading) {
      const list = Lists.findOne();
      setDefaultList(`/lists/${list._id}`);
    }
  }, [loading]);

  const logout = () => {
    Meteor.logout();
    setRedirectTo(defaultList);
  };

  const renderRedirect = (location) => {
    const { pathname } = location;
    let redirect = null;
    if (redirectTo && redirectTo !== pathname) {
      redirect = <Redirect to={redirectTo} />;
    } else if (pathname === '/' && defaultList) {
      redirect = <Redirect to={defaultList} />;
    }
    setRedirectTo(null);
    return redirect;
  };

  renderRedirect.propTypes = {
    pathname: PropTypes.string.isRequired,
  };
  /*
  const renderContent = (location) => {
    const [menuOpen, setMenuOpen] = useMenuOpen();
    const commonChildProps = {
      menuOpen,
    };
    const closeMenu = () => {
      setMenuOpen(false);
    };

    return (
      <div id="container" className={menuOpen ? 'menu-open' : ''}>
        <section id="menu">
          <LanguageToggle />
          <UserMenu user={user} logout={logout} />
          <ListList lists={lists} />
        </section>
        {showConnectionIssue && !connected
          ? <ConnectionNotification />
          : null}
        <div className="content-overlay" onClick={closeMenu} />
        <div id="content-container">
          {loading ? (
            <Loading key="loading" />
          ) : (
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  classNames="fade"
                  timeout={200}
                >
                  <Switch location={location}>
                    <Route
                      path="/lists/:id"
                      render={({ match }) => (
                        <ListPageContainer match={match} {...commonChildProps} />
                      )}
                    />
                    <Route
                      path="/signin"
                      render={() => <AuthPageSignIn {...commonChildProps} />}
                    />
                    <Route
                      path="/join"
                      render={() => <AuthPageJoin {...commonChildProps} />}
                    />
                    <Route
                      path="/*"
                      render={() => <NotFoundPage {...commonChildProps} />}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}
        </div>
      </div>
    );
  };
 */
  return (
    <GlobalStateProvider>
      <BrowserRouter>
        <Route
          render={({ location }) => (
            renderRedirect(location) || (
              <AppContent
                connexionNotification={showConnectionIssue && !connected}
                lists={lists}
                loading={loading}
                location={location}
                logout={logout}
                user={user}
              />
            )
          )}
        />
      </BrowserRouter>
    </GlobalStateProvider>
  );
};

App.propTypes = {
  user: PropTypes.object,
  connected: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  lists: PropTypes.array,
};

App.defaultProps = {
  user: null,
  lists: [],
};

export default App;
