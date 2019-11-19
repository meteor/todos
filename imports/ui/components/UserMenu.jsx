import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import i18n from 'meteor/universe:i18n';

const UserMenu = ({
  user, logout,
}) => {
  const [open, setOpen] = useState();

  const toggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(!open);
  };

  const renderLoggedIn = () => {
    const email = user.emails[0].address;
    const emailLocalPart = email.substring(0, email.indexOf('@'));

    return (
      <div className="user-menu vertical">
        <a href="#toggle" className="btn-secondary" onClick={toggle}>
          {open
            ? <span className="icon-arrow-up" />
            : <span className="icon-arrow-down" />}
          {emailLocalPart}
        </a>
        {open
          ? (
            <a className="btn-secondary" onClick={logout}>
              {i18n.__('components.userMenu.logout')}
            </a>
          ) : null}
      </div>
    );
  };

  const renderLoggedOut = () => (
    <div className="user-menu">
      <Link to="/signin" className="btn-secondary">
        {i18n.__('components.userMenu.login')}
      </Link>
      <Link to="/join" className="btn-secondary">
        {i18n.__('components.userMenu.join')}
      </Link>
    </div>
  );

  return user
    ? renderLoggedIn()
    : renderLoggedOut();
};

UserMenu.propTypes = {
  user: PropTypes.object,
  logout: PropTypes.func,
};

export default UserMenu;
