import React, { useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import i18n from 'meteor/universe:i18n';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import UserMenu from '../components/UserMenu.jsx';
import ListList from '../components/ListList.jsx';
import LanguageToggle from '../components/LanguageToggle.jsx';
import ConnectionNotification from '../components/ConnectionNotification.jsx';
import Loading from '../components/Loading.jsx';
import ListPageContainer from '../containers/ListPageContainer.jsx';
import AuthPageSignIn from '../pages/AuthPageSignIn.jsx';
import AuthPageJoin from '../pages/AuthPageJoin.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import { useMenuOpen } from '../state/MenuOpenState.jsx';
import { useLocale } from '../state/LocaleState.jsx';

const AppContent = ({
  connexionNotification,
  lists,
  loading,
  location,
  logout,
  user,
}) => {
  const [menuOpen, setMenuOpen] = useMenuOpen();
  const [, setLocale] = useLocale();

  const handleLocaleChange = (newLocale) => {
    setLocale(newLocale);
  };

  useEffect(() => {
    i18n.onChangeLocale(handleLocaleChange);
    return () => {
      i18n.offChangeLocale(handleLocaleChange);
    };
  }, []);

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
      {connexionNotification
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
                  component={ListPageContainer}
                />
                <Route
                  path="/signin"
                  component={AuthPageSignIn}
                />
                <Route
                  path="/join"
                  component={AuthPageJoin}
                />
                <Route
                  path="/*"
                  component={NotFoundPage}
                />
              </Switch>
            </CSSTransition>
          </TransitionGroup>
        )}
      </div>
    </div>
  );
};

AppContent.propTypes = {
  connexionNotification: PropTypes.bool,
  lists: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
    key: PropTypes.string,
  }).isRequired,
  logout: PropTypes.func.isRequired,
  user: PropTypes.object,
};

AppContent.defaultProps = {
  connexionNotification: false,
  user: null,
};

export default AppContent;
