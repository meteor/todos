import React from 'react';
import PropTypes from 'prop-types';
import MobileMenu from '../components/MobileMenu.jsx';

// a common layout wrapper for auth pages
const AuthPage = ({ children, link }) => (
  <div className="page auth">
    <nav>
      <MobileMenu />
    </nav>
    <div className="content-scrollable">
      {children}
      {link}
    </div>
  </div>
);

AuthPage.propTypes = {
  children: PropTypes.element.isRequired,
  link: PropTypes.element.isRequired,
};

export default AuthPage;
