import { Meteor } from 'meteor/meteor';
import React, { useEffect, useState } from 'react';
import {
  Switch,
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';
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
import { Lists } from '../../api/lists/lists.js';

const AppContent = ({
  connectionNotification,
  lists,
  loading,
  user,
}) => {
  const history = useHistory();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useMenuOpen();
  const [, setLocale] = useLocale();
  const [defaultList, setDefaultList] = useState(null);

  if (defaultList && location.pathname === '/') {
    history.replace(defaultList);
  }

  useEffect(() => {
    if (!loading) {
      const list = Lists.findOne();
      setDefaultList(`/lists/${list._id}`);
    }
  }, [loading]);

  const handleLocaleChange = (newLocale) => {
    setLocale(newLocale);
  };

  const logout = () => {
    Meteor.logout();
    history.replace(defaultList || '/');
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
      {connectionNotification
        ? <ConnectionNotification />
        : null}
      <div className="content-overlay" onClick={closeMenu} />
      <div id="content-container">
        {loading ? (
          <Loading />
        ) : (
          <TransitionGroup>
            <CSSTransition
              classNames="fade"
              timeout={200}
            >
              <Switch>
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
  connectionNotification: PropTypes.bool,
  lists: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
  user: PropTypes.object,
};

AppContent.defaultProps = {
  connectionNotification: false,
  user: null,
};

export default AppContent;
